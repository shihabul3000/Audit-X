'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  activeCompanyId: string | null;
  activeYearId: string | null;
  setActiveCompany: (id: string | null) => void;
  setActiveYear: (id: string | null) => void;
  clearActive: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      activeCompanyId: null,
      activeYearId: null,
      setActiveCompany: (id) => set({ activeCompanyId: id, activeYearId: null }),
      setActiveYear: (id) => set({ activeYearId: id }),
      clearActive: () => set({ activeCompanyId: null, activeYearId: null }),
    }),
    { name: 'audit-x-ui-state' }
  )
);
