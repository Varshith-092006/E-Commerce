import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card, Badge, Alert } from '@ecommerce/ui';
import { apiRequest } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export function SellerOrdersPage({ onNavigateHome }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState(null);

  // Filters & Search
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Shipping Modal State
  const [shippingOrder, setShippingOrder] = useState(null);
  const [courierName, setCourierName] = useState('BlueDart');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipLoading, setShipLoading] = useState(false);
  const [shipError, setShipError] = useState(null);

  // Packing Slip Modal State
  const [packingSlipData, setPackingSlipData] = useState(null);
  const [slipLoading, setSlipLoading] = useState(false);

  // Action Loading State
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchSellerOrders = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);

      let statusParam = '';
      if (activeTab === 'PLACED') statusParam = '&status=PLACED';
      else if (activeTab === 'CONFIRMED') statusParam = '&status=CONFIRMED';
      else if (activeTab === 'PROCESSING') statusParam = '&status=PROCESSING';
      else if (activeTab === 'SHIPPED') statusParam = '&status=SHIPPED';
      else if (activeTab === 'CANCELLED') statusParam = '&status=CANCELLED';

      let searchParam = '';
      if (debouncedSearch && debouncedSearch.length >= 2) {
        searchParam = `&search=${encodeURIComponent(debouncedSearch)}`;
      }

      const res = await apiRequest(`/seller/orders?limit=30${statusParam}${searchParam}`);
      setOrders(res || []);
      setError(null);
    } catch (err) {
      setError('Failed to load seller orders: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [user, activeTab, debouncedSearch]);

  useEffect(() => {
    fetchSellerOrders();
  }, [fetchSellerOrders]);

  const handleConfirmOrder = async (orderId) => {
    try {
      setActionLoadingId(orderId);
      await apiRequest(`/seller/orders/${orderId}/confirm`, {
        method: 'POST',
        body: { reason: 'Inventory verified and accepted by seller' },
      });
      setActionSuccessMsg('Order confirmed successfully!');
      fetchSellerOrders();
    } catch (err) {
      alert('Failed to confirm order: ' + err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleProcessOrder = async (orderId) => {
    try {
      setActionLoadingId(orderId);
      await apiRequest(`/seller/orders/${orderId}/process`, {
        method: 'POST',
        body: { reason: 'Items packed in warehouse' },
      });
      setActionSuccessMsg('Order marked as Packed & Processing!');
      fetchSellerOrders();
    } catch (err) {
      alert('Failed to process order: ' + err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleOpenShipModal = (order) => {
    setShippingOrder(order);
    setCourierName('BlueDart');
    setTrackingNumber(`BD-${Math.floor(10000000 + Math.random() * 90000000)}`);
    setShipError(null);
  };

  const handleConfirmShip = async (e) => {
    e.preventDefault();
    if (!shippingOrder || !courierName || !trackingNumber) return;

    if (courierName.trim().length < 2) {
      setShipError('Please enter a valid courier name');
      return;
    }
    if (trackingNumber.trim().length < 6) {
      setShipError('Tracking number must be at least 6 characters');
      return;
    }

    try {
      setShipLoading(true);
      setShipError(null);

      await apiRequest(`/seller/orders/${shippingOrder.id}/ship`, {
        method: 'POST',
        body: {
          courierName: courierName.trim(),
          trackingNumber: trackingNumber.trim(),
          reason: `Handed over to ${courierName.trim()} for dispatch`,
        },
      });

      setActionSuccessMsg(`Order ${shippingOrder.orderNumber} successfully dispatched with ${courierName}!`);
      setShippingOrder(null);
      fetchSellerOrders();
    } catch (err) {
      setShipError(err.message || 'Failed to dispatch order');
    } finally {
      setShipLoading(false);
    }
  };

  const handleViewPackingSlip = async (orderId) => {
    try {
      setSlipLoading(true);
      const slip = await apiRequest(`/seller/orders/${orderId}/packing-slip`);
      setPackingSlipData(slip);
    } catch (err) {
      alert('Failed to load packing slip: ' + err.message);
    } finally {
      setSlipLoading(false);
    }
  };

  const handlePrintSlip = () => {
    window.print();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PLACED':
        return <Badge variant="primary">New / Placed</Badge>;
      case 'CONFIRMED':
        return <Badge variant="info">Confirmed</Badge>;
      case 'PROCESSING':
        return <Badge variant="warning">Packed / Processing</Badge>;
      case 'SHIPPED':
        return <Badge variant="success">Shipped</Badge>;
      case 'CANCELLED':
        return <Badge variant="danger">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="seller-orders-container">
      <div className="seller-orders-header">
        <div>
          <h1 className="seller-page-title">Seller Fulfillment Dashboard</h1>
          <p className="seller-page-subtitle">Manage customer orders, packing workflows, and courier dispatches</p>
        </div>
        <Button variant="secondary" size="sm" onClick={onNavigateHome}>
          🏠 Back to Storefront
        </Button>
      </div>

      {actionSuccessMsg && (
        <Alert variant="success" title="Success">
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
            All ({orders.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'PLACED' ? 'active' : ''}`}
            onClick={() => setActiveTab('PLACED')}
          >
            New Orders
          </button>
          <button
            className={`tab-btn ${activeTab === 'CONFIRMED' ? 'active' : ''}`}
            onClick={() => setActiveTab('CONFIRMED')}
          >
            Confirmed
          </button>
          <button
            className={`tab-btn ${activeTab === 'PROCESSING' ? 'active' : ''}`}
            onClick={() => setActiveTab('PROCESSING')}
          >
            Ready to Ship
          </button>
          <button
            className={`tab-btn ${activeTab === 'SHIPPED' ? 'active' : ''}`}
            onClick={() => setActiveTab('SHIPPED')}
          >
            Dispatched
          </button>
        </div>

        <div className="orders-search-box">
          <input
            type="text"
            placeholder="Search Order # or Product Title..."
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
        <div className="loading-container">Loading fulfillment orders...</div>
      ) : orders.length === 0 ? (
        <div className="empty-orders-card">
          <div className="empty-icon">📋</div>
          <h2>No seller orders found</h2>
          <p>When customers purchase your products, they will appear here for processing.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const items = order.sellerItems || [];
            const shipping = order.shippingAddress || {};

            return (
              <Card key={order.id} className="seller-order-card">
                <div className="seller-order-header-row">
                  <div>
                    <span className="order-ref">{order.orderNumber}</span>
                    <span className="order-date">
                      Received {new Date(order.createdAt).toLocaleDateString()} at{' '}
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div>{getStatusBadge(order.status)}</div>
                </div>

                <div className="seller-order-body-grid">
                  {/* Items for this seller */}
                  <div className="seller-items-section">
                    <h4>📦 Your Products in this Order ({items.length}):</h4>
                    <div className="seller-items-list">
                      {items.map((item) => (
                        <div key={item.id} className="seller-item-tile">
                          <div className="tile-title-col">
                            <strong>{item.title}</strong>
                            <span>Unit: ${item.unitPrice} × {item.quantity} units</span>
                          </div>
                          <span className="tile-subtotal">${item.subtotal}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recipient info */}
                  <div className="seller-recipient-section">
                    <h4>📍 Deliver To:</h4>
                    <p>
                      <strong>{shipping.fullName}</strong><br />
                      {shipping.streetAddress ? `${shipping.streetAddress}, ` : ''}
                      {shipping.city}, {shipping.state} - {shipping.postalCode}
                    </p>
                    {order.trackingNumber && (
                      <div className="seller-awb-tag">
                        🚚 <strong>{order.courierName}:</strong> {order.trackingNumber}
                      </div>
                    )}
                  </div>
                </div>

                <div className="seller-order-footer-row">
                  <div className="seller-actions-group">
                    {order.status === 'PLACED' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleConfirmOrder(order.id)}
                        disabled={actionLoadingId === order.id}
                      >
                        ✓ Accept & Confirm Order
                      </Button>
                    )}

                    {order.status === 'CONFIRMED' && (
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => handleProcessOrder(order.id)}
                        disabled={actionLoadingId === order.id}
                      >
                        📦 Mark Ready for Packing
                      </Button>
                    )}

                    {order.status === 'PROCESSING' && (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleOpenShipModal(order)}
                      >
                        🚚 Dispatch & Assign AWB
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewPackingSlip(order.id)}
                      disabled={slipLoading}
                    >
                      📄 Packing Slip
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Shipping / Dispatch Modal */}
      {shippingOrder && (
        <div className="modal-overlay" onClick={() => setShippingOrder(null)}>
          <div className="cancel-modal-card" onClick={(e) => e.stopPropagation()}>
            <h2>Dispatch Order</h2>
            <p className="modal-subtitle">
              Enter courier partner and AWB tracking number for <strong>{shippingOrder.orderNumber}</strong>.
            </p>

            {shipError && (
              <Alert variant="danger" title="Validation Error">
                {shipError}
              </Alert>
            )}

            <form onSubmit={handleConfirmShip}>
              <div className="form-group">
                <label htmlFor="courierSelect">Courier Partner *</label>
                <select
                  id="courierSelect"
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  disabled={shipLoading}
                >
                  <option value="BlueDart">BlueDart Express</option>
                  <option value="Delhivery">Delhivery Logistics</option>
                  <option value="FedEx">FedEx International</option>
                  <option value="DHL">DHL Express</option>
                  <option value="DTDC">DTDC Courier</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="trackingInput">AWB / Tracking Number *</label>
                <input
                  id="trackingInput"
                  type="text"
                  placeholder="e.g. BD-8899776655"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  disabled={shipLoading}
                  required
                />
              </div>

              <div className="modal-actions">
                <Button
                  variant="secondary"
                  size="md"
                  type="button"
                  onClick={() => setShippingOrder(null)}
                  disabled={shipLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  type="submit"
                  disabled={shipLoading || !trackingNumber.trim()}
                >
                  {shipLoading ? 'Dispatching...' : 'Confirm Dispatch & Ship'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Packing Slip Modal */}
      {packingSlipData && (
        <div className="modal-overlay" onClick={() => setPackingSlipData(null)}>
          <div className="invoice-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row no-print">
              <h2>Shipping Manifest / Packing Slip</h2>
              <div className="invoice-actions">
                <Button variant="primary" size="sm" onClick={handlePrintSlip}>
                  🖨️ Print Slip
                </Button>
                <button className="close-btn" onClick={() => setPackingSlipData(null)}>
                  ✕
                </button>
              </div>
            </div>

            <div className="invoice-document">
              <div className="invoice-brand-header">
                <div>
                  <h1 className="invoice-brand-title">📦 SELLER PACKING SLIP</h1>
                  <p>Order Fulfillment Checklist</p>
                </div>
                <div className="invoice-meta-col">
                  <div><strong>Slip #:</strong> {packingSlipData.slipNumber}</div>
                  <div><strong>Order #:</strong> {packingSlipData.orderNumber}</div>
                  <div><strong>Date:</strong> {new Date(packingSlipData.orderDate).toLocaleDateString()}</div>
                </div>
              </div>

              <hr />

              <div className="invoice-parties-grid">
                <div className="party-col">
                  <h4>Ship To:</h4>
                  <p>
                    <strong>{packingSlipData.recipient.fullName}</strong><br />
                    {packingSlipData.recipient.phone && <span>Phone: {packingSlipData.recipient.phone}<br /></span>}
                    {packingSlipData.recipient.shippingAddress}
                  </p>
                </div>
                <div className="party-col">
                  <h4>Courier & Tracking:</h4>
                  <p>
                    <strong>Carrier:</strong> {packingSlipData.courierName}<br />
                    <strong>AWB Tracking:</strong> {packingSlipData.trackingNumber}<br />
                    <strong>Status:</strong> {packingSlipData.status}
                  </p>
                </div>
              </div>

              <table className="invoice-table">
                <thead>
                  <tr>
                    <th>Check</th>
                    <th>Product Title</th>
                    <th>SKU / Product ID</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {packingSlipData.sellerItems.map((item, idx) => (
                    <tr key={idx}>
                      <td>[ ]</td>
                      <td><strong>{item.title}</strong></td>
                      <td><code>{item.productId}</code></td>
                      <td><strong>{item.quantity} pcs</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="invoice-footer-note">
                <p>Checked and verified by seller fulfillment center. Pack securely before carrier pickup.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
