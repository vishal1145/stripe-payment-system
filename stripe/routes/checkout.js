import express from 'express';
import Stripe from 'stripe';
import sgMail from '@sendgrid/mail';
import Subscription from '../models/Subscription.js';
import Order from '../models/Order.js';
import Session from '../models/Session.js';

const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Configure SendGrid with error handling
if (!process.env.SENDGRID_API_KEY) {
    console.error('SENDGRID_API_KEY is not set in environment variables');
    process.exit(1);
}

if (!process.env.SENDGRID_FROM_EMAIL) {
    console.error('SENDGRID_FROM_EMAIL is not set in environment variables');
    process.exit(1);
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Price ID to product name mapping
const priceIdToProduct = {
  'price_1ROFjKFRtxUdrNGC172xd3Xe': 'Development kit',
  'price_1RNrEVFRtxUdrNGCfD9u4SYF': 'Premium Plan',
  'price_1RMRqWFRtxUdrNGCUYfXbac8': 'Elite Plan',
  'price_1RBUjTFRtxUdrNGCd9ydQ0Ly': 'Premium'
};

// Create checkout session
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { priceId, additionalPlans, productId, folderId, productName, productPrice, metadata = {} } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'productId is required' });
    }

    // Get product details
    const mainProduct = await stripe.prices.retrieve(priceId, {
      expand: ['product']
    });

    // Get support plan details if exists
    let supportPlan = null;
    if (additionalPlans && additionalPlans.length > 0) {
      supportPlan = await stripe.prices.retrieve(additionalPlans[0], {
        expand: ['product']
      });
    }

    // Calculate total amount properly
    const mainProductAmount = mainProduct.unit_amount / 100;
    const supportPlanAmount = supportPlan ? supportPlan.unit_amount / 100 : 0;
    const totalAmount = mainProductAmount + supportPlanAmount;

    // Determine mode based on additionalPlans
    const mode = additionalPlans && additionalPlans.length > 0 ? 'subscription' : 'payment';

    // Create a more detailed order in the database
    const order = new Order({
      customerEmail: 'pending@example.com',
      productId: productId,
      folderId: folderId,
      productName: productName,
      productPrice: mainProductAmount.toString(),
      totalAmount: totalAmount,
      mode: mode,
      status: 'pending',
      paymentStatus: 'unpaid',
      mainProductPriceId: priceId,
      additionalPlanIds: additionalPlans || [],
      metadata: {
        ...metadata,
        mainProductDetails: {
          name: mainProduct.product.name,
          description: mainProduct.product.description,
          priceId: priceId,
          unitAmount: mainProductAmount,
          currency: mainProduct.currency
        },
        supportPlanDetails: supportPlan ? {
          name: supportPlan.product.name,
          description: supportPlan.product.description,
          priceId: supportPlan.id,
          unitAmount: supportPlanAmount,
          currency: supportPlan.currency
        } : null,
        kitName: metadata.kitName || productName,
        orderDate: new Date()
      }
    });

    // Log order data before saving
    console.log('Creating order with data:', {
      productId,
      productName,
      mainProductAmount,
      supportPlanAmount,
      totalAmount,
      mode
    });

    const savedOrder = await order.save();
    console.log('Order saved to database:', savedOrder._id);

    // Build line items
    const lineItems = [];

    // Add subscription plans first if in subscription mode
    if (mode === 'subscription' && additionalPlans?.length > 0) {
      additionalPlans.forEach(planId => {
        if (planId) {
          lineItems.push({
            price: planId,
            quantity: 1
          });
        }
      });
    }

    // Add the main product
    lineItems.push({
      price: priceId,
      quantity: 1
    });

    const domainURL = process.env.DOMAIN || 'https://stripe-payment.algofolks.com/';

    // Create Stripe session config
    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode,
      success_url: `${domainURL}/success.html?orderId=${savedOrder._id}`,
      cancel_url: `${domainURL}/cancel.html?orderId=${savedOrder._id}`,
      metadata: {
        orderId: savedOrder._id.toString(),
        productId: productId,
        folderId: folderId,
        productName: productName,
        productPrice: mainProductAmount.toString(),
        mode: mode,
        additionalPlans: JSON.stringify(additionalPlans || []),
        kitName: metadata.kitName || productName,
        totalAmount: totalAmount.toString()
      }
    };

    if (mode === 'payment') {
      sessionConfig.customer_creation = 'always';
    } else {
      sessionConfig.subscription_data = {
        payment_behavior: 'allow_incomplete'
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    // Update order with session ID
    await Order.findByIdAndUpdate(savedOrder._id, {
      stripeSessionId: session.id
    });

    res.json({ url: session.url, orderId: savedOrder._id });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});



