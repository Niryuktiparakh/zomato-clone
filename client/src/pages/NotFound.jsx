import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <p className="text-8xl mb-4">🍔</p>
      <h1 className="text-5xl font-bold text-gray-800 mb-2">404</h1>
      <p className="text-xl text-gray-500 mb-8">Oops! This page doesn't exist</p>
      <button
        onClick={() => navigate('/')}
        className="bg-red-500 text-white px-6 py-3 rounded-full font-bold hover:bg-red-600 transition"
      >
        Go Home
      </button>
    </div>
  );
};

export default NotFound;