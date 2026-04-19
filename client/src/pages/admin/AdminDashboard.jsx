import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    restaurants: 0,
    orders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    const fetchData = async () => {
      try {
        const [usersRes, restaurantsRes, ordersRes] = await Promise.all([
          api.get('/admin/users'),
          api.get('/admin/restaurants'),
          api.get('/admin/orders'),
        ]);
        setStats({
          users: usersRes.data.length,
          restaurants: restaurantsRes.data.length,
          orders: ordersRes.data.length,
        });
        setRecentOrders(ordersRes.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const statusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      preparing: 'bg-orange-100 text-orange-700',
      out_for_delivery: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading dashboard...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
      <p className="text-gray-500 mb-8">Welcome back, {user?.name}!</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <p className="text-4xl font-bold text-red-500">{stats.users}</p>
          <p className="text-gray-600 mt-1 font-medium">Total Users</p>
          <button
            onClick={() => navigate('/admin/users')}
            className="mt-3 text-sm text-red-500 hover:underline"
          >
            Manage Users →
          </button>
        </div>
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <p className="text-4xl font-bold text-red-500">{stats.restaurants}</p>
          <p className="text-gray-600 mt-1 font-medium">Restaurants</p>
          <button
            onClick={() => navigate('/admin/restaurants')}
            className="mt-3 text-sm text-red-500 hover:underline"
          >
            Manage Restaurants →
          </button>
        </div>
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <p className="text-4xl font-bold text-red-500">{stats.orders}</p>
          <p className="text-gray-600 mt-1 font-medium">Total Orders</p>
          <button
            onClick={() => navigate('/admin/orders')}
            className="mt-3 text-sm text-red-500 hover:underline"
          >
            Manage Orders →
          </button>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Orders</h2>
      {recentOrders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-left">Restaurant</th>
                <th className="px-6 py-3 text-left">Total</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{order.user?.name}</td>
                  <td className="px-6 py-4 text-gray-600">{order.restaurant?.name}</td>
                  <td className="px-6 py-4 text-gray-800 font-semibold">Rs.{order.totalPrice}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(order.status)}`}>
                      {order.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
        <button
          onClick={() => navigate('/admin/restaurants')}
          className="bg-red-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-600 transition"
        >
          🍽️ Manage Restaurants
        </button>
        <button
          onClick={() => navigate('/admin/orders')}
          className="bg-gray-800 text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-900 transition"
        >
          📦 Manage Orders
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;