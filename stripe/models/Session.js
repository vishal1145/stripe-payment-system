import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    ordered: {
        type: Boolean,
        default: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    }
});

export default mongoose.model('Session', sessionSchema); 