import { useAppStore, getDefaultNotesData } from '../../../store/useAppStore';
import { useShallow } from 'zustand/react/shallow';
import { Store } from './types';
import { v4 as uuidv4 } from 'uuid';

// Extract actions out to preserve stable references across renders, preventing useEffect infinite loops.
const getUpdateFn = () => useAppStore.getState().updateActiveYearNotesData;

const actions = {
  updateRow: (sId: string, rId: string, field: string, value: number) => getUpdateFn()(draft => {
    const sec = draft.sections.find(s => s.id === sId);
    const row = sec?.rows.find(r => r.id === rId);
    if (row && !row.crossNoteRef) (row as any)[field] = value;
  }),
  addRow: (sId: string) => getUpdateFn()(draft => {
    const sec = draft.sections.find(s => s.id === sId);
    if (!sec) return;
    const newRow = { id: uuidv4(), label: 'New Item', value_cy: 0, value_py: 0, indentLevel: 1 };
    const lastTotalIdx = [...sec.rows].reverse().findIndex(r => r.isTotal);
    const insertAt = lastTotalIdx >= 0 ? sec.rows.length - 1 - lastTotalIdx + 1 : sec.rows.length;
    sec.rows.splice(insertAt - 1, 0, newRow);
  }),
  deleteRow: (sId: string, rId: string) => getUpdateFn()(draft => {
    const sec = draft.sections.find(s => s.id === sId);
    if (!sec) return;
    const row = sec.rows.find(r => r.id === rId);
    if (row?.locked || row?.isTotal || row?.crossNoteRef) return;
    sec.rows = sec.rows.filter(r => r.id !== rId);
  }),
  updateRowLabel: (sId: string, rId: string, label: string) => getUpdateFn()(draft => {
    const sec = draft.sections.find(s => s.id === sId);
    const row = sec?.rows.find(r => r.id === rId);
    if (row && !row.isTotal) row.label = label;
  }),
  updateConfig: (cat: string, field: string, value: any) => getUpdateFn()(draft => {
    (draft as any)[cat][field] = value;
  }),
  addTableItem: (type: string) => getUpdateFn()(draft => {
    if (type === 'bank') draft.bankAccounts.push({ id: uuidv4(), bankName: 'New Bank', accountNo: 'A/C No.', value_cy: 0, value_py: 0 });
    else if (type === 'sh') draft.shareholders.push({ id: uuidv4(), name: 'New Shareholder', shares: 0 });
    else if (type === 'loan') draft.loans.push({ id: uuidv4(), lenderName: 'New Lender', accountNo: 'A/C No.', nonCurrent_cy: 0, current_cy: 0, total_py: 0 });
    else if (type === 'upas') draft.upasEntries.push({ id: uuidv4(), lenderName: 'New UPAS Lender', accountNo: 'A/C No.', nonCurrent_cy: 0, current_cy: 0, total_py: 0 });
  }),
  updateTableItem: (type: string, id: string, field: string, value: any) => getUpdateFn()(draft => {
    const list = type === 'bank' ? draft.bankAccounts : type === 'sh' ? draft.shareholders : type === 'loan' ? draft.loans : draft.upasEntries;
    const item = list.find(i => i.id === id);
    if (item) (item as any)[field] = value;
  }),
  deleteTableItem: (type: string, id: string) => getUpdateFn()(draft => {
    if (type === 'bank') draft.bankAccounts = draft.bankAccounts.filter(i => i.id !== id);
    else if (type === 'sh') draft.shareholders = draft.shareholders.filter(i => i.id !== id);
    else if (type === 'loan') draft.loans = draft.loans.filter(i => i.id !== id);
    else draft.upasEntries = draft.upasEntries.filter(i => i.id !== id);
  }),
  updateSectionTitle: (sId: string, title: string) => getUpdateFn()(draft => {
    const sec = draft.sections.find(s => s.id === sId);
    if (sec) sec.title = title;
  }),
  updatePPESummary: (summary: any) => getUpdateFn()(draft => {
    draft.ppe = { ...draft.ppe, ...summary };
  }),
  updateCompanyInfo: (field: string, value: any) => getUpdateFn()(draft => {
    (draft.company as any)[field] = value;
  }),
};

// We export useStore as a custom selector hook that proxies to useAppStore
// so that all components hitting useStore(state => ...) implicitly select from the global active year.

export const useStore = <T>(selector?: (state: Store) => T): any => {
  return useAppStore(
    useShallow((state) => {
      let notesData;
      try {
        notesData = state.activeYearId ? state.getActiveYearData().notesData : getDefaultNotesData();
      } catch {
        notesData = getDefaultNotesData();
      }

      const storeObj: Store = Object.assign({}, notesData, actions) as Store;

      return selector ? selector(storeObj) : storeObj;
    })
  );
};