import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card, Badge, Alert } from '@ecommerce/ui';
import { apiRequest } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export function CourierDeliveryPage({ onNavigateHome }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState(null);

  // Filters & Search
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Modal States
  const [outForDeliveryOrder, setOutForDeliveryOrder] = useState(null);
  const [agentName, setAgentName] = useState(user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Ramesh Kumar');
  const [agentPhone, setAgentPhone] = useState('+919876543210');
  const [dispatchLoading, setDispatchLoading] = useState(false);

  // POD Delivery Modal
  const [deliverOrder, setDeliverOrder] = useState(null);
  const [recipientName, setRecipientName] = useState('');
  const [podReference, setPodReference] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [codCollected, setCodCollected] = useState(true);
  const [deliverLoading, setDeliverLoading] = useState(false);
  const [deliverError, setDeliverError] = useState(null);

  // Failed Attempt Modal
  const [failedAttemptOrder, setFailedAttemptOrder] = useState(null);
  const [attemptReason, setAttemptReason] = useState('Customer unavailable / Door locked. Rescheduled.');
  const [attemptLoading, setAttemptLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchLogisticsOrders = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);

      let statusParam = '';
      if (activeTab === 'SHIPPED') statusParam = '&status=SHIPPED';
      else if (activeTab === 'OUT_FOR_DELIVERY') statusParam = '&status=OUT_FOR_DELIVERY';
      else if (activeTab === 'DELIVERED') statusParam = '&status=DELIVERED';
      else statusParam = '&status=SHIPPED,OUT_FOR_DELIVERY,DELIVERED';

      let searchParam = '';
      if (debouncedSearch && debouncedSearch.length >= 2) {
        searchParam = `&search=${encodeURIComponent(debouncedSearch)}`;
      }

      const res = await apiRequest(`/logistics/orders?limit=30${statusParam}${searchParam}`);
      setOrders(res || []);
      setError(null);
    } catch (err) {
      setError('Failed to load logistics run sheet: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [user, activeTab, debouncedSearch]);

  useEffect(() => {
    fetchLogisticsOrders();
  }, [fetchLogisticsOrders]);

  const handleConfirmOutForDelivery = async (e) => {
    e.preventDefault();
    if (!outForDeliveryOrder || !agentName.trim() || !agentPhone.trim()) return;

    try {
      setDispatchLoading(true);
      await apiRequest(`/logistics/orders/${outForDeliveryOrder.id}/out-for-delivery`, {
        method: 'POST',
        body: {
          deliveryAgentName: agentName.trim(),
          deliveryAgentPhone: agentPhone.trim(),
          reason: `Dispatched for last-mile delivery with ${agentName.trim()}`,
        },
      });

      setActionSuccessMsg(`Order ${outForDeliveryOrder.orderNumber} is now OUT FOR DELIVERY!`);
      setOutForDeliveryOrder(null);
      fetchLogisticsOrders();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setDispatchLoading(false);
    }
  };

  const handleOpenDeliverModal = (order) => {
    setDeliverOrder(order);
    setRecipientName(order.shippingAddress?.fullName || '');
    setPodReference(`OTP-${Math.floor(1000 + Math.random() * 9000)}`);
    setDeliveryNotes('Delivered to recipient at address');
    setCodCollected(true);
    setDeliverError(null);
  };

  const handleConfirmDeliver = async (e) => {
    e.preventDefault();
    if (!deliverOrder || !recipientName.trim() || !podReference.trim()) return;

    if (deliverOrder.paymentMethod === 'COD' && !codCollected) {
      setDeliverError('Please confirm COD cash collection before marking delivered');
      return;
    }

    try {
      setDeliverLoading(true);
      setDeliverError(null);

      await apiRequest(`/logistics/orders/${deliverOrder.id}/deliver`, {
        method: 'POST',
        body: {
          recipientName: recipientName.trim(),
          podReference: podReference.trim(),
          deliveryNotes: deliveryNotes.trim(),
          codAmountCollected: deliverOrder.paymentMethod === 'COD' ? deliverOrder.totalAmount : null,
        },
      });

      setActionSuccessMsg(`Order ${deliverOrder.orderNumber} successfully marked DELIVERED with verified POD!`);
      setDeliverOrder(null);
      fetchLogisticsOrders();
    } catch (err) {
      setDeliverError(err.message || 'Failed to complete delivery');
    } finally {
      setDeliverLoading(false);
    }
  };

  const handleConfirmFailedAttempt = async (e) => {
    e.preventDefault();
    if (!failedAttemptOrder || !attemptReason.trim()) return;

    try {
      setAttemptLoading(true);
      await apiRequest(`/logistics/orders/${failedAttemptOrder.id}/attempt-failed`, {
        method: 'POST',
        body: {
          reason: attemptReason.trim(),
        },
      });

      setActionSuccessMsg(`Delivery attempt logged for order ${failedAttemptOrder.orderNumber}`);
      setFailedAttemptOrder(null);
      fetchLogisticsOrders();
    } catch (err) {
      alert('Failed to log delivery attempt: ' + err.message);
    } finally {
      setAttemptLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SHIPPED':
        return <Badge variant="info">Ready for Delivery</Badge>;
      case 'OUT_FOR_DELIVERY':
        return <Badge variant="warning">Out for Delivery</Badge>;
      case 'DELIVERED':
        return <Badge variant="success">Delivered</Badge>;
      case 'CANCELLED':
        return <Badge variant="danger">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="logistics-container">
      <div className="logistics-header">
        <div>
          <h1 className="logistics-title">🚚 Courier & Last-Mile Delivery Run Sheet</h1>
          <p className="logistics-subtitle">Dispatch routes, record delivery attempts, and verify Proof of Delivery (POD)</p>
        </div>
        <Button variant="secondary" size="sm" onClick={onNavigateHome}>
          🏠 Back to Storefront
        </Button>
      </div>

      {actionSuccessMsg && (
        <Alert variant="success" title="Action Completed">
          {actionSuccessMsg}
        </Alert>
      )}

      {error && (
        <Alert variant="danger" title="Error">
          {error}
        </Alert>
      )}

      {/* Filter Tabs & Search */}
      <div className="orders-controls-bar">
        <div className="orders-tabs">
          <button
            className={`tab-btn ${activeTab === 'ALL' ? 'active' : ''}`}
            onClick={() => setActiveTab('ALL')}
          >
            All Active ({orders.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'SHIPPED' ? 'active' : ''}`}
            onClick={() => setActiveTab('SHIPPED')}
          >
            Ready to Dispatch
          </button>
          <button
            className={`tab-btn ${activeTab === 'OUT_FOR_DELIVERY' ? 'active' : ''}`}
            onClick={() => setActiveTab('OUT_FOR_DELIVERY')}
          >
            On Route
          </button>
          <button
            className={`tab-btn ${activeTab === 'DELIVERED' ? 'active' : ''}`}
            onClick={() => setActiveTab('DELIVERED')}
          >
            Delivered
          </button>
        </div>

        <div className="orders-search-box">
          <input
            type="text"
            placeholder="Search Order #, AWB, or Customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
              ✕
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="loading-container">Loading delivery run sheet...</div>
      ) : orders.length === 0 ? (
        <div className="empty-orders-card">
          <div className="empty-icon">🚚</div>
          <h2>No shipments assigned</h2>
          <p>Orders dispatched by sellers will appear here for courier delivery assignment.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const shipping = order.shippingAddress || {};
            const pod = order.podMetadata || {};

            return (
              <Card key={order.id} className="logistics-order-card">
                <div className="logistics-order-header-row">
                  <div>
                    <span className="order-ref">{order.orderNumber}</span>
                    <span className="order-date">
                      {order.courierName ? `${order.courierName} (AWB: ${order.trackingNumber})` : 'Courier Pending'}
                    </span>
                  </div>
                  <div>{getStatusBadge(order.status)}</div>
                </div>

                <div className="logistics-order-body-grid">
                  <div className="logistics-dest-col">
                    <h4>📍 Customer & Address:</h4>
                    <p>
                      <strong>{shipping.fullName}</strong> ({shipping.phone || 'No phone'})<br />
                      {shipping.streetAddress ? `${shipping.streetAddress}, ` : ''}
                      {shipping.city}, {shipping.state} - {shipping.postalCode}
                    </p>
                  </div>

                  <div className="logistics-payment-col">
                    <h4>💰 Payment & Amount:</h4>
                    <p>
                      Method: <strong>{order.paymentMethod}</strong><br />
                      Total Amount: <strong>${order.totalAmount}</strong>
                      {order.paymentMethod === 'COD' && order.status !== 'DELIVERED' && (
                        <span className="cod-alert-tag">⚠️ Collect Cash: ${order.totalAmount}</span>
                      )}
                    </p>
                    {order.deliveryAttempts > 0 && (
                      <div className="attempt-badge">
                        ⚠️ Delivery Attempts: {order.deliveryAttempts}
                      </div>
                    )}
                  </div>
                </div>

                {order.status === 'OUT_FOR_DELIVERY' && order.deliveryAgentName && (
                  <div className="agent-info-bar">
                    🚴‍♂️ <strong>Delivery Agent:</strong> {order.deliveryAgentName} ({order.deliveryAgentPhone})
                  </div>
                )}

                {order.status === 'DELIVERED' && (
                  <div className="pod-info-bar">
                    ✅ <strong>Delivered to:</strong> {pod.recipientName || 'Recipient'} | <strong>POD Ref:</strong> {pod.podReference || 'Verified'} | <strong>Time:</strong> {order.deliveredAt ? new Date(order.deliveredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Confirmed'}
                  </div>
                )}

                <div className="logistics-order-footer-row">
                  <div className="seller-actions-group">
                    {order.status === 'SHIPPED' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setOutForDeliveryOrder(order);
                        }}
                      >
                        🚀 Dispatch / Out for Delivery
                      </Button>
                    )}

                    {order.status === 'OUT_FOR_DELIVERY' && (
                      <>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleOpenDeliverModal(order)}
                        >
                          ✅ Confirm Delivery (POD)
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setFailedAttemptOrder(order);
                            setAttemptReason('Customer premises locked / Door closed. Rescheduled.');
                          }}
                        >
                          ⚠️ Door Locked / Attempt Failed
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Out for Delivery Modal */}
      {outForDeliveryOrder && (
        <div className="modal-overlay" onClick={() => setOutForDeliveryOrder(null)}>
          <div className="cancel-modal-card" onClick={(e) => e.stopPropagation()}>
            <h2>Dispatch Out for Delivery</h2>
            <p className="modal-subtitle">
              Assign delivery agent for <strong>{outForDeliveryOrder.orderNumber}</strong>.
            </p>

            <form onSubmit={handleConfirmOutForDelivery}>
              <div className="form-group">
                <label htmlFor="agentNameInput">Delivery Agent Name *</label>
                <input
                  id="agentNameInput"
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  disabled={dispatchLoading}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="agentPhoneInput">Agent Phone Number *</label>
                <input
                  id="agentPhoneInput"
                  type="text"
                  value={agentPhone}
                  onChange={(e) => setAgentPhone(e.target.value)}
                  disabled={dispatchLoading}
                  required
                />
              </div>

              <div className="modal-actions">
                <Button
                  variant="secondary"
                  size="md"
                  type="button"
                  onClick={() => setOutForDeliveryOrder(null)}
                  disabled={dispatchLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  type="submit"
                  disabled={dispatchLoading || !agentName.trim() || !agentPhone.trim()}
                >
                  {dispatchLoading ? 'Dispatching...' : 'Start Last-Mile Route'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deliver & POD Modal */}
      {deliverOrder && (
        <div className="modal-overlay" onClick={() => setDeliverOrder(null)}>
          <div className="cancel-modal-card" onClick={(e) => e.stopPropagation()}>
            <h2>Proof of Delivery (POD)</h2>
            <p className="modal-subtitle">
              Record physical handover and delivery confirmation for <strong>{deliverOrder.orderNumber}</strong>.
            </p>

            {deliverError && (
              <Alert variant="danger" title="Validation Error">
                {deliverError}
              </Alert>
            )}

            <form onSubmit={handleConfirmDeliver}>
              <div className="form-group">
                <label htmlFor="recipientInput">Recipient Full Name *</label>
                <input
                  id="recipientInput"
                  type="text"
                  placeholder="e.g. John Doe"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  disabled={deliverLoading}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="podRefInput">POD Code / OTP / Signature Reference *</label>
                <input
                  id="podRefInput"
                  type="text"
                  placeholder="e.g. OTP-4921 or SIG-12345"
                  value={podReference}
                  onChange={(e) => setPodReference(e.target.value)}
                  disabled={deliverLoading}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="notesInput">Delivery Handover Notes</label>
                <input
                  id="notesInput"
                  type="text"
                  placeholder="e.g. Handed to customer at front entrance"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  disabled={deliverLoading}
                />
              </div>

              {deliverOrder.paymentMethod === 'COD' && (
                <div className="cod-checkbox-box">
                  <label>
                    <input
                      type="checkbox"
                      checked={codCollected}
                      onChange={(e) => setCodCollected(e.target.checked)}
                      disabled={deliverLoading}
                    />
                    <span>
                      💵 I have collected <strong>${deliverOrder.totalAmount}</strong> in cash from the customer.
                    </span>
                  </label>
                </div>
              )}

              <div className="modal-actions">
                <Button
                  variant="secondary"
                  size="md"
                  type="button"
                  onClick={() => setDeliverOrder(null)}
                  disabled={deliverLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant="success"
                  size="md"
                  type="submit"
                  disabled={deliverLoading || !recipientName.trim() || !podReference.trim()}
                >
                  {deliverLoading ? 'Recording Handover...' : 'Verify POD & Mark Delivered'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Failed Attempt Modal */}
      {failedAttemptOrder && (
        <div className="modal-overlay" onClick={() => setFailedAttemptOrder(null)}>
          <div className="cancel-modal-card" onClick={(e) => e.stopPropagation()}>
            <h2>Log Failed Delivery Attempt</h2>
            <p className="modal-subtitle">
              Record reason for incomplete delivery for <strong>{failedAttemptOrder.orderNumber}</strong>.
            </p>

            <form onSubmit={handleConfirmFailedAttempt}>
              <div className="form-group">
                <label htmlFor="reasonSelect">Reason for Non-Delivery *</label>
                <select
                  id="reasonSelect"
                  value={attemptReason}
                  onChange={(e) => setAttemptReason(e.target.value)}
                  disabled={attemptLoading}
                >
                  <option value="Customer unavailable / Door locked. Rescheduled.">Customer unavailable / Door locked</option>
                  <option value="Customer requested delivery reschedule to next day.">Customer requested reschedule</option>
                  <option value="Delivery address unreachable / premises closed.">Address unreachable / premises closed</option>
                  <option value="Customer refused package handover.">Customer refused package</option>
                </select>
              </div>

              <div className="modal-actions">
                <Button
                  variant="secondary"
                  size="md"
                  type="button"
                  onClick={() => setFailedAttemptOrder(null)}
                  disabled={attemptLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant="warning"
                  size="md"
                  type="submit"
                  disabled={attemptLoading || !attemptReason.trim()}
                >
                  {attemptLoading ? 'Logging...' : 'Record Attempt & Reschedule'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
