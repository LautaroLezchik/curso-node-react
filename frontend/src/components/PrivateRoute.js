import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import your AuthContext

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth(); // Get auth status and loading from context

  // While the auth state is being determined (e.g., checking localStorage)
  if (loading) {
    return <div>Loading authentication...</div>; // Or a spinner component
  }

  // If authenticated, render the child routes/components
  // Outlet is used when this component acts as a layout/wrapper for nested routes
  // If not authenticated, redirect to the login page
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;