import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';

/**
 * ProtectedRoute — wraps any route that requires authentication.
 * If the user is not logged in, redirects to /login preserving the intended path.
 */
export default function ProtectedRoute() {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
