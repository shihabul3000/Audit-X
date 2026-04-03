/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
import { useAppStore } from './store/useAppStore';

function AppContent() {
  const { data, updateData, isLoaded } = useAuditData();
  useGlobalStoreSync(data); // Ensures global sync runs continuously
  const activeYearId = useAppStore(state => state.activeYearId);

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
      {/* Main Content Area */}
      <main className="flex-1 relative overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full w-full"
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
        <Route path="/dashboard" element={<DashboardLayout />} />
        <Route path="/fs/*" element={<AppContent />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
