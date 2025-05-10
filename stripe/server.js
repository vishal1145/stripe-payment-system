require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const checkoutRoutes = require('./routes/checkout');
const productRoutes = require('./routes/products');
const cors = require('cors');
const path = require('path');

const app = express();


app.use(express.static(path.join(__dirname, 'public')));

connectDB();

// CORS configuration
const allowedOrigins = [
 
    'http://localhost:3000',
    'https://6ee6-2402-e280-4117-321-ad03-e06a-5c80-6b41.ngrok-free.app',
    'https://stripe-payment.algofolks.com',
    'https://totalbizpack.com',
    'http://192.168.1.7:3000',
    process.env.FRONTEND_URL
].filter(Boolean); 

app.use(cors({
    origin: function(origin, callback) {
      
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            if (origin.includes('ngrok-free.app')) {
                allowedOrigins.push(origin);
                return callback(null, true);
            }
            return callback(new Error('Not allowed by CORS'));
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept'],
    credentials: true
}));

app.use('/api/checkout/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());

app.use(express.static('public'));

app.use('/api/checkout', checkoutRoutes);
app.use('/api/products', productRoutes);

app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Webhook endpoint:', '/api/checkout/webhook');
   
});
