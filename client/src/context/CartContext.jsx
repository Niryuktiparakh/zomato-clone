import { createContext, useContext, useState } from 'react';
import api from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);

  const fetchCart = async () => {
    try {
      const res = await api.get('/cart');
      setCart(res.data);
    } catch {
      setCart(null);
    }
  };

  const addToCart = async (menuItemId, quantity = 1) => {
    const res = await api.post('/cart', { menuItemId, quantity });
    setCart(res.data);
  };

  const clearCart = async () => {
    await api.delete('/cart/clear');
    setCart(null);
  };

  return (
    <CartContext.Provider value={{ cart, fetchCart, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);