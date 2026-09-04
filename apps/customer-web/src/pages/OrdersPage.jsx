import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card, Badge, Alert } from '@ecommerce/ui';
import { apiRequest } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export function OrdersPage({ onNavigateBrowse }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'DELIVERED' | 'CANCELLED'
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Cancellation Modal State
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState(null);

  // Detail Modal State
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Invoice Modal State
  const [invoiceData, setInvoiceData] = useState(null);
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);

      let statusParam = '';
      if (activeTab === 'ACTIVE') {
        statusParam = '&status=PLACED,CONFIRMED,PROCESSING,SHIPPED,OUT_FOR_DELIVERY';
      } else if (activeTab === 'DELIVERED') {
        statusParam = '&status=DELIVERED';
      } else if (activeTab === 'CANCELLED') {
        statusParam = '&status=CANCELLED';
      }

      let searchParam = '';
      if (debouncedSearch && debouncedSearch.length >= 2) {
        searchParam = `&search=${encodeURIComponent(debouncedSearch)}`;
      }

      const res = await apiRequest(`/orders?limit=30${statusParam}${searchParam}`);
      setOrders(res || []);
      setError(null);
    } catch (err) {
      setError('Failed to load your orders: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [user, activeTab, debouncedSearch]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleOpenCancelModal = (order) => {
    setCancellingOrder(order);
    setCancelReason('Found a better price elsewhere');
    setCancelError(null);
    setCancelSuccessMsg(null);
  };

  const handleCloseCancelModal = () => {
    setCancellingOrder(null);
    setCancelReason('');
    setCancelError(null);
  };

  const handleConfirmCancel = async (e) => {
    e.preventDefault();
    if (!cancellingOrder || !cancelReason.trim()) return;

    if (cancelReason.trim().length < 5) {
      setCancelError('Please provide a reason of at least 5 characters');
      return;
    }

    try {
      setCancelLoading(true);
      setCancelError(null);

      const result = await apiRequest(`/orders/${cancellingOrder.id}/cancel`, {
        method: 'POST',
        body: {
          reason: cancelReason.trim(),
        },
      });

      let msg = `Order ${result.orderNumber} was successfully cancelled.`;
      if (result.refund) {
        if (result.refund.status === 'PROCESSED') {
          msg += ` Refund of $${result.refund.amount} has been processed via Razorpay.`;
        } else if (result.refund.status === 'PROCESSING') {
          msg += ` Refund of $${result.refund.amount} is currently being processed.`;
        } else if (result.refund.status === 'FAILED') {
          msg += ' Refund request recorded and will be retried automatically.';
        }
      }

      setCancelSuccessMsg(msg);
      handleCloseCancelModal();
      fetchOrders();
    } catch (err) {
      setCancelError(err.message || 'Failed to cancel order');
    } finally {
      setCancelLoading(false);
    }
  };

  const handleViewDetails = async (orderId) => {
    try {
      setDetailLoading(true);
      const detail = await apiRequest(`/orders/${orderId}`);
      setSelectedOrderDetail(detail);
    } catch (err) {
      alert('Failed to load order details: ' + err.message);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleViewInvoice = async (orderId) => {
    try {
      setInvoiceLoading(true);
      const invoice = await apiRequest(`/orders/${orderId}/invoice`);
      setInvoiceData(invoice);
    } catch (err) {
      alert('Failed to load invoice: ' + err.message);
    } finally {
      setInvoiceLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PLACED':
        return <Badge variant="primary">Placed</Badge>;
      case 'CONFIRMED':
        return <Badge variant="info">Confirmed</Badge>;
      case 'PROCESSING':
        return <Badge variant="warning">Processing</Badge>;
      case 'SHIPPED':
        return <Badge variant="warning">Shipped</Badge>;
      case 'OUT_FOR_DELIVERY':
        return <Badge variant="info">Out for Delivery</Badge>;
      case 'DELIVERED':
        return <Badge variant="success">Delivered</Badge>;
      case 'CANCELLED':
        return <Badge variant="danger">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const renderProgressStepper = (status) => {
    const STEPS = [
      { label: 'Placed', step: 0 },
      { label: 'Confirmed', step: 1 },
      { label: 'Processing', step: 2 },
      { label: 'Shipped', step: 3 },
      { label: 'Out for Delivery', step: 4 },
      { label: 'Delivered', step: 5 },
    ];

    const STATUS_MAP = {
      PLACED: 0,
      CONFIRMED: 1,
      PROCESSING: 2,
      SHIPPED: 3,
      OUT_FOR_DELIVERY: 4,
      DELIVERED: 5,
    };

    if (status === 'CANCELLED') {
      return (
        <div className="cancelled-banner">
          <span className="cancelled-icon">✕</span>
          <span>Order Cancelled</span>
        </div>
      );
    }

    const currentStep = STATUS_MAP[status] ?? 0;

    return (
      <div className="tracking-stepper">
        {STEPS.map((s, idx) => {
          const isDone = s.step <= currentStep;
          const isCurrent = s.step === currentStep;
          return (
            <div
              key={s.step}
              className={`stepper-step ${isDone ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
            >
              <div className="step-circle">{isDone ? '✓' : idx + 1}</div>
              <span className="step-label">{s.label}</span>
              {idx < STEPS.length - 1 && <div className="step-line" />}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="orders-page-container">
      <div className="orders-page-header">
        <div>
          <h1 className="orders-page-title">My Orders</h1>
          <p className="orders-page-subtitle">Track, manage, and view invoices for your purchases</p>
        </div>
        <Button variant="secondary" size="sm" onClick={onNavigateBrowse}>
          🛍️ Continue Shopping
        </Button>
      </div>

      {cancelSuccessMsg && (
        <Alert variant="success" title="Cancellation Complete">
          {cancelSuccessMsg}
        </Alert>
      )}

      {error && (
        <Alert variant="danger" title="Order Error">
          {error}
        </Alert>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="orders-controls-bar">
        <div className="orders-tabs">
          <button
            className={`tab-btn ${activeTab === 'ALL' ? 'active' : ''}`}
            onClick={() => setActiveTab('ALL')}
          >
            All Orders
          </button>
          <button
            className={`tab-btn ${activeTab === 'ACTIVE' ? 'active' : ''}`}
            onClick={() => setActiveTab('ACTIVE')}
          >
            Active & In Transit
          </button>
          <button
            className={`tab-btn ${activeTab === 'DELIVERED' ? 'active' : ''}`}
            onClick={() => setActiveTab('DELIVERED')}
          >
            Delivered
          </button>
          <button
            className={`tab-btn ${activeTab === 'CANCELLED' ? 'active' : ''}`}
            onClick={() => setActiveTab('CANCELLED')}
          >
            Cancelled
          </button>
        </div>

        <div className="orders-search-box">
          <input
            type="text"
            placeholder="Search by Order # or Product..."
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
        <div className="loading-container">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="empty-orders-card">
          <div className="empty-icon">📦</div>
          <h2>No matching orders found</h2>
          <p>
            {debouncedSearch
              ? `No orders matching "${debouncedSearch}". Try a different search term.`
              : 'When you place orders, they will appear here with live tracking and invoices.'}
          </p>
          <Button variant="primary" onClick={onNavigateBrowse}>
            Start Shopping
          </Button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const isCancellable = order.status === 'PLACED' || order.status === 'CONFIRMED';
            const items = order.itemsPreview || [];

            return (
              <Card key={order.id} className="order-history-card">
                <div className="order-card-header">
                  <div className="order-card-meta">
                    <span className="order-ref">{order.orderNumber}</span>
                    <span className="order-date">
                      Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="order-card-status">{getStatusBadge(order.status)}</div>
                </div>

                {/* Progress Stepper */}
                <div className="stepper-wrapper">{renderProgressStepper(order.status)}</div>

                {/* Items Preview */}
                <div className="order-items-grid">
                  {items.map((item) => (
                    <div key={item.id} className="order-item-tile">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} />
                      ) : (
                        <div className="item-icon-box">🛍️</div>
                      )}
                      <div className="item-tile-details">
                        <h4>{item.title}</h4>
                        <p>
                          Qty: {item.quantity} × ${item.unitPrice}
                        </p>
                      </div>
                    </div>
                  ))}
                  {order.itemsCount > items.length && (
                    <span className="more-items-tag">
                      +{order.itemsCount - items.length} more item(s)
                    </span>
                  )}
                </div>

                <div className="order-card-footer">
                  <div className="footer-total">
                    <span>
                      Payment: <strong>{order.paymentMethod}</strong>
                    </span>
                    <span className="footer-grand-total">
                      Total: <strong>${order.totalAmount}</strong>
                    </span>
                  </div>

                  <div className="order-card-actions">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleViewDetails(order.id)}
                      disabled={detailLoading}
                    >
                      🔍 View Details
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewInvoice(order.id)}
                      disabled={invoiceLoading}
                    >
                      📄 Invoice
                    </Button>
                    {isCancellable && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleOpenCancelModal(order)}
                      >
                        ✕ Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrderDetail && (
        <div className="modal-overlay" onClick={() => setSelectedOrderDetail(null)}>
          <div className="detail-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <h2>Order Details</h2>
              <button className="close-btn" onClick={() => setSelectedOrderDetail(null)}>
                ✕
              </button>
            </div>

            <div className="order-detail-header-meta">
              <div>
                <strong>Order #:</strong> {selectedOrderDetail.orderNumber}
              </div>
              <div>
                <strong>Status:</strong> {getStatusBadge(selectedOrderDetail.status)}
              </div>
              <div>
                <strong>Date:</strong>{' '}
                {new Date(selectedOrderDetail.createdAt).toLocaleString()}
              </div>
              {selectedOrderDetail.tracking?.estimatedDelivery && (
                <div>
                  <strong>Estimated Delivery:</strong>{' '}
                  {new Date(selectedOrderDetail.tracking.estimatedDelivery).toLocaleDateString()}
                </div>
              )}
            </div>

            {/* Address Snapshot */}
            {selectedOrderDetail.shippingAddress && (
              <div className="detail-section">
                <h3>📦 Shipping Address</h3>
                <p>
                  <strong>{selectedOrderDetail.shippingAddress.fullName}</strong> ({selectedOrderDetail.shippingAddress.phone})<br />
                  {selectedOrderDetail.shippingAddress.streetAddress}, {selectedOrderDetail.shippingAddress.city},{' '}
                  {selectedOrderDetail.shippingAddress.state} - {selectedOrderDetail.shippingAddress.postalCode},{' '}
                  {selectedOrderDetail.shippingAddress.country}
                </p>
              </div>
            )}

            {/* Line Items */}
            <div className="detail-section">
              <h3>🛍️ Line Items</h3>
              <div className="detail-items-list">
                {selectedOrderDetail.items.map((item) => (
                  <div key={item.id} className="detail-item-row">
                    <div className="item-info-col">
                      <h4>{item.title}</h4>
                      <p>Unit Price: ${item.unitPrice} × Qty: {item.quantity}</p>
                    </div>
                    <span className="item-subtotal-col">${item.subtotal}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Snapshot */}
            {selectedOrderDetail.pricingSnapshot && (
              <div className="detail-section pricing-detail-box">
                <h3>💰 Pricing Summary</h3>
                <div className="pricing-line">
                  <span>Subtotal:</span>
                  <span>${selectedOrderDetail.pricingSnapshot.subtotal}</span>
                </div>
                {parseFloat(selectedOrderDetail.pricingSnapshot.discount) > 0 && (
                  <div className="pricing-line discount-line">
                    <span>Discount ({selectedOrderDetail.pricingSnapshot.couponCode || 'Coupon'}):</span>
                    <span>-${selectedOrderDetail.pricingSnapshot.discount}</span>
                  </div>
                )}
                <div className="pricing-line">
                  <span>Tax (GST 18%):</span>
                  <span>${selectedOrderDetail.pricingSnapshot.tax}</span>
                </div>
                <div className="pricing-line">
                  <span>Shipping:</span>
                  <span>{parseFloat(selectedOrderDetail.pricingSnapshot.shippingFee) === 0 ? 'FREE' : `$${selectedOrderDetail.pricingSnapshot.shippingFee}`}</span>
                </div>
                <div className="pricing-line total-line">
                  <strong>Grand Total:</strong>
                  <strong>${selectedOrderDetail.totalAmount}</strong>
                </div>
              </div>
            )}

            {/* Audit History Timeline */}
            {selectedOrderDetail.statusHistory && selectedOrderDetail.statusHistory.length > 0 && (
              <div className="detail-section">
                <h3>📜 Audit Status History</h3>
                <div className="timeline-steps">
                  {selectedOrderDetail.statusHistory.map((h) => (
                    <div key={h.id} className="timeline-node">
                      <div className="node-dot" />
                      <div className="node-content">
                        <strong>{h.toStatus}</strong>
                        <span>
                          {new Date(h.createdAt).toLocaleDateString()} {new Date(h.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {h.reason && <span className="node-reason">({h.reason})</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="modal-actions">
              <Button
                variant="secondary"
                size="md"
                onClick={() => handleViewInvoice(selectedOrderDetail.id)}
              >
                📄 View Invoice
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => setSelectedOrderDetail(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {invoiceData && (
        <div className="modal-overlay" onClick={() => setInvoiceData(null)}>
          <div className="invoice-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row no-print">
              <h2>Tax Invoice</h2>
              <div className="invoice-actions">
                <Button variant="primary" size="sm" onClick={handlePrint}>
                  🖨️ Print Invoice
                </Button>
                <button className="close-btn" onClick={() => setInvoiceData(null)}>
                  ✕
                </button>
              </div>
            </div>

            <div className="invoice-document">
              <div className="invoice-brand-header">
                <div>
                  <h1 className="invoice-brand-title">🛍️ ApexStore</h1>
                  <p>Tax Invoice / Bill of Supply</p>
                </div>
                <div className="invoice-meta-col">
                  <div><strong>Invoice #:</strong> {invoiceData.invoiceNumber}</div>
                  <div><strong>Invoice Date:</strong> {new Date(invoiceData.invoiceDate).toLocaleDateString()}</div>
                  <div><strong>Order #:</strong> {invoiceData.orderNumber}</div>
                </div>
              </div>

              <hr />

              <div className="invoice-parties-grid">
                <div className="party-col">
                  <h4>Billed To (Customer):</h4>
                  <p>
                    <strong>{invoiceData.customer.name}</strong><br />
                    {invoiceData.customer.phone && <span>Phone: {invoiceData.customer.phone}<br /></span>}
                    {invoiceData.customer.address}
                  </p>
                </div>
                <div className="party-col">
                  <h4>Payment Information:</h4>
                  <p>
                    <strong>Method:</strong> {invoiceData.paymentMethod}<br />
                    <strong>Status:</strong> <span className="invoice-paid-tag">{invoiceData.paymentStatus}</span>
                  </p>
                </div>
              </div>

              <table className="invoice-table">
                <thead>
                  <tr>
                    <th>Item Description</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.title}</td>
                      <td>{item.quantity}</td>
                      <td>${item.unitPrice}</td>
                      <td>${item.subtotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="invoice-totals-box">
                <div className="totals-row">
                  <span>Subtotal:</span>
                  <span>${invoiceData.pricing.subtotal}</span>
                </div>
                {parseFloat(invoiceData.pricing.discount) > 0 && (
                  <div className="totals-row">
                    <span>Discount:</span>
                    <span>-${invoiceData.pricing.discount}</span>
                  </div>
                )}
                <div className="totals-row">
                  <span>Tax (GST 18%):</span>
                  <span>${invoiceData.pricing.tax}</span>
                </div>
                <div className="totals-row">
                  <span>Shipping Fee:</span>
                  <span>${invoiceData.pricing.shippingFee}</span>
                </div>
                <div className="totals-row grand-total-row">
                  <strong>Total Amount:</strong>
                  <strong>${invoiceData.pricing.grandTotal}</strong>
                </div>
              </div>

              <div className="invoice-footer-note">
                <p>Thank you for shopping with ApexStore! This is a computer-generated tax invoice.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Modal */}
      {cancellingOrder && (
        <div className="modal-overlay">
          <div className="cancel-modal-card">
            <h2>Cancel Order</h2>
            <p className="modal-subtitle">
              Are you sure you want to cancel order <strong>{cancellingOrder.orderNumber}</strong>?
            </p>

            {cancelError && (
              <Alert variant="danger" title="Error">
                {cancelError}
              </Alert>
            )}

            <form onSubmit={handleConfirmCancel}>
              <div className="form-group">
                <label htmlFor="reasonSelect">Reason for Cancellation *</label>
                <select
                  id="reasonSelect"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  disabled={cancelLoading}
                >
                  <option value="Found a better price elsewhere">Found a better price elsewhere</option>
                  <option value="Ordered by mistake / wrong item">Ordered by mistake / wrong item</option>
                  <option value="Delivery time is too long">Delivery time is too long</option>
                  <option value="Changed my mind">Changed my mind</option>
                  <option value="Other">Other reason</option>
                </select>
              </div>

              {cancelReason === 'Other' && (
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Please specify reason (min 5 characters)"
                    onChange={(e) => setCancelReason(e.target.value)}
                    disabled={cancelLoading}
                    required
                  />
                </div>
              )}

              <div className="modal-actions">
                <Button
                  variant="secondary"
                  size="md"
                  type="button"
                  onClick={handleCloseCancelModal}
                  disabled={cancelLoading}
                >
                  Keep Order
                </Button>
                <Button
                  variant="danger"
                  size="md"
                  type="submit"
                  disabled={cancelLoading || cancelReason.trim().length < 5}
                >
                  {cancelLoading ? 'Cancelling...' : 'Confirm Cancellation'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
