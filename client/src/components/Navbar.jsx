import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useEffect } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) fetchCart();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cartCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="text-2xl font-bold text-red-500">🍔 FoodApp</Link>
      <div className="flex items-center gap-6">
        <Link to="/restaurants" className="text-gray-700 hover:text-red-500 font-medium">
          Restaurants
        </Link>
        {user ? (
          <>
            <Link to="/cart" className="relative text-gray-700 hover:text-red-500 font-medium">
              🛒 Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link to="/orders" className="text-gray-700 hover:text-red-500 font-medium">
              Orders
            </Link>
            {user.role === 'admin' && (
              <Link to="/admin" className="text-gray-700 hover:text-red-500 font-medium">
                Admin
              </Link>
            )}
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">Hi, {user.name}!</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-red-500 font-medium">Login</Link>
            <Link to="/register" className="bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 transition">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;