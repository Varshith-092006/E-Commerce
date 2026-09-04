import React, { useState, useEffect } from 'react';
import { Button, Badge, Input } from '@ecommerce/ui';
import { apiRequest } from '../api/client.js';
import { useWishlist } from '../context/WishlistContext.jsx';

export function BrowsePage({ initialFilter = {}, searchQuery = '', onSelectProduct }) {
  const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlist();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [paginationMeta, setPaginationMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState(initialFilter.categoryId || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [minRating, setMinRating] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await apiRequest('/categories');
        setCategories(data || []);
      } catch {
        setCategories([]);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        let endpoint;
        const params = new URLSearchParams();
        params.set('page', currentPage);
        params.set('limit', 12);

        if (searchQuery) {
          params.set('q', searchQuery);
          endpoint = `/products/search?${params.toString()}`;
        } else {
          if (selectedCategory) params.set('categoryId', selectedCategory);
          if (minPrice) params.set('minPrice', minPrice);
          if (maxPrice) params.set('maxPrice', maxPrice);
          if (selectedBrand) params.set('brand', selectedBrand);
          if (minRating) params.set('minRating', minRating);
          if (inStockOnly) params.set('inStock', 'true');
          if (sort) params.set('sort', sort);
          endpoint = `/products?${params.toString()}`;
        }

        const data = await apiRequest(endpoint);
        setProducts(data || []);
        // In full metadata responses, pagination is in meta
      } catch (err) {
        console.error('Failed to load browse products', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [
    searchQuery,
    selectedCategory,
    minPrice,
    maxPrice,
    selectedBrand,
    minRating,
    inStockOnly,
    sort,
    currentPage,
  ]);

  const handleResetFilters = () => {
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedBrand('');
    setMinRating('');
    setInStockOnly(false);
    setSort('newest');
    setCurrentPage(1);
  };

  return (
    <div className="browse-layout">
      {/* Filters Sidebar */}
      <aside className="browse-sidebar">
        <div className="sidebar-header">
          <h3>Filters</h3>
          <button className="reset-filter-btn" onClick={handleResetFilters}>
            Reset
          </button>
        </div>

        {/* Categories */}
        <div className="filter-group">
          <label className="filter-label">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="filter-group">
          <label className="filter-label">Price Range ($)</label>
          <div className="price-inputs-row">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => {
                setMinPrice(e.target.value);
                setCurrentPage(1);
              }}
              className="price-input"
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(e.target.value);
                setCurrentPage(1);
              }}
              className="price-input"
            />
          </div>
        </div>

        {/* Minimum Rating */}
        <div className="filter-group">
          <label className="filter-label">Minimum Rating</label>
          <div className="rating-options">
            {[4, 3, 2, 1].map((stars) => (
              <button
                key={stars}
                className={`rating-option-btn ${minRating === String(stars) ? 'active' : ''}`}
                onClick={() => {
                  setMinRating(minRating === String(stars) ? '' : String(stars));
                  setCurrentPage(1);
                }}
              >
                ⭐ {stars} & up
              </button>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div className="filter-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => {
                setInStockOnly(e.target.checked);
                setCurrentPage(1);
              }}
            />
            <span>In Stock Only</span>
          </label>
        </div>
      </aside>

      {/* Product List Content */}
      <main className="browse-main">
        <div className="browse-controls">
          <span className="results-count">
            {searchQuery
              ? `Search Results for "${searchQuery}"`
              : `Showing Products`}
          </span>

          <div className="sort-controls">
            <label>Sort By:</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="sort-select"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Highest Rated</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="empty-state-box">
            <span className="empty-icon">🔍</span>
            <h3>No products found</h3>
            <p>Try adjusting your search or filters to find what you're looking for.</p>
            <Button variant="secondary" onClick={handleResetFilters}>
              Reset Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="products-grid">
              {products.map((product) => {
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

            {/* Pagination */}
            <div className="pagination-bar">
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </Button>
              <span className="page-indicator">Page {currentPage}</span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
