import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireHost?: boolean;
  requireApprovedHost?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requireHost = false,
  requireApprovedHost = false,
}) => {
  const { user, userProfile, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-light-sand via-creamy-white to-golden-yellow/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-deep-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-warm-gray">Loading...</p>
        </div>
      </div>
    );
  }

  // For pages that don't require auth, just render children
  if (!requireAuth && !requireHost && !requireApprovedHost) {
    return <>{children}</>;
  }

  // Check if user is authenticated
  if (requireAuth && !user) {
    const redirectPath = location.pathname + location.search;
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirectPath)}`} replace />;
  }

  // Check if user profile is loaded (needed for role checks)
  if ((requireHost || requireApprovedHost) && !userProfile) {
    // If user exists but profile is not loaded, show loading
    if (user) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-light-sand via-creamy-white to-golden-yellow/20 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-deep-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-warm-gray">Loading profile...</p>
          </div>
        </div>
      );
    }
    
    // No user, redirect to login
    const redirectPath = location.pathname + location.search;
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirectPath)}`} replace />;
  }

  // Check if user needs to be a host
  if (requireHost && !userProfile?.is_host) {
    return <Navigate to="/dashboard?error=host-approval-pending" replace />;
  }

  // Check if user needs to be an approved host
  if (requireApprovedHost && (!userProfile?.is_host || !userProfile?.is_approved_host)) {
    return <Navigate to="/settings?showHostApplication=true" replace />;
  }

  // All checks passed, render children
  return <>{children}</>;
};

export default ProtectedRoute;