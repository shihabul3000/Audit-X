import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';

import { AuditReportData } from '../types';
import { Store as N4_13_State } from '../components/tabs/N4_13/types';
import { buildInitialSections } from '../components/tabs/N4_13/sections';
import { recalculate } from '../components/tabs/N4_13/recalculate';

export type UserRole = 'student' | 'admin' | 'super_admin';

export interface UserNotification {
  id: string;
  type: 'assignment' | 'review_submitted' | 'changes_requested' | 'finalized' | 'ban' | 'unban' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedCompanyId?: string;
  relatedYearId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  profileImg?: string;
  role: UserRole;
  status: 'active' | 'banned' | 'deleted';
  bannedReason?: string;
  bannedByUserId?: string;
  
  assignedCompanyIds: string[];
  assignedStudentIds?: string[];
  assignedAdminIds?: string[];
  notifications: UserNotification[];
}

export type ReviewStatus = 'draft' | 'submitted' | 'under_review' | 'changes_requested' | 'finalized';

export interface ReviewEvent {
  id: string;
  type: 'created' | 'submitted' | 'under_review' | 'changes_requested' | 'finalized' | 'reopened';
  actorUserId: string;
  actorRole: UserRole | string;
  note?: string;
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  createdByUserId: string;
  financialYears: FinancialYear[];
}

export interface FullYearData {
  auditData: AuditReportData;
  notesData: N4_13_State;
}

export interface FinancialYear {
  id: string;
  year: number; 
  reportingDate: string; 
  status: 'in-progress' | 'completed';
  reviewStatus: ReviewStatus;
  isLocked: boolean;
  
  createdByUserId: string;
  assignedStudentIds: string[];
  assignedAdminIds: string[];
  
  currentReviewerUserId: string | null;
  finalizedByUserId: string | null;
  finalizedAt: string | null;
  submittedAt: string | null;
  lastEditedByUserId: string | null;
  
  reviewEvents: ReviewEvent[];
  data: FullYearData;
}

export interface AppState {
  users: User[]; // Will be deprecated once user.service handles UI list
  companies: Company[]; // Will be deprecated once company.service handles UI list
  currentUser: User | null;
  isAuthChecked: boolean;
  activeCompanyId: string | null;
  activeYearId: string | null;

  setCurrentUser: (user: User) => void;
  clearAuth: () => void;
  logout: () => Promise<void>;
  
  fetchCompanies: () => Promise<void>;

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

