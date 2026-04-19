import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Cart = () => {
  const { cart, fetchCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCart();
  }, [user]);

  const handleIncrease = async (menuItemId) => {
    try {
      await api.post('/api/cart', { menuItemId, quantity: 1 });
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDecrease = async (menuItemId, currentQty) => {
    try {
      if (currentQty <= 1) {
        await api.delete('/api/cart/' + menuItemId);
      } else {
        await api.post('/api/cart', { menuItemId, quantity: -1 });
      }
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  if (!cart || cart.items?.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-5xl mb-4">🛒</p>
        <h2 className="text-2xl font-bold text-gray-700">Your cart is empty</h2>
        <p className="text-gray-400 mt-2">Add items from a restaurant to get started</p>
        <button
          onClick={() => navigate('/restaurants')}
          className="mt-6 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Browse Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Cart</h1>
      <p className="text-gray-500 mb-6">From: {cart.restaurant?.name}</p>
      <div className="space-y-4 mb-6">
        {cart.items.map((item) => (
          <div key={item._id} className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{item.menuItem?.name}</h3>
              <p className="text-gray-500 text-sm">₹{item.price} each</p>
              <p className="text-red-500 font-bold">₹{item.price * item.quantity}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleDecrease(item.menuItem?._id, item.quantity)}
                className="w-8 h-8 rounded-full bg-red-100 text-red-500 font-bold hover:bg-red-200 transition"
              >
                -
              </button>
              <span className="text-gray-800 font-semibold w-4 text-center">{item.quantity}</span>
              <button
                onClick={() => handleIncrease(item.menuItem?._id)}
                className="w-8 h-8 rounded-full bg-red-100 text-red-500 font-bold hover:bg-red-200 transition"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="flex justify-between text-lg font-bold text-gray-800">
          <span>Total</span>
          <span>₹{cart.totalPrice}</span>
        </div>
      </div>
      <div className="flex gap-4">
        <button
          onClick={clearCart}
          className="flex-1 border border-red-500 text-red-500 py-2 rounded-lg hover:bg-red-50 transition"
        >
          Clear Cart
        </button>
        <button
          onClick={() => navigate('/payment')}
          className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
        >
          Proceed to Pay ₹{cart.totalPrice}
        </button>
      </div>
    </div>
  );
};

export default Cart;