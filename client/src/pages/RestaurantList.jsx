import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllRestaurants } from '../services/restaurantService';

const isRestaurantOpen = (openingTime, closingTime) => {
  if (!openingTime || !closingTime) return true;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [openH, openM] = openingTime.split(':').map(Number);
  const [closeH, closeM] = closingTime.split(':').map(Number);
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;
  if (closeMinutes < openMinutes) {
    return currentMinutes >= openMinutes || currentMinutes < closeMinutes;
  }
  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
};

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllRestaurants();
        const data = Array.isArray(res.data) ? res.data : [];
        setRestaurants(data);
      } catch (err) {
        console.error(err);
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading restaurants...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">All Restaurants</h1>
      {restaurants.length === 0 ? (
        <p className="text-gray-500">No restaurants found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((r) => {
            const open = isRestaurantOpen(r.openingTime, r.closingTime);
            return (
              <div
                key={r._id}
                onClick={() => navigate('/restaurants/' + r._id)}
                className="bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer overflow-hidden"
              >
                <div className="bg-gray-100 h-40 flex items-center justify-center text-5xl">
                  🍽️
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-bold text-gray-800">{r.name}</h2>
                  <p className="text-gray-500 text-sm mt-1">{r.cuisine.join(', ')}</p>
                  <p className="text-gray-400 text-sm">{r.address?.city}, {r.address?.state}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-yellow-500 font-semibold">⭐ {r.rating || '0.0'}</span>
                    <span className={'text-sm font-medium ' + (open ? 'text-green-500' : 'text-red-400')}>
                      {open ? 'Open' : 'Closed'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RestaurantList;