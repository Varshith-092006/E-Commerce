import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiRequest } from '../api/client.js';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({
    items: [],
    total_items: 0,
    subtotal: '0.00',
  });
  const [loading, setLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart({ items: [], total_items: 0, subtotal: '0.00' });
      return;
    }
    try {
      setLoading(true);
      const data = await apiRequest('/cart');
      setCart(data || { items: [], total_items: 0, subtotal: '0.00' });
      setError(null);
    } catch (err) {
      console.error('Failed to load cart', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      throw new Error('Please sign in to add items to your cart.');
    }
    try {
      setLoading(true);
      const updatedCart = await apiRequest('/cart/items', {
        method: 'POST',
        body: { productId, quantity },
      });
      setCart(updatedCart);
      setIsDrawerOpen(true);
      setError(null);
      return updatedCart;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (!user || quantity < 1) return;

    // Optimistic UI state
    const previousCart = { ...cart };
    setCart((prev) => {
      const updatedItems = prev.items.map((item) => {
        if (item.id === itemId) {
          const itemPrice = parseFloat(item.price) || 0;
          return {
            ...item,
            quantity,
            subtotal: (itemPrice * quantity).toFixed(2),
          };
        }
        return item;
      });
      const newTotalItems = updatedItems.reduce((sum, i) => sum + i.quantity, 0);
      const newSubtotal = updatedItems
        .reduce((sum, i) => sum + (parseFloat(i.price) || 0) * i.quantity, 0)
        .toFixed(2);
      return {
        ...prev,
        items: updatedItems,
        total_items: newTotalItems,
        subtotal: newSubtotal,
      };
    });

    try {
      const updatedCart = await apiRequest(`/cart/items/${itemId}`, {
        method: 'PUT',
        body: { quantity },
      });
      setCart(updatedCart);
      setError(null);
    } catch (err) {
      console.error('Failed to update cart quantity - rolling back', err);
      setCart(previousCart);
      setError(err.message);
    }
  };

  const removeFromCart = async (itemId) => {
    if (!user) return;
    const previousCart = { ...cart };

    // Optimistic UI
    setCart((prev) => {
      const updatedItems = prev.items.filter((item) => item.id !== itemId);
      const newTotalItems = updatedItems.reduce((sum, i) => sum + i.quantity, 0);
      const newSubtotal = updatedItems
        .reduce((sum, i) => sum + (parseFloat(i.price) || 0) * i.quantity, 0)
        .toFixed(2);
      return {
        ...prev,
        items: updatedItems,
        total_items: newTotalItems,
        subtotal: newSubtotal,
      };
    });

    try {
      const updatedCart = await apiRequest(`/cart/items/${itemId}`, {
        method: 'DELETE',
      });
      setCart(updatedCart);
      setError(null);
    } catch (err) {
      console.error('Failed to remove item - rolling back', err);
      setCart(previousCart);
      setError(err.message);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    const previousCart = { ...cart };
    setCart({ items: [], total_items: 0, subtotal: '0.00' });

    try {
      await apiRequest('/cart', {
        method: 'DELETE',
      });
      setError(null);
    } catch (err) {
      console.error('Failed to clear cart - rolling back', err);
      setCart(previousCart);
      setError(err.message);
    }
  };

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
