import React, { useState, useEffect } from 'react';
import { Button, Alert } from '@ecommerce/ui';
import { apiRequest } from '../api/client.js';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export function ProductDetailPage({ productIdOrSlug, onBack, onNavigateLogin, onBuyNow }) {
  const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const data = await apiRequest(`/products/${productIdOrSlug}`);
        setProduct(data);
        setSelectedImageIndex(0);
        setQuantity(1);
      } catch (err) {
        console.error('Failed to load product', err);
      } finally {
        setLoading(false);
      }
    }

    if (productIdOrSlug) {
      loadProduct();
    }
  }, [productIdOrSlug]);

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      setActionError(null);
      await addToCart(product.id, quantity);
      setActionSuccess('Added to cart successfully!');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      if (err.message?.includes('sign in')) {
        if (onNavigateLogin) onNavigateLogin();
      } else {
        setActionError(err.message || 'Failed to add item to cart');
      }
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNowClick = () => {
    if (!product?.is_available) return;
    if (onBuyNow) {
      onBuyNow(product.id, quantity);
    }
  };

  if (loading) {
    return <div className="loading-container">Loading product details...</div>;
  }

  if (!product) {
    return (
      <div className="empty-state-box">
        <h3>Product not found</h3>
        <Button variant="secondary" onClick={onBack}>
          Back to Catalog
        </Button>
      </div>
    );
  }

  const inWishlist = isWishlisted(product.id);
  const images = product.images || [];
  const activeImage = images[selectedImageIndex]?.url;
  const discount = product.compare_at_price
    ? Math.round(
        ((Number(product.compare_at_price) - Number(product.price)) /
          Number(product.compare_at_price)) *
          100,
      )
    : 0;

  return (
    <div className="product-detail-page">
      <button className="back-link-btn" onClick={onBack}>
        ← Back to Products
      </button>

      {actionError && (
        <Alert
          variant="danger"
          title="Notice"
          onClose={() => setActionError(null)}
        >
          {actionError}
        </Alert>
      )}

      {actionSuccess && (
        <Alert
          variant="success"
          title="Added"
          onClose={() => setActionSuccess(null)}
        >
          {actionSuccess}
        </Alert>
      )}

      <div className="product-detail-grid">
        {/* Media Gallery */}
        <div className="product-gallery">
          <div className="main-image-display">
            {activeImage ? (
              <img src={activeImage} alt={product.title} className="detail-hero-img" />
            ) : (
              <div className="detail-img-placeholder">📷 No Image Available</div>
            )}
            {discount > 0 && <span className="detail-discount-tag">Save {discount}%</span>}
          </div>

          {images.length > 1 && (
            <div className="thumbnail-strip">
              {images.map((img, idx) => (
                <div
                  key={img.id || idx}
                  className={`thumbnail-box ${selectedImageIndex === idx ? 'selected' : ''}`}
                  onClick={() => setSelectedImageIndex(idx)}
                >
                  <img src={img.url} alt={img.alt_text || 'Thumbnail'} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="product-info-panel">
          <span className="product-brand-tag">{product.brand}</span>
          <h1 className="product-title-large">{product.title}</h1>

          {/* Rating Summary */}
          <div className="rating-summary-row">
            <div className="stars-badge">
              ⭐ {Number(product.average_rating || 0).toFixed(1)}
            </div>
            <span className="reviews-count-text">
              {product.total_reviews || 0} customer ratings
            </span>
            <span className="stock-badge in-stock">
              {product.is_available ? '✔ In Stock' : '✖ Out of Stock'}
            </span>
          </div>

          {/* Price Row */}
          <div className="detail-price-box">
            <span className="detail-current-price">
              ${Number(product.price).toFixed(2)}
            </span>
            {product.compare_at_price && (
              <span className="detail-compare-price">
                ${Number(product.compare_at_price).toFixed(2)}
              </span>
            )}
          </div>

          <p className="detail-description">{product.description}</p>

          {/* Quantity Selector */}
          <div className="detail-quantity-row">
            <span className="qty-label">Quantity:</span>
            <div className="detail-qty-picker">
              <button
                className="qty-btn"
                disabled={quantity <= 1}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span className="qty-number">{quantity}</span>
              <button
                className="qty-btn"
                disabled={quantity >= 99}
                onClick={() => setQuantity((q) => Math.min(99, q + 1))}
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="detail-actions-row">
            <Button
              variant="primary"
              size="lg"
              onClick={handleAddToCart}
              disabled={addingToCart || !product.is_available}
              className="add-to-cart-btn"
            >
              {addingToCart ? 'Adding to Cart...' : 'Add to Cart 🛒'}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={handleBuyNowClick}
              disabled={!product.is_available}
              className="buy-now-btn"
            >
              ⚡ Buy Now
            </Button>
            <Button
              variant={inWishlist ? 'secondary' : 'ghost'}
              size="lg"
              onClick={() =>
                inWishlist ? removeFromWishlist(product.id) : addToWishlist(product.id)
              }
            >
              {inWishlist ? '❤️ In Wishlist' : '🤍 Add to Wishlist'}
            </Button>
          </div>

          {/* Specifications Table */}
          {product.attributes && Object.keys(product.attributes).length > 0 && (
            <div className="specs-section">
              <h3>Product Specifications</h3>
              <table className="specs-table">
                <tbody>
                  {Object.entries(product.attributes).map(([key, val]) => (
                    <tr key={key}>
                      <td className="spec-key">{key}</td>
                      <td className="spec-val">{String(val)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="spec-key">SKU</td>
                    <td className="spec-val">{product.sku}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Placeholder Section */}
      <section className="reviews-section">
        <div className="reviews-header">
          <h3>Customer Reviews ({product.total_reviews || 0})</h3>
        </div>
        <div className="reviews-empty-placeholder">
          <p>Verified reviews & ratings submission will be enabled in Phase 4.</p>
        </div>
      </section>
    </div>
  );
}
