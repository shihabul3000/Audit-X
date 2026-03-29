/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Tab } from './types';
import { useAuditData } from './hooks/useAuditData';
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

function AppContent() {
  const { data, updateData, isLoaded } = useAuditData();
  const location = useLocation();
  const navigate = useNavigate();

  const tabs: Tab[] = ['Cover', 'SFP', 'PNL', 'SCE', 'SCF', 'P_Discussion', 'N4-13', 'PPE'];
  
  // Extract the current tab from the URL path. E.g., "/sfp" -> "SFP". Default to "Cover".
  const currentPath = location.pathname.split('/')[1];
  const activeTabMatch = tabs.find(t => t.toLowerCase() === currentPath.toLowerCase());
  const activeTab: Tab = activeTabMatch || 'Cover';

  if (!isLoaded) {
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
    navigate(`/${tab.toLowerCase()}`);
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
            <Routes location={location}>
              <Route path="/" element={<Navigate to="/cover" replace />} />
              <Route path="/cover" element={<Cover data={data} onUpdate={updateData} />} />
              <Route path="/sfp" element={<SFP data={data} />} />
              <Route path="/pnl" element={<PNL data={data} />} />
              <Route path="/sce" element={<SCE data={data} />} />
              <Route path="/scf" element={<SCF data={data} />} />
              <Route path="/p_discussion" element={<P_Discussion data={data} onUpdate={updateData} />} />
              <Route path="/n4-13" element={<N4_13 data={data} />} />
              <Route path="/ppe" element={<PPE data={data} onUpdate={updateData} />} />
              <Route path="*" element={<PlaceholderTab tabName={activeTab} />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation Bar */}
      <Navigation 
        tabs={tabs} 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
