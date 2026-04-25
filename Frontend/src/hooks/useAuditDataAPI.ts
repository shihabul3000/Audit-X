'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';
import { auditDataService } from '@/services/api/auditData.service';
import type { AuditReportData } from '@/types';
import { useUIStore } from '@/store/useUIStore';
import { buildInitialSections } from '@/components/tabs/N4_13/sections';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type N4_13_State = Record<string, any>;

const getDefaultAuditData = (): AuditReportData => {
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
        { id: '4', particular: 'Office equipment', statementHead: 'Office equipment', costOpening: '', costAddition: '', costDisposal: '', rate: '', depOpening: '', depCharged: '', depAdjustment: '' },
      ],
      headerInfo: {
        reportTitle: 'Property, plant and equipment',
        annexure: 'Annexure A',
        asAtDate: `30 June ${currentYear}`,
        yearStart: `01 Jul ${String(currentYear - 1).slice(2)}`,
        yearEnd: `30 June ${String(currentYear).slice(2)}`,
      },
      prevYearData: { costOpening: '', costAddition: '', costDisposal: '', depOpening: '', depCharged: '', depAdjustment: '' },
      breakdown: { adminExpense: '0', costOfSalesLabel: 'Cost of sales', adminExpenseLabel: 'Administrative expense' },
    },
    discussionData: { docStatuses: {}, values: {} },
  };
};

const getDefaultNotesData = (): N4_13_State => {
  const currentYear = new Date().getFullYear();
  return {
    company: {
      companyName: 'New Company Ltd.',
      address: 'Dhaka, Bangladesh',
      reportingDateLabel: `30 June ${currentYear}`,
      priorDateLabel: `30 June ${currentYear - 1}`,
      currency: 'BDT',
    },
    ppe: { costClosing_cy: 0, costOpening_py: 0, depClosing_cy: 0, depOpening_py: 0, totalDepCharged_cy: 0, adminDep_cy: 0, taxBase_cy: 0 },
    shareConfig: { authorizedShares: 10000000, authorizedFaceValue: 10, issuedShares: 1000000, issuedFaceValue: 10 },
    taxConfig: { rateOnRevenue_cy: 0.01, rateOnRevenue_py: 0.006, rateOnIncome_cy: 0.275, rateOnIncome_py: 0.275 },
    shareholders: [],
    bankAccounts: [],
    loans: [],
    upasEntries: [],
    sections: buildInitialSections(),
  };
};

export function useAuditDataAPI() {
  const { activeYearId } = useUIStore();
  const queryClient = useQueryClient();

  // Separate timers for audit and notes saves — prevents one from cancelling the other
  const auditSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const notesSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep a ref to yearData so callbacks don't go stale without re-creating functions
  const yearDataRef = useRef<typeof yearData>(undefined);

  const { data: yearData, isLoading } = useQuery({
    queryKey: ['year-data', activeYearId],
    queryFn: () => auditDataService.getYearData(activeYearId!),
    enabled: !!activeYearId,
    staleTime: 30000,
    // Do NOT refetch on window focus — prevents reset while user is typing
    refetchOnWindowFocus: false,
  });

  // Keep ref in sync
  yearDataRef.current = yearData;

  const saveAuditMutation = useMutation({
    mutationFn: ({ yearId, data }: { yearId: string; data: AuditReportData }) =>
      auditDataService.saveAuditData(yearId, data),
    // Do NOT invalidate on success — optimistic update is already in cache
    // Invalidating causes a refetch that resets the UI while user is still typing
  });

  const saveNotesMutation = useMutation({
    mutationFn: ({ yearId, data }: { yearId: string; data: N4_13_State }) =>
      auditDataService.saveNotesData(yearId, data),
    // Do NOT invalidate on success — same reason
  });

  // Debounced save for auditData — separate timer from notes
  const updateData = useCallback(
    (newData: Partial<AuditReportData>) => {
      if (!activeYearId) return;

      // Always read from ref to get latest data without stale closure
      const base = yearDataRef.current?.auditData ?? getDefaultAuditData();
      const merged = { ...base, ...newData };

      // Optimistic update in cache immediately (no delay)
      queryClient.setQueryData(['year-data', activeYearId], (old: typeof yearData) => {
        if (!old) return { auditData: merged, notesData: null, financialYear: null };
        return { ...old, auditData: merged };
      });

      // Debounced backend save — separate timer
      if (auditSaveTimerRef.current) clearTimeout(auditSaveTimerRef.current);
      auditSaveTimerRef.current = setTimeout(() => {
        // Read latest from ref at save time (not stale closure value)
        const latest = yearDataRef.current?.auditData ?? merged;
        const toSave = { ...latest, ...newData };
        saveAuditMutation.mutate({ yearId: activeYearId, data: toSave });
      }, 1500);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeYearId, queryClient]
  );

  // Debounced save for notesData — separate timer
  const updateNotesData = useCallback(
    (updater: (draft: N4_13_State) => void) => {
      if (!activeYearId) return;

      // Always read from ref to get latest data without stale closure
      const base = yearDataRef.current?.notesData ?? getDefaultNotesData();
      const draft = JSON.parse(JSON.stringify(base));
      updater(draft);

      // Optimistic update in cache immediately (no delay)
      queryClient.setQueryData(['year-data', activeYearId], (old: typeof yearData) => {
        if (!old) return { auditData: null, notesData: draft, financialYear: null };
        return { ...old, notesData: draft };
      });

      // Debounced backend save — separate timer
      if (notesSaveTimerRef.current) clearTimeout(notesSaveTimerRef.current);
      notesSaveTimerRef.current = setTimeout(() => {
        saveNotesMutation.mutate({ yearId: activeYearId, data: draft });
      }, 1500);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeYearId, queryClient]
  );

  return {
    data: yearData?.auditData ?? null,
    notesData: yearData?.notesData ?? null,
    financialYear: yearData?.financialYear ?? null,
    isLoaded: !isLoading,
    updateData,
    updateNotesData,
  };
}
