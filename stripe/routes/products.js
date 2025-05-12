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
                price: '$199 ',
                meta: {
                    kitName: 'AI Content Creation Service',
                   
                }
            },
            'index2': {
                productId: 'index2',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Virtual Event Production Service',
                price: '$199 ',
                meta: {
                    kitName: 'Virtual Event Production Service',
                   
                }
            },
            'index3': {
                productId: 'index3',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Ghostwritten Tweetstorm Service',
                price: '$199 ',
                meta: {
                    kitName: 'Ghostwritten Tweetstorm Service',
                 
                }
            },
            'index4': {
                productId: 'index4',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Lead Gen for Agencies',
                price: '$199 ',
                meta: {
                    kitName: 'Lead Gen for Agencies',

                }
            },
            'index5': {
                productId: 'index5',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'LinkedIn Post Ghostwriter',
                price: '$199 ',
                meta: {
                    kitName: 'LinkedIn Post Ghostwriter',

                }
            },
            'index6': {
                productId: 'index6',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Email Newsletter Service',
                price: '$199 ',
                meta: {
                    kitName: 'Email Newsletter Service',

                }
            },
            'index7': {
                productId: 'index7',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'AI Resume Optimizer',
                price: '$199 ',
                meta: {
                    kitName: 'AI Resume Optimizer',

                }
            },
            'index8': {
                productId: 'index8',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'UGC Creator for Brand Deals',
                price: '$199 ',
                meta: {
                    kitName: 'UGC Creator for Brand Deals',

                }
            },
            'index9': {
                productId: 'index9',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'AI Resume Writer Service',
                price: '$199 ',
                meta: {
                    kitName: 'AI Resume Writer Service',

                }
            },
            'index10': {
                productId: 'index10',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'AI Facebook Group Moderator',
                price: '$199 ',
                meta: {
                    kitName: 'AI Facebook Group Moderator',

                }
            },
            'index11': {
                productId: 'index11',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'AI Affiliate Blog Builder',
                price: '$199 ',
                meta: {
                    kitName: 'AI Affiliate Blog Builder',

                }
            },
            'index12': {
                productId: 'index12',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'AI YouTube Script Writer',
                price: '$199 ',
                meta: {
                    kitName: 'AI YouTube Script Writer',

                }
            },
            'index13': {
                productId: 'index13',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'AI-Generated Printable Products Shop',
                price: '$199 ',
                meta: {
                    kitName: 'AI-Generated Printable Products Shop',

                }
            },
            'index14': {
                productId: 'index14',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Local Facebook Ad Service',
                price: '$199 ',
                meta: {
                    kitName: 'Local Facebook Ad Service',

                }
            },
            'index15': {
                productId: 'index15',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Google Reviews Consultant',
                price: '$199 ',
                meta: {
                    kitName: 'Google Reviews Consultant',

                }
            },
            'index16': {
                productId: 'index16',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Newsletter Sponsorship Broker',
                price: '$199 ',
                meta: {
                    kitName: 'Newsletter Sponsorship Broker',

                }
            },
            'index17': {
                productId: 'index17',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Local Services Promoter',
                price: '$199 ',
                meta: {
                    kitName: 'Local Services Promoter',

                }
            },
            'index18': {
                productId: 'index18',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Etsy Niche Shop Setup',
                price: '$199 ',
                meta: {
                    kitName: 'Etsy Niche Shop Setup',

                }
            },
            'index19': {
                productId: 'index19',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'LinkedIn DM Offer Funnel',
                price: '$199 ',
                meta: {
                    kitName: 'LinkedIn DM Offer Funnel',

                }
            },
            'index20': {
                productId: 'index20',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Fiverr Gig Automation',
                price: '$199 ',
                meta: {
                    kitName: 'Fiverr Gig Automation',

                }
            },
            'businessindex1': {
                productId: 'businessindex1',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Dentist',
                price: '$199 ',
                meta: {
                    kitName: 'Dentist',

                },
                isBusiness: true,
            },
            'businessindex2': {
                productId: 'businessindex2',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Lawyer',
                price: '$199 ',
                meta: {
                    kitName: 'Lawyer',

                },
                isBusiness: true,
            },
            'businessindex3': {
                productId: 'businessindex3',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Architect',
                price: '$199 ',
                meta: {
                    kitName: 'Architect',

                },
                isBusiness: true,
            },
            'businessindex4': {
                productId: 'businessindex4',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Psychologist / Therapist',
                price: '$199 ',
                meta: {
                    kitName: 'Psychologist / Therapist',

                },
                isBusiness: true,
            },
            'businessindex5': {
                productId: 'businessindex5',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Financial Advisor',
                price: '$199 ',
                meta: {
                    kitName: 'Financial Advisor',

                },
                isBusiness: true,
            },
            'businessindex6': {
                productId: 'businessindex6',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Real Estate Agent',
                price: '$199 ',
                meta: {
                    kitName: 'Real Estate Agent',

                },
                isBusiness: true,
            },
            'businessindex7': {
                productId: 'businessindex7',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Accountant/CPA',
                price: '$199 ',
                meta: {
                    kitName: 'Accountant/CPA',

                },
                isBusiness: true,
            },
            'businessindex8': {
                productId: 'businessindex8',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Personal Trainer',
                price: '$199 ',
                meta: {
                    kitName: 'Personal Trainer',

                },
                isBusiness: true,
            },
            'businessindex9': {
                productId: 'businessindex9',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Nutritionist/Dietitian',
                price: '$199 ',
                meta: {
                    kitName: 'Nutritionist/Dietitian',

                },
                isBusiness: true,
            },
            'businessindex10': {
                productId: 'businessindex10',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Beautician',
                price: '$199 ',
                meta: {
                    kitName: 'Beautician',

                },
                isBusiness: true,
            },
            'businessindex11': {
                productId: 'businessindex11',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Hairdresser',
                price: '$199 ',
                meta: {
                    kitName: 'Hairdresser',

                },
                isBusiness: true,
            },
            'businessindex12': {
                productId: 'businessindex12',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Virtual Assistant',
                price: '$199 ',
                meta: {
                    kitName: 'Virtual Assistant',

                },
                isBusiness: true,
            },
            'businessindex13': {
                productId: 'businessindex13',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Bookkeeper',
                price: '$199 ',
                meta: {
                    kitName: 'Bookkeeper',

                },
                isBusiness: true,
            },
            businessindex14: {
                productId: 'businessindex14',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Photographer',
                price: '$199 ',
                meta: { kitName: 'Photographer' },
                isBusiness: true,
            },
            businessindex15: {
                productId: 'businessindex15',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Online Coach',
                price: '$199 ',
                meta: { kitName: 'Online Coach' },
                isBusiness: true,
            },
            businessindex16: {
                productId: 'businessindex16',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Electrician',
                price: '$199 ',
                meta: { kitName: 'Electrician' },
                isBusiness: true,
            },
            businessindex17: {
                productId: 'businessindex17',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Plumber',
                price: '$199 ',
                meta: { kitName: 'Plumber' },
                isBusiness: true,
            },
            businessindex18: {
                productId: 'businessindex18',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Painter',
                price: '$199 ',
                meta: { kitName: 'Painter' },
                isBusiness: true,
            },
            businessindex19: {
                productId: 'businessindex19',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Carpenter',
                price: '$199 ',
                meta: { kitName: 'Carpenter' },
                isBusiness: true,
            },
            businessindex20: {
                productId: 'businessindex20',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Landscaper',
                price: '$199 ',
                meta: { kitName: 'Landscaper' },
                isBusiness: true,
            },
            businessindex21: {
                productId: 'businessindex21',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Roofer',
                price: '$199 ',
                meta: { kitName: 'Roofer' },
                isBusiness: true,
            },
            businessindex22: {
                productId: 'businessindex22',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Flooring Installer',
                price: '$199 ',
                meta: { kitName: 'Flooring Installer' },
                isBusiness: true,
            },
            businessindex23: {
                productId: 'businessindex23',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Cleaning Service',
                price: '$199 ',
                meta: { kitName: 'Cleaning Service' },
                isBusiness: true,
            },
            businessindex24: {
                productId: 'businessindex24',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Handyman',
                price: '$199 ',
                meta: { kitName: 'Handyman' },
                isBusiness: true,
            },
            businessindex25: {
                productId: 'businessindex25',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Mobile Car Detailer',
                price: '$199 ',
                meta: { kitName: 'Mobile Car Detailer' },
                isBusiness: true,
            },
            businessindex26: {
                productId: 'businessindex26',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Website Designer',
                price: '$199 ',
                meta: { kitName: 'Website Designer' },
                isBusiness: true,
            },
            businessindex27: {
                productId: 'businessindex27',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'E-commerce Seller',
                price: '$199 ',
                meta: { kitName: 'E-commerce Seller' },
                isBusiness: true,
            },
            businessindex28: {
                productId: 'businessindex28',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Social Media Manager',
                price: '$199 ',
                meta: { kitName: 'Social Media Manager' },
                isBusiness: true,
            },
            businessindex29: {
                productId: 'businessindex29',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'Facebook Ads Consultant',
                price: '$199 ',
                meta: { kitName: 'Facebook Ads Consultant' },
                isBusiness: true,
            },
            businessindex30: {
                productId: 'businessindex30',
                priceId: 'price_1RNBeaFRtxUdrNGCy0bMFTWr',
                name: 'AI Integration Consultant',
                price: '$199 ',
                meta: { kitName: 'AI Integration Consultant' },
                isBusiness: true,
            }
            
        };

        
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

module.exports = router; 