import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/stores/store';

interface ProtectedRouteProps {
  requiredRoles: (string | number)[];
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredRoles,
  children,
}) => {
  // Get user roles from store
  const roles = useSelector((state: RootState) => state.auth.user?.role || []);

  // Normalize roles to an array (empty array if undefined)
  const userRoles = Array.isArray(roles) ? roles : roles ? [roles] : [];

  // Check if user has any of the required roles
  const isAuthorized = userRoles.some((role) => requiredRoles.includes(role));

  if (!isAuthorized) {
    // Redirect to unauthorized page if role check fails
    return <Navigate to="/unauthorized" replace />;
  }

  // Otherwise render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
