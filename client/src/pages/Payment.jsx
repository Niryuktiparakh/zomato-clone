import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const UPI_ID = import.meta.env.VITE_UPI_ID || 'yourname@upi';
const UPI_NAME = 'FoodApp';

function buildUPILink(app, amount) {
  const name = encodeURIComponent(UPI_NAME);
  const note = encodeURIComponent('FoodApp Order');
  const base = 'upi://pay?pa=' + UPI_ID + '&pn=' + name + '&am=' + amount + '&cu=INR&tn=' + note;
  if (app === 'phonepe') return 'phonepe://pay?pa=' + UPI_ID + '&pn=' + name + '&am=' + amount + '&cu=INR&tn=' + note;
  if (app === 'gpay') return 'tez://upi/pay?pa=' + UPI_ID + '&pn=' + name + '&am=' + amount + '&cu=INR&tn=' + note;
  if (app === 'paytm') return 'paytmmp://pay?pa=' + UPI_ID + '&pn=' + name + '&am=' + amount + '&cu=INR&tn=' + note;
  return base;
}

function UPIButton(props) {
  const app = props.app;
  const amount = props.amount;
  const color = props.color;
  const emoji = props.emoji;
  const label = props.label;
  const link = buildUPILink(app, amount);

  return (
    <a href={link} className={'flex flex-col items-center p-3 rounded-xl border-2 ' + color + ' transition'}>
      <span className="text-3xl mb-1">{emoji}</span>
      <span className="text-xs font-semibold">{label}</span>
    </a>
  );
}

function Payment() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [utrNumber, setUtrNumber] = useState('');
  const [placing, setPlacing] = useState(false);
  const [deliveryAddress] = useState({
    street: 'MG Road',
    city: 'Nashik',
    state: 'Maharashtra',
    pincode: '422001',
  });

  if (!cart || cart.items?.length === 0) {
    navigate('/cart');
    return null;
  }

  const amount = parseFloat(cart.totalPrice).toFixed(2);

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'online' && !utrNumber.trim()) {
      toast.error('Please enter UTR/Transaction ID after payment');
      return;
    }
    setPlacing(true);
    try {
      await api.post('/orders', {
        deliveryAddress,
        paymentMethod: paymentMethod === 'online' ? 'online' : 'cod',
        isPaid: paymentMethod === 'online',
        utrNumber: paymentMethod === 'online' ? utrNumber : '',
      });
      await clearCart();
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      toast.error('Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  const codActive = paymentMethod === 'cod';
  const onlineActive = paymentMethod === 'online';
  const codClass = 'p-4 rounded-xl border-2 text-center transition ' + (codActive ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300');
  const onlineClass = 'p-4 rounded-xl border-2 text-center transition ' + (onlineActive ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300');

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Checkout</h1>
      <p className="text-gray-500 mb-6">From: {cart.restaurant?.name}</p>

      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-3">Order Summary</h2>
        <div className="space-y-2 mb-3">
          {cart.items.map((item) => (
            <div key={item._id} className="flex justify-between text-sm text-gray-600">
              <span>{item.menuItem?.name} x {item.quantity}</span>
              <span>Rs.{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        <div className="border-t pt-3 flex justify-between font-bold text-gray-800 text-lg">
          <span>Total Amount</span>
          <span className="text-red-500">Rs.{amount}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Select Payment Method</h2>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => setPaymentMethod('cod')} className={codClass}>
            <p className="text-3xl mb-1">💵</p>
            <p className="font-semibold text-gray-800">Cash on Delivery</p>
            <p className="text-xs text-gray-500">Pay when delivered</p>
          </button>
          <button onClick={() => setPaymentMethod('online')} className={onlineClass}>
            <p className="text-3xl mb-1">📱</p>
            <p className="font-semibold text-gray-800">Pay Online</p>
            <p className="text-xs text-gray-500">UPI / QR Code</p>
          </button>
        </div>
      </div>

      {onlineActive && (
        <div className="bg-white rounded-xl shadow p-5 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-1">Pay via UPI</h2>
          <p className="text-gray-500 text-sm mb-4">
            Amount: <span className="text-red-500 font-bold text-lg">Rs.{amount}</span>
          </p>

          <div className="grid grid-cols-3 gap-3 mb-5">
            <UPIButton app="phonepe" amount={amount} color="border-purple-200 hover:border-purple-400 hover:bg-purple-50" emoji="💜" label="PhonePe" />
            <UPIButton app="gpay" amount={amount} color="border-blue-200 hover:border-blue-400 hover:bg-blue-50" emoji="🔵" label="Google Pay" />
            <UPIButton app="paytm" amount={amount} color="border-sky-200 hover:border-sky-400 hover:bg-sky-50" emoji="🔷" label="Paytm" />
          </div>

          <div className="border-t pt-4 mb-4">
            <p className="text-sm font-semibold text-gray-700 mb-3 text-center">Or scan QR code</p>
            <div className="flex flex-col items-center">
              <div className="w-48 h-48 bg-gray-100 flex items-center justify-center rounded-lg">
                <p className="text-gray-400 text-sm text-center">QR Code Placeholder</p>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                UPI ID: <span className="font-bold text-gray-800">{UPI_ID}</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">Scan and pay Rs.{amount}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter UTR / Transaction ID after payment
            </label>
            <input
              type="text"
              value={utrNumber}
              onChange={(e) => setUtrNumber(e.target.value)}
              placeholder="e.g. 123456789012"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
            />
            <p className="text-xs text-gray-400 mt-1">
              Find UTR in your payment app under transaction history
            </p>
          </div>
        </div>
      )}

      <button
        onClick={handlePlaceOrder}
        disabled={placing}
        className="w-full bg-red-500 text-white py-3 rounded-xl font-bold text-lg hover:bg-red-600 transition disabled:opacity-50"
      >
        {placing ? 'Placing Order...' : codActive ? 'Place Order (COD)' : 'Confirm Payment & Order'}
      </button>

      <button
        onClick={() => navigate('/cart')}
        className="w-full mt-3 text-gray-500 text-sm hover:text-red-500 transition"
      >
        Back to Cart
      </button>
    </div>
  );
}

export default Payment;