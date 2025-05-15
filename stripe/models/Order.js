import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customerEmail: {
    type: String,
    required: true
  },
  productId: {
    type: String,
    required: true
  },
  productName: String,
  productPrice: String,
  totalAmount: Number,
  mode: {
    type: String,
    enum: ['payment', 'subscription'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled', 'failed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'failed'],
    default: 'unpaid'
  },
  mainProductPriceId: String,
  additionalPlanIds: [String],
  stripeSessionId: String,
  stripeCustomerId: String,
  subscriptionId: String,
  metadata: {
    kitName: String,
    orderDate: Date,
    paymentMode: String,
    mainProductDetails: {
      name: String,
      description: String,
      priceId: String,
      unitAmount: Number,
      currency: String
    },
    supportPlanDetails: {
      name: String,
      description: String,
      priceId: String,
      unitAmount: Number,
      currency: String
    },
    subscriptionStatus: String,
    additionalData: mongoose.Schema.Types.Mixed
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Order', orderSchema); 