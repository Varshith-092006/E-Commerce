import React from 'react';
import { Button, Card, Alert } from '@ecommerce/ui';
import { useCart } from '../context/CartContext.jsx';

export function CartPage({ onContinueShopping, onProceedToCheckout }) {
  const { cart, loading, error, updateQuantity, removeFromCart, clearCart } = useCart();

  const items = cart?.items || [];
  const totalItems = cart?.total_items || 0;
  const subtotal = cart?.subtotal || '0.00';

  if (loading && items.length === 0) {
    return <div className="loading-container">Loading your shopping cart...</div>;
  }

  return (
    <div className="cart-page-container">
      <div className="cart-page-header">
        <h1 className="cart-page-title">Shopping Cart</h1>
        <span className="cart-items-count-badge">({totalItems} items)</span>
      </div>

      {error && (
        <Alert variant="danger" title="Cart Notice">
          {error}
        </Alert>
      )}

      {items.length === 0 ? (
        <div className="cart-empty-fullpage">
          <div className="empty-cart-graphic">🛒</div>
          <h2>Your Cart is Currently Empty</h2>
          <p>Explore our catalog and find amazing deals on electronics, fashion, and more!</p>
          <Button variant="primary" size="lg" onClick={onContinueShopping}>
            Start Shopping Now
          </Button>
        </div>
      ) : (
        <div className="cart-layout-grid">
          {/* Main Items List */}
          <div className="cart-items-column">
            <div className="cart-table-header">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
            </div>

            <div className="cart-items-list-card">
              {items.map((item) => (
                <div key={item.id} className="cart-table-row">
                  {/* Product Info */}
                  <div className="cart-col-product">
                    <div className="cart-row-img-box">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.title} />
                      ) : (
                        <div className="cart-img-placeholder">🛍️</div>
                      )}
                    </div>
                    <div className="cart-row-info">
                      <h3 className="cart-row-title">{item.title}</h3>
                      <span className="cart-row-seller">Sold by Verified Seller</span>
                      <button
                        className="cart-row-remove-btn"
                        onClick={() => removeFromCart(item.id)}
                      >
                        🗑️ Remove
                      </button>
                    </div>
                  </div>

                  {/* Unit Price */}
                  <div className="cart-col-price">
                    <span className="unit-price-text">${item.price}</span>
                  </div>

                  {/* Quantity Counter */}
                  <div className="cart-col-qty">
                    <div className="cart-page-qty-counter">
                      <button
                        className="qty-btn"
                        disabled={item.quantity <= 1}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="qty-val">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        disabled={item.quantity >= 99}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Item Subtotal */}
                  <div className="cart-col-subtotal">
                    <span className="item-subtotal-text">${item.subtotal}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer-actions">
              <Button variant="ghost" size="sm" onClick={onContinueShopping}>
                ← Continue Shopping
              </Button>
              <Button variant="secondary" size="sm" onClick={clearCart}>
                Clear Entire Cart
              </Button>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="cart-summary-column">
            <Card className="cart-summary-card">
              <h2 className="summary-title">Order Summary</h2>

              <div className="summary-line-row">
                <span>Subtotal ({totalItems} items)</span>
                <span className="summary-val">${subtotal}</span>
              </div>

              <div className="summary-line-row">
                <span>Estimated Shipping</span>
                <span className="summary-val-free">Calculated at checkout</span>
              </div>

              <div className="summary-line-row">
                <span>Estimated Tax (GST)</span>
                <span className="summary-val-muted">Calculated at checkout</span>
              </div>

              <div className="summary-divider" />

              <div className="summary-total-row">
                <span>Estimated Total</span>
                <span className="summary-grand-total">${subtotal}</span>
              </div>

              <div className="summary-checkout-box">
                <Button
                  variant="primary"
                  size="lg"
                  className="checkout-proceed-btn"
                  onClick={onProceedToCheckout}
                >
                  Proceed to Checkout →
                </Button>
              </div>

              <div className="security-guarantee-note">
                🔒 Guaranteed Safe & Secure Checkout
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
