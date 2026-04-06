

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Tab } from './types';
import { useAuditData } from './hooks/useAuditData';
import { useGlobalStoreSync } from './hooks/useGlobalStoreSync';
import { Navigation } from './components/Navigation';
import { Cover } from './components/tabs/Cover';
import { SFP } from './components/tabs/SFP';
import { PNL } from './components/tabs/PNL';
import { SCE } from './components/tabs/SCE';
import { SCF } from './components/tabs/SCF';
import { N4_13 } from './components/tabs/N4_13';
import { PPE } from './components/tabs/PPE';
import { P_Discussion } from './components/tabs/P_Discussion';
import { PlaceholderTab } from './components/tabs/PlaceholderTab';

import { LandingPage } from './components/landing/LandingPage';
import { AuthPage } from './components/auth/AuthPage';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { CompanyDashboard } from './components/dashboard/CompanyDashboard';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { SuperAdminDashboard } from './components/dashboard/SuperAdminDashboard';
import { useAppStore, authSelectors, permissionSelectors } from './store/useAppStore';
import { AlertCircle } from 'lucide-react';

function AppContent() {
  const { data, updateData, isLoaded } = useAuditData();
  useGlobalStoreSync(data); // Ensures global sync runs continuously
  const activeYearId = useAppStore(state => state.activeYearId);
  const activeCompanyId = useAppStore(state => state.activeCompanyId);
  const companies = useAppStore(state => state.companies);
  const currentUser = useAppStore(authSelectors.getCurrentUser);

  const location = useLocation();
  const navigate = useNavigate();

  const tabs: Tab[] = ['Cover', 'SFP', 'PNL', 'SCE', 'SCF', 'P_Discussion', 'N4-13', 'PPE'];

  // Navigate back to dashboard if they reach /fs without selecting a year
  useEffect(() => {
    if (!activeYearId) {
      navigate('/dashboard', { replace: true });
    }
  }, [activeYearId, navigate]);

  if (!activeYearId) {
    return null; // Prevents render glitch before redirect
  }

  if (currentUser?.status === 'banned') {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full bg-[#121212] text-white">
         <AlertCircle size={48} className="text-red-500 mb-4" />
         <h1 className="text-2xl font-bold">Account Suspended</h1>
         <p className="text-gray-400 mt-2">You have been banned from the platform.</p>
         <button onClick={() => navigate('/dashboard')} className="mt-6 text-blue-400">Return to Dashboard</button>
      </div>
    );
  }

  const activeCompany = companies.find(c => c.id === activeCompanyId);
  const activeYear = activeCompany?.financialYears.find(y => y.id === activeYearId);
  const canEdit = permissionSelectors.canEditFinancialYear(currentUser, activeYear ?? null);

  // Extract the current tab from the URL path. E.g., "/fs/sfp" -> "sfp". Default to "cover".
  const currentPath = location.pathname.split('/')[2];
  const activeTabMatch = tabs.find(t => t.toLowerCase() === currentPath?.toLowerCase());
  const activeTab: Tab = activeTabMatch || 'Cover';

  if (!isLoaded || !data) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-[#808080] text-white font-serif">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading Audit Report Data...</p>
        </div>
      </div>
    );
  }

  const handleTabChange = (tab: Tab) => {
    navigate(`/fs/${tab.toLowerCase()}`);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#808080] overflow-hidden font-sans">
      {!canEdit && activeYear && (
         <div className="bg-amber-500/90 text-amber-950 px-4 py-2 text-sm font-semibold flex items-center justify-center z-50 shadow-md">
           <AlertCircle size={16} className="mr-2" />
           {activeYear.isLocked 
              ? 'This financial year is locked and finalized. Editing is disabled.' 
              : `This financial year is marked as ${activeYear.reviewStatus.replace('_', ' ')}. Editing is disabled.`}
         </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`h-full w-full ${!canEdit ? 'pointer-events-none' : ''}`}
          >
            <Routes>
              <Route path="/" element={<Navigate to="cover" replace />} />
              <Route path="cover" element={<Cover data={data} onUpdate={updateData} />} />
              <Route path="sfp" element={<SFP data={data} />} />
              <Route path="pnl" element={<PNL data={data} />} />
              <Route path="sce" element={<SCE data={data} />} />
              <Route path="scf" element={<SCF data={data} />} />
              <Route path="p_discussion" element={<P_Discussion data={data} onUpdate={updateData} />} />
              <Route path="n4-13" element={<N4_13 data={data} />} />
              <Route path="ppe" element={<PPE data={data} onUpdate={updateData} />} />
              <Route path="*" element={<PlaceholderTab tabName={activeTab} />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation Bar */}
      <div className="relative">
        <Navigation tabs={tabs} activeTab={activeTab} setActiveTab={handleTabChange} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="my-companies" replace />} />
          <Route path="my-companies" element={<CompanyDashboard />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="system" element={<SuperAdminDashboard />} />
        </Route>
        <Route path="/fs/*" element={<AppContent />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
