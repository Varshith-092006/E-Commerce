import React, { useState, useEffect } from 'react';
import { Button, Badge, Alert, Card, Table } from '@ecommerce/ui';
import { apiRequest, setAccessToken } from './api/client.js';
import './App.css';

export default function SellerApp() {
  const [sellerUser, setSellerUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('dashboard'); // dashboard | products | profile | login | register
  const [authError, setAuthError] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  // Products state
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    title: '',
    slug: '',
    sku: '',
    categoryId: '',
    brand: '',
    price: '',
    compareAtPrice: '',
    description: '',
    status: 'PUBLISHED',
  });

  // Image management state
  const [imageModalProduct, setImageModalProduct] = useState(null);
  const [imageForm, setImageForm] = useState({
    url: '',
    publicId: '',
    altText: '',
    isThumbnail: false,
  });

  // Profile edit state
  const [profileForm, setProfileForm] = useState({
    businessName: '',
    businessAddress: '',
    gstin: '',
    pan: '',
  });

  // Auth forms state
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    businessName: '',
    storeSlug: '',
    gstin: '',
    pan: '',
    businessAddress: '',
  });

  useEffect(() => {
    async function bootstrap() {
      try {
        const refresh = await apiRequest('/auth/refresh', { method: 'POST' });
        if (refresh?.accessToken) {
          setAccessToken(refresh.accessToken);
          const profile = await apiRequest('/users/me');
          if (profile.role === 'SELLER') {
            setSellerUser(profile);
          }
        }
      } catch {
        // Not logged in
      } finally {
        setLoading(false);
      }
    }
    bootstrap();
  }, []);

  useEffect(() => {
    if (sellerUser && sellerUser.seller?.status === 'ACTIVE') {
      loadSellerProducts();
      loadCategories();
      setProfileForm({
        businessName: sellerUser.seller.businessName || '',
        businessAddress: '',
        gstin: '',
        pan: '',
      });
    }
  }, [sellerUser]);

  const loadSellerProducts = async () => {
    try {
      const data = await apiRequest('/seller/products');
      setProducts(data || []);
    } catch (err) {
      console.error('Failed to load seller products', err);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await apiRequest('/categories');
      setCategories(data || []);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setAuthError(null);
      const res = await apiRequest('/auth/login', {
        method: 'POST',
        body: loginForm,
      });

      if (res.user.role !== 'SELLER') {
        throw new Error('Access denied: Only seller accounts can access Seller Central');
      }

      setAccessToken(res.accessToken);
      setSellerUser(res.user);
      setCurrentTab('dashboard');
    } catch (err) {
      setAuthError(err.message || 'Login failed');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setAuthError(null);
      await apiRequest('/auth/register-seller', {
        method: 'POST',
        body: registerForm,
      });
      setStatusMessage('Registration submitted! Please sign in.');
      setCurrentTab('login');
    } catch (err) {
      setAuthError(err.message || 'Registration failed');
    }
  };

  const handleLogout = async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } finally {
      setAccessToken(null);
      setSellerUser(null);
      setCurrentTab('login');
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      setAuthError(null);
      const payload = {
        ...productForm,
        price: parseFloat(productForm.price),
        compareAtPrice: productForm.compareAtPrice
          ? parseFloat(productForm.compareAtPrice)
          : null,
      };

      if (editingProductId) {
        await apiRequest(`/seller/products/${editingProductId}`, {
          method: 'PUT',
          body: payload,
        });
        setStatusMessage('Product updated successfully');
      } else {
        await apiRequest('/seller/products', {
          method: 'POST',
          body: payload,
        });
        setStatusMessage('Product created successfully');
      }

      setShowProductModal(false);
      await loadSellerProducts();
    } catch (err) {
      setAuthError(err.message || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await apiRequest(`/seller/products/${id}`, { method: 'DELETE' });
      setStatusMessage('Product deleted');
      await loadSellerProducts();
    } catch (err) {
      setAuthError(err.message || 'Failed to delete product');
    }
  };

  const handleAddImage = async (e) => {
    e.preventDefault();
    try {
      await apiRequest(`/seller/products/${imageModalProduct.id}/images`, {
        method: 'POST',
        body: imageForm,
      });
      setStatusMessage('Image reference attached successfully');
      setImageForm({ url: '', publicId: '', altText: '', isThumbnail: false });
      setImageModalProduct(null);
      await loadSellerProducts();
    } catch (err) {
      setAuthError(err.message || 'Failed to attach image');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setAuthError(null);
      const updated = await apiRequest('/sellers/me', {
        method: 'PUT',
        body: profileForm,
      });
      setStatusMessage('Seller profile updated successfully');
    } catch (err) {
      setAuthError(err.message || 'Failed to update seller profile');
    }
  };

  if (loading) {
    return <div className="seller-loading">Loading Seller Central...</div>;
  }

  // Not logged in view
  if (!sellerUser) {
    return (
      <div className="seller-shell">
        <header className="seller-header">
          <div className="seller-brand">
            <span className="seller-logo">🏪</span>
            <h2>ApexStore Seller Central</h2>
          </div>
        </header>

        <div className="seller-auth-container">
          <div className="seller-auth-card">
            {authError && <Alert variant="danger">{authError}</Alert>}
            {statusMessage && <Alert variant="success">{statusMessage}</Alert>}

            {currentTab === 'register' ? (
              <div>
                <h2>Apply as a Seller</h2>
                <p className="auth-subtitle">
                  Join our verified marketplace and sell to millions of customers.
                </p>
                <form onSubmit={handleRegister}>
                  <div className="form-row-two">
                    <div className="form-group">
                      <label>First Name</label>
                      <input
                        type="text"
                        value={registerForm.firstName}
                        onChange={(e) =>
                          setRegisterForm({ ...registerForm, firstName: e.target.value })
                        }
                        required
                        className="seller-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input
                        type="text"
                        value={registerForm.lastName}
                        onChange={(e) =>
                          setRegisterForm({ ...registerForm, lastName: e.target.value })
                        }
                        required
                        className="seller-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={registerForm.email}
                      onChange={(e) =>
                        setRegisterForm({ ...registerForm, email: e.target.value })
                      }
                      required
                      className="seller-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Password (min 8 chars)</label>
                    <input
                      type="password"
                      value={registerForm.password}
                      onChange={(e) =>
                        setRegisterForm({ ...registerForm, password: e.target.value })
                      }
                      required
                      minLength={8}
                      className="seller-input"
                    />
                  </div>

                  <div className="form-row-two">
                    <div className="form-group">
                      <label>Business Name</label>
                      <input
                        type="text"
                        value={registerForm.businessName}
                        onChange={(e) =>
                          setRegisterForm({ ...registerForm, businessName: e.target.value })
                        }
                        required
                        className="seller-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Store URL Slug</label>
                      <input
                        type="text"
                        value={registerForm.storeSlug}
                        onChange={(e) =>
                          setRegisterForm({ ...registerForm, storeSlug: e.target.value })
                        }
                        required
                        className="seller-input"
                      />
                    </div>
                  </div>

                  <div className="form-row-two">
                    <div className="form-group">
                      <label>GSTIN (Optional)</label>
                      <input
                        type="text"
                        value={registerForm.gstin}
                        onChange={(e) =>
                          setRegisterForm({ ...registerForm, gstin: e.target.value })
                        }
                        className="seller-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>PAN (Optional)</label>
                      <input
                        type="text"
                        value={registerForm.pan}
                        onChange={(e) =>
                          setRegisterForm({ ...registerForm, pan: e.target.value })
                        }
                        className="seller-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Business Address</label>
                    <textarea
                      value={registerForm.businessAddress}
                      onChange={(e) =>
                        setRegisterForm({ ...registerForm, businessAddress: e.target.value })
                      }
                      className="seller-input"
                      rows="2"
                    />
                  </div>

                  <Button type="submit" variant="primary" size="lg" fullWidth>
                    Submit Seller Application
                  </Button>
                </form>

                <div className="auth-footer-text">
                  Already registered?{' '}
                  <button
                    className="text-link-btn"
                    onClick={() => setCurrentTab('login')}
                  >
                    Sign in to Seller Central
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h2>Seller Sign In</h2>
                <p className="auth-subtitle">Manage your catalog, inventory, and sales</p>
                <form onSubmit={handleLogin}>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={loginForm.email}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, email: e.target.value })
                      }
                      required
                      className="seller-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, password: e.target.value })
                      }
                      required
                      className="seller-input"
                    />
                  </div>
                  <Button type="submit" variant="primary" size="lg" fullWidth>
                    Sign In
                  </Button>
                </form>
                <div className="auth-footer-text">
                  New seller?{' '}
                  <button
                    className="text-link-btn"
                    onClick={() => setCurrentTab('register')}
                  >
                    Apply for onboarding
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const sellerStatus = sellerUser.seller?.status;

  return (
    <div className="seller-shell">
      {/* Top Header */}
      <header className="seller-header">
        <div className="seller-brand">
          <span className="seller-logo">🏪</span>
          <h2>ApexStore Seller Central</h2>
          {sellerStatus && (
            <Badge
              variant={
                sellerStatus === 'ACTIVE'
                  ? 'success'
                  : sellerStatus === 'PENDING'
                    ? 'warning'
                    : 'danger'
              }
            >
              {sellerStatus}
            </Badge>
          )}
        </div>

        <div className="seller-user-actions">
          <span>{sellerUser.seller?.businessName || sellerUser.email}</span>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Container */}
      <div className="seller-container">
        {statusMessage && (
          <Alert variant="success" onClose={() => setStatusMessage(null)}>
            {statusMessage}
          </Alert>
        )}
        {authError && (
          <Alert variant="danger" onClose={() => setAuthError(null)}>
            {authError}
          </Alert>
        )}

        {/* If Seller is PENDING or SUSPENDED */}
        {sellerStatus !== 'ACTIVE' ? (
          <div className="seller-pending-banner">
            <h2>
              {sellerStatus === 'PENDING'
                ? '⏳ Seller Onboarding Under Review'
                : `⚠️ Account Status: ${sellerStatus}`}
            </h2>
            <p>
              {sellerStatus === 'PENDING'
                ? 'Your seller application is currently being reviewed by administrators. Once approved, your status will transition to ACTIVE and product management will be unlocked.'
                : `Your seller account is currently ${sellerStatus}. Please contact support.`}
            </p>
          </div>
        ) : (
          <div>
            {/* Nav Tabs */}
            <div className="seller-tabs">
              <button
                className={`tab-btn ${currentTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setCurrentTab('dashboard')}
              >
                📊 Dashboard
              </button>
              <button
                className={`tab-btn ${currentTab === 'products' ? 'active' : ''}`}
                onClick={() => setCurrentTab('products')}
              >
                📦 Products ({products.length})
              </button>
              <button
                className={`tab-btn ${currentTab === 'profile' ? 'active' : ''}`}
                onClick={() => setCurrentTab('profile')}
              >
                ⚙️ Profile Settings
              </button>
            </div>

            {/* Dashboard Overview */}
            {currentTab === 'dashboard' && (
              <div className="seller-dashboard-view">
                <div className="metrics-row">
                  <div className="metric-card">
                    <span className="metric-num">{products.length}</span>
                    <span className="metric-title">Total Products</span>
                  </div>
                  <div className="metric-card">
                    <span className="metric-num">
                      {products.filter((p) => p.status === 'PUBLISHED').length}
                    </span>
                    <span className="metric-title">Active Listings</span>
                  </div>
                  <div className="metric-card">
                    <span className="metric-num">
                      {products.filter((p) => p.status === 'DRAFT').length}
                    </span>
                    <span className="metric-title">Draft Listings</span>
                  </div>
                </div>

                <div className="quick-actions-box">
                  <h3>Quick Actions</h3>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setEditingProductId(null);
                      setProductForm({
                        title: '',
                        slug: '',
                        sku: '',
                        categoryId: categories[0]?.id || '',
                        brand: '',
                        price: '',
                        compareAtPrice: '',
                        description: '',
                        status: 'PUBLISHED',
                      });
                      setShowProductModal(true);
                    }}
                  >
                    + Add New Product
                  </Button>
                </div>
              </div>
            )}

            {/* Products Table View */}
            {currentTab === 'products' && (
              <div className="seller-products-view">
                <div className="view-header-row">
                  <h2>My Product Catalog</h2>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setEditingProductId(null);
                      setProductForm({
                        title: '',
                        slug: '',
                        sku: '',
                        categoryId: categories[0]?.id || '',
                        brand: '',
                        price: '',
                        compareAtPrice: '',
                        description: '',
                        status: 'PUBLISHED',
                      });
                      setShowProductModal(true);
                    }}
                  >
                    + Add Product
                  </Button>
                </div>

                <div className="products-table-container">
                  <table className="seller-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>SKU</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Images</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p.id}>
                          <td className="product-title-cell">
                            <strong>{p.title}</strong>
                            <span className="brand-sub">{p.brand}</span>
                          </td>
                          <td><code>{p.sku}</code></td>
                          <td>{p.category?.name || '—'}</td>
                          <td><strong>${Number(p.price).toFixed(2)}</strong></td>
                          <td>
                            <Badge
                              variant={p.status === 'PUBLISHED' ? 'success' : 'neutral'}
                              size="sm"
                            >
                              {p.status}
                            </Badge>
                          </td>
                          <td>{p.images?.length || 0} images</td>
                          <td className="actions-cell">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => {
                                setImageModalProduct(p);
                              }}
                            >
                              📷 Images
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingProductId(p.id);
                                setProductForm({
                                  title: p.title,
                                  slug: p.slug,
                                  sku: p.sku,
                                  categoryId: p.category_id,
                                  brand: p.brand,
                                  price: p.price,
                                  compareAtPrice: p.compare_at_price || '',
                                  description: p.description,
                                  status: p.status,
                                });
                                setShowProductModal(true);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeleteProduct(p.id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Profile Settings */}
            {currentTab === 'profile' && (
              <div className="seller-profile-view">
                <h2>Seller Business Profile</h2>
                <form onSubmit={handleUpdateProfile} className="profile-form-box">
                  <div className="form-group">
                    <label>Business Name</label>
                    <input
                      type="text"
                      value={profileForm.businessName}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, businessName: e.target.value })
                      }
                      required
                      className="seller-input"
                    />
                  </div>
                  <div className="form-row-two">
                    <div className="form-group">
                      <label>GSTIN</label>
                      <input
                        type="text"
                        value={profileForm.gstin}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, gstin: e.target.value })
                        }
                        className="seller-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>PAN</label>
                      <input
                        type="text"
                        value={profileForm.pan}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, pan: e.target.value })
                        }
                        className="seller-input"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Business Address</label>
                    <textarea
                      value={profileForm.businessAddress}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          businessAddress: e.target.value,
                        })
                      }
                      className="seller-input"
                      rows="3"
                    />
                  </div>
                  <Button type="submit" variant="primary">
                    Save Profile Changes
                  </Button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Create/Edit Modal */}
      {showProductModal && (
        <div className="modal-overlay">
          <div className="modal-content product-modal">
            <h3>{editingProductId ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleSaveProduct}>
              <div className="form-group">
                <label>Product Title</label>
                <input
                  type="text"
                  value={productForm.title}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      title: e.target.value,
                      slug:
                        !editingProductId && !productForm.slug
                          ? e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-')
                          : productForm.slug,
                    })
                  }
                  required
                  className="seller-input"
                />
              </div>

              <div className="form-row-two">
                <div className="form-group">
                  <label>URL Slug</label>
                  <input
                    type="text"
                    value={productForm.slug}
                    onChange={(e) =>
                      setProductForm({ ...productForm, slug: e.target.value })
                    }
                    required
                    className="seller-input"
                  />
                </div>
                <div className="form-group">
                  <label>SKU (Stock Keeping Unit)</label>
                  <input
                    type="text"
                    value={productForm.sku}
                    onChange={(e) =>
                      setProductForm({ ...productForm, sku: e.target.value })
                    }
                    required
                    className="seller-input"
                  />
                </div>
              </div>

              <div className="form-row-two">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={productForm.categoryId}
                    onChange={(e) =>
                      setProductForm({ ...productForm, categoryId: e.target.value })
                    }
                    required
                    className="seller-input"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Brand</label>
                  <input
                    type="text"
                    value={productForm.brand}
                    onChange={(e) =>
                      setProductForm({ ...productForm, brand: e.target.value })
                    }
                    required
                    className="seller-input"
                  />
                </div>
              </div>

              <div className="form-row-three">
                <div className="form-group">
                  <label>Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({ ...productForm, price: e.target.value })
                    }
                    required
                    className="seller-input"
                  />
                </div>
                <div className="form-group">
                  <label>Compare-At Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.compareAtPrice}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        compareAtPrice: e.target.value,
                      })
                    }
                    className="seller-input"
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={productForm.status}
                    onChange={(e) =>
                      setProductForm({ ...productForm, status: e.target.value })
                    }
                    className="seller-input"
                  >
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="DRAFT">DRAFT</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({ ...productForm, description: e.target.value })
                  }
                  required
                  rows="3"
                  className="seller-input"
                />
              </div>

              <div className="modal-actions">
                <Button type="submit" variant="primary">
                  Save Product
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowProductModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cloudinary Image Attachment Modal */}
      {imageModalProduct && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add Image for {imageModalProduct.title}</h3>
            <p className="auth-subtitle">
              Attach a Cloudinary URL and media reference ID
            </p>
            <form onSubmit={handleAddImage}>
              <div className="form-group">
                <label>Cloudinary Image URL</label>
                <input
                  type="url"
                  placeholder="https://res.cloudinary.com/..."
                  value={imageForm.url}
                  onChange={(e) =>
                    setImageForm({ ...imageForm, url: e.target.value })
                  }
                  required
                  className="seller-input"
                />
              </div>
              <div className="form-group">
                <label>Cloudinary Public ID</label>
                <input
                  type="text"
                  placeholder="e.g. products/laptop_01"
                  value={imageForm.publicId}
                  onChange={(e) =>
                    setImageForm({ ...imageForm, publicId: e.target.value })
                  }
                  required
                  className="seller-input"
                />
              </div>
              <div className="form-group">
                <label>Alt Text</label>
                <input
                  type="text"
                  value={imageForm.altText}
                  onChange={(e) =>
                    setImageForm({ ...imageForm, altText: e.target.value })
                  }
                  className="seller-input"
                />
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={imageForm.isThumbnail}
                    onChange={(e) =>
                      setImageForm({ ...imageForm, isThumbnail: e.target.checked })
                    }
                  />
                  <span>Set as primary thumbnail</span>
                </label>
              </div>
              <div className="modal-actions">
                <Button type="submit" variant="primary">
                  Attach Image
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setImageModalProduct(null)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
