import React, { createContext, useContext } from 'react';
import { AuditReportData } from '../../../types';

export interface Asset {
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

export interface HeaderInfo {
  reportTitle: string;
  annexure: string;
  asAtDate: string;
  yearStart: string;
  yearEnd: string;
}

export const ASSET_TYPES = [
  "Land",
  "Land (freehold)",
  "Land (leasehold)",
  "Land (mortgaged)",
  "Buildings",
  "Plant & Machinery",
  "Machinery",
  "Ships",
  "Aircraft",
  "Motor vehicles",
  "Furniture and fixtures",
  "Office equipment",
  "Bearer plants",
  "Low value assets (LVA)",
  "Assets under construction (AUC)"
];

export const STATEMENT_HEAD_MAPPING: Record<string, string> = {
  "Land": "Land",
  "Land (freehold)": "Land (freehold)",
  "Land (leasehold)": "Land (leasehold)",
  "Land (mortgaged)": "Land (mortgaged)",
  "Buildings": "Buildings",
  "Plant & Machinery": "Plant & machineries",
  "Machinery": "Plant & machineries",
  "Ships": "Ships",
  "Aircraft": "Aircraft",
  "Motor vehicles": "Motor vehicles",
  "Furniture and fixtures": "Furniture & Fixture",
  "Office equipment": "Office equipment",
  "Bearer plants": "Bearer plants",
  "Low value assets (LVA)": "Low value assets (LVA)",
  "Assets under construction (AUC)": "Assets under construction (AUC)"
};

export interface PPEContextType {
  data: AuditReportData;
  assets: Asset[];
  setAssets: (newAssets: Asset[] | ((prev: Asset[]) => Asset[])) => void;
  headerInfo: HeaderInfo;
  setHeaderInfo: (newHeader: HeaderInfo | ((prev: HeaderInfo) => HeaderInfo)) => void;
  breakdown: {
    adminExpense: string;
    costOfSalesLabel: string;
    adminExpenseLabel: string;
  };
  prevYearData: {
    costOpening: string;
    costAddition: string;
    costDisposal: string;
    depOpening: string;
    depCharged: string;
    depAdjustment: string;
  };
  setPrevYearData: (newPrev: any | ((prev: any) => any)) => void;
  setBreakdown: (newBreakdown: any | ((prev: any) => any)) => void;
  handleAssetChange: (id: string, field: keyof Asset, value: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => void;
  parseValue: (val: string | number) => number;
  formatDisplay: (num: number) => string;
  formatRateDisplay: (val: string) => string;
  totals: any;
  onUpdate?: (data: Partial<AuditReportData>) => void;
  tableRef: React.RefObject<HTMLTableElement | null>;
}

export const PPEContext = createContext<PPEContextType | null>(null);
export const PPEProvider = PPEContext.Provider;

export const usePPE = () => {
  const context = useContext(PPEContext);
  if (!context) throw new Error('usePPE must be used within PPEProvider');
  return context;
};
