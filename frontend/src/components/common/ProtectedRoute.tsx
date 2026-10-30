import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, normalizeRole } from '@/context/AuthContext';
import { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-[#4779B8]/20 border-t-[#4779B8] rounded-full animate-spin" />
        <span className="text-sm font-medium text-[#356F9D]">Verifying academic session...</span>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const role = normalizeRole(user.role);

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect strictly to their authorized home
    if (role === 'STUDENT') return <Navigate to="/student/dashboard" replace />;
    if (role === 'COMPANY') return <Navigate to="/company/dashboard" replace />;
    if (role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
