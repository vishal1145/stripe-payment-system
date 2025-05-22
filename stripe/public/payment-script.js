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
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
            }
            .my-stripe-popup-root .popup-overlay {
                display: none;
                position: fixed;
                top: 0; left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0,0,0,0.7);
                z-index: 99999;
                justify-content: center;
                align-items: center;
                backdrop-filter: blur(5px);
            }
            .my-stripe-popup-root .popup-content {
                background: #fff;
                padding: 24px;
                border-radius: 16px;
                width: 95%;
                max-width: 1000px;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 40px rgba(0,0,0,0.2);
                display: flex;
                flex-direction: column;
                gap: 20px;
                animation: slideUp 0.3s ease-out;
            }
            @keyframes slideUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            .my-stripe-popup-root .popup-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-bottom: 16px;
                border-bottom: 1px solid #f0f0f0;
            }
            .my-stripe-popup-root .popup-title {
                font-size: 24px;
                font-weight: 600;
                color: #1a1a1a;
            }
            .my-stripe-popup-root .popup-header img {
                width: 120px;
                height: auto;
                object-fit: contain;
            }
            .my-stripe-popup-root .close-x {
                font-size: 24px;
                cursor: pointer;
                color: #666;
                font-weight: 300;
                transition: color 0.2s;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                background: #f5f5f5;
            }
            .my-stripe-popup-root .close-x:hover {
                color: #000;
                background: #ebebeb;
            }
            .my-stripe-popup-root .plan-summary {
                background: #f8fafc;
                border: 1px solid #e5e7eb;
                border-radius: 12px;
                padding: 16px;
                display: flex;
                flex-direction: column;
                gap: 8px;
                transition: all 0.2s;
            }
            .my-stripe-popup-root .plan-summary:hover {
                border-color: #d1d5db;
                box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            }
            .my-stripe-popup-root .plan-cards {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin: 20px 0;
            }
            .my-stripe-popup-root .plan-card {
                position: relative;
                background: #fff;
                border-radius: 16px;
                border: 1px solid #e5e7eb;
                padding: 24px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
            .my-stripe-popup-root .plan-card:before {
                display: none;
            }
            .my-stripe-popup-root .plan-card:hover {
                border-color: #e5e7eb;
                transform: none;
                box-shadow: none;
            }
            .my-stripe-popup-root .plan-card-title {
                font-size: 16px;
                font-weight: 600;
                color: #1a1a1a;
                margin-bottom: 8px;
            }
            .my-stripe-popup-root .plan-card ul {
                list-style: none;
                padding-left: 0;
                font-size: 14px;
                color: #4b5563;
                margin: 16px 0;
            }
            .my-stripe-popup-root .plan-card li {
                line-height: 1.8;
                display: flex;
                align-items: flex-start;
                margin-bottom: 8px;
            }
            .my-stripe-popup-root .plan-card li span {
                color: #3B0764;
                font-weight: 600;
                margin-right: 12px;
            }
            .my-stripe-popup-root .plan-btn {
                padding: 14px;
                background: #3B0764;
                color: #fff;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                width: 100%;
                margin-top: 20px;
                transition: all 0.2s;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .my-stripe-popup-root .plan-btn.elite { 
                background: #8044FF;
                background: linear-gradient(135deg, #8044FF 0%, #6D28D9 100%);
            }
            .my-stripe-popup-root .plan-btn.premium { 
                background: #3B0764;
                background: linear-gradient(135deg, #4C1D95 0%, #3B0764 100%);
            }
            .my-stripe-popup-root .plan-btn:hover { 
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            .my-stripe-popup-root .or-divider {
                display: flex;
                align-items: center;
                text-align: center;
                margin: 24px 0;
                height: 24px;
            }
            .my-stripe-popup-root .or-divider hr {
                flex: 1;
                border: none;
                border-top: 1px solid #e5e7eb;
                margin: 0;
            }
            .my-stripe-popup-root .or-divider span {
                padding: 0 16px;
                font-size: 14px;
                color: #6b7280;
                background: #fff;
                font-weight: 500;
            }
            .my-stripe-popup-root .continue-btn {
                padding: 14px;
                background: #fff;
                color: #374151;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                width: 100%;
                transition: all 0.2s;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .my-stripe-popup-root .continue-btn:hover {
                background: #f9fafb;
                border-color: #d1d5db;
                color: #111827;
            }
            .premium-plan-header, .elite-plan-header {
                margin-bottom: 20px;
                padding-bottom: 16px;
                border-bottom: 1px solid #f0f0f0;
                position: relative;
            }
            .premium-badge, .elite-badge {
                position: absolute;
                top: -12px;
                right: -12px;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                letter-spacing: 0.5px;
                text-transform: uppercase;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .premium-badge {
                               box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                background: rgba(128, 68, 255, 0.1);
                color: #6D28D9;
                border: 1px solid rgba(128, 68, 255, 0.2);
            }
            .elite-badge {
                position: absolute;
                top: -12px;
                right: 80px;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                letter-spacing: 0.5px;
                text-transform: uppercase;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                background: rgba(128, 68, 255, 0.1);
                color: #6D28D9;
                border: 1px solid rgba(128, 68, 255, 0.2);
            }
            .premium-bold, .elite-bold {
                font-size: 24px;
                font-weight: 700;
                color: #1a1a1a;
                display: block;
                margin-bottom: 6px;
                background: linear-gradient(135deg, #3B0764 0%, #4C1D95 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            .premium-normal, .elite-normal {
                font-weight: 500;
                font-size: 15px;
                color: #6b7280;
                display: block;
                margin-bottom: 8px;
            }
            .premium-subtext, .elite-subtext {
                font-size: 14px;
                color:rgb(5, 5, 5);
                margin-top: 8px;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .premium-subtext:before, .elite-subtext:before {
                content: "✓";
                color:rgb(3, 3, 3);
                font-weight: bold;
            }
            .plan-card {
                position: relative;
                overflow: visible !important;
            }
            .plan-card:before {
                content: "";
                position: absolute;
                top: -2px;
                left: -2px;
                right: -2px;
                bottom: -2px;
                border-radius: 18px;
                background: linear-gradient(135deg, #3B0764 0%, #4C1D95 100%);
                opacity: 0;
                transition: opacity 0.3s;
                z-index: -1;
            }
            .plan-card:hover:before {
                opacity: 1;
            }
            .best-value-badge {
                display: block !important;
                position: absolute;
                top: 0;
                right: 0;
                background: #3B0764;
                color: #fff;
                padding: 6px 16px;
                font-size: 12px;
                font-weight: 600;
                clip-path: polygon(0 0, 100% 0, 100% 100%, 15% 100%);
                border-radius: 0 16px 0 0;
                z-index: 1;
            }
            .discount-tag {
                display: inline-flex;
                align-items: center;
                background: #ecfdf5;
                color: #059669;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 600;
                margin: 12px 0;
            }
            .discount-tag:before {
                content: "🎉";
                margin-right: 6px;
            }
            .price-block {
                background: #f8fafc;
                border-radius: 12px;
                padding: 16px;
                margin: 16px 0;
            }
            .original-price {
                color: #94a3b8;
                text-decoration: line-through;
                font-size: 16px;
                margin-bottom: 8px;
            }
            .discounted-price {
                color: #1a1a1a;
                font-size: 32px;
                font-weight: 700;
                display: flex;
                align-items: baseline;
            }
            .discounted-price span {
                font-size: 16px;
                font-weight: 500;
                color: #64748b;
                margin-left: 4px;
            }
            .premium-plan-header, .elite-plan-header {
                margin-bottom: 16px;
                padding-bottom: 16px;
                border-bottom: 1px solid #f0f0f0;
            }
            .premium-bold, .elite-bold {
                font-weight: 600;
                font-size: 18px;
                color: #1a1a1a;
                display: block;
                margin-bottom: 4px;
            }
            .premium-normal, .elite-normal {
                font-weight: 400;
                font-size: 14px;
                color: #6b7280;
            }
            .premium-subtext, .elite-subtext {
                font-size: 14px;
                color:rgb(3, 3, 3);
                margin-top: 4px;
                font-weight: 500;
            }
            .best-value-badge {
                position: absolute;
                top: -1px;
                right: -1px;
                background: #3B0764;
                color: #fff;
                padding: 8px 16px;
                font-size: 12px;
                font-weight: 500;
                border-radius: 0 16px 0 16px;
                letter-spacing: 0.5px;
            }
            .best-value-badge span {
                color: #fff;
            }

            @media (max-width: 768px) {
                .my-stripe-popup-root .popup-content {
                    padding: 16px;
                    max-height: 95vh;
                }
                .my-stripe-popup-root .plan-cards {
                    grid-template-columns: 1fr;
                }
                .my-stripe-popup-root .plan-card {
                    padding: 20px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    const selectedProduct = JSON.parse(sessionStorage.getItem('selectedProduct') || '{}');
    const isBusiness = selectedProduct?.isBusiness === true;

    const businessPlanContent = `
        <div class="plan-card">
            <div>
             <div class="best-value-badge">Most Popular</div>
                <div class="premium-plan-header">
                  
                    <span class="premium-bold">PREMIUM PLAN</span>
                    <div class="premium-subtext">Cancel anytime</div>
                </div>
                <div class="discount-tag">Limited time offer – 50% discount</div>
                <div class="price-block">
                    <div class="original-price">$99/month</div>
                    <div class="discounted-price">$49<span>/month</span></div>
                    <div style="font-size: 12px; color: #059669; margin-top: 4px;">
                        Discount guaranteed for 12 months
                    </div>
                </div>
                <ul style="list-style: none; padding-left: 0;">
                    <li><span>✓</span> Monthly growth ideas, tips, tools + checklist</li>
                    <li><span>✓</span> Marketing prompts, templates + outreach scripts</li>
                    <li><span>✓</span> Ongoing business optimization tools</li>
                    <li><span>✓</span> 1:1 support via email with 24-hour response</li>
                    <li><span>✓</span> Early access to new business packs</li>
                    <li><span>✓</span> AI-powered business analysis tools</li>
                    <li><span>✓</span> Training vault: step-by-step guides</li>
                    <li><span>✓</span> Bonus: Canva branding kit + social posts</li>
                    <li><span>✓</span> Quarterly content refresh + trend adaptation</li>
                    <li><span>✓</span> AI optimization prompts and training</li>
                </ul>
            </div>
            <button class="plan-btn premium" onclick="proceedToCheckout('price_1RNrEVFRtxUdrNGCfD9u4SYF')">CONTINUE WITH PREMIUM</button>
        </div>

        <div class="plan-card" style="position: relative;">
            <div class="best-value-badge">Best Value</div>
            <div>
                <div class="elite-plan-header">
                    <div class="elite-badge">Complete Solution</div>
                    <span class="elite-bold">ELITE PLAN</span>
                    <div class="elite-subtext">Cancel anytime</div>
                </div>
                <div class="discount-tag">Limited time offer – 50% discount</div>
                <div class="price-block">
                    <div class="original-price">$199/month</div>
                    <div class="discounted-price">$99<span>/month</span></div>
                    <div style="font-size: 12px; color: #059669; margin-top: 4px;">
                        Discount guaranteed for 12 months
                    </div>
                </div>
                <ul style="list-style: none; padding-left: 0;">
                    <li><span>✓</span> Everything in Premium – plus</li>
                    <li><span>✓</span> Custom voice-over walkthroughs and screen-recorded setup videos</li>
                    <li><span>✓</span> Brand Personalization — logo, color palette, banner image, profile assets</li>
                    <li><span>✓</span> Use us as your personal expert mentor and advisor — 24/7 access</li>
                    <li><span>✓</span> Full ORM — 24/7 online monitoring, suppression, and takedown support</li>
                    <li><span>✓</span> Front-of-queue support with fast response times</li>
                    <li><strong><span>✓</span> BONUS:</strong> 3 exclusive Canva templates</li>
                </ul>
            </div>
            <button class="plan-btn elite" onclick="proceedToCheckout('price_1RMRqWFRtxUdrNGCUYfXbac8')">CONTINUE WITH ELITE</button>
        </div>`;

    const regularPlanContent = `
        <div class="plan-card">
            <div>
            <div class="best-value-badge">Most Popular</div>
                <div class="premium-plan-header">
                    <div>
                        <span class="premium-bold">PREMIUM PLAN</span>
                      
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

        <div class="plan-card" style="position: relative;">
            <div class="best-value-badge">Best Value</div>
            <div>
                <div class="elite-plan-header">
                    <div class="elite-badge">Complete Solution</div>
                    <span class="elite-bold">ELITE PLAN</span>
                    <div class="elite-subtext">Cancel anytime</div>
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
                   <div style="display: flex; align-items: center; margin-bottom: 16px;">
  <img
    src="https://totalbizpack.com/wp-content/uploads/2025/04/cropped-cropped-cropped-logo-briief-cse-70x69.png"
    alt="TotalBizPack"
    style="height: 40px;     width: 82px;"
  />
  <div style="display: flex; flex-direction: column; line-height: 1; margin-right:-3px">
    <span style="font-size: 16px; color: #06566D; font-weight: 600;">Total</span>
    <span style="font-size: 18px; color: #06566D; font-weight: 700;">BizPack</span>
  </div>
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
            folderId: selectedProduct.folderId,
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


document.addEventListener('DOMContentLoaded', function () {
    // Extract the ID from the current page's URL
    let path = window.location.pathname; // e.g., "/index-1/"
    let idPart = path.split('/').filter(Boolean).pop() || '';
    idPart = idPart.replace(/-/g, ''); // e.g., "index1"

    // Helper: check if idPart is "index1", "index2", etc.
    function isIndexId(id) {
        return /^index\d+$/i.test(id);
    }
    // Helper: check if idPart is "businessindex1", "businessindex2", etc.
    function isBusinessIndexId(id) {
        return /^businessindex\d+$/i.test(id);
    }

    document.querySelectorAll('a.elementor-button').forEach(anchor => {
        const buttonText = anchor.textContent.trim();
        if (buttonText.toLowerCase().includes('buy now')) {
            // Create the button
            const button = document.createElement('button');
            button.textContent = buttonText;
            
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.cursor = 'pointer';
            button.style.fontWeight = '500';

            // Conditional CSS
            if (isIndexId(idPart)) {
                button.style.background = '#0070f3'; // blue
            } else if (isBusinessIndexId(idPart) || /^[a-zA-Z0-9]{16,}$/.test(idPart)) {
                // businessindex* or Stripe-like ID (long alphanumeric)
                button.style.background = 'rgb(29, 102, 94)'; // green
                button.style.width = '100%';
            } else {
                // Default style if needed
                button.style.background = '#888';
                button.style.width = '17%';
            }

            button.setAttribute('onclick', `openPopup('${idPart}')`);
            anchor.parentNode.replaceChild(button, anchor);
        }
    });
});