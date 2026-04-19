import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const ManageOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/api/admin/orders');
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    setUpdating(orderId);
    try {
      await api.put('/api/admin/orders/' + orderId + '/status', { status });
      fetchOrders();
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

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

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading orders...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Orders</h1>
        <button onClick={() => navigate('/admin')} className="text-red-500 hover:underline text-sm">
          Back to Dashboard
        </button>
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-bold text-gray-800">
                    {order.user?.name}
                    <span className="text-gray-400 font-normal text-sm ml-2">{order.user?.email}</span>
                  </p>
                  <p className="text-gray-500 text-sm">{order.restaurant?.name}</p>
                  <p className="text-gray-400 text-xs">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-red-500">Rs.{order.totalPrice}</p>
                  <p className="text-gray-400 text-sm">{order.paymentMethod.toUpperCase()}</p>
                </div>
              </div>

              <div className="border-t pt-3 mb-3 space-y-1">
                {order.items.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm text-gray-600">
                    <span>{item.menuItem?.name} x {item.quantity}</span>
                    <span>Rs.{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className={'px-3 py-1 rounded-full text-xs font-semibold ' + statusColor(order.status)}>
                  {order.status.replace('_', ' ').toUpperCase()}
                </span>
                <select
                  value={order.status}
                  disabled={updating === order._id}
                  onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="preparing">Preparing</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageOrders;