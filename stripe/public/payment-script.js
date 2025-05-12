// Load API URL from environment variable
    const API_URL = window.API_URL || 'https://stripe-payment.algofolks.com/api';
    // const API_URL = window.API_URL || 'http://192.168.1.7:3000/api';
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

    // Inject CSS (scoped to .my-stripe-popup-root)
    if (!document.getElementById('my-stripe-popup-style')) {
            const style = document.createElement('style');
    style.id = 'my-stripe-popup-style';
    style.innerHTML = `
    .my-stripe-popup-root {font - family: Arial, sans-serif !important; }
    .my-stripe-popup-root .popup-overlay {
        display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(0,0,0,0.5); z-index: 99999; justify-content: center; align-items: center;
}
    .my-stripe-popup-root .popup-content {
        background: #fff; padding: 20px; border-radius: 12px; width: 95%; max-width: 800px;padding-top:30px;padding-bottom:30px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2); display: flex; flex-direction: column; gap: 16px;
}
    .my-stripe-popup-root .popup-header {
        display: flex; justify-content: space-between; align-items: center; margin-bottom: 0;
}
    .my-stripe-popup-root .popup-title {
        font - size: 24px; font-weight: bold; margin: 0 0 2px 0;
}
    .my-stripe-popup-root .close-x {
        font - size: 22px; cursor: pointer; color: #999; font-weight: normal; line-height: 1;
}
    .my-stripe-popup-root .plan-summary {
        background: #f9f9f9; border: 1px solid #eee; border-radius: 12px; padding: 12px; margin-bottom: 0;
    display: flex; flex-direction: column; gap: 4px;
}
    .my-stripe-popup-root .plan-cards {display: flex; gap: 10px; }
    .my-stripe-popup-root .plan-card {
        flex: 1; background: #fff; border-radius: 10px; border: 1px solid #eee; padding: 14px;
    display: flex; flex-direction: column; justify-content: space-between; min-width: 0;
}
    .my-stripe-popup-root .plan-card-title {
        font - size: 15px; font-weight: 600; color: #666; margin-bottom: 2px;
}
    .my-stripe-popup-root .plan-card-price {
        font - size: 20px; font-weight: bold; color: #000; margin-top: 3px ;margin-bottom: 12px ;
}
    .my-stripe-popup-root .plan-card-oldprice {
        color: #999; text-decoration: line-through; font-size: 15px; font-weight: normal; margin-left: 6px;
}
    .my-stripe-popup-root .plan-card-period {
        font - size: 13px; color: #666; margin-left: 2px;
}
    .my-stripe-popup-root .plan-card ul {
        list-style: none; padding: 0; font-size: 14px; color: #444; margin: 0 0 10px 0;
}

  .my-stripe-popup-root .plan-card li {
        list-style: none;
}
    .my-stripe-popup-root .plan-btn {
        padding: 10px 0;
    background: #3B0764;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    width: 100%;
    margin-top: 10px;
    transition: background 0.2s;
    font-family: Arial, sans-serif;
}
    .my-stripe-popup-root .plan-btn.elite {background: #8044FF; }
    .my-stripe-popup-root .plan-btn.premium {background: #3B0764; }
    .my-stripe-popup-root .plan-btn:hover {opacity: 0.92; }
    .my-stripe-popup-root .or-divider {
        display: flex; align-items: center; text-align: center; margin: 0px 0 0 0; height: 24px;
}
    .my-stripe-popup-root .or-divider hr {flex: 1; border: none; border-top: 1px solid #ccc; margin: 0; }
    .my-stripe-popup-root .or-divider span {
        padding: 0 6px; font-size: 12px; color: #666; background: #fff; position: relative; z-index: 1; font-family: Arial, sans-serif;
}
    .my-stripe-popup-root .continue-btn {
        padding: 10px 0;
    background: #fff;
    color: #666;
    border: 1.5px solid #666;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    width: 100%;
    margin-top: 10px;
    transition: background 0.2s, color 0.2s;
    font-family: Arial, sans-serif;
    text-transform: uppercase;
}
    .my-stripe-popup-root .continue-btn:hover {background: #000; color: #fff; }
    @media (max-width: 768px) {
.my - stripe - popup - root.plan - cards {flex - direction: column; gap: 10px; }
    .my-stripe-popup-root .popup-content {padding: 10px; }
}
    `;
    document.head.appendChild(style);
        }

    // Popup HTML (no inline styles, all classes)
    const popupHTML = `
    <div class="my-stripe-popup-root">
        <div class="popup-overlay" id="popupOverlay">
            <div class="popup-content">
                <div class="popup-header">
                    <div class="popup-title">Checkout Details</div>
                    <span class="close-x" onclick="closePopup()">&times;</span>
                </div>
                <div class="plan-summary" id="selectedPlanSummary">
                    <div id="kitName" style="font-size:13px;color:#666;font-weight:500;"></div>
                    <div><span id="planPrice" style="font-size:20px;font-weight:700;color:#000;"></span></div>
                </div>
                <div style="padding:5px 0;">
                    <h3 style="font-size:18px;color:#666;margin:0;">Choose a support plan to get our support.</h3>
                </div>
                <div class="plan-cards">
                    <div class="plan-card">
                        <div>
                            <div class="plan-card-title">PREMIUM</div>
                            <div class="plan-card-price">$99 <span class="plan-card-oldprice">$199</span> <span class="plan-card-period">/mo</span></div>
                            <ul>
                                <li>✓ Dedicated Account Manager</li>
                                <li>✓ Priority Support (24-48 hr turnaround)</li>
                                <li>✓ Standard(Service Level Agreement)</li>
                                <li>✓ Access to Premium Templates/Assets</li>
                            </ul>
                        </div>
                        <button class="plan-btn premium" onclick="proceedToCheckout('price_1RMRqWFRtxUdrNGCUYfXbac8')">CONTINUE WITH PREMIUM</button>
                    </div>
                    <div class="plan-card">
                        <div>
                            <div class="plan-card-title">ELITE</div>
                            <div class="plan-card-price">$199 <span class="plan-card-oldprice">$99</span> <span class="plan-card-period">/mo</span></div>
                            <ul>
                                <li>✓ Everything in Premium</li>
                                <li>✓ Personalized Project Manager</li>
                                <li>✓ AI-Powered Insights/Recommendations</li>
                                <li>✓ Dedicated Slack/Phone Support</li>
                            </ul>
                        </div>
                        <button class="plan-btn elite" onclick="proceedToCheckout('price_1RMRlVFRtxUdrNGC0raPhXjS')">CONTINUE WITH ELITE</button>
                    </div>
                </div>
                <div class="or-divider">
                    <hr><span>OR</span><hr>
                    </div>
                        <button class="continue-btn" onclick="proceedToCheckout()">Continue without support</button>
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

        injectPopupHTML();

        const product = productMapping[productId];
        if (!product) {
            console.error('Product not found:', productId);
        return;
        }

        sessionStorage.setItem('selectedProduct', JSON.stringify(product));

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

//buy now button click event apply

document.addEventListener('DOMContentLoaded', function() {
  // 1. Get productId from URL
  var urls = window.location.href.split("/");
    var productId = urls[urls.length - 2].replace('-', '');

  // 2. Find the Buy Now button
  const buttons = document.querySelectorAll('button');
  let buyNowButton = null;
  for (const button of buttons) {
    if (button.textContent.trim().toLowerCase().includes('buy now')) {
      buyNowButton = button;
      break;
    }
  }

  // 3. Assign click event
  if (buyNowButton && productId) {
    buyNowButton.addEventListener('click', function() {
      openPopup(productId);
    });
  }
});