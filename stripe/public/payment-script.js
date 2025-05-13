// Load API URL from environment variable
    const API_URL = window.API_URL || 'https://stripe-payment.algofolks.com/api';
    // const API_URL = window.API_URL || 'http://localhost:3000/api';
    const stripe = Stripe('pk_test_51RAUufFRtxUdrNGCljb5TkX16xKPX6EiJRSHPHENAfBx6AVvaE83LOBKC41ltr1HLECLiKuuTYdWauBuOyBTRsrF009tGlRQ9C');

    let selectedPlanId = null;
    let popupInjected = false;
    let productMapping = { };

    // Fetch product mapping data
    async function fetchProductMapping() {
    try {
        const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    productMapping = await response.json();
    console.log('Product mapping loaded:', productMapping);
    } catch (error) {
        console.error('Error fetching product mapping:', error);
    alert('Error loading product data. Please try again.');
    }
}

    // Load product data when page loads
    document.addEventListener('DOMContentLoaded', fetchProductMapping);
function injectPopupHTML() {
    if (window.popupInjected) return;
    window.popupInjected = true;

    if (!document.getElementById('my-stripe-popup-style')) {
        const style = document.createElement('style');
        style.id = 'my-stripe-popup-style';
        style.innerHTML = `
            .my-stripe-popup-root {
                font-family: Arial, sans-serif !important;
            }
            .my-stripe-popup-root .popup-overlay {
                display: none;
                position: fixed;
                top: 0; left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0,0,0,0.5);
                z-index: 99999;
                justify-content: center;
                align-items: center;
            }
            .my-stripe-popup-root .popup-content {
                background: #fff;
                padding: 16px;
                border-radius: 12px;
                width: 95%;
                max-width: 1000px;
                max-height: 100vh;
                overflow-y: auto;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .my-stripe-popup-root .popup-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .my-stripe-popup-root .popup-title {
                font-size: 20px;
                font-weight: bold;
            }
              .my-stripe-popup-root .popup-header img {
    margin-left: -50PX;
    width: 150px;
    height: auto;
    object-fit: contain;
    margin-right: -33px;
}
            .my-stripe-popup-root .close-x {
                font-size: 20px;
                cursor: pointer;
                color: #999;
                font-weight: normal;
            }
            .my-stripe-popup-root .plan-summary {
                background: #f9f9f9;
                border: 1px solid #eee;
                border-radius: 10px;
                padding: 10px;
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            .my-stripe-popup-root .plan-cards {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            }
            .my-stripe-popup-root .plan-card {
                flex: 1;
                min-width: 280px;
                background: #fff;
                border-radius: 10px;
                border: 1px solid #eee;
                padding: 12px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
            .my-stripe-popup-root .plan-card-title {
                font-size: 15px;
                font-weight: 600;
                color: #666;
            }
            .my-stripe-popup-root .plan-card-price {
                font-size: 18px;
                font-weight: bold;
                color: #000;
                margin: 5px 0;
            }
            .my-stripe-popup-root .plan-card-oldprice {
                color: #999;
                text-decoration: line-through;
                font-size: 14px;
                margin-left: 6px;
            }
            .my-stripe-popup-root .plan-card-period {
                font-size: 13px;
                color: #666;
                margin-left: 2px;
            }
            .my-stripe-popup-root .plan-card ul {
                list-style: none;
                padding-left: 0;
                font-size: 13px;
                color: #444;
                margin: 10px 0;
            }

               .my-stripe-popup-root .plan-card li{
               line-height: 1.9;
               }
            .my-stripe-popup-root .plan-btn {
                padding: 10px;
                background: #3B0764;
                color: #fff;
                border: none;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                width: 100%;
                margin-top: 10px;
            }
            .my-stripe-popup-root .plan-btn.elite { background: #8044FF; }
            .my-stripe-popup-root .plan-btn.premium { background: #3B0764; }
            .my-stripe-popup-root .plan-btn:hover { opacity: 0.92; }
    
            .my-stripe-popup-root .or-divider {
                display: flex;
                align-items: center;
                text-align: center;
                margin: 0;
                height: 24px;
            }
            .my-stripe-popup-root .or-divider hr {
                flex: 1;
                border: none;
                border-top: 1px solid #ccc;
                margin: 0;
            }
            .my-stripe-popup-root .or-divider span {
                padding: 0 6px;
                font-size: 12px;
                color: #666;
                background: #fff;
                position: relative;
                z-index: 1;
            }
            .my-stripe-popup-root .continue-btn {
                padding: 10px;
                background: #fff;
                color: #666;
                border: 1.5px solid #666;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                width: 100%;
                transition: background 0.2s, color 0.2s;
                text-transform: uppercase;
            }
            .my-stripe-popup-root .continue-btn:hover {
                background: #000;
                color: #fff;
            }
    
            @media (max-width: 768px) {
                .my-stripe-popup-root .plan-cards {
                    flex-direction: column;
                }
                .my-stripe-popup-root .popup-content {
                    padding: 12px;
                }
            }
            .premium-plan-header {
                margin-bottom: 10px;
            }
            .premium-bold {
                font-weight: bold;
                font-size: 1em;
              color: #666;
            }
            .premium-normal {
                font-weight: normal;
                font-size: 1em;
                color: #666;
            }
            .premium-subtext {
                font-size: 14px;
                color: #222;
                margin-top: 2px;
            }
            .elite-plan-header {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                margin-bottom: 10px;
                
            }
            .elite-bold {
                font-weight: bold;
                font-size: 1em;
                  color: #666;
            }
            .elite-normal {
                font-weight: normal;
                font-size: 1em;
                  color: #666;
            }
            .elite-subtext {
                font-size: 14px;
                color: #222;
                margin-top: 2px;
            }
            .best-value-badge {
                border: 2px solid #222;
                padding: 4px 12px 4px 12px;
                display: flex;
                align-items: center;
                height: 30px;
                min-width: 100px;
                justify-content: center;
            }
            .best-value-badge span {
                background: #000;
                color: #fff;
                padding: 4px 16px;
                font-size: 1.3em;
                font-family: serif;
                font-weight: 500;
                display: block;
            }
            `;
        document.head.appendChild(style);
    }

    const selectedProduct = JSON.parse(sessionStorage.getItem('selectedProduct') || '{}');
    const isBusiness = selectedProduct?.isBusiness === true;

    const businessPlanContent = `
        <div class="plan-card">
            <div>
                <div class="premium-plan-header">
                    <div>
                        <span class="premium-bold">PREMIUM PLAN</span>
                        <span class="premium-normal">– Most Popular</span>
                    </div>
                    <div class="premium-subtext">Cancel anytime</div>
                </div>
                <div style="color: #28a745; font-size:18px; font-weight: bold; ">Limited time offer – 50% discount</div>
                <div style="display: flex; align-items: flex-start; gap: 30px;">
                    <div style="color: #aaa; font-size: 18px; font-weight: 400; display: flex; align-items: center;">
                        <span style="font-size: 22px; margin-right: 4px;">✕</span>
                        <span style="text-decoration: line-through;">$99</span>
                        <span style="font-size: 18px; margin-left: 2px;">/month</span>
                    </div>
                    <div>
                        <div style="color: #222; font-size: 24px; font-weight: 700; display: flex; align-items: center;">
                            <span style="font-size: 18px; color: #888; margin-right: 4px;">✓</span>
                            $49<span style="font-size: 18px; font-weight: 400; margin-left: 2px;">/month</span>
                        </div>
                        <div style="font-size: 10px; color: #444; margin-top: 0px; margin-left: 0px;">
                            Discount guaranteed for 12 months
                        </div>
                    </div>
                </div>
                <ul style="list-style: none; padding-left: 0;">
                    <li><span style="margin-right: 9px;">✓</span> Monthly growth ideas, tips, tools + checklist</li>
                    <li><span style="margin-right: 9px;">✓</span> Marketing prompts, templates + outreach scripts</li>
                    <li><span style="margin-right: 9px;">✓</span> Ongoing business optimization tools</li>
                    <li><span style="margin-right: 9px;">✓</span> 1:1 support via email with 24-hour response</li>
                    <li><span style="margin-right: 9px;">✓</span> Early access to new business packs</li>
                    <li><span style="margin-right: 9px;">✓</span> AI-powered business analysis tools</li>
                    <li><span style="margin-right: 9px;">✓</span> Training vault: step-by-step guides for common tasks</li>
                    <li><span style="margin-right: 9px;">✓</span> Bonus: Canva branding kit + social posts</li>
                    <li><span style="margin-right: 9px;">✓</span> Quarterly content refresh + trend adaptation</li>
                    <li><span style="margin-right: 9px;">✓</span> AI optimization prompts and training</li>
                </ul>
            </div>
            <button class="plan-btn premium" onclick="proceedToCheckout('price_1RNrEVFRtxUdrNGCfD9u4SYF')">CONTINUE WITH PREMIUM</button>
        </div>

        <div class="plan-card">
            <div>
                <div class="elite-plan-header">
                    <div>
                        <span class="elite-bold">ELITE PLAN</span>
                        <span class="elite-normal">- Complete Solution</span>
                        <div class="elite-subtext">Cancel anytime</div>
                    </div>
                    <div class="best-value-badge">
                        <span>Best Value</span>
                    </div>
                </div>
                <div style="color: #28a745; font-size:18px; font-weight: bold; ">Limited time offer – 50% discount</div>
                <div style="display: flex; align-items: flex-start; gap: 30px;">
                    <div style="color: #aaa; font-size: 18px; font-weight: 400; display: flex; align-items: center;">
                        <span style="font-size: 22px; margin-right: 4px;">✕</span>
                        <span style="text-decoration: line-through;">$199</span>
                        <span style="font-size: 18px; margin-left: 2px;">/month</span>
                    </div>
                    <div>
                        <div style="color: #222; font-size: 24px; font-weight: 700; display: flex; align-items: center;">
                            <span style="font-size: 18px; color: #888; margin-right: 4px;">✓</span>
                            $99<span style="font-size: 18px; font-weight: 400; margin-left: 2px;">/month</span>
                        </div>
                        <div style="font-size: 10px; color: #444; margin-top: 2px; margin-left: 0px;">
                            Discount guaranteed for 12 months
                        </div>
                    </div>
                </div>
                <ul style="list-style: none; padding-left: 0;">
                    <li><span style="margin-right: 9px;">✓</span> Includes all Premium features - plus</li>
                    <li><span style="margin-right: 9px;">✓</span> Use us as your personal expert mentor and advisor — 24/7 email support</li>
                    <li><span style="margin-right: 9px;">✓</span> Done-for-you upgrades, scripts, reviews, redesigns</li>
                    <li><span style="margin-right: 9px;">✓</span> Online Reputation Management (ORM) monitoring + takedown support</li>
                    <li><span style="margin-right: 9px;">✓</span> 1-on-1 business strategy check-ins (via email)</li>
                    <li><span style="margin-right: 9px;">✓</span> Brand protection advice</li>
                    <li><span style="margin-right: 9px;">✓</span> Issue resolution help as needed</li>
                    <li><span style="margin-right: 9px;">✓</span> Legal & creative usage templates (terms, portfolio rights, privacy)</li>
                </ul>
            </div>
            <button class="plan-btn elite" onclick="proceedToCheckout('price_1RMRqWFRtxUdrNGCUYfXbac8')">CONTINUE WITH ELITE</button>
        </div>`;

    const regularPlanContent = `
        <div class="plan-card">
            <div>
                <div class="premium-plan-header">
                    <div>
                        <span class="premium-bold">PREMIUM PLAN</span>
                        <span class="premium-normal">– Most Popular</span>
                    </div>
                    <div class="premium-subtext">Cancel anytime</div>
                </div>
                <div style="color: #28a745; font-size:18px; font-weight: bold; ">Limited time offer – 50% discount</div>
                <div style="display: flex; align-items: flex-start; gap: 30px;">
                    <div style="color: #aaa; font-size: 18px; font-weight: 400; display: flex; align-items: center;">
                        <span style="font-size: 22px; margin-right: 4px;">✕</span>
                        <span style="text-decoration: line-through;">$99</span>
                        <span style="font-size: 18px; margin-left: 2px;">/month</span>
                    </div>
                    <div>
                        <div style="color: #222; font-size: 24px; font-weight: 700; display: flex; align-items: center;">
                            <span style="font-size: 18px; color: #888; margin-right: 4px;">✓</span>
                            $49<span style="font-size: 18px; font-weight: 400; margin-left: 2px;">/month</span>
                        </div>
                        <div style="font-size: 10px; color: #444; margin-top: 0px; margin-left: 0px;">
                            Discount guaranteed for 12 months
                        </div>
                    </div>
                </div>
                <ul style="list-style: none; padding-left: 0;">
                    <li><span style="margin-right: 9px;">✓</span> Everything in Lite Support – plus</li>
                    <li><span style="margin-right: 9px;">✓</span> Email support for marketing help and launch strategy</li>
                    <li><span style="margin-right: 9px;">✓</span> Extra AI tools and advanced templates</li>
                    <li><span style="margin-right: 9px;">✓</span> New kit previews before public release</li>
                    <li><span style="margin-right: 9px;">✓</span> Concierge tips on pricing, positioning, and upsells</li>
                    <li><span style="margin-right: 9px;">✓</span> 10+ bonus templates for outreach, upsells, and social proof</li>
                    <li><strong><span style="margin-right: 9px;">✓</span> BONUS:</strong> 3 exclusive Canva templates</li>
                </ul>
            </div>
            <button class="plan-btn premium" onclick="proceedToCheckout('price_1RNrEVFRtxUdrNGCfD9u4SYF')">CONTINUE WITH PREMIUM</button>
        </div>

        <div class="plan-card">
            <div>
                <div class="elite-plan-header">
                    <div>
                        <span class="elite-bold">ELITE PLAN</span>
                        <span class="elite-normal">- Complete Solution</span>
                        <div class="elite-subtext">Cancel anytime</div>
                    </div>
                    <div class="best-value-badge">
                        <span>Best Value</span>
                    </div>
                </div>
                <div style="color: #28a745; font-size:18px; font-weight: bold; ">Limited time offer – 50% discount</div>
                <div style="display: flex; align-items: flex-start; gap: 30px;">
                    <div style="color: #aaa; font-size: 18px; font-weight: 400; display: flex; align-items: center;">
                        <span style="font-size: 22px; margin-right: 4px;">✕</span>
                        <span style="text-decoration: line-through;">$199</span>
                        <span style="font-size: 18px; margin-left: 2px;">/month</span>
                    </div>
                    <div>
                        <div style="color: #222; font-size: 24px; font-weight: 700; display: flex; align-items: center;">
                            <span style="font-size: 18px; color: #888; margin-right: 4px;">✓</span>
                            $99<span style="font-size: 18px; font-weight: 400; margin-left: 2px;">/month</span>
                        </div>
                        <div style="font-size: 10px; color: #444;  margin-left: 0px;">
                            Discount guaranteed for 12 months
                        </div>
                    </div>
                </div>
                <ul style="list-style: none; padding-left: 0;">
                    <li><span style="margin-right: 9px;">✓</span> Everything in Premium – plus</li>
                    <li><span style="margin-right: 9px;">✓</span> Custom voice-over walkthroughs and screen-recorded setup videos</li>
                    <li><span style="margin-right: 9px;">✓</span> Brand Personalization — logo, color palette, banner image, profile assets</li>
                    <li><span style="margin-right: 9px;">✓</span> Use us as your personal expert mentor and advisor — 24/7 access</li>
                    <li><span style="margin-right: 9px;">✓</span> Full ORM — 24/7 online monitoring, suppression, and takedown support</li>
                    <li><span style="margin-right: 9px;">✓</span> Front-of-queue support with fast response times</li>
                    <li><strong><span style="margin-right: 9px;">✓</span> BONUS:</strong> 3 exclusive Canva templates</li>
                </ul>
            </div>
            <button class="plan-btn elite" onclick="proceedToCheckout('price_1RMRqWFRtxUdrNGCUYfXbac8')">CONTINUE WITH ELITE</button>
        </div>`;

    const popupHTML = `
        <div class="my-stripe-popup-root">
            <div class="popup-overlay" id="popupOverlay">
                <div class="popup-content">
                    <div class="popup-header">
                    <div style="display: flex; justify-content: center; align-items: center; gap: 0px; margin-bottom: 16px;">
  <img src="https://totalbizpack.com/wp-content/uploads/2025/04/cropped-cropped-cropped-logo-briief-cse-70x69.png" alt="TotalBizPack" style="height: 40px;">
  <div style="font-size: 20px; font-weight: bold;">Checkout</div>
</div>

                        <span class="close-x" onclick="closePopup()">&times;</span>
                    </div>
                    <div class="plan-summary" id="selectedPlanSummary">
                        <div id="kitName" style="font-size:13px;color:#666;font-weight:500;"></div>
                        <div><span id="planPrice" style="font-size:20px;font-weight:700;color:#000;"> </span>  <span style="font-size:20px; color:#888;"> / one time payment</span></div>
                    </div>
                    <div>
                        <h3 style="font-size:16px; margin:0;">
                            <span style="font-size:13px;color:#666;font-weight:500; margin-bottom:3px;">Help your business grow </span><br>
                            <span style="font-size:20px;font-weight:700;color:#000;">Growth Lab: choose a Support Plan</span>
                        </h3>
                    </div>
                    <div class="plan-cards">
                        ${isBusiness ? businessPlanContent : regularPlanContent}
                    </div>
                    <div class="or-divider">
                        <hr><span>OR</span><hr>
                    </div>
                    <button class="continue-btn" onclick="proceedToCheckout()">CONTINUE WITH LITE SUPPORT (Free)</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', popupHTML);
}
    

        async function openPopup(productId) {
    try {
        // Ensure product mapping is loaded
        if (Object.keys(productMapping).length === 0) {
            await fetchProductMapping();
        }

        const product = productMapping[productId];
        if (!product) {
            console.error('Product not found:', productId);
            return;
        }

        // Store the selected product in session storage
        sessionStorage.setItem('selectedProduct', JSON.stringify(product));

        injectPopupHTML();

        const planPriceElement = document.getElementById('planPrice');
        const planKitName = document.getElementById('kitName')
        if (planPriceElement) {
            planPriceElement.textContent = product.price;
        }
        if (planKitName) {
            planKitName.textContent = product.meta.kitName;
        }
        const popupOverlay = document.getElementById('popupOverlay');
        if (popupOverlay) {
            popupOverlay.style.display = 'flex';
        }
    } catch (error) {
        console.error('Error opening popup:', error);
    }
}

        function closePopup() {
    try {
        const popupOverlay = document.getElementById('popupOverlay');
        if (popupOverlay) {
            popupOverlay.style.display = 'none';
        }
        selectedPlanId = null;
    } catch (error) {
            console.error('Error closing popup:', error);
    }
}

        function proceedToCheckout(priceId) {
    try {
        const additionalPlans = priceId ? [priceId] : [];
        createCheckoutSession(additionalPlans);
    } catch (error) {
            console.error('Error proceeding to checkout:', error);
        alert('Error proceeding to checkout. Please try again.');
    }
}

        function createCheckoutSession(additionalPlans) {
    try {
        const selectedProduct = JSON.parse(sessionStorage.getItem('selectedProduct'));
        if (!selectedProduct) {
            console.error('No product selected');
        return;
        }

        fetch(`${API_URL}/checkout/create-checkout-session`, {
            method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            },
        credentials: 'include',
        body: JSON.stringify({
            priceId: selectedProduct.priceId,
        productId: selectedProduct.productId,
        productName: selectedProduct.name,
        productPrice: selectedProduct.price,
        additionalPlans: additionalPlans,
        metadata: selectedProduct.meta
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        return response.json();
        })
        .then(session => {
            if (session.error) {
            console.error('Error:', session.error);
        alert(session.error);
        return;
            }
        window.location.href = session.url;
        })
        .catch(error => {
            console.error('Error:', error);
        alert('Something went wrong with the checkout. Please try again.');
        });
    } catch (error) {
            console.error('Error creating checkout session:', error);
        alert('Error creating checkout session. Please try again.');
    }
}

