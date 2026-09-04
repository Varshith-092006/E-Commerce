import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card, Alert, Badge } from '@ecommerce/ui';
import { apiRequest } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export function CheckoutPage({ buyNowItem = null, onNavigateCart, onNavigateBrowse }) {
  const { user } = useAuth();
  const { refreshCart } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('PREPAID'); // PREPAID or COD
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [calculation, setCalculation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [error, setError] = useState(null);
  const [couponError, setCouponError] = useState(null);
  const [placedOrder, setPlacedOrder] = useState(null);

  // 1. Dynamically Load Razorpay Checkout Script
  useEffect(() => {
    const existingScript = document.getElementById('razorpay-checkout-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'razorpay-checkout-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // 2. Load Saved Addresses
  useEffect(() => {
    async function loadAddresses() {
      if (!user) return;
      try {
        setLoading(true);
        const data = await apiRequest('/users/addresses');
        setAddresses(data || []);
        if (data && data.length > 0) {
          const defaultAddr = data.find((a) => a.is_default) || data[0];
          setSelectedAddressId(defaultAddr.id);
        }
      } catch (err) {
        setError('Failed to load delivery addresses: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
    loadAddresses();
  }, [user]);

  // 3. Perform Server-Authoritative Calculation
  const runCalculation = useCallback(
    async (addressId, promoCode) => {
      if (!addressId) return;
      try {
        setCalculating(true);
        setCouponError(null);
        const payload = {
          addressId,
          couponCode: promoCode || undefined,
          buyNowItem: buyNowItem || undefined,
          useCart: buyNowItem ? undefined : true,
        };

        const result = await apiRequest('/checkout/calculate', {
          method: 'POST',
          body: payload,
        });

        setCalculation(result);
        if (result.pricing?.coupon) {
          setAppliedCoupon(result.pricing.coupon);
        } else {
          setAppliedCoupon(null);
        }
        setError(null);
      } catch (err) {
        if (promoCode) {
          setCouponError(err.message);
        } else {
          setError(err.message);
        }
      } finally {
        setCalculating(false);
      }
    },
    [buyNowItem],
  );

  useEffect(() => {
    if (selectedAddressId) {
      runCalculation(selectedAddressId, appliedCoupon?.code);
    }
  }, [selectedAddressId, runCalculation]);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim() || !selectedAddressId) return;
    runCalculation(selectedAddressId, couponCode.trim());
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setAppliedCoupon(null);
    if (selectedAddressId) {
      runCalculation(selectedAddressId, null);
    }
  };

  // Helper to create a UUID v4
  const generateUUID = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  // 4. Handle Complete Payment and Order Placement
  const handlePaymentAndPlaceOrder = async () => {
    if (!selectedAddressId || !calculation) return;

    try {
      setSubmittingOrder(true);
      setError(null);

      const grandTotal = calculation.pricing.grand_total;
      const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

      // --- FLOW A: CASH ON DELIVERY (COD) ---
      if (paymentMethod === 'COD') {
        const codPayment = await apiRequest('/payments/cod/initiate', {
          method: 'POST',
          body: {
            amount: grandTotal,
            currency: 'INR',
          },
        });

        const idempotencyKey = `idem_${generateUUID()}`;
        const orderResponse = await apiRequest('/orders', {
          method: 'POST',
          headers: {
            'Idempotency-Key': idempotencyKey,
          },
          body: {
            addressId: selectedAddressId,
            paymentMethod: 'COD',
            paymentId: codPayment.paymentId,
            couponCode: appliedCoupon?.code || null,
            buyNowItem: buyNowItem || null,
          },
        });

        setPlacedOrder(orderResponse);
        if (!buyNowItem) {
          refreshCart();
        }
        return;
      }

      // --- FLOW B: PREPAID (RAZORPAY) ---
      const paymentIntent = await apiRequest('/payments/initiate', {
        method: 'POST',
        body: {
          amount: grandTotal,
          currency: 'INR',
        },
      });

      // Handler called upon successful payment in Razorpay modal
      const handleRazorpaySuccess = async (response) => {
        try {
          // 1. Verify HMAC-SHA256 signature
          const verificationResult = await apiRequest('/payments/verify', {
            method: 'POST',
            body: {
              paymentId: paymentIntent.paymentId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            },
          });

          if (!verificationResult.verified) {
            throw new Error('Payment signature verification failed');
          }

          // 2. Place Order in order-svc
          const idempotencyKey = `idem_${generateUUID()}`;
          const orderResponse = await apiRequest('/orders', {
            method: 'POST',
            headers: {
              'Idempotency-Key': idempotencyKey,
            },
            body: {
              addressId: selectedAddressId,
              paymentMethod: 'PREPAID',
              paymentId: paymentIntent.paymentId,
              couponCode: appliedCoupon?.code || null,
              buyNowItem: buyNowItem || null,
            },
          });

          setPlacedOrder(orderResponse);
          if (!buyNowItem) {
            refreshCart();
          }
        } catch (err) {
          setError(err.message || 'Failed to finalize order after payment');
        } finally {
          setSubmittingOrder(false);
        }
      };

      // Check if real Razorpay Checkout is loaded in browser
      if (typeof window !== 'undefined' && window.Razorpay) {
        const rzpOptions = {
          key: paymentIntent.keyId,
          amount: Math.round(parseFloat(paymentIntent.amount) * 100),
          currency: paymentIntent.currency,
          name: 'ApexStore',
          description: `Order Payment (${calculation.items.length} items)`,
          order_id: paymentIntent.razorpayOrderId,
          prefill: {
            name: selectedAddress?.full_name || user?.firstName || 'Customer',
            email: user?.email || '',
            contact: selectedAddress?.phone || '+919876543210',
          },
          theme: {
            color: '#38bdf8',
          },
          handler: handleRazorpaySuccess,
          modal: {
            ondismiss: () => {
              setSubmittingOrder(false);
            },
          },
        };

        const rzpInstance = new window.Razorpay(rzpOptions);
        rzpInstance.open();
      } else {
        // Mock Razorpay Simulator (For automated testing or offline mock development)
        const mockPaymentId = `pay_mock_${generateUUID().substring(0, 14)}`;
        // Compute mock signature for development/mock mode
        const mockSignature = '9ef4d3418ee649a4cb3e5mocksignature';
        await handleRazorpaySuccess({
          razorpay_order_id: paymentIntent.razorpayOrderId,
          razorpay_payment_id: mockPaymentId,
          razorpay_signature: mockSignature,
        });
      }
    } catch (err) {
      setError(err.message || 'Payment initiation failed');
      setSubmittingOrder(false);
    }
  };

  if (loading) {
    return <div className="loading-container">Loading checkout details...</div>;
  }

  // --- RENDER ORDER CONFIRMATION SCREEN ---
  if (placedOrder) {
    const orderPricing = placedOrder.pricing_snapshot || {};
    const orderItems = placedOrder.items || [];
    const shippingAddr = placedOrder.shipping_address || {};

    return (
      <div className="order-confirmation-container">
        <div className="order-success-card">
          <div className="success-icon-banner">🎉</div>
          <h1 className="success-title">Order Placed Successfully!</h1>
          <p className="order-number-tag">
            Order Reference: <strong>{placedOrder.order_number}</strong>
          </p>
          <p className="confirmation-notice">
            Thank you for your purchase. We have received your order and are preparing it for shipment.
          </p>

          <div className="order-details-grid">
            <div className="confirmation-section">
              <h3>Delivery Details</h3>
              <p><strong>{shippingAddr.full_name}</strong></p>
              <p>{shippingAddr.street_address}, {shippingAddr.city}, {shippingAddr.state} - {shippingAddr.postal_code}</p>
              <p>Phone: {shippingAddr.phone}</p>
            </div>

            <div className="confirmation-section">
              <h3>Payment & Order Summary</h3>
              <p>Payment Method: <Badge variant="primary" size="sm">{placedOrder.payment_method}</Badge></p>
              <p>Status: <Badge variant="success" size="sm">{placedOrder.status}</Badge></p>
              <p>Items Subtotal: ${orderPricing.subtotal}</p>
              {parseFloat(orderPricing.discount || 0) > 0 && (
                <p className="val-discount">Discount: -${orderPricing.discount}</p>
              )}
              <p>Tax (18% GST): ${orderPricing.tax}</p>
              <p>Shipping: {orderPricing.free_shipping ? 'FREE' : `$${orderPricing.shipping_fee}`}</p>
              <p className="confirmation-grand-total">Total Paid: ${placedOrder.total_amount}</p>
            </div>
          </div>

          <div className="confirmation-items-list">
            <h3>Items in this Order ({orderItems.length})</h3>
            {orderItems.map((item) => (
              <div key={item.id} className="confirmation-item-row">
                <span>{item.title} (Qty: {item.quantity})</span>
                <strong>${item.subtotal}</strong>
              </div>
            ))}
          </div>

          <div className="confirmation-actions">
            <Button variant="primary" size="lg" onClick={onNavigateBrowse}>
              Continue Shopping 🛍️
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const pricing = calculation?.pricing;
  const items = calculation?.items || [];

  return (
    <div className="checkout-page-container">
      <div className="checkout-page-header">
        <h1 className="checkout-page-title">Secure Checkout</h1>
        {buyNowItem ? (
          <Badge variant="primary" size="sm">⚡ Instant Buy Now</Badge>
        ) : (
          <Badge variant="secondary" size="sm">🛒 Cart Checkout</Badge>
        )}
      </div>

      {error && (
        <Alert variant="danger" title="Checkout Notice">
          {error}
        </Alert>
      )}

      <div className="checkout-layout-grid">
        {/* Left Column: Address, Payment Method, and Items Review */}
        <div className="checkout-main-column">
          {/* 1. Delivery Address Selection */}
          <div className="checkout-step-card">
            <div className="step-header">
              <span className="step-number">1</span>
              <h2>Select Delivery Address</h2>
            </div>

            {addresses.length === 0 ? (
              <div className="no-address-box">
                <p>No saved addresses found in your account.</p>
                <Button variant="secondary" size="sm" onClick={onNavigateCart}>
                  Go to Profile to Add Address
                </Button>
              </div>
            ) : (
              <div className="address-options-list">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`address-option-card ${
                      selectedAddressId === addr.id ? 'selected' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryAddress"
                      value={addr.id}
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                    />
                    <div className="address-details-text">
                      <div className="address-recipient">
                        <strong>{addr.full_name}</strong>
                        {addr.is_default && (
                          <Badge variant="primary" size="sm">Default</Badge>
                        )}
                      </div>
                      <p>{addr.street_address}, {addr.city}, {addr.state} - {addr.postal_code}</p>
                      <span className="address-phone">📞 {addr.phone}</span>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* 2. Payment Method Selection */}
          <div className="checkout-step-card">
            <div className="step-header">
              <span className="step-number">2</span>
              <h2>Select Payment Method</h2>
            </div>

            <div className="payment-options-list">
              <label
                className={`payment-option-card ${
                  paymentMethod === 'PREPAID' ? 'selected' : ''
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="PREPAID"
                  checked={paymentMethod === 'PREPAID'}
                  onChange={() => setPaymentMethod('PREPAID')}
                />
                <div className="payment-method-details">
                  <strong>💳 Online Payment (Razorpay)</strong>
                  <p>Instant authorization via Credit/Debit Cards, UPI, Netbanking, or Wallets.</p>
                </div>
              </label>

              <label
                className={`payment-option-card ${
                  paymentMethod === 'COD' ? 'selected' : ''
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                />
                <div className="payment-method-details">
                  <strong>💵 Cash on Delivery (COD)</strong>
                  <p>Pay in cash upon physical delivery at your doorstep.</p>
                </div>
              </label>
            </div>
          </div>

          {/* 3. Review Order Items */}
          <div className="checkout-step-card">
            <div className="step-header">
              <span className="step-number">3</span>
              <h2>Review Order Items ({items.length})</h2>
            </div>

            <div className="checkout-items-preview">
              {items.map((item) => (
                <div key={item.product_id} className="checkout-item-row">
                  <div className="checkout-item-img">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.title} />
                    ) : (
                      <div className="img-placeholder">🛍️</div>
                    )}
                  </div>
                  <div className="checkout-item-info">
                    <h4>{item.title}</h4>
                    <span className="checkout-item-qty">Qty: {item.quantity} × ${item.price}</span>
                  </div>
                  <div className="checkout-item-total">
                    ${item.subtotal}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Pricing Summary & Order CTA */}
        <div className="checkout-summary-column">
          <Card className="checkout-summary-card">
            <h2 className="summary-card-title">Order Summary</h2>

            {/* Promo Code Box */}
            <div className="promo-code-section">
              <label htmlFor="couponInput" className="promo-label">Have a Promo Code?</label>
              {appliedCoupon ? (
                <div className="applied-coupon-badge">
                  <span>🎟️ <strong>{appliedCoupon.code}</strong> (-${appliedCoupon.discount_amount})</span>
                  <button className="remove-coupon-btn" onClick={handleRemoveCoupon}>
                    ✕ Remove
                  </button>
                </div>
              ) : (
                <form className="promo-form" onSubmit={handleApplyCoupon}>
                  <input
                    id="couponInput"
                    type="text"
                    placeholder="e.g. SAVE20"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    disabled={calculating || !selectedAddressId}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    type="submit"
                    disabled={calculating || !couponCode.trim()}
                  >
                    Apply
                  </Button>
                </form>
              )}

              {couponError && (
                <span className="coupon-error-msg">{couponError}</span>
              )}
            </div>

            <div className="summary-breakdown-list">
              <div className="summary-breakdown-row">
                <span>Items Subtotal</span>
                <span className="val">${pricing?.subtotal || '0.00'}</span>
              </div>

              {parseFloat(pricing?.discount || 0) > 0 && (
                <div className="summary-breakdown-row discount-row">
                  <span>Coupon Discount</span>
                  <span className="val-discount">-${pricing.discount}</span>
                </div>
              )}

              <div className="summary-breakdown-row">
                <span>Estimated Tax (GST 18%)</span>
                <span className="val">${pricing?.tax || '0.00'}</span>
              </div>

              <div className="summary-breakdown-row">
                <span>Shipping Fee</span>
                {pricing?.free_shipping ? (
                  <span className="val-free">FREE</span>
                ) : (
                  <span className="val">${pricing?.shipping_fee || '10.00'}</span>
                )}
              </div>

              <div className="summary-divider-line" />

              <div className="summary-grand-total-row">
                <span>Total to Pay</span>
                <span className="grand-total-amount">
                  ${pricing?.grand_total || '0.00'}
                </span>
              </div>
            </div>

            <div className="checkout-action-box">
              <Button
                variant="primary"
                size="lg"
                className="checkout-pay-btn"
                disabled={!selectedAddressId || items.length === 0 || calculating || submittingOrder}
                onClick={handlePaymentAndPlaceOrder}
              >
                {submittingOrder
                  ? 'Processing Order...'
                  : paymentMethod === 'PREPAID'
                  ? `Pay $${pricing?.grand_total || '0.00'} with Razorpay →`
                  : 'Place COD Order →'}
              </Button>
            </div>

            <div className="checkout-trust-badges">
              <span>🔒 256-Bit SSL Encryption</span>
              <span>⚡ Authoritative Server Validation</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
