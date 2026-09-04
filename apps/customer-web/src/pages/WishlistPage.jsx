import React from 'react';
import { Button } from '@ecommerce/ui';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export function WishlistPage({ onSelectProduct, onNavigateBrowse, onNavigateLogin }) {
  const { user } = useAuth();
  const { items, loading, removeFromWishlist } = useWishlist();

  if (!user) {
    return (
      <div className="wishlist-page empty-state-box">
        <span className="empty-icon">🔒</span>
        <h2>Sign in to view your wishlist</h2>
        <p>Save items you love and access them anytime across all your devices.</p>
        <Button variant="primary" onClick={onNavigateLogin}>
          Sign In
        </Button>
      </div>
    );
  }

  if (loading) {
    return <div className="loading-container">Loading your wishlist...</div>;
  }

  if (!items || items.length === 0) {
    return (
      <div className="wishlist-page empty-state-box">
        <span className="empty-icon">❤️</span>
        <h2>Your Wishlist is Empty</h2>
        <p>Explore our catalog and click the heart icon on any product to save it here.</p>
        <Button variant="primary" onClick={onNavigateBrowse}>
          Browse Products
        </Button>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <h1>My Wishlist ({items.length} items)</h1>
        <p>Your saved favorites stored securely in your account.</p>
      </div>

      <div className="wishlist-grid">
        {items.map((item) => {
          const product = item.product || {};
          const thumbnail = product.images?.[0]?.url;

          return (
            <div key={item.id} className="wishlist-card">
              <div
                className="wishlist-media"
                onClick={() => onSelectProduct(product.slug || product.id)}
              >
                {thumbnail ? (
                  <img src={thumbnail} alt={product.title} className="wishlist-img" />
                ) : (
                  <div className="placeholder-icon">📷</div>
                )}
              </div>

              <div className="wishlist-body">
                <span className="wishlist-brand">{product.brand}</span>
                <h3
                  className="wishlist-title"
                  onClick={() => onSelectProduct(product.slug || product.id)}
                >
                  {product.title}
                </h3>
                <span className="wishlist-price">
                  ${Number(product.price || 0).toFixed(2)}
                </span>

                <div className="wishlist-actions">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onSelectProduct(product.slug || product.id)}
                  >
                    View Product
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeFromWishlist(product.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
