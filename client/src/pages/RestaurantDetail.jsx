import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRestaurantById, getMenuByRestaurant } from '../services/restaurantService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingItem, setAddingItem] = useState(null);
  const { user } = useAuth();
  const { addToCart, clearCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restRes, menuRes] = await Promise.all([
          getRestaurantById(id),
          getMenuByRestaurant(id),
        ]);
        setRestaurant(restRes.data);
        setMenu(Array.isArray(menuRes.data) ? menuRes.data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddToCart = async (menuItemId) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    if (!restaurant.isOpen) {
      toast.error('This restaurant is currently closed');
      return;
    }
    setAddingItem(menuItemId);
    try {
      await addToCart(menuItemId, 1);
      toast.success('Item added to cart!');
    } catch (err) {
      const message = err.response?.data?.message || '';
      if (message.includes('different restaurants')) {
        const confirmed = window.confirm(
          'Your cart has items from another restaurant. Clear cart and add this item?'
        );
        if (confirmed) {
          try {
            await clearCart();
            await addToCart(menuItemId, 1);
            toast.success('Item added to cart!');
          } catch (e) {
            toast.error('Failed to add item');
          }
        }
      } else {
        toast.error('Failed to add item');
      }
    } finally {
      setAddingItem(null);
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  if (!restaurant) return <p className="text-center mt-10 text-red-500">Restaurant not found.</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{restaurant.name}</h1>
        <p className="text-gray-500 mt-1">{restaurant.cuisine.join(', ')}</p>
        <p className="text-gray-400 text-sm">{restaurant.address?.street}, {restaurant.address?.city}</p>
        <div className="flex items-center gap-4 mt-3 flex-wrap">
          <span className="text-yellow-500 font-semibold">⭐ {restaurant.rating || '0.0'}</span>
          <span className={`text-sm font-medium ${restaurant.isOpen ? 'text-green-500' : 'text-red-400'}`}>
            {restaurant.isOpen ? '🟢 Open Now' : '🔴 Closed Now'}
          </span>
          <span className="text-gray-400 text-sm">
            🕐 {restaurant.openingTime} - {restaurant.closingTime}
          </span>
        </div>
        {!restaurant.isOpen && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-red-500 text-sm">
            This restaurant is currently closed. Opens at {restaurant.openingTime}.
          </div>
        )}
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-4">Menu</h2>
      {menu.length === 0 ? (
        <p className="text-gray-500">No menu items available.</p>
      ) : (
        <div className="space-y-4">
          {menu.map((item) => (
            <div key={item._id} className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                <p className="text-gray-500 text-sm">{item.description}</p>
                <p className="text-gray-400 text-xs mt-1">{item.category}</p>
                <p className="text-red-500 font-bold mt-1">₹{item.price}</p>
              </div>
              <button
                onClick={() => handleAddToCart(item._id)}
                disabled={addingItem === item._id || !restaurant.isOpen}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {!restaurant.isOpen ? 'Closed' : addingItem === item._id ? 'Adding...' : '+ Add'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantDetail;