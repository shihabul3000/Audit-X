'use client';

import { useEffect, useRef } from 'react';
import type { AuditReportData } from '../types';
import { getFormattedDate } from '../utils/dateFormatter';
import { recalculate } from '../components/tabs/N4_13/recalculate';
import { buildInitialSections } from '../components/tabs/N4_13/sections';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UpdateFn = (updater: (draft: any) => void) => void;

const parseValue = (val: string | number): number => {
  if (!val || val === '' || val === '-') return 0;
  const str =
    typeof val === 'string'
      ? val.replace(/,/g, '').replace(/%/g, '').replace(/\(/g, '-').replace(/\)/g, '')
      : val.toString();
  const parsed = parseFloat(str);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * useGlobalStoreSync — syncs PPE totals and company info from AuditData into NotesData.
 * Uses a stable ref for updateNotesData to avoid infinite re-render loops.
 */
export const useGlobalStoreSync = (
  data: AuditReportData | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  notesData: Record<string, any> | null,
  updateNotesData: UpdateFn
) => {
  const prevSyncRef = useRef<string | null>(null);
  // Keep updateNotesData in a ref so the effect doesn't re-run when the function identity changes
  const updateNotesDataRef = useRef(updateNotesData);
  updateNotesDataRef.current = updateNotesData;

  const reportingDateLabel = getFormattedDate(data?.reportingDate) || '30 June 2024';
  const priorDateLabel = getFormattedDate(data?.startDate) || '30 June 2023';

  useEffect(() => {
    if (!data) return;

    let costClosing_cy = 0;
    let costOpening_py = 0;
    let depClosing_cy = 0;
    let depOpening_py = 0;
    let totalDepCharged_cy = 0;

    if (data.ppe?.assets) {
      data.ppe.assets.forEach(asset => {
        const co = parseValue(asset.costOpening);
        const ca = parseValue(asset.costAddition);
        const cd = parseValue(asset.costDisposal);
        costClosing_cy += co + ca - cd;
        costOpening_py += co;

        const dop = parseValue(asset.depOpening);
        const dc = parseValue(asset.depCharged);
        const da = parseValue(asset.depAdjustment);
        depClosing_cy += dop + dc + da;
        depOpening_py += dop;
        totalDepCharged_cy += dc;
      });
    }

    const adminDep = parseValue(data.ppe?.breakdown?.adminExpense || 0);
    const companyName = data.company || 'New Company Ltd.';

    const syncKey = JSON.stringify({
      reportingDateLabel, priorDateLabel, companyName,
      costClosing_cy, costOpening_py, depClosing_cy, depOpening_py, totalDepCharged_cy, adminDep,
    });

    if (prevSyncRef.current === syncKey) return;
    prevSyncRef.current = syncKey;

    // Use ref to call latest updateNotesData without it being a dependency
    updateNotesDataRef.current((draft: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      // Initialize missing fields if notesData was null/empty
      if (!draft.company) draft.company = {};
      if (!draft.ppe) draft.ppe = {};
      if (!draft.sections || draft.sections.length === 0) {
        draft.sections = buildInitialSections();
      }
      if (!draft.bankAccounts) draft.bankAccounts = [];
      if (!draft.shareholders) draft.shareholders = [];
      if (!draft.loans) draft.loans = [];
      if (!draft.upasEntries) draft.upasEntries = [];
      if (!draft.shareConfig) draft.shareConfig = { authorizedShares: 10000000, authorizedFaceValue: 10, issuedShares: 1000000, issuedFaceValue: 10 };
      if (!draft.taxConfig) draft.taxConfig = { rateOnRevenue_cy: 0.01, rateOnRevenue_py: 0.006, rateOnIncome_cy: 0.275, rateOnIncome_py: 0.275 };

      draft.company.reportingDateLabel = reportingDateLabel;
      draft.company.priorDateLabel = priorDateLabel;
      draft.company.companyName = companyName;

      draft.ppe.costClosing_cy = costClosing_cy;
      draft.ppe.costOpening_py = costOpening_py;
      draft.ppe.depClosing_cy = depClosing_cy;
      draft.ppe.depOpening_py = depOpening_py;
      draft.ppe.totalDepCharged_cy = totalDepCharged_cy;
      draft.ppe.adminDep_cy = adminDep;

      // Run recalculate so Note04 and all dependent notes update immediately
      recalculate(draft);
    });
    // Only re-run when the actual PPE data values change, not when updateNotesData identity changes
  }, [reportingDateLabel, priorDateLabel, data]); // eslint-disable-line react-hooks/exhaustive-deps
};
