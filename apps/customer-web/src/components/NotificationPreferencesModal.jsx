import React, { useState, useEffect } from 'react';
import { api } from '../api/client';

export function NotificationPreferencesModal({ isOpen, onClose }) {
  const [preferences, setPreferences] = useState({
    emailEnabled: true,
    smsEnabled: true,
    inAppEnabled: true,
    ordersEmail: true,
    ordersSms: true,
    paymentsEmail: true,
    paymentsSms: true,
    marketingEmail: true,
    marketingSms: false,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchPrefs = async () => {
      setLoading(true);
      setStatusMessage(null);
      try {
        const res = await api.get('/notifications/preferences');
        if (res.data) {
          setPreferences((prev) => ({ ...prev, ...res.data }));
        }
      } catch (err) {
        setStatusMessage({ type: 'error', text: err.message || 'Failed to load preferences' });
      } finally {
        setLoading(false);
      }
    };

    fetchPrefs();
  }, [isOpen]);

  const handleToggle = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    setStatusMessage(null);
    try {
      await api.put('/notifications/preferences', preferences);
      setStatusMessage({ type: 'success', text: 'Preferences saved successfully!' });
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to save preferences' });
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-container notification-prefs-modal">
        <div className="modal-header">
          <h3>⚙️ Notification Preferences</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="notification-loading-state">
              <div className="spinner"></div>
              <p>Loading your preferences...</p>
            </div>
          ) : (
            <>
              {statusMessage && (
                <div className={`status-banner ${statusMessage.type}`}>
                  {statusMessage.type === 'success' ? '✅' : '⚠️'} {statusMessage.text}
                </div>
              )}

              {/* Global Channel Toggles */}
              <div className="pref-section">
                <h4>Primary Channels</h4>
                <div className="pref-row">
                  <div>
                    <strong>In-App Notifications</strong>
                    <p className="pref-sub">Show alerts in the top bell icon drawer</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.inAppEnabled}
                    onChange={() => handleToggle('inAppEnabled')}
                  />
                </div>
                <div className="pref-row">
                  <div>
                    <strong>Email Delivery</strong>
                    <p className="pref-sub">Send notifications to your registered email</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.emailEnabled}
                    onChange={() => handleToggle('emailEnabled')}
                  />
                </div>
                <div className="pref-row">
                  <div>
                    <strong>SMS Delivery</strong>
                    <p className="pref-sub">Send order SMS to your registered mobile</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.smsEnabled}
                    onChange={() => handleToggle('smsEnabled')}
                  />
                </div>
              </div>

              {/* Category-Specific Toggles */}
              <div className="pref-section">
                <h4>Category Subscriptions</h4>
                <div className="pref-row">
                  <div>
                    <strong>📦 Orders & Deliveries</strong>
                    <p className="pref-sub">Tracking numbers, out for delivery, and delivery confirmations</p>
                  </div>
                  <div className="pref-channel-toggles">
                    <label>
                      <input
                        type="checkbox"
                        checked={preferences.ordersEmail}
                        onChange={() => handleToggle('ordersEmail')}
                      />{' '}
                      Email
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={preferences.ordersSms}
                        onChange={() => handleToggle('ordersSms')}
                      />{' '}
                      SMS
                    </label>
                  </div>
                </div>

                <div className="pref-row">
                  <div>
                    <strong>💳 Payments & Receipts</strong>
                    <p className="pref-sub">Payment confirmations, invoices, and refund alerts</p>
                  </div>
                  <div className="pref-channel-toggles">
                    <label>
                      <input
                        type="checkbox"
                        checked={preferences.paymentsEmail}
                        onChange={() => handleToggle('paymentsEmail')}
                      />{' '}
                      Email
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={preferences.paymentsSms}
                        onChange={() => handleToggle('paymentsSms')}
                      />{' '}
                      SMS
                    </label>
                  </div>
                </div>

                <div className="pref-row">
                  <div>
                    <strong>🏷️ Marketing & Promotions</strong>
                    <p className="pref-sub">Exclusive offers, flash sales, and discount coupons</p>
                  </div>
                  <div className="pref-channel-toggles">
                    <label>
                      <input
                        type="checkbox"
                        checked={preferences.marketingEmail}
                        onChange={() => handleToggle('marketingEmail')}
                      />{' '}
                      Email
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={preferences.marketingSms}
                        onChange={() => handleToggle('marketingSms')}
                      />{' '}
                      SMS
                    </label>
                  </div>
                </div>

                <div className="pref-row disabled-row">
                  <div>
                    <strong>👤 Account Security (Mandatory)</strong>
                    <p className="pref-sub">Password resets, security alerts, and verification codes</p>
                  </div>
                  <span className="mandatory-badge">Always Active</span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSave} disabled={saving || loading}>
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
}
