import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';
import { CartProvider, useCart } from './context/CartContext.jsx';
import { Header } from './components/Header.jsx';
import { CartDrawer } from './components/CartDrawer.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { BrowsePage } from './pages/BrowsePage.jsx';
import { ProductDetailPage } from './pages/ProductDetailPage.jsx';
import { CartPage } from './pages/CartPage.jsx';
import { CheckoutPage } from './pages/CheckoutPage.jsx';
import { WishlistPage } from './pages/WishlistPage.jsx';
import { AccountPage } from './pages/AccountPage.jsx';
import { OrdersPage } from './pages/OrdersPage.jsx';
import { SellerOrdersPage } from './pages/SellerOrdersPage.jsx';
import { CourierDeliveryPage } from './pages/CourierDeliveryPage.jsx';
import {
  LoginPage,
  RegisterPage,
  VerifyEmailPage,
  ForgotPasswordPage,
  ResetPasswordPage,
} from './pages/AuthPages.jsx';
import './App.css';

function MainStorefront() {
  const { user } = useAuth();
  const { openDrawer } = useCart();
  const [currentView, setCurrentView] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterParams, setFilterParams] = useState({});
  const [buyNowItem, setBuyNowItem] = useState(null);

  // Auth flow temporary state
  const [authEmail, setAuthEmail] = useState('');
  const [authOtp, setAuthOtp] = useState('');
  const [authResetToken, setAuthResetToken] = useState('');

  const navigateTo = (view, params = {}) => {
    if (params.categoryId) {
      setFilterParams({ categoryId: params.categoryId });
    } else {
      setFilterParams({});
    }
    if (view !== 'checkout') {
      setBuyNowItem(null);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (idOrSlug) => {
    setSelectedProductId(idOrSlug);
    setCurrentView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartBuyNow = (productId, quantity = 1) => {
    setBuyNowItem({ productId, quantity });
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="storefront-app">
      <Header
        currentView={currentView}
        setCurrentView={navigateTo}
        onSelectProduct={handleSelectProduct}
        onSearchQuery={(q) => {
          setSearchQuery(q);
          navigateTo('browse');
        }}
      />

      <CartDrawer
        onNavigateToCart={() => navigateTo('cart')}
        onNavigateToCheckout={() => navigateTo('checkout')}
      />

      <main className="storefront-main-content">
        {currentView === 'home' && (
          <HomePage
            onNavigateBrowse={(params) => navigateTo('browse', params)}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentView === 'browse' && (
          <BrowsePage
            initialFilter={filterParams}
            searchQuery={searchQuery}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentView === 'product-detail' && (
          <ProductDetailPage
            productIdOrSlug={selectedProductId}
            onBack={() => navigateTo('browse')}
            onNavigateLogin={() => navigateTo('login')}
            onBuyNow={handleStartBuyNow}
          />
        )}

        {currentView === 'cart' && (
          <CartPage
            onContinueShopping={() => navigateTo('browse')}
            onProceedToCheckout={() => {
              setBuyNowItem(null);
              setCurrentView('checkout');
            }}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutPage
            buyNowItem={buyNowItem}
            onNavigateCart={() => navigateTo('cart')}
            onNavigateBrowse={() => navigateTo('browse')}
          />
        )}

        {currentView === 'wishlist' && (
          <WishlistPage
            onSelectProduct={handleSelectProduct}
            onNavigateBrowse={() => navigateTo('browse')}
            onNavigateLogin={() => navigateTo('login')}
          />
        )}

        {currentView === 'account' && (
          <AccountPage onNavigateLogin={() => navigateTo('login')} />
        )}

        {currentView === 'orders' && (
          <OrdersPage onNavigateBrowse={() => navigateTo('browse')} />
        )}

        {currentView === 'seller-orders' && (
          <SellerOrdersPage onNavigateHome={() => navigateTo('home')} />
        )}

        {currentView === 'courier-delivery' && (
          <CourierDeliveryPage onNavigateHome={() => navigateTo('home')} />
        )}

        {currentView === 'login' && (
          <LoginPage
            onNavigateRegister={() => navigateTo('register')}
            onNavigateForgot={() => navigateTo('forgot-password')}
            onSuccess={() => navigateTo('home')}
          />
        )}

        {currentView === 'register' && (
          <RegisterPage
            onNavigateLogin={() => navigateTo('login')}
            onRegistered={(email, otp) => {
              setAuthEmail(email);
              setAuthOtp(otp || '');
              navigateTo('verify');
            }}
          />
        )}

        {currentView === 'verify' && (
          <VerifyEmailPage
            email={authEmail}
            testOtp={authOtp}
            onVerified={() => navigateTo('login')}
            onNavigateLogin={() => navigateTo('login')}
          />
        )}

        {currentView === 'forgot-password' && (
          <ForgotPasswordPage
            onNavigateLogin={() => navigateTo('login')}
            onCodeSent={(email, resetToken) => {
              setAuthEmail(email);
              setAuthResetToken(resetToken || '');
              navigateTo('reset-password');
            }}
          />
        )}

        {currentView === 'reset-password' && (
          <ResetPasswordPage
            email={authEmail}
            testToken={authResetToken}
            onSuccess={() => navigateTo('login')}
            onNavigateLogin={() => navigateTo('login')}
          />
        )}
      </main>

      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-brand-col">
            <span className="footer-brand-logo">🛍️ ApexStore</span>
            <p>Modern, scalable, multi-role e-commerce platform built for excellence.</p>
          </div>
          <div className="footer-links-col">
            <h4>Quick Links</h4>
            <button onClick={() => navigateTo('home')}>Home</button>
            <button onClick={() => navigateTo('browse')}>Catalog</button>
            <button onClick={() => navigateTo('cart')}>Cart</button>
            <button onClick={() => navigateTo('wishlist')}>Wishlist</button>
          </div>
          <div className="footer-badge-col">
            <h4>Phase Status</h4>
            <div className="footer-phase-badge">Phase 2B: Checkout Engine Active</div>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} ApexStore Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <MainStorefront />
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
