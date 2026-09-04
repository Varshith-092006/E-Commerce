import React, { useState, useEffect } from 'react';
import { Button, Badge, Alert } from '@ecommerce/ui';
import { apiRequest, setAccessToken } from './api/client.js';
import './App.css';

export default function AdminApp() {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('sellers'); // sellers | categories | login
  const [statusMessage, setStatusMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Auth form
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  // Sellers moderation state
  const [sellers, setSellers] = useState([]);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('');
  const [selectedSellerForAction, setSelectedSellerForAction] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Category management state
  const [categories, setCategories] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    parentId: '',
    imageUrl: '',
    displayOrder: 0,
    isActive: true,
  });

  useEffect(() => {
    async function bootstrap() {
      try {
        const refresh = await apiRequest('/auth/refresh', { method: 'POST' });
        if (refresh?.accessToken) {
          setAccessToken(refresh.accessToken);
          const profile = await apiRequest('/users/me');
          if (profile.role === 'ADMIN') {
            setAdminUser(profile);
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
    if (adminUser) {
      if (currentTab === 'sellers') loadSellers();
      if (currentTab === 'categories') loadCategories();
    }
  }, [adminUser, currentTab, selectedStatusFilter]);

  const loadSellers = async () => {
    try {
      const query = selectedStatusFilter ? `?status=${selectedStatusFilter}` : '';
      const data = await apiRequest(`/sellers/admin/list${query}`);
      setSellers(data || []);
    } catch (err) {
      console.error('Failed to load sellers', err);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await apiRequest('/categories?all=true');
      setCategories(data || []);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setErrorMessage(null);
      const res = await apiRequest('/auth/login', {
        method: 'POST',
        body: loginForm,
      });

      if (res.user.role !== 'ADMIN') {
        throw new Error('Access denied: Admin role required for Admin Command Center');
      }

      setAccessToken(res.accessToken);
      setAdminUser(res.user);
      setCurrentTab('sellers');
    } catch (err) {
      setErrorMessage(err.message || 'Login failed');
    }
  };

  const handleLogout = async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } finally {
      setAccessToken(null);
      setAdminUser(null);
    }
  };

  const handleTransitionSeller = async (sellerId, newStatus, reason = null) => {
    try {
      setErrorMessage(null);
      await apiRequest(`/sellers/admin/${sellerId}/status`, {
        method: 'PATCH',
        body: {
          status: newStatus,
          rejectionReason: reason,
        },
      });
      setStatusMessage(`Seller status transitioned to ${newStatus}`);
      setSelectedSellerForAction(null);
      setRejectionReason('');
      await loadSellers();
    } catch (err) {
      setErrorMessage(err.message || 'Status transition failed');
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      setErrorMessage(null);
      const payload = {
        ...categoryForm,
        parentId: categoryForm.parentId || null,
        displayOrder: parseInt(categoryForm.displayOrder, 10) || 0,
      };

      if (editingCategoryId) {
        await apiRequest(`/categories/${editingCategoryId}`, {
          method: 'PUT',
          body: payload,
        });
        setStatusMessage('Category updated successfully');
      } else {
        await apiRequest('/categories', {
          method: 'POST',
          body: payload,
        });
        setStatusMessage('Category created successfully');
      }

      setShowCategoryModal(false);
      await loadCategories();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await apiRequest(`/categories/${id}`, { method: 'DELETE' });
      setStatusMessage('Category deleted');
      await loadCategories();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to delete category');
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading Command Center...</div>;
  }

  // Not logged in view
  if (!adminUser) {
    return (
      <div className="admin-shell">
        <header className="admin-header">
          <div className="admin-brand">
            <span className="admin-logo">🛡️</span>
            <h2>ApexStore Admin Command Center</h2>
          </div>
        </header>

        <div className="admin-auth-container">
          <div className="admin-auth-card">
            <h2>Admin Authentication</h2>
            <p className="auth-subtitle">Phase 1 Governance & Moderation Console</p>

            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Admin Email</label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, email: e.target.value })
                  }
                  required
                  className="admin-input"
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
                  className="admin-input"
                />
              </div>
              <Button type="submit" variant="primary" size="lg" fullWidth>
                Authenticate as Admin
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      {/* Top Header */}
      <header className="admin-header">
        <div className="admin-brand">
          <span className="admin-logo">🛡️</span>
          <h2>ApexStore Admin Command Center</h2>
          <Badge variant="primary">Phase 1 Scoped</Badge>
        </div>

        <div className="admin-user-actions">
          <span>{adminUser.email}</span>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Container */}
      <div className="admin-container">
        {statusMessage && (
          <Alert variant="success" onClose={() => setStatusMessage(null)}>
            {statusMessage}
          </Alert>
        )}
        {errorMessage && (
          <Alert variant="danger" onClose={() => setErrorMessage(null)}>
            {errorMessage}
          </Alert>
        )}

        {/* Navigation Tabs */}
        <div className="admin-tabs">
          <button
            className={`tab-btn ${currentTab === 'sellers' ? 'active' : ''}`}
            onClick={() => setCurrentTab('sellers')}
          >
            🏪 Seller Onboarding & Moderation
          </button>
          <button
            className={`tab-btn ${currentTab === 'categories' ? 'active' : ''}`}
            onClick={() => setCurrentTab('categories')}
          >
            🗂️ Category Management
          </button>
        </div>

        {/* Sellers Moderation Tab */}
        {currentTab === 'sellers' && (
          <div className="admin-view">
            <div className="view-header-row">
              <h2>Seller Applications</h2>
              <div className="filter-select-box">
                <label>Filter Status:</label>
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="admin-input"
                >
                  <option value="">All Statuses</option>
                  <option value="PENDING">PENDING</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>
            </div>

            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Business Name</th>
                    <th>Store Slug</th>
                    <th>Applicant</th>
                    <th>GSTIN / PAN</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sellers.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <strong>{s.business_name}</strong>
                      </td>
                      <td>
                        <code>{s.store_slug}</code>
                      </td>
                      <td>
                        {s.user?.first_name} {s.user?.last_name}
                        <span className="sub-text">{s.user?.email}</span>
                      </td>
                      <td>
                        <span>GSTIN: {s.gstin || '—'}</span>
                        <span className="sub-text">PAN: {s.pan || '—'}</span>
                      </td>
                      <td>
                        <Badge
                          variant={
                            s.status === 'ACTIVE'
                              ? 'success'
                              : s.status === 'PENDING'
                                ? 'warning'
                                : 'danger'
                          }
                        >
                          {s.status}
                        </Badge>
                      </td>
                      <td className="actions-cell">
                        {s.status === 'PENDING' && (
                          <>
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleTransitionSeller(s.id, 'ACTIVE')}
                            >
                              Approve (ACTIVE)
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => setSelectedSellerForAction(s)}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {s.status === 'ACTIVE' && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleTransitionSeller(s.id, 'SUSPENDED')}
                          >
                            Suspend
                          </Button>
                        )}
                        {s.status === 'SUSPENDED' && (
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleTransitionSeller(s.id, 'ACTIVE')}
                          >
                            Reactivate
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Category Management Tab */}
        {currentTab === 'categories' && (
          <div className="admin-view">
            <div className="view-header-row">
              <h2>Category Hierarchy</h2>
              <Button
                variant="primary"
                onClick={() => {
                  setEditingCategoryId(null);
                  setCategoryForm({
                    name: '',
                    slug: '',
                    description: '',
                    parentId: '',
                    imageUrl: '',
                    displayOrder: 0,
                    isActive: true,
                  });
                  setShowCategoryModal(true);
                }}
              >
                + Create Category
              </Button>
            </div>

            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Slug</th>
                    <th>Order</th>
                    <th>Status</th>
                    <th>Subcategories</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <strong>{c.name}</strong>
                      </td>
                      <td>
                        <code>{c.slug}</code>
                      </td>
                      <td>{c.display_order}</td>
                      <td>
                        <Badge
                          variant={c.is_active ? 'success' : 'neutral'}
                          size="sm"
                        >
                          {c.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td>{c.children?.length || 0} subcategories</td>
                      <td className="actions-cell">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingCategoryId(c.id);
                            setCategoryForm({
                              name: c.name,
                              slug: c.slug,
                              description: c.description || '',
                              parentId: c.parent_id || '',
                              imageUrl: c.image_url || '',
                              displayOrder: c.display_order,
                              isActive: c.is_active,
                            });
                            setShowCategoryModal(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteCategory(c.id)}
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
      </div>

      {/* Rejection Modal */}
      {selectedSellerForAction && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Reject Seller Application</h3>
            <p>Specify the rejection reason for {selectedSellerForAction.business_name}:</p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Invalid business documentation or GSTIN mismatch"
              rows="3"
              className="admin-input"
              required
            />
            <div className="modal-actions">
              <Button
                variant="danger"
                onClick={() =>
                  handleTransitionSeller(
                    selectedSellerForAction.id,
                    'REJECTED',
                    rejectionReason,
                  )
                }
              >
                Confirm Rejection
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setSelectedSellerForAction(null);
                  setRejectionReason('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Category Create/Edit Modal */}
      {showCategoryModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingCategoryId ? 'Edit Category' : 'Create Category'}</h3>
            <form onSubmit={handleSaveCategory}>
              <div className="form-group">
                <label>Category Name</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) =>
                    setCategoryForm({
                      ...categoryForm,
                      name: e.target.value,
                      slug:
                        !editingCategoryId && !categoryForm.slug
                          ? e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-')
                          : categoryForm.slug,
                    })
                  }
                  required
                  className="admin-input"
                />
              </div>

              <div className="form-group">
                <label>Slug</label>
                <input
                  type="text"
                  value={categoryForm.slug}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, slug: e.target.value })
                  }
                  required
                  className="admin-input"
                />
              </div>

              <div className="form-group">
                <label>Parent Category (Optional)</label>
                <select
                  value={categoryForm.parentId}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, parentId: e.target.value })
                  }
                  className="admin-input"
                >
                  <option value="">None (Top-level Category)</option>
                  {categories
                    .filter((c) => c.id !== editingCategoryId)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-group">
                <label>Display Order</label>
                <input
                  type="number"
                  value={categoryForm.displayOrder}
                  onChange={(e) =>
                    setCategoryForm({
                      ...categoryForm,
                      displayOrder: e.target.value,
                    })
                  }
                  className="admin-input"
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={categoryForm.isActive}
                    onChange={(e) =>
                      setCategoryForm({
                        ...categoryForm,
                        isActive: e.target.checked,
                      })
                    }
                  />
                  <span>Active & Visible to Customers</span>
                </label>
              </div>

              <div className="modal-actions">
                <Button type="submit" variant="primary">
                  Save Category
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowCategoryModal(false)}
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
