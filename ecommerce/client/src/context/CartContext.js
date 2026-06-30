import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [cartCount, setCartCount] = useState(0);

  const fetchCart = useCallback(async () => {
    if (!user) { setCart({ items: [], total: 0 }); setCartCount(0); return; }
    try {
      const { data } = await api.get('/cart');
      setCart(data);
      setCartCount(data.items.reduce((sum, i) => sum + i.quantity, 0));
    } catch {}
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    await api.post('/cart', { productId, quantity });
    fetchCart();
  };

  const updateCart = async (id, quantity) => {
    await api.put(`/cart/${id}`, { quantity });
    fetchCart();
  };

  const removeFromCart = async (id) => {
    await api.delete(`/cart/${id}`);
    fetchCart();
  };

  return (
    <CartContext.Provider value={{ cart, cartCount, addToCart, updateCart, removeFromCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
