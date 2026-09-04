import { useEffect, useRef, useState } from 'react';

/**
 * Custom React hook connecting browser to live Notification SSE stream
 */
export function useNotificationStream({
  token = null,
  onNotification = null,
  onConnected = null,
  baseUrl = '',
} = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastNotification, setLastNotification] = useState(null);
  const eventSourceRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const backoffDelayRef = useRef(1000);
  const callbackRef = useRef(onNotification);
  const connectedCallbackRef = useRef(onConnected);

  // Keep latest callbacks without triggering reconnects
  useEffect(() => {
    callbackRef.current = onNotification;
    connectedCallbackRef.current = onConnected;
  }, [onNotification, onConnected]);

  useEffect(() => {
    if (!token) {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      setIsConnected(false);
      return;
    }

    let isMounted = true;

    const connect = () => {
      if (!isMounted) {
        return;
      }

      // Close existing connection if any
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }

      const streamUrl = `${baseUrl}/api/v1/notifications/stream?token=${encodeURIComponent(token)}`;
      const es = new EventSource(streamUrl);
      eventSourceRef.current = es;

      es.addEventListener('connected', () => {
        if (!isMounted) {
          return;
        }
        setIsConnected(true);
        backoffDelayRef.current = 1000; // Reset backoff on successful connection
        if (connectedCallbackRef.current) {
          connectedCallbackRef.current();
        }
      });

      es.addEventListener('notification', (e) => {
        if (!isMounted) {
          return;
        }
        try {
          const data = JSON.parse(e.data);
          setLastNotification(data);
          if (callbackRef.current) {
            callbackRef.current(data);
          }
        } catch {
          // Ignore JSON parse errors
        }
      });

      es.onerror = () => {
        if (!isMounted) {
          return;
        }
        setIsConnected(false);
        es.close();
        eventSourceRef.current = null;

        // Exponential backoff reconnect: 1s, 2s, 4s, 8s, 16s, max 30s
        const nextDelay = Math.min(backoffDelayRef.current * 2, 30000);
        backoffDelayRef.current = nextDelay;

        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, nextDelay);
      };
    };

    connect();

    return () => {
      isMounted = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      setIsConnected(false);
    };
  }, [token, baseUrl]);

  return { isConnected, lastNotification };
}