// Webhook endpoint
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
      console.log('Webhook event type:', event.type);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const session = event.data.object;

    switch (event.type) {
      case 'checkout.session.completed': {
        console.log('Processing checkout.session.completed:', {
          sessionId: session.id,
          customerId: session.customer,
          customerEmail: session.customer_details.email
        });

        try {
          // Find existing order
          const existingOrder = await Order.findOne({ stripeSessionId: session.id });
          if (!existingOrder) {
            throw new Error('Order not found for session: ' + session.id);
          }

          // Get subscription if exists
          let subscription;
          if (session.subscription) {
            subscription = await stripe.subscriptions.retrieve(session.subscription, {
              expand: ['items.data.price.product']
            });
            console.log('Full subscription data:', JSON.stringify(subscription, null, 2));
          }

          // Update order with payment success details
          const orderUpdateData = {
            customerEmail: session.customer_details.email,
            status: 'completed',
            paymentStatus: 'paid',
            stripeCustomerId: session.customer,
            subscriptionId: session.subscription || null,
            'metadata.paymentDetails': {
              paymentIntentId: session.payment_intent,
              paymentMethod: session.payment_method_types?.[0],
              customerName: session.customer_details?.name,
              customerPhone: session.customer_details?.phone,
              customerAddress: session.customer_details?.address
            }
          };

          if (subscription) {
            orderUpdateData['metadata.subscriptionStatus'] = subscription.status;
          }

          const updatedOrder = await Order.findByIdAndUpdate(
            existingOrder._id,
            orderUpdateData,
            { new: true }
          );

          console.log('Order updated successfully:', updatedOrder._id);

          // Create subscription record only if it's a subscription mode and subscription exists
          if (session.mode === 'subscription' && subscription) {
            // Debug logging
            console.log('Subscription period data:', {
              created: subscription.created,
              billing_cycle_anchor: subscription.billing_cycle_anchor
            });

            // Use created timestamp for start date and add 30 days for end date
            const startDate = new Date(subscription.created * 1000);
            const endDate = new Date(startDate.getTime());
            endDate.setDate(endDate.getDate() + 30); // Add 30 days for monthly subscription

            console.log('Converted dates:', {
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString()
            });

            const subscriptionData = {
              stripeCustomerId: session.customer,
              customerEmail: session.customer_details.email,
              stripeSubscriptionId: subscription.id,
              status: subscription.status,
              currentPeriodStart: startDate,
              currentPeriodEnd: endDate,
              orderId: updatedOrder._id,
              planIds: subscription.items.data.map(item => item.price.id),
              mainProductName: subscription.items.data[0].price.product.name,
              supportPlan: subscription.items.data[0]?.price.product.name || 'No Support Plan',
              kitName: session.metadata.kitName || subscription.items.data[0].price.product.name
            };

            try {
              const savedSubscription = await Subscription.create(subscriptionData);
              console.log('Subscription created:', savedSubscription._id);
            } catch (subError) {
              console.error('Error creating subscription:', subError);
              console.error('Attempted subscription data:', JSON.stringify(subscriptionData, null, 2));
              // Continue execution even if subscription creation fails
            }
          } else {
            console.log('Skipping subscription creation - not a subscription payment');
          }

          // Create new session with 7 days expiry
          const newSession = new Session({
            ordered: true,
            expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            orderId: updatedOrder._id
          });

          const savedSession = await newSession.save();
          console.log('New session created:', savedSession._id);
          
            // Send confirmation email
            try {
              const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f6f8fb; padding: 40px 0;">
                <div style="background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #e0e0e0; padding: 32px 32px 24px 32px; margin: 0 auto;">
       <table align="center" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom: 16px;">
  <tr>
    <td style="vertical-align: middle;">
      <img
        src="https://totalbizpack.com/wp-content/uploads/2025/04/cropped-cropped-cropped-logo-briief-cse-70x69.png"
        alt="TotalBizPack"
        width="40"
        style="display: block;"
      />
    </td>
    <td style="vertical-align: middle; padding-left: 10px;">
      <span style="font-size: 16px; color: #06566D; font-weight: 600; font-family: Arial, sans-serif;">Total</span>
      <span style="font-size: 18px; color: #06566D; font-weight: 700; font-family: Arial, sans-serif;">BizPack</span>
    </td>
  </tr>
</table>

<p style="text-align: center; color: #27ae60; font-size: 20px; font-weight: bold; font-family: Arial, sans-serif; margin: 0 0 8px 0;">
  Thank You for Your Purchase!
</p>


                    <table style="width: 100%; margin-bottom: 24px;">
                        <tr>
                            <td style="color: #888;">Order ID</td>
                            <td style="text-align: right; color: #333;">${updatedOrder._id}</td>
                        </tr>
                        <tr>
                            <td style="color: #888;">Purchase Date</td>
                            <td style="text-align: right; color: #333;">${new Date().toLocaleDateString()}</td>
                        </tr>
                    </table>
                    <div style="border-top: 1px solid #eee; margin: 24px 0;"></div>
                    <h3 style="color: #34495e; font-size: 18px; margin-bottom: 12px;">Order Summary</h3>
                    <table style="width: 100%; font-size: 15px; margin-bottom: 16px;">
                        <tr>
                            <td>
                                <span style="color: #888;">${updatedOrder.metadata.mainProductDetails.name} - ${updatedOrder.metadata.kitName}</span>
                            </td>
                            <td style="text-align: right;">$${updatedOrder.metadata.mainProductDetails.unitAmount.toFixed(2)}</td>
                        </tr>
                        ${subscription && updatedOrder.metadata.supportPlanDetails ? `
                        <tr>
                            <td>
                                <span style="color: #888;">
                                    Support Plan<strong style="color: #000; padding-left:3px;"> (${updatedOrder.metadata.supportPlanDetails.name || 'No Support Plan'}) </strong>
                                </span>
                            </td>
                            <td style="text-align: right;">
                                $${updatedOrder.metadata.supportPlanDetails.unitAmount.toFixed(2)}/month
                            </td>
                        </tr>
                        ` : ''}
                        <tr>
                            <td style="color: #888;">Subtotal</td>
                            <td style="text-align: right;">$${updatedOrder.totalAmount.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold;">Total</td>
                            <td style="text-align: right; font-weight: bold;">$${updatedOrder.totalAmount.toFixed(2)}</td>
                        </tr>
                    </table>
                    ${subscription ? `
                    <div style="border-top: 1px solid #eee; margin: 24px 0;"></div>
                     <h3 style="color: #34495e; font-size: 18px; margin-bottom: 12px;">Support Plan - ${updatedOrder.metadata.supportPlanDetails.name || 'No Support Plan'}</h3>
                    <table style="width: 100%; font-size: 15px;">
                        ${subscription.items.data[1] ? `
                        <tr>
                            <td>Support Plan</td>
                            <td style="text-align: right; color: #27ae60;">${priceIdToProduct[subscription.items.data[1]?.price.id] || subscription.items.data[1]?.price.product.name}</td>
                        </tr>
                        ` : ''}
                        <tr>
                            <td>Status</td>
                            <td style="text-align: right; color: #27ae60;">${subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}</td>
                        </tr>
                        <tr>
                            <td>Next Billing Date</td>
                            <td style="text-align: right;">${new Date(new Date(subscription.created * 1000).getTime() + (30 * 24 * 60 * 60 * 1000)).toLocaleDateString()}</td>
                        </tr>
                        <tr>
                            <td>Billing Frequency</td>
                            <td style="text-align: right;">Monthly</td>
                        </tr>
                    </table>
                    ` : ''}
                    <div style="text-align: center; margin: 32px 0 0 0;">
                        <a href="${process.env.DOMAIN}/session/${savedSession._id}" style="background: #1976d2; color: #fff; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-right: 12px;">Download Kit</a>
                    </div>
                    <div style="margin-top: 32px; color: #888; font-size: 13px; text-align: left;">
                        <h3>Getting Started</h3>
                        <ol style="text-align: left; display: inline-block;">
                            <li>Step 1: Download your kit using the button above</li>
                            <li>Step 2: Open the main PDF file first for orientation</li>
                            <li>Step 3: Look at the quick-start checklist</li>
                        </ol>
                        <div style="margin-top: 8px;">Estimated setup time: <strong>Most customers launch within 24-72 hours</strong></div>
                    </div>
                    <div style="margin-top: 32px; color: #888; font-size: 13px; text-align: center;">
                        <div style="text-align: left;">
                            For any query please contact us here → 
                            <a href="mailto:admin@totalbizpack.com" style="color: #1976d2;">admin@totalbizpack.com</a>
                        </div>
                        <div style="margin-top: 16px; color: #888; font-size: 13px; text-align: center;">
                            &copy; ${new Date().getFullYear()} TotalBizPack. All rights reserved.<br>
                        </div>
                    </div>
                </div>
            </div>`;

            const emailData = {
              to: session.customer_details.email,
              from: process.env.SENDGRID_FROM_EMAIL,
              subject: 'Thank You for Your Purchase!',
              html: emailHtml
            };
            
            await sgMail.send(emailData);
            console.log('Confirmation email sent to:', session.customer_details.email);
          } catch (emailError) {
            console.error('Error sending confirmation email:', emailError);
          }
        } catch (error) {
          console.error('Error processing checkout.session.completed:', error);
        }
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
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;
