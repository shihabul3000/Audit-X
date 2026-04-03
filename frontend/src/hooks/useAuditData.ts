import { useCallback } from 'react';
import { AuditReportData } from '../types';
import { useAppStore, getDefaultAuditData } from '../store/useAppStore';

export function useAuditData() {
  const activeYearId = useAppStore(state => state.activeYearId);
  const data = useAppStore(state => {
    try {
      if (activeYearId) {
        return state.getActiveYearData().auditData;
      }
      return getDefaultAuditData(); // Fallback for when no active year is set but component renders
    } catch {
      return getDefaultAuditData();
    }
  });

  const updateDataFn = useAppStore(state => state.updateActiveYearAuditData);

  const updateData = useCallback((newData: Partial<AuditReportData>) => {
    if (activeYearId) {
      updateDataFn(draft => {
        Object.assign(draft, newData);
      });
    }
  }, [activeYearId, updateDataFn]);

  return { data, updateData, isLoaded: true };
}
