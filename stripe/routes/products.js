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
            },
            'index4': {
                productId: 'index4',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Lead Gen for Agencies',
                price: '$199.00/month',
                meta: {
                    kitName: 'Lead Gen for Agencies',

                }
            },
            'index5': {
                productId: 'index5',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'LinkedIn Post Ghostwriter',
                price: '$199.00/month',
                meta: {
                    kitName: 'LinkedIn Post Ghostwriter',

                }
            },
            'index6': {
                productId: 'index6',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Email Newsletter Service',
                price: '$199.00/month',
                meta: {
                    kitName: 'Email Newsletter Service',

                }
            },
            'index7': {
                productId: 'index7',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'AI Resume Optimizer',
                price: '$199.00/month',
                meta: {
                    kitName: 'AI Resume Optimizer',

                }
            },
            'index8': {
                productId: 'index8',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'UGC Creator for Brand Deals',
                price: '$199.00/month',
                meta: {
                    kitName: 'UGC Creator for Brand Deals',

                }
            },
            'index9': {
                productId: 'index9',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'AI Resume Writer Service',
                price: '$199.00/month',
                meta: {
                    kitName: 'AI Resume Writer Service',

                }
            },
            'index10': {
                productId: 'index10',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'AI Facebook Group Moderator',
                price: '$199.00/month',
                meta: {
                    kitName: 'AI Facebook Group Moderator',

                }
            },
            'index11': {
                productId: 'index11',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'AI Affiliate Blog Builder',
                price: '$199.00/month',
                meta: {
                    kitName: 'AI Affiliate Blog Builder',

                }
            },
            'index12': {
                productId: 'index12',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'AI YouTube Script Writer',
                price: '$199.00/month',
                meta: {
                    kitName: 'AI YouTube Script Writer',

                }
            },
            'index13': {
                productId: 'index13',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'AI-Generated Printable Products Shop',
                price: '$199.00/month',
                meta: {
                    kitName: 'AI-Generated Printable Products Shop',

                }
            },
            'index14': {
                productId: 'index14',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Local Facebook Ad Service',
                price: '$199.00/month',
                meta: {
                    kitName: 'Local Facebook Ad Service',

                }
            },
            'index15': {
                productId: 'index15',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Google Reviews Consultant',
                price: '$199.00/month',
                meta: {
                    kitName: 'Google Reviews Consultant',

                }
            },
            'index16': {
                productId: 'index16',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Newsletter Sponsorship Broker',
                price: '$199.00/month',
                meta: {
                    kitName: 'Newsletter Sponsorship Broker',

                }
            },
            'index17': {
                productId: 'index17',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Local Services Promoter',
                price: '$199.00/month',
                meta: {
                    kitName: 'Local Services Promoter',

                }
            },
            'index18': {
                productId: 'index18',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Etsy Niche Shop Setup',
                price: '$199.00/month',
                meta: {
                    kitName: 'Etsy Niche Shop Setup',

                }
            },
            'index19': {
                productId: 'index19',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'LinkedIn DM Offer Funnel',
                price: '$199.00/month',
                meta: {
                    kitName: 'LinkedIn DM Offer Funnel',

                }
            },
            'index20': {
                productId: 'index20',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Fiverr Gig Automation',
                price: '$199.00/month',
                meta: {
                    kitName: 'Fiverr Gig Automation',

                }
            },
            'businessIndex1': {
                productId: 'businessIndex1',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Dentist',
                price: '$199.00/month',
                meta: {
                    kitName: 'Dentist',

                }
            },
            'businessIndex2': {
                productId: 'businessIndex2',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Lawyer',
                price: '$199.00/month',
                meta: {
                    kitName: 'Lawyer',

                }
            },
            'businessIndex3': {
                productId: 'businessIndex3',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Architect',
                price: '$199.00/month',
                meta: {
                    kitName: 'Architect',

                }
            },
            'businessIndex4': {
                productId: 'businessIndex4',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Psychologist / Therapist',
                price: '$199.00/month',
                meta: {
                    kitName: 'Psychologist / Therapist',

                }
            },
            'businessIndex5': {
                productId: 'businessIndex5',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Financial Advisor',
                price: '$199.00/month',
                meta: {
                    kitName: 'Financial Advisor',

                }
            },
            'businessIndex6': {
                productId: 'businessIndex6',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Real Estate Agent',
                price: '$199.00/month',
                meta: {
                    kitName: 'Real Estate Agent',

                }
            },
            'businessIndex7': {
                productId: 'businessIndex7',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Accountant/CPA',
                price: '$199.00/month',
                meta: {
                    kitName: 'Accountant/CPA',

                }
            },
            'businessIndex8': {
                productId: 'businessIndex8',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Personal Trainer',
                price: '$199.00/month',
                meta: {
                    kitName: 'Personal Trainer',

                }
            },
            'businessIndex9': {
                productId: 'businessIndex9',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Nutritionist/Dietitian',
                price: '$199.00/month',
                meta: {
                    kitName: 'Nutritionist/Dietitian',

                }
            },
            'businessIndex10': {
                productId: 'businessIndex10',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Beautician',
                price: '$199.00/month',
                meta: {
                    kitName: 'Beautician',

                }
            },
            'businessIndex11': {
                productId: 'businessIndex11',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Hairdresser',
                price: '$199.00/month',
                meta: {
                    kitName: 'Hairdresser',

                }
            },
            'businessIndex12': {
                productId: 'businessIndex12',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Virtual Assistant',
                price: '$199.00/month',
                meta: {
                    kitName: 'Virtual Assistant',

                }
            },
            'businessIndex13': {
                productId: 'businessIndex13',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Bookkeeper',
                price: '$199.00/month',
                meta: {
                    kitName: 'Bookkeeper',

                }
            },
            businessIndex14: {
                productId: 'businessIndex14',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Photographer',
                price: '$199.00/month',
                meta: { kitName: 'Photographer' }
            },
            businessIndex15: {
                productId: 'businessIndex15',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Online Coach',
                price: '$199.00/month',
                meta: { kitName: 'Online Coach' }
            },
            businessIndex16: {
                productId: 'businessIndex16',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Electrician',
                price: '$199.00/month',
                meta: { kitName: 'Electrician' }
            },
            businessIndex17: {
                productId: 'businessIndex17',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Plumber',
                price: '$199.00/month',
                meta: { kitName: 'Plumber' }
            },
            businessIndex18: {
                productId: 'businessIndex18',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Painter',
                price: '$199.00/month',
                meta: { kitName: 'Painter' }
            },
            businessIndex19: {
                productId: 'businessIndex19',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Carpenter',
                price: '$199.00/month',
                meta: { kitName: 'Carpenter' }
            },
            businessIndex20: {
                productId: 'businessIndex20',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Landscaper',
                price: '$199.00/month',
                meta: { kitName: 'Landscaper' }
            },
            businessIndex21: {
                productId: 'businessIndex21',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Roofer',
                price: '$199.00/month',
                meta: { kitName: 'Roofer' }
            },
            businessIndex22: {
                productId: 'businessIndex22',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Flooring Installer',
                price: '$199.00/month',
                meta: { kitName: 'Flooring Installer' }
            },
            businessIndex23: {
                productId: 'businessIndex23',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Cleaning Service',
                price: '$199.00/month',
                meta: { kitName: 'Cleaning Service' }
            },
            businessIndex24: {
                productId: 'businessIndex24',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Handyman',
                price: '$199.00/month',
                meta: { kitName: 'Handyman' }
            },
            businessIndex25: {
                productId: 'businessIndex25',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Mobile Car Detailer',
                price: '$199.00/month',
                meta: { kitName: 'Mobile Car Detailer' }
            },
            businessIndex26: {
                productId: 'businessIndex26',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Website Designer',
                price: '$199.00/month',
                meta: { kitName: 'Website Designer' }
            },
            businessIndex27: {
                productId: 'businessIndex27',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'E-commerce Seller',
                price: '$199.00/month',
                meta: { kitName: 'E-commerce Seller' }
            },
            businessIndex28: {
                productId: 'businessIndex28',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Social Media Manager',
                price: '$199.00/month',
                meta: { kitName: 'Social Media Manager' }
            },
            businessIndex29: {
                productId: 'businessIndex29',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Facebook Ads Consultant',
                price: '$199.00/month',
                meta: { kitName: 'Facebook Ads Consultant' }
            },
            businessIndex30: {
                productId: 'businessIndex30',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'AI Integration Consultant',
                price: '$199.00/month',
                meta: { kitName: 'AI Integration Consultant' }
            }
            
        };

        
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

module.exports = router; 