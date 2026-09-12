import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function NotFound() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoHome = () => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    const destination =
      user.role === 'ADMIN'
        ? '/admin-dashboard'
        : user.role === 'AGENT'
        ? '/agent-dashboard'
        : '/client-dashboard';

    navigate(destination, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-6">
        <div>
          <h1 className="text-9xl font-extrabold text-indigo-600 tracking-tight">
            404
          </h1>
          <h2 className="mt-4 text-3xl font-bold text-gray-900 tracking-tight">
            Page Not Found
          </h2>
          <p className="mt-2 text-base text-gray-500">
            Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
          >
            ← Go Back
          </button>
          <button
            onClick={handleGoHome}
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
}