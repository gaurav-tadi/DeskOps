import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function RootRedirect() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }


  if (!user) {
    return <Navigate to="/login" replace />;
  }


  switch (user.role) {
    case 'ADMIN':
      return <Navigate to="/admin-dashboard" replace />;
    case 'AGENT':
      return <Navigate to="/agent-dashboard" replace />;
    case 'CLIENT':
    default:
      return <Navigate to="/client-dashboard" replace />;
  }
}