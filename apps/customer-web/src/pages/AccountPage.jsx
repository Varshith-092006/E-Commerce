import React, { useState, useEffect } from 'react';
import { Button, Input, Badge, Alert } from '@ecommerce/ui';
import { useAuth } from '../context/AuthContext.jsx';
import { apiRequest } from '../api/client.js';

export function AccountPage({ onNavigateLogin }) {
  const { user, setUser } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
  });

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isDefault: false,
  });

  const [statusMessage, setStatusMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (user) {
      loadAddresses();
    }
  }, [user]);

  const loadAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const data = await apiRequest('/users/addresses');
      setAddresses(data || []);
    } catch (err) {
      console.error('Failed to load addresses', err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  if (!user) {
    return (
      <div className="account-page empty-state-box">
        <h2>Please Sign In</h2>
        <Button variant="primary" onClick={onNavigateLogin}>
          Sign In
        </Button>
      </div>
    );
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setErrorMessage(null);
      const updated = await apiRequest('/users/me', {
        method: 'PUT',
        body: profileForm,
      });
      setUser(updated);
      setIsEditingProfile(false);
      setStatusMessage('Profile successfully updated!');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update profile');
    }
  };

  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddressForm({
      fullName: user.firstName ? `${user.firstName} ${user.lastName}` : '',
      phone: user.phone || '',
      streetAddress: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      isDefault: addresses.length === 0,
    });
    setShowAddressModal(true);
  };

  const handleOpenEditAddress = (addr) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      fullName: addr.full_name,
      phone: addr.phone,
      streetAddress: addr.street_address,
      city: addr.city,
      state: addr.state,
      postalCode: addr.postal_code,
      country: addr.country || 'India',
      isDefault: addr.is_default,
    });
    setShowAddressModal(true);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      setErrorMessage(null);
      if (editingAddressId) {
        await apiRequest(`/users/addresses/${editingAddressId}`, {
          method: 'PUT',
          body: addressForm,
        });
        setStatusMessage('Address updated successfully');
      } else {
        await apiRequest('/users/addresses', {
          method: 'POST',
          body: addressForm,
        });
        setStatusMessage('New address saved successfully');
      }
      setShowAddressModal(false);
      await loadAddresses();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save address');
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await apiRequest(`/users/addresses/${id}`, { method: 'DELETE' });
      setStatusMessage('Address deleted');
      await loadAddresses();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to delete address');
    }
  };

  return (
    <div className="account-page">
      <h1>My Account</h1>

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

      <div className="account-grid">
        {/* Profile Card */}
        <div className="account-card">
          <div className="card-header-row">
            <h2>Personal Information</h2>
            {!isEditingProfile && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsEditingProfile(true)}
              >
                Edit
              </Button>
            )}
          </div>

          {isEditingProfile ? (
            <form onSubmit={handleUpdateProfile} className="profile-form">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={profileForm.firstName}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, firstName: e.target.value })
                  }
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={profileForm.lastName}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, lastName: e.target.value })
                  }
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, phone: e.target.value })
                  }
                  className="form-input"
                />
              </div>
              <div className="form-actions">
                <Button type="submit" variant="primary" size="sm">
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingProfile(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="profile-info-display">
              <div className="info-row">
                <span className="label">Name:</span>
                <span className="val">{user.firstName} {user.lastName}</span>
              </div>
              <div className="info-row">
                <span className="label">Email:</span>
                <span className="val">{user.email}</span>
              </div>
              <div className="info-row">
                <span className="label">Phone:</span>
                <span className="val">{user.phone || 'Not provided'}</span>
              </div>
              <div className="info-row">
                <span className="label">Account Status:</span>
                <Badge variant={user.isVerified ? 'success' : 'warning'}>
                  {user.isVerified ? 'Verified' : 'Pending Verification'}
                </Badge>
              </div>
            </div>
          )}
        </div>

        {/* Address Book Card */}
        <div className="account-card">
          <div className="card-header-row">
            <h2>Address Book</h2>
            <Button variant="primary" size="sm" onClick={handleOpenAddAddress}>
              + Add Address
            </Button>
          </div>

          {loadingAddresses ? (
            <div className="loading-container">Loading addresses...</div>
          ) : addresses.length === 0 ? (
            <p className="empty-text">No saved addresses yet.</p>
          ) : (
            <div className="addresses-list">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`address-item-card ${addr.is_default ? 'default-addr' : ''}`}
                >
                  <div className="address-item-header">
                    <span className="address-name">{addr.full_name}</span>
                    {addr.is_default && (
                      <Badge variant="primary" size="sm">
                        Default Address
                      </Badge>
                    )}
                  </div>
                  <p className="address-text">
                    {addr.street_address}, {addr.city}, {addr.state} - {addr.postal_code}, {addr.country}
                  </p>
                  <p className="address-phone">Phone: {addr.phone}</p>
                  <div className="address-actions">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenEditAddress(addr)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteAddress(addr.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Address Edit/Add Modal */}
      {showAddressModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingAddressId ? 'Edit Address' : 'Add New Address'}</h3>
            <form onSubmit={handleSaveAddress}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={addressForm.fullName}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, fullName: e.target.value })
                  }
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  value={addressForm.phone}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, phone: e.target.value })
                  }
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Street Address</label>
                <textarea
                  value={addressForm.streetAddress}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, streetAddress: e.target.value })
                  }
                  required
                  className="form-input"
                  rows="2"
                />
              </div>
              <div className="form-row-three">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, city: e.target.value })
                    }
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    value={addressForm.state}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, state: e.target.value })
                    }
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Postal Code</label>
                  <input
                    type="text"
                    value={addressForm.postalCode}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, postalCode: e.target.value })
                    }
                    required
                    className="form-input"
                  />
                </div>
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={addressForm.isDefault}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, isDefault: e.target.checked })
                    }
                  />
                  <span>Set as default delivery address</span>
                </label>
              </div>
              <div className="modal-actions">
                <Button type="submit" variant="primary">
                  Save Address
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowAddressModal(false)}
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
