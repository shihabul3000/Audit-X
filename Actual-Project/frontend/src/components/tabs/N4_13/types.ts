// ─── TYPES ────────────────────────────────────────────────────────────────────
export interface Company {
  companyName: string;
  address: string;
  reportingDateLabel: string;
  priorDateLabel: string;
  currency: string;
}

export interface PPE {
  costClosing_cy: number;
  costOpening_py: number;
  depClosing_cy: number;
  depOpening_py: number;
  totalDepCharged_cy: number;
  adminDep_cy: number;
  taxBase_cy: number;
}

export interface ShareConfig {
  authorizedShares: number;
  authorizedFaceValue: number;
  issuedShares: number;
  issuedFaceValue: number;
}

export interface TaxConfig {
  rateOnRevenue_cy: number;
  rateOnRevenue_py: number;
  rateOnIncome_cy: number;
  rateOnIncome_py: number;
}

export interface Row {
  id: string;
  label: string;
  value_cy: number;
  value_py: number;
  isTotal?: boolean;
  isSubHeader?: boolean;
  isRichText?: boolean;
  crossNoteRef?: boolean;
  locked?: boolean;
  indentLevel?: number;
}

export interface Section {
  id: string;
  noteNumber: string;
  title: string;
  suffixLabel?: string;
  showDoubleLine?: boolean;
  tableType?: string;
  rows: Row[];
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNo: string;
  value_cy: number;
  value_py: number;
}

export interface Shareholder {
  id: string;
  name: string;
  shares: number;
}

export interface Loan {
  id: string;
  lenderName: string;
  accountNo: string;
  nonCurrent_cy: number;
  current_cy: number;
  total_py: number;
}

export type LoanEntry = Loan;
export type UPASEntry = Loan;

export interface Store {
  company: Company;
  ppe: PPE;
  shareConfig: ShareConfig;
  taxConfig: TaxConfig;
  shareholders: Shareholder[];
  bankAccounts: BankAccount[];
  loans: Loan[];
  upasEntries: Loan[];
  sections: Section[];
  updateRow: (sId: string, rId: string, field: string, value: number) => void;
  addRow: (sId: string) => void;
  deleteRow: (sId: string, rId: string) => void;
  updateRowLabel: (sId: string, rId: string, label: string) => void;
  updateConfig: (cat: string, field: string, value: any) => void;
  addTableItem: (type: string) => void;
  updateTableItem: (type: string, id: string, field: string, value: any) => void;
  deleteTableItem: (type: string, id: string) => void;
  updateSectionTitle: (sId: string, title: string) => void;
  updatePPESummary: (summary: Partial<Store['ppe']>) => void;
  updateCompanyInfo: (field: keyof Company, value: string) => void;
}

export type StoreData = Omit<
  Store,
  | 'updateRow'
  | 'addRow'
  | 'deleteRow'
  | 'updateRowLabel'
  | 'updateConfig'
  | 'addTableItem'
  | 'updateTableItem'
  | 'deleteTableItem'
  | 'updateSectionTitle'
  | 'updatePPESummary'
  | 'updateCompanyInfo'
>;