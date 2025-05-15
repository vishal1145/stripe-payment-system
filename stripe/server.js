import 'dotenv/config';
import express from 'express';
import connectDB from './config/db.js';
import checkoutRoutes from './routes/checkout.js';
import productRoutes from './routes/products.js';
import sessionRoutes from './routes/session.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Log environment variables for debugging
console.log('Environment Variables Check:');
console.log('SENDGRID_API_KEY exists:', !!process.env.SENDGRID_API_KEY);
console.log('SENDGRID_FROM_EMAIL:', process.env.SENDGRID_FROM_EMAIL);
console.log('DOMAIN:', process.env.DOMAIN);

const app = express();
app.use('/api/checkout/webhook', express.raw({ type: 'application/json' }));

app.use(express.json())
// Callback route to exchange code for token and store it

app.use(express.static(path.join(__dirname, 'public')));

connectDB();

// CORS configuration
const allowedOrigins = [
    'http://localhost:3000',
    'https://stripe-payment.algofolks.com',
    'https://totalbizpack.com',
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


app.use(express.json());

app.use(express.static('public'));

app.use('/api/checkout', checkoutRoutes);
app.use('/api/products', productRoutes);
app.use('/session', sessionRoutes);

app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Webhook endpoint:', '/api/checkout/webhook');
});
