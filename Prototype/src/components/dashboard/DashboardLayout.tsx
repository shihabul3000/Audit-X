import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Sidebar } from './Sidebar';

export const DashboardLayout: React.FC = () => {
  const currentUserId = useAppStore(state => state.currentUserId);

  if (!currentUserId) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="flex h-screen w-full bg-[#121212] overflow-hidden font-sans">
      <Sidebar />
      <Outlet />
    </div>
  );
};
