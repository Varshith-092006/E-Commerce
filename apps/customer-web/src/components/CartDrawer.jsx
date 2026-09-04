import React from 'react';
import { Button } from '@ecommerce/ui';
import { useCart } from '../context/CartContext.jsx';

export function CartDrawer({ onNavigateToCart, onNavigateToCheckout }) {
  const { cart, isDrawerOpen, closeDrawer, updateQuantity, removeFromCart } = useCart();

  if (!isDrawerOpen) return null;

  const items = cart?.items || [];
  const totalItems = cart?.total_items || 0;
  const subtotal = cart?.subtotal || '0.00';

  return (
    <div className="cart-drawer-overlay" onClick={closeDrawer}>
      <div className="cart-drawer-content" onClick={(e) => e.stopPropagation()}>
        <div className="cart-drawer-header">
          <h3>Your Shopping Cart ({totalItems})</h3>
          <button className="cart-close-btn" onClick={closeDrawer} title="Close Cart">
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-drawer-empty">
            <div className="empty-cart-icon">🛒</div>
            <p>Your cart is empty.</p>
            <Button variant="primary" size="sm" onClick={closeDrawer}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="cart-drawer-items-list">
              {items.map((item) => (
                <div key={item.id} className="cart-drawer-item-row">
                  <div className="cart-item-img-container">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.title} />
                    ) : (
                      <div className="placeholder-box">🛍️</div>
                    )}
                  </div>
                  <div className="cart-item-details">
                    <h4 className="cart-item-title">{item.title}</h4>
                    <div className="cart-item-price-row">
                      <span className="cart-item-unit-price">${item.price}</span>
                      <span className="cart-item-subtotal-tag">${item.subtotal}</span>
                    </div>
                    <div className="cart-item-actions-row">
                      <div className="cart-qty-counter">
                        <button
                          className="qty-btn"
                          disabled={item.quantity <= 1}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          −
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          disabled={item.quantity >= 99}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="cart-remove-link"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-drawer-footer">
              <div className="cart-drawer-subtotal-row">
                <span>Subtotal</span>
                <span className="subtotal-amount">${subtotal}</span>
              </div>
              <p className="cart-shipping-note">Taxes and shipping calculated at checkout.</p>
              <div className="cart-drawer-buttons">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    closeDrawer();
                    onNavigateToCart();
                  }}
                >
                  View Full Cart
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    closeDrawer();
                    onNavigateToCart();
                  }}
                >
                  Go to Checkout
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
