import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyOrders } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({});
  const [submittingReview, setSubmittingReview] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchOrders = async () => {
      try {
        const res = await getMyOrders();
        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const handleReviewChange = (orderId, field, value) => {
    setReviewForm((prev) => ({
      ...prev,
      [orderId]: { ...prev[orderId], [field]: value },
    }));
  };

  const handleReviewSubmit = async (order) => {
    const review = reviewForm[order._id];
    if (!review?.rating) {
      toast.error('Please select a rating');
      return;
    }
    setSubmittingReview(order._id);
    try {
      await api.post('/api/reviews/' + order.restaurant?._id, {
        rating: review.rating,
        comment: review.comment || '',
      });
      toast.success('Review submitted!');
      setReviewForm((prev) => ({ ...prev, [order._id]: { submitted: true } }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(null);
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
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">📦</p>
          <h2 className="text-2xl font-bold text-gray-700">No orders yet</h2>
          <p className="text-gray-400 mt-2">Place your first order to see it here</p>
          <button
            onClick={() => navigate('/restaurants')}
            className="mt-6 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Order Now
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">{order.restaurant?.name}</h2>
                  <p className="text-gray-400 text-sm">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <span className={'text-sm font-semibold px-3 py-1 rounded-full ' + statusColor(order.status)}>
                  {order.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <div className="border-t pt-3 space-y-2">
                {order.items.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm text-gray-600">
                    <span>{item.menuItem?.name} x {item.quantity}</span>
                    <span>Rs.{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t mt-3 pt-3 flex justify-between font-bold text-gray-800">
                <span>Total</span>
                <span>Rs.{order.totalPrice}</span>
              </div>

              <div className="mt-2 text-sm text-gray-500">
                Payment: {order.paymentMethod.toUpperCase()} •
                {order.isPaid ? ' Paid' : ' Unpaid'}
              </div>

              {order.status === 'delivered' && (
                <div className="mt-4 border-t pt-4">
                  {reviewForm[order._id]?.submitted ? (
                    <p className="text-green-500 text-sm font-medium">Review submitted!</p>
                  ) : (
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">Rate your experience:</p>
                      <div className="flex gap-2 mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleReviewChange(order._id, 'rating', star)}
                            className={'text-2xl transition ' + (reviewForm[order._id]?.rating >= star ? 'text-yellow-400' : 'text-gray-300')}
                          >
                            ★
                          </button>
                        ))}
                        {reviewForm[order._id]?.rating && (
                          <span className="text-sm text-gray-500 self-center ml-1">
                            {reviewForm[order._id].rating}/5
                          </span>
                        )}
                      </div>
                      <textarea
                        placeholder="Write a comment (optional)"
                        value={reviewForm[order._id]?.comment || ''}
                        onChange={(e) => handleReviewChange(order._id, 'comment', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 mb-2"
                        rows={2}
                      />
                      <button
                        onClick={() => handleReviewSubmit(order)}
                        disabled={submittingReview === order._id}
                        className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-red-600 transition disabled:opacity-50"
                      >
                        {submittingReview === order._id ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;