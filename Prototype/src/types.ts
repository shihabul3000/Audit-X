export type Tab = 'Cover' | 'SFP' | 'PNL' | 'SCE' | 'SCF' | 'P_Discussion' | 'N4-13' | 'PPE';

export interface AssetRow {
  id: string;
  particular: string;
  statementHead: string;
  costOpening: string;
  costAddition: string;
  costDisposal: string;
  rate: string;
  depOpening: string;
  depCharged: string;
  depAdjustment: string;
}

export interface PPEData {
  assets: AssetRow[];
  headerInfo: {
    reportTitle: string;
    annexure: string;
    asAtDate: string;
    yearStart: string;
    yearEnd: string;
  };
  prevYearData: {
    costOpening: string;
    costAddition: string;
    costDisposal: string;
    depOpening: string;
    depCharged: string;
    depAdjustment: string;
  };
  breakdown: {
    adminExpense: string;
    costOfSalesLabel: string;
    adminExpenseLabel: string;
  };
}

export interface AuditReportData {
  company: string;
  addr: string;
  date: string;
  reportingDate: string;
  startDate: string;
  ppe: PPEData;
  discussionData: {
    docStatuses: Record<string, string>;
    values: Record<string, string>;
  };
}
