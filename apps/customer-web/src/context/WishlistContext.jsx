import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../api/client.js';
import { useAuth } from './AuthContext.jsx';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadWishlist();
    } else {
      setItems([]);
    }
  }, [user]);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/wishlist');
      setItems(data || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    if (!user) return;
    try {
      await apiRequest('/wishlist/items', {
        method: 'POST',
        body: { productId },
      });
      await loadWishlist();
    } catch (err) {
      console.error('Failed to add to wishlist', err);
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user) return;
    try {
      await apiRequest(`/wishlist/items/${productId}`, {
        method: 'DELETE',
      });
      setItems((prev) => prev.filter((item) => item.product_id !== productId && item.product?.id !== productId));
    } catch (err) {
      console.error('Failed to remove from wishlist', err);
    }
  };

  const isWishlisted = (productId) => {
    return items.some((item) => item.product_id === productId || item.product?.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        loading,
        addToWishlist,
        removeFromWishlist,
        isWishlisted,
        reload: loadWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
