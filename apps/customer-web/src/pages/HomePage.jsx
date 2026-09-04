import React, { useState, useEffect } from 'react';
import { Button, Badge, Card } from '@ecommerce/ui';
import { apiRequest } from '../api/client.js';
import { useWishlist } from '../context/WishlistContext.jsx';

export function HomePage({ onNavigateBrowse, onSelectProduct }) {
  const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlist();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        setLoading(true);
        const [cats, prods] = await Promise.all([
          apiRequest('/categories'),
          apiRequest('/products?limit=8'),
        ]);
        setCategories(cats || []);
        setFeaturedProducts(prods || []);
      } catch (err) {
        console.error('Failed to load home data', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <Badge variant="primary" size="md">⚡ Spring 2026 Collection</Badge>
          <h1 className="hero-title">Experience Modern Shopping</h1>
          <p className="hero-subtitle">
            Curated electronics, fashion, and lifestyle products with instant delivery and guaranteed quality.
          </p>
          <div className="hero-actions">
            <Button variant="primary" size="lg" onClick={() => onNavigateBrowse()}>
              Explore Catalog ➔
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="home-section">
        <div className="section-header">
          <h2>Featured Categories</h2>
          <span className="section-link" onClick={() => onNavigateBrowse()}>
            View All Categories ➔
          </span>
        </div>
        <div className="categories-grid">
          {categories.slice(0, 6).map((cat) => (
            <div
              key={cat.id}
              className="category-card"
              onClick={() => onNavigateBrowse({ categoryId: cat.id })}
            >
              <div className="category-icon">📦</div>
              <h3 className="category-title">{cat.name}</h3>
              <p className="category-desc">{cat.description || 'Explore products'}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section className="home-section">
        <div className="section-header">
          <h2>Trending Products</h2>
          <span className="section-link" onClick={() => onNavigateBrowse()}>
            Browse All ({featuredProducts.length}+) ➔
          </span>
        </div>

        {loading ? (
          <div className="loading-container">Loading products...</div>
        ) : (
          <div className="products-grid">
            {featuredProducts.map((product) => {
              const inWishlist = isWishlisted(product.id);
              const discount = product.compare_at_price
                ? Math.round(
                    ((Number(product.compare_at_price) - Number(product.price)) /
                      Number(product.compare_at_price)) *
                      100,
                  )
                : 0;

              return (
                <div key={product.id} className="product-card">
                  <div
                    className="product-card-media"
                    onClick={() => onSelectProduct(product.slug || product.id)}
                  >
                    <div className="product-image-placeholder">
                      {product.images?.[0]?.url ? (
                        <img
                          src={product.images[0].url}
                          alt={product.title}
                          className="product-img"
                        />
                      ) : (
                        <span className="placeholder-icon">📷</span>
                      )}
                    </div>
                    {discount > 0 && (
                      <span className="discount-badge">-{discount}%</span>
                    )}
                    <button
                      className={`wishlist-toggle-btn ${inWishlist ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        inWishlist
                          ? removeFromWishlist(product.id)
                          : addToWishlist(product.id);
                      }}
                      title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    >
                      {inWishlist ? '❤️' : '🤍'}
                    </button>
                  </div>

                  <div className="product-card-body">
                    <span className="product-brand">{product.brand}</span>
                    <h3
                      className="product-title"
                      onClick={() => onSelectProduct(product.slug || product.id)}
                    >
                      {product.title}
                    </h3>
                    <div className="product-rating">
                      ⭐ {Number(product.average_rating || 0).toFixed(1)} ({product.total_reviews || 0})
                    </div>
                    <div className="product-price-row">
                      <span className="product-price">
                        ${Number(product.price).toFixed(2)}
                      </span>
                      {product.compare_at_price && (
                        <span className="product-compare-price">
                          ${Number(product.compare_at_price).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
