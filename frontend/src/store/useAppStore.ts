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
  deleteFinancialYear: (yearId: string) => void;
  deleteCompany: (companyId: string) => void;

  getActiveYearData: () => FullYearData;
  updateActiveYearAuditData: (updater: (draft: AuditReportData) => void) => void;
  updateActiveYearNotesData: (updater: (draft: N4_13_State) => void) => void;
}

export const getDefaultAuditData = (): AuditReportData => {
  const currentYear = new Date().getFullYear();
  return {
    company: 'New Company',
    addr: 'Address',
    date: new Date().toLocaleDateString(),
    reportingDate: `${currentYear}-06-30`,
    startDate: `${currentYear - 1}-07-01`,
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
        asAtDate: `30 June ${currentYear}`,
        yearStart: `01 Jul ${String(currentYear - 1).slice(2)}`,
        yearEnd: `30 June ${String(currentYear).slice(2)}`
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
  };
};

export const getDefaultNotesData = (): N4_13_State => {
  const currentYear = new Date().getFullYear();
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
      reportingDateLabel: `30 June ${currentYear}`,
      priorDateLabel: `30 June ${currentYear - 1}`,
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
          // Snapshot the PREVIOUS year's data for carry-forward reference
          const prevData: FullYearData = JSON.parse(JSON.stringify(lastYear.data));

          // Start with fresh defaults for the NEW year's data entry
          newData = {
            auditData: getDefaultAuditData(),
            notesData: getDefaultNotesData()
          };

          // 1. Update dates for continuity
          newData.auditData.reportingDate = reportingDate;
          newData.auditData.startDate = lastYear.reportingDate;
          newData.notesData.company.reportingDateLabel = new Date(reportingDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
          newData.notesData.company.priorDateLabel = prevData.notesData.company.reportingDateLabel;

          // 2. Carry forward company info
          newData.notesData.company.companyName = prevData.notesData.company.companyName;
          newData.notesData.company.address = prevData.notesData.company.address;
          newData.auditData.company = prevData.auditData.company;
          newData.auditData.addr = prevData.auditData.addr;

          // 3. For every section: clone prev so dynamic rows are kept, move prev CY -> new PY, new CY stays 0
          newData.notesData.sections = JSON.parse(JSON.stringify(prevData.notesData.sections));
          newData.notesData.sections.forEach(newSection => {
            newSection.rows.forEach(newRow => {
              newRow.value_py = newRow.value_cy;
              newRow.value_cy = 0;
            });
          });

          // 4. Explicit Opening Balance Carry-Forward (Closing of prev year → Opening of new year)
          // Intentionally skipped: Users prefer a globally fresh zeroed Current Year. 
          // Opening balances will be manually inputted or driven by the UI trial balance instead to prevent cascading auto-fills confusing the SFP/PNL.

          // 5. PPE Asset Carry-Forward (Closing Cost/Dep → new Opening)
          // Preserve asset list structure from previous year
          const parsePpeValue = (v: string) => parseFloat(String(v || '').replace(/,/g, '')) || 0;
          
          newData.auditData.ppe.assets = prevData.auditData.ppe.assets.map(lastAsset => {
            const co = parsePpeValue(lastAsset.costOpening);
            const ca = parsePpeValue(lastAsset.costAddition);
            const cd = parsePpeValue(lastAsset.costDisposal);
            const costClosing = co + ca - cd;

            const do_ = parsePpeValue(lastAsset.depOpening);
            const dc = parsePpeValue(lastAsset.depCharged);
            const da = parsePpeValue(lastAsset.depAdjustment);
            const depClosing = do_ + dc + da;

            return {
              ...lastAsset,
              costOpening: costClosing ? costClosing.toString() : '',
              costAddition: '',
              costDisposal: '',
              depOpening: depClosing ? depClosing.toString() : '',
              depCharged: '',
              depAdjustment: '',
            };
          });

          // Update PPE header dates
          const repYear = new Date(reportingDate).getFullYear();
          newData.auditData.ppe.headerInfo = {
            ...prevData.auditData.ppe.headerInfo,
            asAtDate: `30 June ${repYear}`,
            yearStart: `01 Jul ${String(repYear - 1).slice(2)}`,
            yearEnd: `30 June ${String(repYear).slice(2)}`,
          };

          // Calculate totals from the previous year's assets to serve as the new Comparative (Previous) Year Row
          const prevPPETotals = prevData.auditData.ppe.assets.reduce((t, asset) => {
            const co = parseFloat(String(asset.costOpening).replace(/,/g, '')) || 0;
            const ca = parseFloat(String(asset.costAddition).replace(/,/g, '')) || 0;
            const cd = parseFloat(String(asset.costDisposal).replace(/,/g, '')) || 0;
            const do_ = parseFloat(String(asset.depOpening).replace(/,/g, '')) || 0;
            const dc = parseFloat(String(asset.depCharged).replace(/,/g, '')) || 0;
            const da = parseFloat(String(asset.depAdjustment).replace(/,/g, '')) || 0;
            return {
              costOpening: t.costOpening + co,
              costAddition: t.costAddition + ca,
              costDisposal: t.costDisposal + cd,
              depOpening: t.depOpening + do_,
              depCharged: t.depCharged + dc,
              depAdjustment: t.depAdjustment + da
            };
          }, { costOpening: 0, costAddition: 0, costDisposal: 0, depOpening: 0, depCharged: 0, depAdjustment: 0 });

          newData.auditData.ppe.prevYearData = {
            costOpening: prevPPETotals.costOpening ? prevPPETotals.costOpening.toString() : '',
            costAddition: prevPPETotals.costAddition ? prevPPETotals.costAddition.toString() : '',
            costDisposal: prevPPETotals.costDisposal ? prevPPETotals.costDisposal.toString() : '',
            depOpening: prevPPETotals.depOpening ? prevPPETotals.depOpening.toString() : '',
            depCharged: prevPPETotals.depCharged ? prevPPETotals.depCharged.toString() : '',
            depAdjustment: prevPPETotals.depAdjustment ? prevPPETotals.depAdjustment.toString() : ''
          };

          // Carry forward NotesData PPE
          newData.notesData.ppe = {
            costClosing_cy: 0,
            costOpening_py: prevData.notesData.ppe.costClosing_cy,
            depClosing_cy: 0,
            depOpening_py: prevData.notesData.ppe.depClosing_cy,
            totalDepCharged_cy: 0,
            adminDep_cy: 0,
            taxBase_cy: 0,
          };

          // 6. Table Carry-Forward: Bank Accounts (CY → PY, reset CY)
          newData.notesData.bankAccounts = prevData.notesData.bankAccounts.map(acc => ({
            ...acc,
            value_py: acc.value_cy,
            value_cy: 0,
          }));

          // 7. Table Carry-Forward: Loans (CY totals → PY, reset CY)
          newData.notesData.loans = prevData.notesData.loans.map(loan => ({
            ...loan,
            total_py: loan.nonCurrent_cy + loan.current_cy,
            nonCurrent_cy: 0,
            current_cy: 0,
          }));

          // 8. Table Carry-Forward: UPAS (CY totals → PY, reset CY)
          newData.notesData.upasEntries = prevData.notesData.upasEntries.map(upas => ({
            ...upas,
            total_py: upas.nonCurrent_cy + upas.current_cy,
            nonCurrent_cy: 0,
            current_cy: 0,
          }));

          // 9. Carry forward shareholders list (structural, no values to reset)
          newData.notesData.shareholders = JSON.parse(JSON.stringify(prevData.notesData.shareholders));

          // 10. Carry forward configs
          newData.notesData.shareConfig = { ...prevData.notesData.shareConfig };
          newData.notesData.taxConfig = { ...prevData.notesData.taxConfig };

          // 11. Recalculate all formulas with the new carried-forward data
          recalculate(newData.notesData);

        } else {

          newData = {
            auditData: getDefaultAuditData(),
            notesData: getDefaultNotesData()
          };
          newData.auditData.reportingDate = reportingDate;
          newData.notesData.company.reportingDateLabel = new Date(reportingDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
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

      deleteFinancialYear: (yearId: string) => set(state => {
        const { currentUserId, activeCompanyId, activeYearId } = state;
        if (!currentUserId || !activeCompanyId) return;
        const user = state.users.find(u => u.id === currentUserId);
        const company = user?.companies.find(c => c.id === activeCompanyId);
        if (!company) return;
        company.financialYears = company.financialYears.filter(y => y.id !== yearId);
        if (activeYearId === yearId) state.activeYearId = null;
      }),

      deleteCompany: (companyId: string) => set(state => {
        const { currentUserId, activeCompanyId } = state;
        if (!currentUserId) return;
        const user = state.users.find(u => u.id === currentUserId);
        if (!user) return;
        user.companies = user.companies.filter(c => c.id !== companyId);
        if (activeCompanyId === companyId) {
          state.activeCompanyId = null;
          state.activeYearId = null;
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