  // New RBAC & Review Actions
  createUser: (name: string, email: string, role: UserRole) => void;
  updateUserRole: (userId: string, role: UserRole) => void;
  banUser: (userId: string, reason?: string) => void;
  unbanUser: (userId: string) => void;
  softDeleteUser: (userId: string) => void;
  assignStudentToAdmin: (studentId: string, adminId: string) => void;
  unassignStudentFromAdmin: (studentId: string, adminId: string) => void;
  assignCompanyToUser: (userId: string, companyId: string) => void;
  unassignCompanyFromUser: (userId: string, companyId: string) => void;
  submitFinancialYear: (yearId: string, note?: string) => void;
  startFinancialYearReview: (yearId: string) => void;
  requestFinancialYearChanges: (yearId: string, note?: string) => void;
  finalizeFinancialYear: (yearId: string, note?: string) => void;
  reopenFinancialYear: (yearId: string, note?: string) => void;
  markNotificationRead: (notificationId: string) => void;
  pushNotification: (userId: string, notification: Omit<UserNotification, 'id' | 'createdAt' | 'read'>) => void;
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
        { id: '1', particular: 'Buildings', statementHead: 'Buildings', costOpening: '', costAddition: '', costDisposal: '', rate: '', depOpening: '', depCharged: '', depAdjustment: '' },
        { id: '2', particular: 'Machinery', statementHead: 'Plant & machineries', costOpening: '', costAddition: '', costDisposal: '', rate: '', depOpening: '', depCharged: '', depAdjustment: '' },
        { id: '3', particular: 'Furniture and fixtures', statementHead: 'Furniture & Fixture', costOpening: '', costAddition: '', costDisposal: '', rate: '', depOpening: '', depCharged: '', depAdjustment: '' },
        { id: '4', particular: 'Office equipment', statementHead: 'Office equipment', costOpening: '', costAddition: '', costDisposal: '', rate: '', depOpening: '', depCharged: '', depAdjustment: '' }
      ],
      headerInfo: {
        reportTitle: 'Property, plant and equipment',
        annexure: 'Annexure A',
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

export const authSelectors = {
  getCurrentUser: (state: AppState) => state.currentUser,
  isBanned: (user: User | null) => user?.status === 'banned',
  isSuperAdmin: (user: User | null) => user?.role === 'SUPER_ADMIN' || user?.role === 'super_admin',
  isAdmin: (user: User | null) => user?.role === 'ADMIN' || user?.role === 'admin',
  isStudent: (user: User | null) => !user || user.role === 'STUDENT' || user.role === 'student',
};

export const permissionSelectors = {
  canAccessCompany: (user: User | null, company: Company | null) => {
    if (!user || user.status === 'banned' || !company) return false;
    if (user.role === 'super_admin') return true;
    if (user.role === 'admin') return true; // Could scope to assigned admin
    return user.assignedCompanyIds.includes(company.id) || company.createdByUserId === user.id;
  },

  canEditFinancialYear: (user: User | null, year: FinancialYear | null) => {
    if (!user || user.status === 'banned' || !year) return false;
    if (year.isLocked) return false;
    
    if (user.role === 'super_admin') return true;
    if (user.role === 'admin') return true; // Admins can edit accessible ones

    if (user.role === 'student') {
      return year.assignedStudentIds.includes(user.id) || year.createdByUserId === user.id;
    }
    return false;
  },

  canFinalizeFinancialYear: (user: User | null, year: FinancialYear | null) => {
     if (!user || user.status === 'banned' || !year) return false;
     return user.role === 'super_admin' || user.role === 'admin';
  }
};

export const useAppStore = create<AppState>()(
  persist(
    immer((set, get) => ({
      users: [],
      companies: [],
      currentUser: null,
      isAuthChecked: false,
      activeCompanyId: null,
      activeYearId: null,

      setCurrentUser: (user: User) => set(state => {
        state.currentUser = user;
        state.isAuthChecked = true;
      }),

      clearAuth: () => set(state => {
        state.currentUser = null;
        state.isAuthChecked = true;
        state.activeCompanyId = null;
        state.activeYearId = null;
      }),

      logout: async () => {
        try {
          const { authService } = await import('../services/auth.service');
          await authService.logout();
        } catch (e) {
          // Ignore logout API failures
        }
        set(state => {
          state.currentUser = null;
          state.isAuthChecked = true;
          state.activeCompanyId = null;
          state.activeYearId = null;
        });
      },

      fetchCompanies: async () => {
        try {
          const { companyService } = await import('../services/company.service');
          const response = await companyService.getAll();
          set(state => {
            state.companies = response.data.data;
          });
        } catch (error) {
          console.error("Failed to fetch companies:", error);
        }
      },

      createCompany: (name: string) => set(state => {
        const currentUserId = state.currentUser?.id;
        if (!currentUserId) return;
        
        const newCompany: Company = {
          id: uuidv4(),
          name,
          createdByUserId: currentUserId,
          financialYears: []
        };
        state.companies.push(newCompany);

        const user = state.users.find(u => u.id === currentUserId);
        if (user) {
           user.assignedCompanyIds.push(newCompany.id);
        }

        state.activeCompanyId = newCompany.id;
        state.activeYearId = null;
      }),

      updateCompany: (id: string, newName: string) => set(state => {
        const company = state.companies.find(c => c.id === id);
        if (company) {
          company.name = newName;
        }
      }),

      setActiveCompany: (id: string | null) => set(state => {
        state.activeCompanyId = id;
        state.activeYearId = null;
      }),

      startNewYear: (reportingDate: string) => set(state => {
        const currentUserId = state.currentUser?.id;
        const { activeCompanyId } = state;
        if (!currentUserId || !activeCompanyId) throw new Error('No active company');

        const company = state.companies.find(c => c.id === activeCompanyId);
        if (!company) throw new Error('Company not found');

        const newYearObj = new Date(reportingDate);
        if (isNaN(newYearObj.getTime())) throw new Error('Invalid reporting date');
        const newYearNumber = newYearObj.getFullYear();

        if (company.financialYears.some(y => y.year === newYearNumber)) {
          throw new Error(`Financial year ${newYearNumber} already exists`);
        }

        const newYearId = uuidv4();
        let newData: FullYearData;

        company.financialYears.sort((a, b) => a.year - b.year);

        if (company.financialYears.length > 0) {
          const lastYear = company.financialYears[company.financialYears.length - 1];
          const prevData: FullYearData = JSON.parse(JSON.stringify(lastYear.data));

          newData = {
            auditData: getDefaultAuditData(),
            notesData: getDefaultNotesData()
          };

          newData.auditData.reportingDate = reportingDate;
          newData.auditData.startDate = lastYear.reportingDate;
          newData.notesData.company.reportingDateLabel = new Date(reportingDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
          newData.notesData.company.priorDateLabel = prevData.notesData.company.reportingDateLabel;

          newData.notesData.company.companyName = prevData.notesData.company.companyName;
          newData.notesData.company.address = prevData.notesData.company.address;
          newData.auditData.company = prevData.auditData.company;
          newData.auditData.addr = prevData.auditData.addr;

          newData.notesData.sections = JSON.parse(JSON.stringify(prevData.notesData.sections));
          newData.notesData.sections.forEach(newSection => {
            newSection.rows.forEach(newRow => {
              newRow.value_py = newRow.value_cy;
              newRow.value_cy = 0;
            });
          });

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

          const repYear = new Date(reportingDate).getFullYear();
          newData.auditData.ppe.headerInfo = {
            ...prevData.auditData.ppe.headerInfo,
            asAtDate: `30 June ${repYear}`,
            yearStart: `01 Jul ${String(repYear - 1).slice(2)}`,
            yearEnd: `30 June ${String(repYear).slice(2)}`,
          };

          const prevPPETotals = prevData.auditData.ppe.assets.reduce((t, asset) => {
            const co = parseFloat(String(asset.costOpening).replace(/,/g, '')) || 0;
            const ca = parseFloat(String(asset.costAddition).replace(/,/g, '')) || 0;
            const cd = parseFloat(String(asset.costDisposal).replace(/,/g, '')) || 0;
            const do_ = parseFloat(String(asset.depOpening).replace(/,/g, '')) || 0;
            const dc = parseFloat(String(asset.depCharged).replace(/,/g, '')) || 0;
            const da = parseFloat(String(asset.depAdjustment).replace(/,/g, '')) || 0;
            return {
              costOpening: t.costOpening + co, costAddition: t.costAddition + ca, costDisposal: t.costDisposal + cd,
              depOpening: t.depOpening + do_, depCharged: t.depCharged + dc, depAdjustment: t.depAdjustment + da
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

          newData.notesData.ppe = {
            costClosing_cy: 0, costOpening_py: prevData.notesData.ppe.costClosing_cy,
            depClosing_cy: 0, depOpening_py: prevData.notesData.ppe.depClosing_cy,
            totalDepCharged_cy: 0, adminDep_cy: 0, taxBase_cy: 0,
          };

          newData.notesData.bankAccounts = prevData.notesData.bankAccounts.map(acc => ({ ...acc, value_py: acc.value_cy, value_cy: 0 }));
          newData.notesData.loans = prevData.notesData.loans.map(loan => ({ ...loan, total_py: loan.nonCurrent_cy + loan.current_cy, nonCurrent_cy: 0, current_cy: 0 }));
          newData.notesData.upasEntries = prevData.notesData.upasEntries.map(upas => ({ ...upas, total_py: upas.nonCurrent_cy + upas.current_cy, nonCurrent_cy: 0, current_cy: 0 }));
          newData.notesData.shareholders = JSON.parse(JSON.stringify(prevData.notesData.shareholders));
          newData.notesData.shareConfig = { ...prevData.notesData.shareConfig };
          newData.notesData.taxConfig = { ...prevData.notesData.taxConfig };

          recalculate(newData.notesData);
        } else {
          newData = { auditData: getDefaultAuditData(), notesData: getDefaultNotesData() };
          newData.auditData.reportingDate = reportingDate;
          newData.notesData.company.reportingDateLabel = new Date(reportingDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
        }

        const newFinYear: FinancialYear = {
          id: newYearId,
          year: newYearNumber,
          reportingDate,
          status: 'in-progress',
          reviewStatus: 'draft',
          isLocked: false,
          createdByUserId: currentUserId,
          assignedStudentIds: [],
          assignedAdminIds: [],
          currentReviewerUserId: null,
          finalizedByUserId: null,
          finalizedAt: null,
          submittedAt: null,
          lastEditedByUserId: null,
          reviewEvents: [],
          data: newData
        };

        company.financialYears.push(newFinYear);
        company.financialYears.sort((a, b) => a.year - b.year);
        state.activeYearId = newYearId;
      }),

      setActiveYear: (id: string | null) => set(state => { state.activeYearId = id; }),

      markYearCompleted: (id?: string) => set(state => {
        const targetId = id || state.activeYearId;
        const company = state.companies.find(c => c.financialYears.some(y => y.id === targetId));
        const year = company?.financialYears.find(y => y.id === targetId);
        if (year) {
          year.status = 'completed'; // For backward compat
          year.reviewStatus = 'finalized';
          year.isLocked = true;
        }
      }),

      deleteFinancialYear: (yearId: string) => set(state => {
        const company = state.companies.find(c => c.financialYears.some(y => y.id === yearId));
        if (company) {
          company.financialYears = company.financialYears.filter(y => y.id !== yearId);
        }
        if (state.activeYearId === yearId) state.activeYearId = null;
      }),

      deleteCompany: (companyId: string) => set(state => {
        state.companies = state.companies.filter(c => c.id !== companyId);
        if (state.activeCompanyId === companyId) {
          state.activeCompanyId = null;
          state.activeYearId = null;
        }
      }),

      getActiveYearData: () => {
        const state = get();
        const company = state.companies.find(c => c.id === state.activeCompanyId);
        const year = company?.financialYears.find(y => y.id === state.activeYearId);
        if (!year) throw new Error('No active financial year selected');
        return year.data;
      },

      updateActiveYearAuditData: (updater: (draft: AuditReportData) => void) => set(state => {
        const company = state.companies.find(c => c.id === state.activeCompanyId);
        const year = company?.financialYears.find(y => y.id === state.activeYearId);
        if (year) {
          updater(year.data.auditData);
          year.lastEditedByUserId = state.currentUser?.id;
        }
      }),

      updateActiveYearNotesData: (updater: (draft: N4_13_State) => void) => set(state => {
        const company = state.companies.find(c => c.id === state.activeCompanyId);
        const year = company?.financialYears.find(y => y.id === state.activeYearId);
        if (year) {
          updater(year.data.notesData);
          recalculate(year.data.notesData); 
          year.lastEditedByUserId = state.currentUser?.id;
        }
      }),

      // --- RBAC & Review Actions ---

      createUser: (name, email, role) => set(state => {
        if (state.users.some(u => u.email === email && u.status !== 'deleted')) {
           throw new Error('User already exists');
        }
        state.users.push({
           id: uuidv4(), name, email, role, status: 'active',
           assignedCompanyIds: [], notifications: []
        });
      }),

      updateUserRole: (userId, role) => set(state => {
         const user = state.users.find(u => u.id === userId);
         if (user) user.role = role;
      }),

      banUser: (userId, reason) => set(state => {
        const user = state.users.find(u => u.id === userId);
        if (user) {
           user.status = 'banned';
           user.bannedReason = reason;
           user.bannedByUserId = state.currentUser?.id || undefined;
        }
      }),

      unbanUser: (userId) => set(state => {
        const user = state.users.find(u => u.id === userId);
        if (user) {
           user.status = 'active';
           user.bannedReason = undefined;
           user.bannedByUserId = undefined;
        }
      }),

      softDeleteUser: (userId) => set(state => {
        const user = state.users.find(u => u.id === userId);
        if (user) user.status = 'deleted';
      }),

      assignStudentToAdmin: (studentId, adminId) => set(state => {
         const admin = state.users.find(u => u.id === adminId);
         if (admin && !admin.assignedStudentIds?.includes(studentId)) {
            admin.assignedStudentIds = [...(admin.assignedStudentIds || []), studentId];
         }
      }),

      unassignStudentFromAdmin: (studentId, adminId) => set(state => {
         const admin = state.users.find(u => u.id === adminId);
         if (admin && admin.assignedStudentIds) {
            admin.assignedStudentIds = admin.assignedStudentIds.filter(id => id !== studentId);
         }
      }),

      assignCompanyToUser: (userId, companyId) => set(state => {
         const user = state.users.find(u => u.id === userId);
         if (user && !user.assignedCompanyIds.includes(companyId)) {
           user.assignedCompanyIds.push(companyId);
         }
      }),

      unassignCompanyFromUser: (userId, companyId) => set(state => {
         const user = state.users.find(u => u.id === userId);
         if (user) {
           user.assignedCompanyIds = user.assignedCompanyIds.filter(id => id !== companyId);
         }
      }),

      submitFinancialYear: (yearId, note) => set(state => {
         const company = state.companies.find(c => c.financialYears.some(y => y.id === yearId));
         const year = company?.financialYears.find(y => y.id === yearId);
         if (year) {
           year.reviewStatus = 'submitted';
           year.submittedAt = new Date().toISOString();
           year.reviewEvents.push({
             id: uuidv4(), type: 'submitted',
             actorUserId: state.currentUser?.id!, actorRole: 'student',
             createdAt: new Date().toISOString(), note
           });
         }
      }),

      startFinancialYearReview: (yearId) => set(state => {
         const company = state.companies.find(c => c.financialYears.some(y => y.id === yearId));
         const year = company?.financialYears.find(y => y.id === yearId);
         if (year) {
           year.reviewStatus = 'under_review';
           year.currentReviewerUserId = state.currentUser?.id;
           year.reviewEvents.push({
             id: uuidv4(), type: 'under_review',
             actorUserId: state.currentUser?.id!, actorRole: 'admin',
             createdAt: new Date().toISOString()
           });
         }
      }),

      requestFinancialYearChanges: (yearId, note) => set(state => {
         const company = state.companies.find(c => c.financialYears.some(y => y.id === yearId));
         const year = company?.financialYears.find(y => y.id === yearId);
         if (year) {
           year.reviewStatus = 'changes_requested';
           year.reviewEvents.push({
             id: uuidv4(), type: 'changes_requested',
             actorUserId: state.currentUser?.id!, actorRole: 'admin',
             createdAt: new Date().toISOString(), note
           });
         }
      }),

      finalizeFinancialYear: (yearId, note) => set(state => {
         const company = state.companies.find(c => c.financialYears.some(y => y.id === yearId));
         const year = company?.financialYears.find(y => y.id === yearId);
         if (year) {
           year.reviewStatus = 'finalized';
           year.isLocked = true;
           year.status = 'completed'; // Compat
           year.finalizedAt = new Date().toISOString();
           year.finalizedByUserId = state.currentUser?.id;
           year.reviewEvents.push({
             id: uuidv4(), type: 'finalized',
             actorUserId: state.currentUser?.id!, actorRole: 'admin',
             createdAt: new Date().toISOString(), note
           });
         }
      }),

      reopenFinancialYear: (yearId, note) => set(state => {
         const company = state.companies.find(c => c.financialYears.some(y => y.id === yearId));
         const year = company?.financialYears.find(y => y.id === yearId);
         if (year) {
           year.reviewStatus = 'draft';
           year.isLocked = false;
           year.status = 'in-progress'; // Compat
           year.finalizedAt = null;
           year.finalizedByUserId = null;
           year.reviewEvents.push({
             id: uuidv4(), type: 'reopened',
             actorUserId: state.currentUser?.id!, actorRole: 'admin',
             createdAt: new Date().toISOString(), note
           });
         }
      }),

      markNotificationRead: (notificationId) => set(state => {
         const user = state.users.find(u => u.id === state.currentUser?.id);
         if (user) {
            const notif = user.notifications.find(n => n.id === notificationId);
            if (notif) notif.read = true;
         }
      }),

      pushNotification: (userId, notification) => set(state => {
         const user = state.users.find(u => u.id === userId);
         if (user) {
            user.notifications.unshift({
               ...notification,
               id: uuidv4(),
               createdAt: new Date().toISOString(),
               read: false
            });
         }
      }),

    })),
    {
      name: 'audit-x-platform-storage',
      version: 2,
      partialize: (state) => ({ 
        activeCompanyId: state.activeCompanyId,
        activeYearId: state.activeYearId
        // Do NOT persist currentUser (session cookie handles this) or isAuthChecked
      }),
      migrate: (persistedState: any, version: number) => {
        if (version === 0 || !version) {
          const oldUsers = persistedState.users || [];
          const newUsers: User[] = [];
          const newCompanies: Company[] = [];

          oldUsers.forEach((oldUser: any) => {
            const newUser: User = {
              id: oldUser.id,
              name: oldUser.name,
              email: oldUser.email,
              role: oldUser.role || 'student',
              status: oldUser.status || 'active',
              bannedReason: oldUser.bannedReason,
              bannedByUserId: oldUser.bannedByUserId,
              profileImg: oldUser.profileImg,
              assignedCompanyIds: oldUser.assignedCompanyIds || [],
              assignedStudentIds: oldUser.assignedStudentIds || [],
              assignedAdminIds: oldUser.assignedAdminIds || [],
              notifications: oldUser.notifications || []
            };

            if (oldUser.companies && Array.isArray(oldUser.companies)) {
              oldUser.companies.forEach((oldComp: any) => {
                const compId = oldComp.id;
                if (!newUser.assignedCompanyIds.includes(compId)) {
                  newUser.assignedCompanyIds.push(compId);
                }
                const migratedYears = (oldComp.financialYears || []).map((y: any) => ({
                   ...y,
                   reviewStatus: y.reviewStatus || (y.status === 'completed' ? 'finalized' : 'draft'),
                   isLocked: y.isLocked ?? (y.status === 'completed'),
                   createdByUserId: y.createdByUserId || oldUser.id,
                   assignedStudentIds: y.assignedStudentIds || [],
                   assignedAdminIds: y.assignedAdminIds || [],
                   currentReviewerUserId: y.currentReviewerUserId || null,
                   finalizedByUserId: y.finalizedByUserId || null,
                   finalizedAt: y.finalizedAt || null,
                   submittedAt: y.submittedAt || null,
                   lastEditedByUserId: y.lastEditedByUserId || null,
                   reviewEvents: y.reviewEvents || []
                }));

                newCompanies.push({
                  id: compId,
                  name: oldComp.name,
                  createdByUserId: oldUser.id,
                  financialYears: migratedYears
                });
              });
            }
            newUsers.push(newUser);
          });

          return {
            ...persistedState,
            users: newUsers,
            companies: newCompanies
          };
        }
        return persistedState as AppState;
      }
    }
  )
);
