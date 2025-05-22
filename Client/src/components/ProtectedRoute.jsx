// src/components/ProtectedRoute.js
import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!user) {
    // Redirect to login page with the return location
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;