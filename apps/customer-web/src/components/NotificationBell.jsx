import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { useNotificationStream } from '../hooks/useNotificationStream';
import { NotificationPreferencesModal } from './NotificationPreferencesModal';

export function NotificationBell() {
  const { user, token } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isPrefsOpen, setIsPrefsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeToast, setActiveToast] = useState(null);
  const dropdownRef = useRef(null);
  const toastTimeoutRef = useRef(null);

  // Fetch unread count on login/mount
  const fetchUnreadCount = useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.get('/notifications?limit=1');
      if (res.meta?.unreadCount !== undefined) {
        setUnreadCount(res.meta.unreadCount);
      }
    } catch {
      // Non-blocking fallback
    }
  }, [user]);

  // Fetch full notification list
  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/notifications?limit=20');
      setNotifications(res.data || []);
      if (res.meta?.unreadCount !== undefined) {
        setUnreadCount(res.meta.unreadCount);
      }
    } catch (err) {
      setError(err.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Live real-time incoming notification handler
  const handleLiveNotification = useCallback((incoming) => {
    if (!incoming || !incoming.id) return;

    // Deduplicate and update state
    setNotifications((prev) => {
      if (prev.some((n) => n.id === incoming.id)) {
        return prev;
      }
      return [
        {
          id: incoming.id,
          channel: incoming.channel || 'IN_APP',
          category: incoming.category || 'ORDERS',
          subject: incoming.subject || 'New Notification',
          content: incoming.content || '',
          metadata: incoming.metadata || {},
          status: incoming.status || 'SENT',
          isRead: false,
          readAt: null,
          createdAt: incoming.created_at || new Date().toISOString(),
        },
        ...prev,
      ];
    });

    // Increment unread count safely
    setUnreadCount((prev) => prev + 1);

    // Trigger visual toast popup
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setActiveToast(incoming);
    toastTimeoutRef.current = setTimeout(() => {
      setActiveToast(null);
    }, 4500);
  }, []);

  // Connect to live SSE notification stream
  useNotificationStream({
    token: token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null),
    onNotification: handleLiveNotification,
  });

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
    } else {
      setUnreadCount(0);
      setNotifications([]);
      setActiveToast(null);
    }
  }, [user, fetchUnreadCount]);

  // Handle open/close
  const toggleDropdown = () => {
    if (!isOpen) {
      fetchNotifications();
    }
    setIsOpen(!isOpen);
  };

  // Close on outside click or Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleMarkAsRead = async (id, isRead) => {
    if (isRead) return;
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // Ignore error on mark read
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.post('/notifications/read-all', {});
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true, readAt: new Date().toISOString() })),
      );
      setUnreadCount(0);
    } catch {
      // Ignore error on mark all read
    }
  };

  if (!user) return null;

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'ORDERS':
        return '📦';
      case 'PAYMENTS':
        return '💳';
      case 'ACCOUNT':
        return '👤';
      case 'MARKETING':
        return '🏷️';
      default:
        return '🔔';
    }
  };

  return (
    <div className="notification-bell-container" ref={dropdownRef}>
      <button
        className="action-btn notification-bell-btn"
        onClick={toggleDropdown}
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
        aria-expanded={isOpen}
        title="Notifications"
      >
        🔔 <span className="action-label">Alerts</span>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {/* Floating Live Real-Time Toast Alert */}
      {activeToast && !isOpen && (
        <div
          className="notification-live-toast"
          role="alert"
          onClick={() => {
            setIsOpen(true);
            fetchNotifications();
            setActiveToast(null);
          }}
        >
          <div className="toast-icon">{getCategoryIcon(activeToast.category)}</div>
          <div className="toast-content">
            <span className="toast-title">{activeToast.subject || 'Order Update'}</span>
            <p className="toast-body">{activeToast.content}</p>
          </div>
          <button
            className="toast-close-btn"
            onClick={(e) => {
              e.stopPropagation();
              setActiveToast(null);
            }}
            aria-label="Dismiss toast"
          >
            ✕
          </button>
        </div>
      )}

      {isOpen && (
        <div className="notification-popover" role="dialog" aria-label="Notifications Drawer">
          <div className="notification-popover-header">
            <div className="popover-title-row">
              <span className="popover-title">Notifications</span>
              {unreadCount > 0 && <span className="popover-unread-pill">{unreadCount} new</span>}
            </div>
            <div className="popover-actions">
              {unreadCount > 0 && (
                <button className="popover-action-link" onClick={handleMarkAllAsRead}>
                  Mark all read
                </button>
              )}
              <button
                className="popover-refresh-btn"
                onClick={() => setIsPrefsOpen(true)}
                title="Notification Preferences"
                aria-label="Notification Preferences"
              >
                ⚙️
              </button>
              <button
                className="popover-refresh-btn"
                onClick={fetchNotifications}
                title="Refresh notifications"
                aria-label="Refresh notifications"
              >
                🔄
              </button>
            </div>
          </div>

          <div className="notification-popover-body">
            {loading && (
              <div className="notification-loading-state">
                <div className="spinner"></div>
                <p>Loading alerts...</p>
              </div>
            )}

            {error && !loading && (
              <div className="notification-error-state">
                <p>⚠️ {error}</p>
                <button className="btn-secondary btn-sm" onClick={fetchNotifications}>
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && notifications.length === 0 && (
              <div className="notification-empty-state">
                <span className="empty-bell-icon">🔕</span>
                <p>No notifications yet</p>
                <span className="empty-sub">We'll alert you when order updates arrive!</span>
              </div>
            )}

            {!loading && !error && notifications.length > 0 && (
              <div className="notification-items-list">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`notification-item ${item.isRead ? 'read' : 'unread'}`}
                    onClick={() => handleMarkAsRead(item.id, item.isRead)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleMarkAsRead(item.id, item.isRead);
                      }
                    }}
                  >
                    <div className="notification-icon">{getCategoryIcon(item.category)}</div>
                    <div className="notification-content-col">
                      <div className="notification-header-line">
                        <span className="notification-subject">
                          {item.subject || 'Notification'}
                        </span>
                        {!item.isRead && <span className="unread-dot" title="Unread" />}
                      </div>
                      <p className="notification-text">{item.content}</p>
                      <span className="notification-time">
                        {new Date(item.createdAt).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {/* Granular Notification Preferences Modal */}
      <NotificationPreferencesModal
        isOpen={isPrefsOpen}
        onClose={() => setIsPrefsOpen(false)}
      />
    </div>
  );
}
