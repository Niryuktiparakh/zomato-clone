import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-red-500 text-white py-20 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">🍔 FoodApp</h1>
        <p className="text-xl mb-2">Order food from the best restaurants near you</p>
        <p className="text-red-100 mb-8">Fast delivery • Fresh food • Best prices</p>
        <button
          onClick={() => navigate('/restaurants')}
          className="bg-white text-red-500 font-bold px-8 py-3 rounded-full text-lg hover:bg-red-50 transition shadow-lg"
        >
          Order Now 🚀
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">Why choose FoodApp?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p className="text-5xl mb-4">⚡</p>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Fast Delivery</h3>
            <p className="text-gray-500">Get your food delivered in 30 minutes or less</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p className="text-5xl mb-4">🍽️</p>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Top Restaurants</h3>
            <p className="text-gray-500">Choose from hundreds of top rated restaurants</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p className="text-5xl mb-4">💰</p>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Best Prices</h3>
            <p className="text-gray-500">Exclusive deals and discounts every day</p>
          </div>
        </div>
      </div>

      <div className="bg-red-50 py-16 px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          {user ? `Welcome back, ${user.name}! 👋` : 'Ready to order?'}
        </h2>
        <p className="text-gray-500 mb-8">
          {user
            ? 'Browse restaurants and place your next order'
            : 'Create an account and start ordering in minutes'}
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate('/restaurants')}
            className="bg-red-500 text-white font-bold px-6 py-3 rounded-full hover:bg-red-600 transition"
          >
            Browse Restaurants
          </button>
          {!user && (
            <button
              onClick={() => navigate('/register')}
              className="border-2 border-red-500 text-red-500 font-bold px-6 py-3 rounded-full hover:bg-red-50 transition"
            >
              Create Account
            </button>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          {[
            { step: '1', icon: '🔍', title: 'Browse', desc: 'Find restaurants near you' },
            { step: '2', icon: '🛒', title: 'Select', desc: 'Pick your favourite dishes' },
            { step: '3', icon: '💳', title: 'Order', desc: 'Place your order easily' },
            { step: '4', icon: '🚀', title: 'Enjoy', desc: 'Get it delivered fast' },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-14 h-14 bg-red-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                {item.step}
              </div>
              <p className="text-3xl mb-2">{item.icon}</p>
              <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 text-white text-center py-8">
        <p className="text-lg font-bold">🍔 FoodApp</p>
        <p className="text-gray-400 text-sm mt-1">Made with ❤️ in Maharashtra</p>
      </div>
    </div>
  );
};

export default Home;