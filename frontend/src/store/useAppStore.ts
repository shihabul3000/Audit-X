import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';

import { AuditReportData } from '../types';
import { Store as N4_13_State } from '../components/tabs/N4_13/types';
import { buildInitialSections } from '../components/tabs/N4_13/sections';
import { recalculate } from '../components/tabs/N4_13/recalculate';

export interface User {
  id: string;
  name: string;
  email: string;
  profileImg?: string;
  companies: Company[];
}

export interface Company {
  id: string;
  name: string;
  financialYears: FinancialYear[];
}

export interface FullYearData {
  auditData: AuditReportData;
  notesData: N4_13_State;
}

export interface FinancialYear {
  id: string;
  year: number; // e.g., 2024, 2025, 2026
  reportingDate: string; // e.g., "2026-06-30"
  status: "in-progress" | "completed";
  data: FullYearData;
}

export interface AppState {
  users: User[];
  currentUserId: string | null;
  activeCompanyId: string | null;
  activeYearId: string | null;

  login: (email: string) => void;
  register: (name: string, email: string) => void;
  logout: () => void;

  createCompany: (name: string) => void;
  updateCompany: (id: string, newName: string) => void;
  setActiveCompany: (id: string | null) => void;

  startNewYear: (reportingDate: string) => void;
  setActiveYear: (id: string | null) => void;
  markYearCompleted: (id?: string) => void;

  getActiveYearData: () => FullYearData;
  updateActiveYearAuditData: (updater: (draft: AuditReportData) => void) => void;
  updateActiveYearNotesData: (updater: (draft: N4_13_State) => void) => void;
}

export const getDefaultAuditData = (): AuditReportData => ({
  company: 'New Company',
  addr: 'Address',
  date: new Date().toLocaleDateString(),
  reportingDate: '2025-06-30',
  startDate: '2024-07-01',
  ppe: {
    assets: [
      { id: '1', particular: "Buildings", statementHead: "Buildings", costOpening: '', costAddition: '', costDisposal: '', rate: '', depOpening: '', depCharged: '', depAdjustment: '' },
      { id: '2', particular: "Machinery", statementHead: "Plant & machineries", costOpening: '', costAddition: '', costDisposal: '', rate: '', depOpening: '', depCharged: '', depAdjustment: '' },
      { id: '3', particular: "Furniture and fixtures", statementHead: "Furniture & Fixture", costOpening: '', costAddition: '', costDisposal: '', rate: '', depOpening: '', depCharged: '', depAdjustment: '' },
      { id: '4', particular: "Office equipment", statementHead: "Office equipment", costOpening: '', costAddition: '', costDisposal: '', rate: '', depOpening: '', depCharged: '', depAdjustment: '' }
    ],
    headerInfo: {
      reportTitle: "Property, plant and equipment",
      annexure: "Annexure A",
      asAtDate: "30 June 2025",
      yearStart: "01 Jul 24",
      yearEnd: "30 June 25"
    },
    prevYearData: {
      costOpening: '', costAddition: '', costDisposal: '',
      depOpening: '', depCharged: '', depAdjustment: ''
    },
    breakdown: {
      adminExpense: '0',
      costOfSalesLabel: 'Cost of sales',
      adminExpenseLabel: 'Administrative expense'
    }
  },
  discussionData: {
    docStatuses: {},
    values: {}
  }
});

export const getDefaultNotesData = (): N4_13_State => {
  // Mock N4_13 actions as empty, they shouldn't be used directly from state here,
  // We use `updateActiveYearNotesData` instead. 
  // We cast as any because functions cannot be easily serialized in localStorage anyway,
  // but Zustand will just drop them or preserve reference. 
  // It's cleaner to remove the functions from N4_13_State in the long run,
  // but for backward compatibility, we can leave them out of the persisted state if we want.
  return {
    company: {
      companyName: 'New Company Ltd.',
      address: 'Dhaka, Bangladesh',
      reportingDateLabel: '30 June 2025',
      priorDateLabel: '30 June 2024',
      currency: 'BDT',
    },
    ppe: {
      costClosing_cy: 0, costOpening_py: 0,
      depClosing_cy: 0, depOpening_py: 0,
      totalDepCharged_cy: 0, adminDep_cy: 0, taxBase_cy: 0,
    },
    shareConfig: { authorizedShares: 10000000, authorizedFaceValue: 10, issuedShares: 1000000, issuedFaceValue: 10 },
    taxConfig: { rateOnRevenue_cy: 0.01, rateOnRevenue_py: 0.006, rateOnIncome_cy: 0.275, rateOnIncome_py: 0.275 },
    shareholders: [],
    bankAccounts: [],
    loans: [],
    upasEntries: [],
    sections: buildInitialSections(),
  } as N4_13_State;
};


