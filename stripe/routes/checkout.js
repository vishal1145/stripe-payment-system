const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer = require('nodemailer');

const Subscription = require('../models/Subscription');

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Create checkout session
router.post('/create-checkout-session', async (req, res) => {
    try {
        const { priceId, additionalPlans, productId, productName, productPrice, metadata, email } = req.body;
        console.log('Creating checkout session with:', {
            priceId,
            additionalPlans,
            productId,
            productName,
            productPrice,
            metadata,
            email
        });

        if (!priceId || !productId) {
            return res.status(400).json({ error: 'Main priceId and productId are required' });
        }

        // Create line items for Stripe
        const lineItems = [
            {
                price: priceId,
                quantity: 1
            }
        ];

        // Add additional plans if they exist
        if (additionalPlans && additionalPlans.length > 0) {
            console.log('Adding additional plans:', additionalPlans);
            additionalPlans.forEach(planId => {
                lineItems.push({
                    price: planId,
                    quantity: 1
                });
            });
        }

        console.log('Final line items:', lineItems);

        // Create Stripe session with enhanced metadata
        const domainURL = process.env.DOMAIN || 'https://stripe-payment.algofolks.com/';
        const session = await stripe.checkout.sessions.create({
            customer_email: email,
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'subscription',
            success_url: `${domainURL}/success.html`,
            cancel_url: `${domainURL}/cancel.html`,
            metadata: {
                productId,
                productName,
                productPrice,
               
                ...metadata
            },
            custom_fields: [
                {
                    key: 'kit_name',
                    label: {
                        type: 'custom',
                        custom: 'Kit Name'
                    },
                    type: 'text',
                    optional: false
                }
            ]
        });

        console.log('Stripe session created:', session.id);
        res.json({ url: session.url });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
});

// Webhook endpoint
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  console.log('Received webhook event');
  const supportPlanNames = {
    'price_1RNrEVFRtxUdrNGCfD9u4SYF': 'Premium',
    'price_1RMRqWFRtxUdrNGCUYfXbac8': 'Elite'
  // Add more priceIds as needed
  };
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        console.log('Webhook event type:', event.type);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                console.log('Processing checkout.session.completed:', {
                    sessionId: session.id,
                    customerId: session.customer,
                    subscriptionId: session.subscription
                });

                // Get subscription and customer details
                const subscription = await stripe.subscriptions.retrieve(session.subscription);
                const customer = await stripe.customers.retrieve(session.customer);
                
                // Get the latest invoice for receipt URL
                const invoice = await stripe.invoices.retrieve(subscription.latest_invoice);
                const receiptUrl = invoice.hosted_invoice_url || invoice.invoice_pdf;

                // Get kit name from custom fields
                const kitName = session.custom_fields.find(field => field.key === 'kit_name')?.text?.value || customer.email;
            let supportPlan = 'None';
            if (subscription.items.data.length > 1) {
              // If there is an additional plan, use its priceId
              const additionalPriceId = subscription.items.data[1].price.id;
              supportPlan = supportPlanNames[additionalPriceId] || 'Custom Plan';
            } else if (subscription.items.data.length > 0) {
              // If only one plan, use its priceId
              const mainPriceId = subscription.items.data[0].price.id;
              supportPlan = supportPlanNames[mainPriceId] || 'Custom Plan';
                }
                // Send confirmation email
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: customer.email,
                    subject: `Payment Confirmation - ${session.metadata.productName}`,
                    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f6f8fb; padding: 40px 0;">
  <div style="background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #e0e0e0; padding: 32px 32px 24px 32px; margin: 0 auto;">
    <div style="text-align: center;">
      <img src="https://totalbizpack.com/wp-content/uploads/2025/04/cropped-cropped-cropped-logo-briief-cse-70x69.png" alt="TotalBizPack" style="height: 40px; margin-bottom: 16px;">
      <h2 style="color: #27ae60; margin: 0 0 8px 0;">Thank You for Your Purchase!</h2>
      <p style="color: #888; margin: 0 0 24px 0;">Your order for <strong>${session.metadata.kitName}</strong> is confirmed.</p>
    </div>
    <table style="width: 100%; margin-bottom: 24px;">
      <tr>
        <td style="color: #888;">Order ID</td>
        <td style="text-align: right; color: #333;">${session.id}</td>
      </tr>
      <tr>
        <td style="color: #888;">Purchase Date</td>
        <td style="text-align: right; color: #333;">${new Date(session.created * 1000).toLocaleDateString()}</td>
      </tr>
    </table>
    <div style="border-top: 1px solid #eee; margin: 24px 0;"></div>
    <h3 style="color: #34495e; font-size: 18px; margin-bottom: 12px;">Order Summary</h3>
    <table style="width: 100%; font-size: 15px; margin-bottom: 16px;">
      <tr>
        <td>
          <strong>${session.metadata.kitName}</strong><br>
          <span style="color: #888;">${session.metadata.productDescription || session.metadata.productName}</span>
        </td>
        <td style="text-align: right;">$${(subscription.items.data[0].price.unit_amount / 100).toFixed(2)}</td>
      </tr>
      ${subscription.items.data.length > 1 ? `
      <tr>
        <td>
          <span style="color: #888;">
  Support Plan<strong style="color: #000;">(${supportPlan})</strong>
</span>

        </td>
       <td style="text-align: right;">
  $${(subscription.items.data[1].price.unit_amount / 100).toFixed(2)}/month
</td>

      </tr>
      ` : ''}
      <tr>
        <td style="color: #888;">Subtotal</td>
        <td style="text-align: right;">$${(subscription.items.data.reduce((sum, item) => sum + item.price.unit_amount, 0) / 100).toFixed(2)}</td>
      </tr>
      <tr>
        <td style="color: #888;">Tax</td>
        <td style="text-align: right;">$0.00</td>
      </tr>
      <tr>
        <td style="font-weight: bold;">Total</td>
        <td style="text-align: right; font-weight: bold;">$${(subscription.items.data.reduce((sum, item) => sum + item.price.unit_amount, 0) / 100).toFixed(2)}</td>
      </tr>
    </table>
    <div style="border-top: 1px solid #eee; margin: 24px 0;"></div>
    <h3 style="color: #34495e; font-size: 18px; margin-bottom: 12px;">Subscription Details</h3>
    <table style="width: 100%; font-size: 15px;">
      <tr>
        <td>Status</td>
        <td style="text-align: right; color: #27ae60;">${subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}</td>
      </tr>
      <tr>
        <td>Next Billing Date</td>
        <td style="text-align: right;">${new Date(subscription.current_period_end * 1000).toLocaleDateString()}</td>
      </tr>
      <tr>
        <td>Support Plan</td>
       <td style="text-align: right;">${supportPlan}</td>
      </tr>
      <tr>
        <td>Kit</td>
        <td style="text-align: right;">${session.metadata.kitName}</td>
      </tr>
      <tr>
        <td>Billing Frequency</td>
        <td style="text-align: right;">Monthly</td>
      </tr>
    </table>
    <div style="text-align: center; margin: 32px 0 0 0;">
      <a href="${receiptUrl}" style="background: #1976d2; color: #fff; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-right: 12px;">Download Kit</a>
    </div>
    <div style="margin-top: 32px; color: #888; font-size: 13px; text-align: left;">
      <h3>Getting Started</h3>
      <ol style="text-align: left;  display: inline-block;">
        <li>Step 1: Download your kit using the button above</li>
        <li>Step 2: Open the main PDF file first for orientation</li>
        <li>Step 3: Look at the quick-start checklist</li>
      </ol>
      <div style="margin-top: 8px;">Estimated setup time: <strong>Most customers launch within 24-72 hours</strong></div>
    </div>
    <div style="margin-top: 32px; color: #888; font-size: 13px; text-align: center;">
      <h3>Support</h3>
      <div>Email: <a href=\"mailto:admin@totalbizpack.com\" style=\"color: #1976d2;\">admin@totalbizpack.com</a></div>
      <div>Support hours: We respond within 24 hours, Monday-Friday</div>
      <div>If you purchased a support plan, reply to this email for 1:1 help.</div>
    </div>
    <div style="margin-top: 16px; color: #888; font-size: 13px; text-align: center;">
      &copy; ${new Date().getFullYear()} TotalBizPack. All rights reserved.<br>
      <a href="https://yourdomain.com/privacy" style="color: #888;">Privacy Policy</a> &nbsp;|&nbsp; <a href="https://yourdomain.com/terms" style="color: #888;">Terms</a>
    </div>
  </div>
</div>
`
                };

                try {
                    await transporter.sendMail(mailOptions);
                    console.log('Payment confirmation email sent successfully to:', customer.email);
                } catch (emailError) {
                    console.error('Error sending confirmation email:', emailError);
                }

                // Create subscription record
                const subscriptionData = {
                    customerId: session.client_reference_id || session.customer,
                    stripeCustomerId: session.customer,
                    email: customer.email,
                    kitName: kitName,
                    mainSubscription: {
                        stripeSubscriptionId: subscription.id,
                        productId: session.metadata.productId,
                        planType: session.metadata.planType,
                        stripePriceId: subscription.items.data[0].price.id,
                        amount: subscription.items.data[0].price.unit_amount / 100,
                        productName: session.metadata.productName,
                        productPrice: session.metadata.productPrice,
                        status: subscription.status,
                        currentPeriodStart: new Date(subscription.current_period_start * 1000),
                        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                        cancelAtPeriodEnd: subscription.cancel_at_period_end
                    },
                    additionalPlan: subscription.items.data.length > 1 ? {
                        stripeSubscriptionItemId: subscription.items.data[1].id,
                        planId: subscription.items.data[1].price.id,
                        name: session.metadata.supportPlan || 'Additional Plan',
                        stripePriceId: subscription.items.data[1].price.id,
                        amount: subscription.items.data[1].price.unit_amount / 100,
                        status: 'active',
                        startDate: new Date(subscription.current_period_start * 1000),
                        endDate: new Date(subscription.current_period_end * 1000),
                        createdAt: new Date()
                    } : null,
                    paymentMethod: session.payment_method_types[0],
                    latestInvoice: {
                        stripeInvoiceId: subscription.latest_invoice,
                        amount: subscription.items.data.reduce((sum, item) => sum + item.price.unit_amount, 0) / 100,
                        status: 'paid',
                        paidAt: new Date()
                    },
                    metadata: session.metadata
                };

                console.log('Saving subscription data:', {
                    subscriptionId: subscription.id,
                    customerId: subscriptionData.customerId,
                    email: subscriptionData.email
                });

                const savedSubscription = await Subscription.findOneAndUpdate(
                    { 'mainSubscription.stripeSubscriptionId': subscription.id },
                    subscriptionData,
                    { upsert: true, new: true }
                );

                console.log('Subscription saved successfully:', savedSubscription._id);
                break;
            }

            case 'invoice.paid': {
                const invoice = event.data.object;
                console.log('Processing paid invoice:', invoice.id);

                const result = await Subscription.findOneAndUpdate(
                    { stripeCustomerId: invoice.customer },
                    {
                        latestInvoice: {
                            stripeInvoiceId: invoice.id,
                            amount: invoice.amount_paid / 100,
                            status: invoice.status,
                            paidAt: new Date()
                        },
                        updatedAt: new Date()
                    }
                );

                console.log('Invoice update result:', result ? 'Success' : 'Not Found');
                break;
            }

            case 'invoice.payment_failed': {
                const invoice = event.data.object;
                console.log('Processing failed invoice:', invoice.id);

                const result = await Subscription.findOneAndUpdate(
                    { stripeCustomerId: invoice.customer },
                    {
                        'mainSubscription.status': 'past_due',
                        latestInvoice: {
                            stripeInvoiceId: invoice.id,
                            amount: invoice.amount_due / 100,
                            status: 'failed',
                            paidAt: null
                        },
                        updatedAt: new Date()
                    }
                );

                console.log('Failed payment update result:', result ? 'Success' : 'Not Found');
                break;
            }
        }

        res.json({ received: true });
    } catch (err) {
        console.error('Error processing webhook:', err);
        console.error('Error details:', {
            message: err.message,
            stack: err.stack
        });
        res.status(500).json({ error: 'Webhook processing failed' });
    }
});

module.exports = router;
