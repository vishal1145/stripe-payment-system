import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    stripeCustomerId: String,
    customerEmail: String,
    stripeSubscriptionId: String,
    status: String,
    currentPeriodStart: Date,
    currentPeriodEnd: Date,
    orderId: mongoose.Schema.Types.ObjectId,
    planIds: [String],
    mainProductName: String,
    supportPlan: String,
    kitName: String,
    latestInvoice: {
        stripeInvoiceId: String,
        amount: Number,
        status: String,
        paidAt: Date
    },
    metadata: mongoose.Schema.Types.Mixed
}, { 
    timestamps: true,
    strict: false 
});


export default mongoose.model('Subscription', subscriptionSchema); 