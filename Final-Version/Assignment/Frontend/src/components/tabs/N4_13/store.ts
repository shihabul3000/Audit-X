/**
 * N4_13 Store — API-connected version
 * Reads/writes notesData via useAuditDataAPI hook (TanStack Query + backend API)
 * Falls back to default data when no active year is selected.
 */
import { v4 as uuidv4 } from 'uuid';
import { useAuditDataAPI } from '@/hooks/useAuditDataAPI';
import { buildInitialSections } from './sections';
import { recalculate } from './recalculate';
import type { Store } from './types';

// Default notes data (used as fallback)
export const getDefaultNotesData = () => {
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
  };
};

/**
 * useStore — custom hook that reads notesData from the API cache
 * and provides actions that update via the API.
 */
export const useStore = <T = Store>(selector?: (state: Store) => T): T => {
  const { notesData, updateNotesData } = useAuditDataAPI();

  // Merge loaded notesData with defaults to ensure all sections exist
  const rawData = notesData ?? getDefaultNotesData();
  const initialSections = buildInitialSections();

  // If loaded sections are missing any note IDs, fill them in from initial
  let mergedSections = rawData.sections;
  if (!mergedSections || mergedSections.length === 0) {
    mergedSections = initialSections;
  } else {
    const loadedIds = new Set(mergedSections.map((s: { id: string }) => s.id));
    const missingSections = initialSections.filter(s => !loadedIds.has(s.id));
    if (missingSections.length > 0) {
      mergedSections = [...mergedSections, ...missingSections];
      // Sort by the original order
      const orderMap = new Map(initialSections.map((s, i) => [s.id, i]));
      mergedSections.sort((a: { id: string }, b: { id: string }) =>
        (orderMap.get(a.id) ?? 999) - (orderMap.get(b.id) ?? 999)
      );
    }
  }

  const data = { ...rawData, sections: mergedSections };

  const actions = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateRow: (sId: string, rId: string, field: string, value: number) => updateNotesData((draft: any) => {
      const sec = draft.sections?.find((s: { id: string }) => s.id === sId);
      const row = sec?.rows?.find((r: { id: string }) => r.id === rId);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (row && !row.crossNoteRef) (row as any)[field] = value;
      recalculate(draft);
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addRow: (sId: string) => updateNotesData((draft: any) => {
      const sec = draft.sections?.find((s: { id: string }) => s.id === sId);
      if (!sec) return;
      const newRow = { id: uuidv4(), label: 'New Item', value_cy: 0, value_py: 0, indentLevel: 1 };
      const lastTotalIdx = [...sec.rows].reverse().findIndex((r: { isTotal?: boolean }) => r.isTotal);
      const insertAt = lastTotalIdx >= 0 ? sec.rows.length - 1 - lastTotalIdx + 1 : sec.rows.length;
      sec.rows.splice(insertAt - 1, 0, newRow);
      recalculate(draft);
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    deleteRow: (sId: string, rId: string) => updateNotesData((draft: any) => {
      const sec = draft.sections?.find((s: { id: string }) => s.id === sId);
      if (!sec) return;
      const row = sec.rows.find((r: { id: string }) => r.id === rId);
      if (row?.locked || row?.isTotal || row?.crossNoteRef) return;
      sec.rows = sec.rows.filter((r: { id: string }) => r.id !== rId);
      recalculate(draft);
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateRowLabel: (sId: string, rId: string, label: string) => updateNotesData((draft: any) => {
      const sec = draft.sections?.find((s: { id: string }) => s.id === sId);
      const row = sec?.rows?.find((r: { id: string }) => r.id === rId);
      if (row && !row.isTotal) row.label = label;
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateConfig: (cat: string, field: string, value: unknown) => updateNotesData((draft: any) => {
      if (draft[cat]) draft[cat][field] = value;
      recalculate(draft);
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addTableItem: (type: string) => updateNotesData((draft: any) => {
      if (type === 'bank') draft.bankAccounts.push({ id: uuidv4(), bankName: 'New Bank', accountNo: 'A/C No.', value_cy: 0, value_py: 0 });
      else if (type === 'sh') draft.shareholders.push({ id: uuidv4(), name: 'New Shareholder', shares: 0 });
      else if (type === 'loan') draft.loans.push({ id: uuidv4(), lenderName: 'New Lender', accountNo: 'A/C No.', nonCurrent_cy: 0, current_cy: 0, total_py: 0 });
      else if (type === 'upas') draft.upasEntries.push({ id: uuidv4(), lenderName: 'New UPAS Lender', accountNo: 'A/C No.', nonCurrent_cy: 0, current_cy: 0, total_py: 0 });
      recalculate(draft);
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateTableItem: (type: string, id: string, field: string, value: unknown) => updateNotesData((draft: any) => {
      const list = type === 'bank' ? draft.bankAccounts : type === 'sh' ? draft.shareholders : type === 'loan' ? draft.loans : draft.upasEntries;
      const item = list?.find((i: { id: string }) => i.id === id);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (item) (item as any)[field] = value;
      recalculate(draft);
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    deleteTableItem: (type: string, id: string) => updateNotesData((draft: any) => {
      if (type === 'bank') draft.bankAccounts = draft.bankAccounts.filter((i: { id: string }) => i.id !== id);
      else if (type === 'sh') draft.shareholders = draft.shareholders.filter((i: { id: string }) => i.id !== id);
      else if (type === 'loan') draft.loans = draft.loans.filter((i: { id: string }) => i.id !== id);
      else draft.upasEntries = draft.upasEntries.filter((i: { id: string }) => i.id !== id);
      recalculate(draft);
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateSectionTitle: (sId: string, title: string) => updateNotesData((draft: any) => {
      const sec = draft.sections?.find((s: { id: string }) => s.id === sId);
      if (sec) sec.title = title;
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updatePPESummary: (summary: Partial<Store['ppe']>) => updateNotesData((draft: any) => {
      draft.ppe = { ...draft.ppe, ...summary };
      recalculate(draft);
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateCompanyInfo: (field: string, value: string) => updateNotesData((draft: any) => {
      if (draft.company) draft.company[field] = value;
    }),
  };

  const storeObj = Object.assign({}, data, actions) as Store;
  return selector ? selector(storeObj) : (storeObj as unknown as T);
};