export const useAppStore = create<AppState>()(
  persist(
    immer((set, get) => ({
      users: [],
      currentUserId: null,
      activeCompanyId: null,
      activeYearId: null,

      login: (email: string) => set(state => {
        const user = state.users.find(u => u.email === email);
        if (user) {
          state.currentUserId = user.id;
          state.activeCompanyId = null;
          state.activeYearId = null;
        } else {
          throw new Error('User not found');
        }
      }),

      register: (name: string, email: string) => set(state => {
        if (state.users.some(u => u.email === email)) {
          throw new Error('User already exists');
        }
        const newUser: User = { id: uuidv4(), name, email, companies: [] };
        state.users.push(newUser);
        state.currentUserId = newUser.id;
        state.activeCompanyId = null;
        state.activeYearId = null;
      }),

      logout: () => set(state => {
        state.currentUserId = null;
        state.activeCompanyId = null;
        state.activeYearId = null;
      }),

      createCompany: (name: string) => set(state => {
        const { currentUserId } = state;
        if (!currentUserId) return;
        const user = state.users.find(u => u.id === currentUserId);
        if (!user) return;
        
        const newCompany: Company = {
          id: uuidv4(),
          name,
          financialYears: []
        };
        user.companies.push(newCompany);
        state.activeCompanyId = newCompany.id;
        state.activeYearId = null;
      }),

      updateCompany: (id: string, newName: string) => set(state => {
        const { currentUserId } = state;
        if (!currentUserId) return;
        const user = state.users.find(u => u.id === currentUserId);
        if (!user) return;
        
        const company = user.companies.find(c => c.id === id);
        if (company) {
          company.name = newName;
        }
      }),

      setActiveCompany: (id: string | null) => set(state => {
        state.activeCompanyId = id;
        state.activeYearId = null;
      }),

      startNewYear: (reportingDate: string) => set(state => {
        const { currentUserId, activeCompanyId } = state;
        if (!currentUserId || !activeCompanyId) throw new Error("No active company");

        const user = state.users.find(u => u.id === currentUserId);
        const company = user?.companies.find(c => c.id === activeCompanyId);
        if (!company) throw new Error("Company not found");

        const newYearObj = new Date(reportingDate);
        if (isNaN(newYearObj.getTime())) throw new Error("Invalid reporting date");
        const newYearNumber = newYearObj.getFullYear();

        if (company.financialYears.some(y => y.year === newYearNumber)) {
          throw new Error(`Financial year ${newYearNumber} already exists`);
        }

        const newYearId = uuidv4();
        let newData: FullYearData;

        company.financialYears.sort((a, b) => a.year - b.year);
        
        // Deep copy from the most recent year if exists, else defaults
        if (company.financialYears.length > 0) {
          const lastYear = company.financialYears[company.financialYears.length - 1];
          // Use structured clone as requested
          newData = structuredClone(lastYear.data);
          
          // Modify some parameters for the copied data
          newData.auditData.reportingDate = reportingDate;
          newData.notesData.company.reportingDateLabel = new Date(reportingDate).toLocaleDateString();
        } else {
          newData = {
            auditData: getDefaultAuditData(),
            notesData: getDefaultNotesData()
          };
          newData.auditData.reportingDate = reportingDate;
          newData.notesData.company.reportingDateLabel = new Date(reportingDate).toLocaleDateString();
        }

        const newFinYear: FinancialYear = {
          id: newYearId,
          year: newYearNumber,
          reportingDate,
          status: "in-progress",
          data: newData
        };

        company.financialYears.push(newFinYear);
        company.financialYears.sort((a, b) => a.year - b.year);
        
        state.activeYearId = newYearId;
      }),

      setActiveYear: (id: string | null) => set(state => {
        state.activeYearId = id;
      }),

      markYearCompleted: (id?: string) => set(state => {
        const { currentUserId, activeCompanyId, activeYearId } = state;
        const targetId = id || activeYearId;
        if (!currentUserId || !activeCompanyId || !targetId) return;

        const user = state.users.find(u => u.id === currentUserId);
        const company = user?.companies.find(c => c.id === activeCompanyId);
        const year = company?.financialYears.find(y => y.id === targetId);
        
        if (year) {
          year.status = "completed";
        }
      }),

      getActiveYearData: () => {
        const state = get();
        const user = state.users.find(u => u.id === state.currentUserId);
        const company = user?.companies.find(c => c.id === state.activeCompanyId);
        const year = company?.financialYears.find(y => y.id === state.activeYearId);
        if (!year) throw new Error("No active financial year selected");
        return year.data;
      },

      updateActiveYearAuditData: (updater: (draft: AuditReportData) => void) => set(state => {
        const { currentUserId, activeCompanyId, activeYearId } = state;
        const user = state.users.find(u => u.id === currentUserId);
        const company = user?.companies.find(c => c.id === activeCompanyId);
        const year = company?.financialYears.find(y => y.id === activeYearId);
        if (year) {
          updater(year.data.auditData);
        }
      }),

      updateActiveYearNotesData: (updater: (draft: N4_13_State) => void) => set(state => {
        const { currentUserId, activeCompanyId, activeYearId } = state;
        const user = state.users.find(u => u.id === currentUserId);
        const company = user?.companies.find(c => c.id === activeCompanyId);
        const year = company?.financialYears.find(y => y.id === activeYearId);
        if (year) {
          updater(year.data.notesData);
          recalculate(year.data.notesData); // We trigger the recalculate logic directly on the draft
        }
      })
    })),
    {
      name: 'audit-x-platform-storage', // The master key in localStorage
    }
  )
);
