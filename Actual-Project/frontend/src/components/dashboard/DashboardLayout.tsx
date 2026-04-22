import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Sidebar } from './Sidebar';
import { authService } from '../../services/auth.service';

export const DashboardLayout: React.FC = () => {
  const currentUser = useAppStore(state => state.currentUser);
  const isAuthChecked = useAppStore(state => state.isAuthChecked);
  const setCurrentUser = useAppStore(state => state.setCurrentUser);
  const clearAuth = useAppStore(state => state.clearAuth);
  const fetchCompanies = useAppStore(state => state.fetchCompanies);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    
    const checkAuth = async () => {
      try {
        const response = await authService.getMe();
        if (mounted) {
          setCurrentUser({
            ...response.data,
            assignedCompanyIds: response.data.assignedCompanyIds || [],
            notifications: response.data.notifications || [],
          });
          fetchCompanies();
        }
      } catch (error) {
        if (mounted) {
          clearAuth();
        }
      }
    };

    if (!isAuthChecked) {
      checkAuth();
    }
    
    return () => {
      mounted = false;
    };
  }, [isAuthChecked, setCurrentUser, clearAuth]);

  // Always fetch companies when user is authenticated (covers the case where
  // login already set isAuthChecked=true, so checkAuth above was skipped)
  useEffect(() => {
    if (currentUser) {
      fetchCompanies();
    }
  }, [currentUser?.id]);

  if (!isAuthChecked) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-[#121212] flex-col text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p>Loading Audit-X...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return (
    <div className="flex h-screen w-full bg-[#121212] overflow-hidden font-sans">
      <Sidebar />
      <Outlet />
    </div>
  );
};
