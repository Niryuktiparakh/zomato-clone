import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ManageRestaurants = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [menuForm, setMenuForm] = useState({
    name: '', description: '', price: '', category: '',
  });
  const [form, setForm] = useState({
    name: '',
    cuisine: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    openingTime: '09:00',
    closingTime: '22:00',
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchRestaurants();
  }, [user]);

  const fetchRestaurants = async () => {
    try {
      const res = await api.get('/admin/restaurants');
      setRestaurants(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenu = async (restaurantId) => {
    try {
      const res = await api.get(`/menu/${restaurantId}`);
      setMenuItems(Array.isArray(res.data) ? res.data : []);
      setSelectedRestaurant(restaurantId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this restaurant?')) return;
    setDeleting(id);
    try {
      await api.delete(`/admin/restaurants/${id}`);
      toast.success('Restaurant deleted successfully!');
      if (selectedRestaurant === id) setSelectedRestaurant(null);
      fetchRestaurants();
    } catch (err) {
      toast.error('Failed to delete restaurant');
    } finally {
      setDeleting(null);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMenuChange = (e) => {
    setMenuForm({ ...menuForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/restaurants', {
        name: form.name,
        cuisine: form.cuisine.split(',').map((c) => c.trim()),
        phone: form.phone,
        openingTime: form.openingTime,
        closingTime: form.closingTime,
        address: {
          street: form.street,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
        },
      });
      toast.success('Restaurant created successfully!');
      setForm({ name: '', cuisine: '', phone: '', street: '', city: '', state: '', pincode: '', openingTime: '09:00', closingTime: '22:00' });
      setShowForm(false);
      fetchRestaurants();
    } catch (err) {
      toast.error('Failed to create restaurant');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/menu/${selectedRestaurant}`, {
        name: menuForm.name,
        description: menuForm.description,
        price: Number(menuForm.price),
        category: menuForm.category,
      });
      toast.success('Menu item added!');
      setMenuForm({ name: '', description: '', price: '', category: '' });
      setShowMenuForm(false);
      fetchMenu(selectedRestaurant);
    } catch (err) {
      toast.error('Failed to add menu item');
    }
  };

  const handleDeleteMenuItem = async (menuItemId) => {
    if (!window.confirm('Delete this menu item?')) return;
    try {
      await api.delete(`/menu/${menuItemId}`);
      toast.success('Menu item deleted!');
      fetchMenu(selectedRestaurant);
    } catch (err) {
      toast.error('Failed to delete menu item');
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Restaurants</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            {showForm ? 'Cancel' : '+ Add Restaurant'}
          </button>
          <button
            onClick={() => navigate('/admin')}
            className="text-red-500 hover:underline text-sm"
          >
            ← Dashboard
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Restaurant</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Spice Garden" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine (comma separated)</label>
              <input type="text" name="cuisine" value={form.cuisine} onChange={handleChange} required placeholder="e.g. Indian, Chinese" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="text" name="phone" value={form.phone} onChange={handleChange} required placeholder="9999999999" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
              <input type="text" name="street" value={form.street} onChange={handleChange} placeholder="MG Road" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input type="text" name="city" value={form.city} onChange={handleChange} placeholder="Nashik" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input type="text" name="state" value={form.state} onChange={handleChange} placeholder="Maharashtra" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
              <input type="text" name="pincode" value={form.pincode} onChange={handleChange} placeholder="422001" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Opening Time</label>
              <input type="time" name="openingTime" value={form.openingTime} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Closing Time</label>
              <input type="time" name="closingTime" value={form.closingTime} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400" />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" disabled={submitting} className="w-full bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50">
                {submitting ? 'Creating...' : 'Create Restaurant'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {restaurants.map((r) => (
          <div key={r._id} className="bg-white rounded-xl shadow p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-800">{r.name}</h2>
                <p className="text-gray-500 text-sm">{r.cuisine.join(', ')}</p>
                <p className="text-gray-400 text-sm">{r.address?.city}, {r.address?.state}</p>
                <div className="flex gap-3 mt-1 flex-wrap">
                  <span className="text-yellow-500 text-sm">⭐ {r.rating}</span>
                  <span className={`text-sm ${r.isOpen ? 'text-green-500' : 'text-red-400'}`}>
                    {r.isOpen ? 'Open' : 'Closed'}
                  </span>
                  {r.openingTime && (
                    <span className="text-gray-400 text-sm">🕐 {r.openingTime} - {r.closingTime}</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => {
                    if (selectedRestaurant === r._id) {
                      setSelectedRestaurant(null);
                      setMenuItems([]);
                    } else {
                      fetchMenu(r._id);
                      setShowMenuForm(false);
                    }
                  }}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition text-sm"
                >
                  {selectedRestaurant === r._id ? 'Hide Menu' : 'Manage Menu'}
                </button>
                <button
                  onClick={() => handleDelete(r._id)}
                  disabled={deleting === r._id}
                  className="bg-red-100 text-red-500 px-4 py-2 rounded-lg hover:bg-red-200 transition disabled:opacity-50"
                >
                  {deleting === r._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>

            {selectedRestaurant === r._id && (
              <div className="mt-4 border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-gray-700">Menu Items</h3>
                  <button
                    onClick={() => setShowMenuForm(!showMenuForm)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition"
                  >
                    {showMenuForm ? 'Cancel' : '+ Add Item'}
                  </button>
                </div>

                {showMenuForm && (
                  <form onSubmit={handleMenuSubmit} className="grid grid-cols-2 gap-3 mb-4">
                    <input
                      type="text"
                      name="name"
                      value={menuForm.name}
                      onChange={handleMenuChange}
                      required
                      placeholder="Item name"
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                    />
                    <input
                      type="text"
                      name="category"
                      value={menuForm.category}
                      onChange={handleMenuChange}
                      required
                      placeholder="Category (e.g. Starter)"
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                    />
                    <input
                      type="number"
                      name="price"
                      value={menuForm.price}
                      onChange={handleMenuChange}
                      required
                      placeholder="Price (₹)"
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                    />
                    <input
                      type="text"
                      name="description"
                      value={menuForm.description}
                      onChange={handleMenuChange}
                      placeholder="Description (optional)"
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                    />
                    <button
                      type="submit"
                      className="col-span-2 bg-red-500 text-white py-2 rounded-lg text-sm hover:bg-red-600 transition"
                    >
                      Add Menu Item
                    </button>
                  </form>
                )}

                {menuItems.length === 0 ? (
                  <p className="text-gray-400 text-sm">No menu items yet.</p>
                ) : (
                  <div className="space-y-2">
                    {menuItems.map((item) => (
                      <div key={item._id} className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2">
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                          <p className="text-gray-400 text-xs">{item.category} • ₹{item.price}</p>
                          {item.description && <p className="text-gray-400 text-xs">{item.description}</p>}
                        </div>
                        <button
                          onClick={() => handleDeleteMenuItem(item._id)}
                          className="text-red-400 hover:text-red-600 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageRestaurants;