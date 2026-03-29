import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Store } from './types';
import { recalculate } from './recalculate';
import { buildInitialSections } from './sections';
// ─── STORE ────────────────────────────────────────────────────────────────────
const useStore = create<Store>()(immer((set) => ({
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

  updateRow: (sId, rId, field, value) => set(state => {
    const sec = state.sections.find(s => s.id === sId);
    const row = sec?.rows.find(r => r.id === rId);
    if (row && !row.crossNoteRef) row[field] = value;
    recalculate(state);
  }),

  addRow: (sId) => set(state => {
    const sec = state.sections.find(s => s.id === sId);
    if (!sec) return;
    const newRow = { id: uuidv4(), label: 'New Item', value_cy: 0, value_py: 0, indentLevel: 1 };
    const lastTotalIdx = [...sec.rows].reverse().findIndex(r => r.isTotal);
    const insertAt = lastTotalIdx >= 0 ? sec.rows.length - 1 - lastTotalIdx + 1 : sec.rows.length;
    sec.rows.splice(insertAt - 1, 0, newRow);
    recalculate(state);
  }),

  deleteRow: (sId, rId) => set(state => {
    const sec = state.sections.find(s => s.id === sId);
    if (!sec) return;
    const row = sec.rows.find(r => r.id === rId);
    if (row?.locked || row?.isTotal || row?.crossNoteRef) return;
    sec.rows = sec.rows.filter(r => r.id !== rId);
    recalculate(state);
  }),

  updateRowLabel: (sId, rId, label) => set(state => {
    const sec = state.sections.find(s => s.id === sId);
    const row = sec?.rows.find(r => r.id === rId);
    if (row && !row.isTotal) row.label = label;
  }),

  updateConfig: (cat, field, value) => set(state => {
    state[cat][field] = value;
    recalculate(state);
  }),

  addTableItem: (type) => set(state => {
    if (type === 'bank')
      state.bankAccounts.push({ id: uuidv4(), bankName: 'New Bank', accountNo: 'A/C No.', value_cy: 0, value_py: 0 });
    else if (type === 'sh')
      state.shareholders.push({ id: uuidv4(), name: 'New Shareholder', shares: 0 });
    else if (type === 'loan')
      state.loans.push({ id: uuidv4(), lenderName: 'New Lender', accountNo: 'A/C No.', nonCurrent_cy: 0, current_cy: 0, total_py: 0 });
    else if (type === 'upas')
      state.upasEntries.push({ id: uuidv4(), lenderName: 'New UPAS Lender', accountNo: 'A/C No.', nonCurrent_cy: 0, current_cy: 0, total_py: 0 });
    recalculate(state);
  }),

  updateTableItem: (type, id, field, value) => set(state => {
    const list = type === 'bank' ? state.bankAccounts
      : type === 'sh' ? state.shareholders
        : type === 'loan' ? state.loans
          : state.upasEntries;
    const item = list.find(i => i.id === id);
    if (item) item[field] = value;
    recalculate(state);
  }),

  deleteTableItem: (type, id) => set(state => {
    if (type === 'bank') state.bankAccounts = state.bankAccounts.filter(i => i.id !== id);
    else if (type === 'sh') state.shareholders = state.shareholders.filter(i => i.id !== id);
    else if (type === 'loan') state.loans = state.loans.filter(i => i.id !== id);
    else state.upasEntries = state.upasEntries.filter(i => i.id !== id);
    recalculate(state);
  }),

  updateSectionTitle: (sId, title) => set(state => {
    const sec = state.sections.find(s => s.id === sId);
    if (sec) sec.title = title;
  }),
})));


export { useStore };