const express = require('express');
const router = express.Router();

// Get product mapping data
router.get('/', async (req, res) => {
    try {
        const products = {
            'index1': {
                productId: 'index1',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'AI Content Creation Service',
                price: '$199.00/month',
                meta: {
                    kitName: 'AI Content Creation Service',
                   
                }
            },
            'index2': {
                productId: 'index2',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Virtual Event Production Service',
                price: '$199.00/month',
                meta: {
                    kitName: 'Virtual Event Production Service',
                   
                }
            },
            'index3': {
                productId: 'index3',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Ghostwritten Tweetstorm Service',
                price: '$199.00/month',
                meta: {
                    kitName: 'Ghostwritten Tweetstorm Service',
                 
                }
            }
        };

        
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

module.exports = router; 