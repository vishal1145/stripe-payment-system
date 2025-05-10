const express = require('express');
const router = express.Router();

// Get product mapping data
router.get('/', async (req, res) => {
    try {
        const products = {
            'index10': {
                productId: 'index10',
                priceId: 'price_1RMNi9FRtxUdrNGCtI6KOqao',
                name: 'Premium Plan',
                price: '$299.00/month',
                meta: {}
            }
        };
        
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

module.exports = router; 