const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const Subscription = require('../models/Subscription');

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

                // Get kit name from custom fields
                const kitName = session.custom_fields.find(field => field.key === 'kit_name')?.text?.value || customer.email;

                console.log('Retrieved subscription details:', {
                    subscriptionId: subscription.id,
                    status: subscription.status,
                    items: subscription.items.data.length,
                    kitName: kitName
                });

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
