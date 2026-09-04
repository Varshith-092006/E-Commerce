import React, { useState, useEffect, useRef } from 'react';
import { Badge, Button } from '@ecommerce/ui';
import { useAuth } from '../context/AuthContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { NotificationBell } from './NotificationBell.jsx';
import { apiRequest } from '../api/client.js';

export function Header({ currentView, setCurrentView, onSelectProduct, onSearchQuery }) {
  const { user, logout } = useAuth();
  const { items: wishlistItems } = useWishlist();
  const { cart, openDrawer } = useCart();
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  const totalCartItems = cart?.total_items || 0;

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

  // Autocomplete debounce
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const data = await apiRequest(`/products/autocomplete?q=${encodeURIComponent(searchQuery)}&limit=6`);
        setSuggestions(data || []);
      } catch {
        setSuggestions([]);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      onSearchQuery(searchQuery.trim());
      setCurrentView('browse');
    }
  };

  const handleSelectSuggestion = (item) => {
    setShowSuggestions(false);
    setSearchQuery('');
    onSelectProduct(item.slug || item.id);
    setCurrentView('product-detail');
  };

  return (
    <header className="site-header">
      <div className="header-top">
        <div className="header-brand" onClick={() => setCurrentView('home')}>
          <span className="brand-icon">🛍️</span>
          <span className="brand-name">ApexStore</span>
        </div>

        {/* Search with Autocomplete */}
        <div className="header-search-container" ref={searchRef}>
          <form className="header-search-form" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search products, brands, categories..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              🔍
            </button>
          </form>

          {showSuggestions && suggestions.length > 0 && (
            <div className="search-suggestions-dropdown">
              {suggestions.map((item) => (
                <div
                  key={item.id}
                  className="suggestion-item"
                  onClick={() => handleSelectSuggestion(item)}
                >
                  <span className="suggestion-title">{item.title}</span>
                  <span className="suggestion-brand">{item.brand}</span>
                  <span className="suggestion-price">${Number(item.price).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation actions */}
        <div className="header-actions">
          {/* Cart Trigger */}
          <button
            className="action-btn cart-btn"
            onClick={openDrawer}
            title="Shopping Cart"
          >
            🛒 <span className="action-label">Cart</span>
            {totalCartItems > 0 && (
              <Badge variant="primary" size="sm">{totalCartItems}</Badge>
            )}
          </button>

          <button
            className="action-btn"
            onClick={() => setCurrentView('wishlist')}
            title="Wishlist"
          >
            ❤️ <span className="action-label">Wishlist</span>
            {wishlistItems.length > 0 && (
              <Badge variant="secondary" size="sm">{wishlistItems.length}</Badge>
            )}
          </button>

          {user ? (
            <div className="user-profile-menu">
              {(user.role === 'SELLER' || user.role === 'ADMIN') && (
                <button
                  className="action-btn"
                  onClick={() => setCurrentView('seller-orders')}
                  title="Seller Fulfillment Dashboard"
                >
                  📋 <span className="action-label">Seller Portal</span>
                </button>
              )}
              {(user.role === 'COURIER' || user.role === 'LOGISTICS' || user.role === 'ADMIN') && (
                <button
                  className="action-btn"
                  onClick={() => setCurrentView('courier-delivery')}
                  title="Courier & Logistics Run Sheet"
                >
                  🚚 <span className="action-label">Courier Portal</span>
                </button>
              )}
              <NotificationBell />
              <button
                className="action-btn"
                onClick={() => setCurrentView('orders')}
                title="My Orders"
              >
                📦 <span className="action-label">Orders</span>
              </button>
              <button
                className="action-btn user-btn"
                onClick={() => setCurrentView('account')}
              >
                👤 <span className="action-label">{user.firstName || user.email}</span>
              </button>
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="auth-nav-buttons">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentView('login')}
              >
                Sign In
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setCurrentView('register')}
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Category Navigation Bar */}
      <nav className="header-categories-nav">
        <button
          className={`cat-nav-btn ${currentView === 'home' ? 'active' : ''}`}
          onClick={() => setCurrentView('home')}
        >
          Home
        </button>
        <button
          className={`cat-nav-btn ${currentView === 'browse' ? 'active' : ''}`}
          onClick={() => {
            onSearchQuery('');
            setCurrentView('browse');
          }}
        >
          All Products
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className="cat-nav-btn"
            onClick={() => {
              onSearchQuery('');
              setCurrentView('browse', { categoryId: cat.id });
            }}
          >
            {cat.name}
          </button>
        ))}
      </nav>
    </header>
  );
}
