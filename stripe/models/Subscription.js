const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    customerId: String,
    stripeCustomerId: String,
    email: String,
    kitName: String,
    mainSubscription: {
        stripeSubscriptionId: String,
        productId: String,
        planType: String,
        stripePriceId: String,
        amount: Number,
        productName: String,
        productPrice: String,
        status: String,
        currentPeriodStart: Date,
        currentPeriodEnd: Date,
        cancelAtPeriodEnd: Boolean
    },
    additionalPlan: {
        stripeSubscriptionItemId: String,
        planId: String,
        name: String,
        stripePriceId: String,
        amount: Number,
        status: String,
        startDate: Date,
        endDate: Date,
        createdAt: Date
    },
    paymentMethod: String,
    latestInvoice: {
        stripeInvoiceId: String,
        amount: Number,
        status: String,
        paidAt: Date
    },
    metadata: mongoose.Schema.Types.Mixed
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema); 