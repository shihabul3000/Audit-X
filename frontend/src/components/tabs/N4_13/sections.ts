import { Section, Row, PPE } from './types';
import { v4 as uuidv4 } from 'uuid';
// ─── INITIAL SECTIONS DATA ────────────────────────────────────────────────────
const buildInitialSections = () => [
  // ── NOTE 4: PPE ──────────────────────────────────────────────────────────
  {
    id: 'note04', noteNumber: '4', title: 'Property, plant and equipment',
    suffixLabel: 'Property, plant and equipment', showDoubleLine: true,
    rows: [
      { id: 'ppe_cost', label: 'At cost (Annexure A)', value_cy: 0, value_py: 0, crossNoteRef: true },
      { id: 'ppe_dep', label: 'Accumulated depreciation (Annexure A)', value_cy: 0, value_py: 0, crossNoteRef: true },
      { id: 'ppe_total', label: '', value_cy: 0, value_py: 0, isTotal: true },
    ]
  },
  {
    id: 'note04_01', noteNumber: '4.01', title: 'Category of assets',
    suffixLabel: 'Category of assets', showDoubleLine: true,
    rows: [
      { id: 'ppe_active', label: 'Property, plant and equipment are in active use', value_cy: 0, value_py: 0 },
      { id: 'ppe_auc', label: 'Assets under construction (AUC) or temporarily idle', value_cy: 0, value_py: 0 },
      { id: 'ppe_fulldep', label: 'Fully depreciated assets still in use', value_cy: 0, value_py: 0 },
      { id: 'ppe_hfs', label: 'Assets classified as held for sale', value_cy: 0, value_py: 0 },
      { id: 'cat_total', label: '', value_cy: 0, value_py: 0, isTotal: true },
    ]
  },
  // ── NOTE 5: INTANGIBLE ASSETS (was "Note 0" in demo) ─────────────────────
  {
    id: 'note05', noteNumber: '5', title: 'Intangible assets',
    suffixLabel: 'Intangible assets', showDoubleLine: true,
    rows: [
      { id: 'intang_cost', label: 'At cost (Annexure A)', value_cy: 0, value_py: 0 },
      { id: 'intang_amort', label: 'Accumulated amortization (Annexure A)', value_cy: 0, value_py: 0 },
      { id: 'intang_nbv', label: '', value_cy: 0, value_py: 0, isTotal: true },
    ]
  },
  // ── NOTE 6: INVENTORIES ───────────────────────────────────────────────────
  {
    id: 'note06', noteNumber: '6', title: 'Inventories',
    suffixLabel: 'Inventories', showDoubleLine: true,
    rows: [
      { id: 'fg', label: 'Finished goods', value_cy: 0, value_py: 0 },
      { id: 'wip', label: 'Work-in-progress', value_cy: 0, value_py: 0 },
      { id: 'rm', label: 'Raw materials', value_cy: 0, value_py: 0 },
      { id: 'pm', label: 'Packing materials', value_cy: 0, value_py: 0 },
      { id: 'prod_supplies', label: 'Production supplies and spare parts', value_cy: 0, value_py: 0 },
      { id: 'inv_sub', label: '', value_cy: 0, value_py: 0, isTotal: true },
      { id: 'iit', label: 'Inventory-in-transit — raw materials', value_cy: 0, value_py: 0 },
      { id: 'inv_total', label: '', value_cy: 0, value_py: 0, isTotal: true },
    ]
  },
  // ── NOTE 7: TRADE RECEIVABLES ─────────────────────────────────────────────
  {
    id: 'note07', noteNumber: '7', title: 'Trade and other receivables',
    suffixLabel: 'Trade and other receivables', showDoubleLine: true,
    rows: [
      { id: 'trade_rec', label: 'Trade receivable', value_cy: 0, value_py: 0 },
      { id: 'other_rec', label: 'Other receivables', value_cy: 0, value_py: 0 },
      { id: 'secured_rec', label: 'Secured receivables (cheque on hand)', value_cy: 0, value_py: 0 },
      { id: 'prov_bad', label: 'Provision for bad and doubtful debts', value_cy: 0, value_py: 0 },
      { id: 'rec_total', label: '', value_cy: 0, value_py: 0, isTotal: true },
    ]
  },
  // ── NOTE 8: ADVANCES ──────────────────────────────────────────────────────
  {
    id: 'note08', noteNumber: '8', title: 'Advances, deposits and prepayments',
    suffixLabel: 'Advances, deposits and prepayments', showDoubleLine: true,
    rows: [
      { id: 'adv_purchase', label: 'Advance against purchases', value_cy: 0, value_py: 0 },
      { id: 'adv_rent', label: 'Advance office rent', value_cy: 0, value_py: 0 },
      { id: 'adv_vat', label: 'Advance for VAT', value_cy: 0, value_py: 0 },
      { id: 'dep_bttb', label: 'Deposit with BTTB', value_cy: 0, value_py: 0 },
      { id: 'emp_loan', label: 'Employee loan', value_cy: 0, value_py: 0 },
      { id: 'prepaid', label: 'Prepaid expense', value_cy: 0, value_py: 0 },
      { id: 'adv_total', label: '', value_cy: 0, value_py: 0, isTotal: true },
    ]
  },
  {
    id: 'note08_01', noteNumber: '8.01', title: 'Advance for VAT',
    suffixLabel: 'Advance for VAT', showDoubleLine: true,
    rows: [
      { id: 'vat_opening', label: 'Opening balance', value_cy: 0, value_py: 0, locked: true },
      { id: 'vat_purchase', label: 'VAT on purchase', value_cy: 0, value_py: 0 },
      { id: 'vat_challan', label: 'VAT deposited by challan', value_cy: 0, value_py: 0 },
      { id: 'vat_payable', label: 'VAT payable on bills/invoiced', value_cy: 0, value_py: 0 },
      { id: 'vat_total', label: '', value_cy: 0, value_py: 0, isTotal: true },
    ]
  },
  // ── NOTE 9: INVESTMENTS IN FINANCIAL ASSETS (was "Note 0" in demo) ────────
  {
    id: 'note09', noteNumber: '9', title: 'Investments in financial assets',
    suffixLabel: 'Investments in financial assets', showDoubleLine: true,
    rows: [
      { id: 'inv_fdr', label: 'Investment in FDR', value_cy: 0, value_py: 0 },
      { id: 'inv_shares', label: 'Investment in shares', value_cy: 0, value_py: 0 },
      { id: 'inv_bonds', label: 'Investment in bonds / securities', value_cy: 0, value_py: 0 },
      { id: 'inv_fin_total', label: '', value_cy: 0, value_py: 0, isTotal: true },
    ]
  },
  // ── NOTE 10: ADVANCE INCOME TAX ───────────────────────────────────────────
  {
    id: 'note10', noteNumber: '10', title: 'Advance income tax',
    suffixLabel: 'Advance income tax', showDoubleLine: true,
    rows: [
      { id: 'ait_opening', label: 'Opening balance', value_cy: 0, value_py: 0, locked: true },
      { id: 'ait_import', label: 'AIT on import materials', value_cy: 0, value_py: 0 },
      { id: 'ait_challan', label: 'Tax deposit by Challan', value_cy: 0, value_py: 0 },
      { id: 'ait_goods', label: 'AIT on imported goods', value_cy: 0, value_py: 0 },
      { id: 'tds_license', label: 'TDS on trade license', value_cy: 0, value_py: 0 },
      { id: 'tds_vehicle', label: 'TDS on vehicle fitness (tax token)', value_cy: 0, value_py: 0 },
      { id: 'ait_bank', label: 'AIT on bank interest income', value_cy: 0, value_py: 0 },
      { id: 'ait_adj', label: 'Adjustment during the year (Note 21)', value_cy: 0, value_py: 0, crossNoteRef: true },
      { id: 'ait_total', label: '', value_cy: 0, value_py: 0, isTotal: true },
    ]
  },
  // ── NOTE 11: CASH AND CASH EQUIVALENTS ────────────────────────────────────
  {
    id: 'note11', noteNumber: '11', title: 'Cash and cash equivalents',
    suffixLabel: 'Cash and cash equivalents', showDoubleLine: true,
    rows: [
      { id: 'cash_hand', label: 'Cash on hand', value_cy: 0, value_py: 0 },
      { id: 'cash_at_bank', label: 'Cash at bank(s) (Note 11.01)', value_cy: 0, value_py: 0, crossNoteRef: true },
      { id: 'cash_total', label: '', value_cy: 0, value_py: 0, isTotal: true },
    ]
  },
  {
    id: 'note11_01', noteNumber: '11.01', title: 'Cash at bank(s)',
    tableType: 'bank_account', rows: []
  },
  // ── NOTE 12: SHARE CAPITAL ────────────────────────────────────────────────
  {
    id: 'note12_01', noteNumber: '12.01', title: 'Authorized capital',
    suffixLabel: 'Authorized capital', showDoubleLine: true,
    rows: [
      { id: 'auth_desc', label: 'Ordinary shares at face value', value_cy: 0, value_py: 0 },
      { id: 'auth_capital', label: '', value_cy: 0, value_py: 0, isTotal: true, crossNoteRef: true },
    ]
  },
  {
    id: 'note12_02', noteNumber: '12.02', title: 'Issued, subscribed, called up and paid up capital',
    tableType: 'shareholder',
    rows: [
      { id: 'issued_desc', label: 'Ordinary shares at face value', value_cy: 0, value_py: 0 },
      { id: 'issued_capital', label: '', value_cy: 0, value_py: 0, isTotal: true, crossNoteRef: true },
    ]
  },
  // ── NOTE 12.03: CALLS-IN-ARREAR (was "Note 0" in demo) ───────────────────
  {
    id: 'note12_03', noteNumber: '12.03', title: 'Calls-in-arrear',
    suffixLabel: 'Calls-in-arrear', showDoubleLine: true,
    rows: [
      { id: 'calls_arrear', label: 'Calls-in-arrear', value_cy: 0, value_py: 0 },
      { id: 'calls_total', label: '', value_cy: 0, value_py: 0, isTotal: true },
    ]
  },
  // ── NOTE 13: REVALUATION SURPLUS ─────────────────────────────────────────
  {
    id: 'note13', noteNumber: '13', title: 'Revaluation surplus',
    suffixLabel: 'Revaluation surplus', showDoubleLine: true,
    rows: [
      { id: 'reval_surplus', label: 'Revaluation surplus on land (freehold)', value_cy: 0, value_py: 0 },
      { id: 'reval_dtl', label: 'Deferred tax thereon', value_cy: 0, value_py: 0 },
      { id: 'reval_total', label: '', value_cy: 0, value_py: 0, isTotal: true },
    ]
  },
  // ── NOTE 14: RETAINED EARNINGS ────────────────────────────────────────────
  {
    id: 'note14', noteNumber: '14', title: 'Retained earnings',
    suffixLabel: 'Retained earnings', showDoubleLine: true,
    rows: [
      { id: 're_opening', label: 'Opening balance', value_cy: 0, value_py: 0, locked: true },
      { id: 're_policy', label: 'Changes in accounting policy', value_cy: 0, value_py: 0 },
      { id: 're_restated', label: 'Opening balance re-stated', value_cy: 0, value_py: 0, isTotal: true },
      { id: 're_income', label: 'Total comprehensive income for the year', value_cy: 0, value_py: 0 },
      { id: 're_closing', label: '', value_cy: 0, value_py: 0, isTotal: true },
    ]
  },
  // ── NOTE 15: BORROWINGS FROM BANK ─────────────────────────────────────────
  {
    id: 'note15', noteNumber: '15', title: 'Borrowings from bank',
    tableType: 'loan',
    rows: [
      { id: 'loan_grand', label: 'Total', value_cy: 0, value_py: 0, isTotal: true, crossNoteRef: true },
    ]
  },
  // ── NOTE 16: UPAS LIABILITIES ─────────────────────────────────────────────
  {
    id: 'note16', noteNumber: '16', title: 'UPAS liabilities',
    tableType: 'upas',
    rows: [
      { id: 'upas_grand', label: 'Total', value_cy: 0, value_py: 0, isTotal: true, crossNoteRef: true },
    ]
  },
  // ── NOTE 17: DEFERRED TAX LIABILITIES ─────────────────────────────────────
  {
    id: 'note17_dtl', noteNumber: '17', title: 'Deferred tax liabilities',
    suffixLabel: 'Deferred tax liabilities', showDoubleLine: true,
    rows: [
      { id: 'dtl_opening', label: 'Opening deferred tax liability', value_cy: 0, value_py: 0, locked: true },
      { id: 'dtl_addition', label: 'Add: Addition during the year', value_cy: 0, value_py: 0 },
      { id: 'dtl_total', label: '', value_cy: 0, value_py: 0, isTotal: true },
    ]
  },
  // ── NOTE 18: FINANCIAL LIABILITIES WITH RELATED PARTIES (was "Note 0") ────
  {
    id: 'note18', noteNumber: '18', title: 'Financial liabilities with related parties',
    suffixLabel: 'Financial liabilities with related parties', showDoubleLine: true,
    rows: [
      { id: 'rel_liab_1', label: 'Loan from directors', value_cy: 0, value_py: 0 },
      { id: 'rel_liab_2', label: 'Loan from related companies', value_cy: 0, value_py: 0 },
      { id: 'rel_liab_total', label: '', value_cy: 0, value_py: 0, isTotal: true },
    ]
  },
  // ── NOTE 19: ADVANCE RECEIVED FROM CUSTOMERS (was "Note 0") ──────────────
  {
    id: 'note19_adv', noteNumber: '19', title: 'Advance received from customers',
    suffixLabel: 'Advance received from customers', showDoubleLine: true,
    rows: [
      { id: 'adv_cust_1', label: 'Advance from trade customers', value_cy: 0, value_py: 0 },
      { id: 'adv_cust_2', label: 'Advance for export orders', value_cy: 0, value_py: 0 },
      { id: 'adv_cust_total', label: '', value_cy: 0, value_py: 0, isTotal: true },
    ]
  },
  // ── NOTE 20: TRADE AND OTHER PAYABLES ─────────────────────────────────────
  {
    id: 'note20_pay', noteNumber: '20', title: 'Trade and other payables',
    suffixLabel: 'Trade and other payables', showDoubleLine: true,
    rows: [
      { id: 'pay_rm', label: 'Payable for Raw materials', value_cy: 0, value_py: 0 },
      { id: 'pay_pm', label: 'Payable for Packing materials', value_cy: 0, value_py: 0 },
      { id: 'pay_transport', label: 'Payable for transport contractors', value_cy: 0, value_py: 0 },
      { id: 'pay_other', label: 'Payable for other services', value_cy: 0, value_py: 0 },
      { id: 'pay_total', label: '', value_cy: 0, value_py: 0, isTotal: true },
    ]
  },
  // ── NOTE 21: CURRENT TAX PAYABLE ──────────────────────────────────────────
  {
    id: 'note21_ctp', noteNumber: '21', title: 'Current tax payable',
    suffixLabel: 'Current tax payable', showDoubleLine: true,
    rows: [
      { id: 'ctp_opening', label: 'Opening balance', value_cy: 0, value_py: 0, locked: true },
      { id: 'ctp_challan', label: 'Tax deposit by Challan', value_cy: 0, value_py: 0 },
      { id: 'current_tax', label: 'Current tax for the year (Note 29)', value_cy: 0, value_py: 0, crossNoteRef: true },
      { id: 'adjustment', label: 'Adjustment during the year', value_cy: 0, value_py: 0 },
      { id: 'ctp_total', label: '', value_cy: 0, value_py: 0, isTotal: true },
    ]
  },
  // ── NOTE 22: PROVISION FOR EXPENSE ────────────────────────────────────────
  {
    id: 'note22', noteNumber: '22', title: 'Provision for expense',
    suffixLabel: 'Provision for expense', showDoubleLine: true,
    rows: [
      { id: 'prov_wages', label: 'Outstanding wages, salary and allowances', value_cy: 0, value_py: 0 },
      { id: 'prov_prof', label: 'Provision for professional fees', value_cy: 0, value_py: 0 },
      { id: 'prov_audit', label: 'Provision for audit fees', value_cy: 0, value_py: 0, crossNoteRef: true },
      { id: 'prov_vds', label: 'Provision for VDS on audit fees', value_cy: 0, value_py: 0 },
      { id: 'prov_tds', label: 'Provision for TDS on audit fees', value_cy: 0, value_py: 0 },
      { id: 'prov_legal', label: 'Provision for legal fees', value_cy: 0, value_py: 0 },
      { id: 'prov_total', label: '', value_cy: 0, value_py: 0, isTotal: true },
    ]
  },
  // ── NOTE 23: REVENUE ──────────────────────────────────────────────────────
  {
    id: 'note19', noteNumber: '23', title: 'Revenue',
    suffixLabel: 'Revenue', showDoubleLine: true,
    rows: [
      { id: 'revenue', label: 'Sales/bill received', value_cy: 0, value_py: 0 },
      { id: 'export', label: 'Export sales', value_cy: 0, value_py: 0 },
      { id: 'disc_price', label: "Distributors' product price discount", value_cy: 0, value_py: 0 },
      { id: 'disc_vol', label: "Distributors' volume discount", value_cy: 0, value_py: 0 },
      { id: 'commission', label: 'Channel sale commission/rebate', value_cy: 0, value_py: 0 },
      { id: 'vat_sales', label: 'VAT on sales', value_cy: 0, value_py: 0 },
      { id: 'net_revenue', label: '', value_cy: 0, value_py: 0, isTotal: true },
    ]
  },
  // ── NOTE 24: COST OF SALES ────────────────────────────────────────────────
  {
    id: 'note20', noteNumber: '24', title: 'Cost of sales',
    suffixLabel: 'Cost of sales', showDoubleLine: true,
    rows: [
      { id: 'cos_open_fg', label: 'Opening inventory — Finished goods', value_cy: 0, value_py: 0, locked: true },
      { id: 'cop', label: 'Cost of Production (Note 24.01)', value_cy: 0, value_py: 0, crossNoteRef: true },
      { id: 'cos_subtotal', label: '', value_cy: 0, value_py: 0, isTotal: true },
      { id: 'samples', label: 'Product sample costs', value_cy: 0, value_py: 0 },
      { id: 'cos_close_fg', label: 'Closing inventory — FG (Note 6)', value_cy: 0, value_py: 0, crossNoteRef: true },
      { id: 'cos_total', label: '', value_cy: 0, value_py: 0, isTotal: true },
    ]
  },
  {
    id: 'note20_01', noteNumber: '24.01', title: 'Cost of Production',
    suffixLabel: 'Cost of Production', showDoubleLine: true,
    rows: [
      { id: 'mat_used', label: 'Materials used in production (Note 24.02)', value_cy: 0, value_py: 0, crossNoteRef: true },
      { id: 'prod_oh', label: 'Production overhead (Note 24.03)', value_cy: 0, value_py: 0, crossNoteRef: true },
      { id: 'cop_total', label: '', value_cy: 0, value_py: 0, isTotal: true },
    ]
  },
  {
    id: 'note20_02', noteNumber: '24.02', title: 'Materials used in production',
    suffixLabel: 'Materials used in production', showDoubleLine: true,
    rows: [
      { id: 'rm_hdr', label: 'Raw materials', value_cy: 0, value_py: 0, isSubHeader: true },
      { id: 'rm_open', label: 'Opening Raw materials', value_cy: 0, value_py: 0, locked: true },
      { id: 'rm_purchase', label: 'Purchased during the year', value_cy: 0, value_py: 0 },
      { id: 'rm_import', label: 'Import during the year', value_cy: 0, value_py: 0 },
      { id: 'rm_transfer', label: 'Transfer in (inventory in transit)', value_cy: 0, value_py: 0 },
      { id: 'rm_close', label: 'Closing Raw materials', value_cy: 0, value_py: 0, crossNoteRef: true },
      { id: 'rm_used', label: 'Raw materials used', value_cy: 0, value_py: 0, isTotal: true },
      { id: 'pm_hdr', label: 'Packing materials', value_cy: 0, value_py: 0, isSubHeader: true },
      { id: 'pm_open', label: 'Opening Packing materials', value_cy: 0, value_py: 0, locked: true },
      { id: 'pm_purchase', label: 'Purchased during the year', value_cy: 0, value_py: 0 },
      { id: 'pm_import', label: 'Import during the year', value_cy: 0, value_py: 0 },
      { id: 'pm_close', label: 'Closing Packing materials', value_cy: 0, value_py: 0 },
      { id: 'pm_used', label: 'Packing materials used', value_cy: 0, value_py: 0, isTotal: true },
      { id: 'mat_total', label: 'Total materials used', value_cy: 0, value_py: 0, isTotal: true },
    ]
  },
  {
    id: 'note20_03', noteNumber: '24.03', title: 'Production overhead',
    suffixLabel: 'Production overhead', showDoubleLine: true,
    rows: [
      { id: 'wip_open', label: 'Opening Work-in-progress', value_cy: 0, value_py: 0, locked: true },
      { id: 'mfg_hdr', label: 'Manufacturing overhead', value_cy: 0, value_py: 0, isSubHeader: true },
      { id: 'elec_f', label: 'Electricity — Factory', value_cy: 0, value_py: 0 },
      { id: 'wages_f', label: 'Wages — Factory', value_cy: 0, value_py: 0 },
      { id: 'repair_f', label: 'Repair & Maintenance — Factory', value_cy: 0, value_py: 0 },
      { id: 'insurance_f', label: 'Fire Insurance — Factory', value_cy: 0, value_py: 0 },
      { id: 'gas_f', label: 'Gas bill — Factory', value_cy: 0, value_py: 0 },
      { id: 'diesel_f', label: 'Diesel, Octane & Kerosene — Factory', value_cy: 0, value_py: 0 },
      { id: 'conv_f', label: 'Conveyance — Factory', value_cy: 0, value_py: 0 },
      { id: 'lab_f', label: 'Lab supplies — Factory', value_cy: 0, value_py: 0 },
      { id: 'prod_sup', label: 'Production supplies used (Note 24.04)', value_cy: 0, value_py: 0, crossNoteRef: true },
      { id: 'dep_factory', label: 'Depreciation expense (Annexure A)', value_cy: 0, value_py: 0, crossNoteRef: true },
      { id: 'amort_f', label: 'Amortization expense (Annexure A)', value_cy: 0, value_py: 0 },
      { id: 'mfg_sub', label: '', value_cy: 0, value_py: 0, isTotal: true },
      { id: 'wip_close', label: 'Closing Work-in-progress (Note 6)', value_cy: 0, value_py: 0, crossNoteRef: true },
      { id: 'prod_oh_total', label: '', value_cy: 0, value_py: 0, isTotal: true },
    ]
  },
  {
    id: 'note20_04', noteNumber: '24.04', title: 'Production supplies and spare parts used',
    suffixLabel: 'Production supplies and spare parts used', showDoubleLine: true,
    rows: [
      { id: 'ps_open', label: 'Opening Production supplies', value_cy: 0, value_py: 0, locked: true },
      { id: 'ps_purchase', label: 'Spare parts purchased during the year', value_cy: 0, value_py: 0 },
      { id: 'ps_close', label: 'Closing Production supplies (Note 6)', value_cy: 0, value_py: 0, crossNoteRef: true },
      { id: 'ps_total', label: '', value_cy: 0, value_py: 0, isTotal: true },
    ]
  },
  // ── NOTE 25: ADMIN EXPENSE ────────────────────────────────────────────────
  {
    id: 'note21', noteNumber: '25', title: 'Administrative expense',
    suffixLabel: 'Administrative expense', showDoubleLine: true,
    rows: [
      { id: 'salary_a', label: 'Salary and allowances', value_cy: 0, value_py: 0 },
      { id: 'rent_util', label: 'Rent and utilities', value_cy: 0, value_py: 0 },
      { id: 'telecom', label: 'Telephone and mobile expenses', value_cy: 0, value_py: 0 },
      { id: 'it_exp', label: 'Business communication and IT', value_cy: 0, value_py: 0 },
      { id: 'travel_a', label: 'Travelling and conveyance', value_cy: 0, value_py: 0 },
      { id: 'entertain', label: 'Entertainment expense', value_cy: 0, value_py: 0 },
      { id: 'repairs_a', label: 'Repairs and maintenance', value_cy: 0, value_py: 0 },
      { id: 'printing', label: 'Printing and stationery', value_cy: 0, value_py: 0 },
      { id: 'prof_fees', label: 'Professional fees', value_cy: 0, value_py: 0 },
      { id: 'audit_fees', label: 'Audit fees', value_cy: 0, value_py: 0 },
      { id: 'dep_admin', label: 'Depreciation expense (Annexure A)', value_cy: 0, value_py: 0, crossNoteRef: true },
      { id: 'amort_a', label: 'Amortization expense (Annexure A)', value_cy: 0, value_py: 0 },
      { id: 'adm_total', label: '', value_cy: 0, value_py: 0, isTotal: true },
    ]
  },
  // ── NOTE 26: DISTRIBUTION COSTS ───────────────────────────────────────────
  {
    id: 'note26', noteNumber: '26', title: 'Distribution costs',
    suffixLabel: 'Distribution costs', showDoubleLine: true,
    rows: [
      { id: 'comm_exp', label: 'Communication Expenses', value_cy: 0, value_py: 0 },
      { id: 'marketing', label: 'Marketing & Selling Expense', value_cy: 0, value_py: 0 },
      { id: 'travel_d', label: 'Travel Expenses', value_cy: 0, value_py: 0 },
      { id: 'delivery', label: 'Delivery expenses', value_cy: 0, value_py: 0 },
      { id: 'postage_d', label: 'Postage & Stamp', value_cy: 0, value_py: 0 },
      { id: 'samples_d', label: 'Product sample costs', value_cy: 0, value_py: 0 },
      { id: 'dist_total', label: '', value_cy: 0, value_py: 0, isTotal: true },
    ]
  },
  // ── NOTE 27: OTHER INCOME (was "Note 0" in demo) ──────────────────────────
  {
    id: 'note27', noteNumber: '27', title: 'Other income',
    suffixLabel: 'Other income', showDoubleLine: true,
    rows: [
      { id: 'bank_interest', label: 'Bank interest received', value_cy: 0, value_py: 0 },
      { id: 'gain_assets', label: 'Gain on disposal of assets', value_cy: 0, value_py: 0 },
      { id: 'misc_income', label: 'Miscellaneous income', value_cy: 0, value_py: 0 },
      { id: 'other_total', label: '', value_cy: 0, value_py: 0, isTotal: true },
    ]
  },
  // ── NOTE 28: FINANCE COSTS ────────────────────────────────────────────────
  {
    id: 'note23', noteNumber: '28', title: 'Finance costs',
    suffixLabel: 'Finance costs', showDoubleLine: true,
    rows: [
      { id: 'int_cc', label: 'Interest on CC', value_cy: 0, value_py: 0 },
      { id: 'int_time', label: 'Interest on Time Loan', value_cy: 0, value_py: 0 },
      { id: 'int_lease_f', label: 'Interest on Factory Lease', value_cy: 0, value_py: 0 },
      { id: 'int_ltr', label: 'Interest on LTR', value_cy: 0, value_py: 0 },
      { id: 'int_uf', label: 'Interest on United Finance lease', value_cy: 0, value_py: 0 },
      { id: 'int_ipdc', label: 'Interest on IPDC automobile finance', value_cy: 0, value_py: 0 },
      { id: 'bank_charges', label: 'Bank charges', value_cy: 0, value_py: 0 },
      { id: 'fc_total', label: '', value_cy: 0, value_py: 0, isTotal: true },
    ]
  },
  // ── NOTE 29: INCOME TAX EXPENSE ───────────────────────────────────────────
  {
    id: 'note25', noteNumber: '29', title: 'Income tax expense',
    suffixLabel: 'Income tax expense', showDoubleLine: true,
    rows: [
      { id: 'current_tax', label: 'Current tax expense', value_cy: 0, value_py: 0, crossNoteRef: true },
      { id: 'deferred_tax', label: 'Deferred tax expense', value_cy: 0, value_py: 0 },
      { id: 'tax_total', label: '', value_cy: 0, value_py: 0, isTotal: true },
    ]
  },
  {
    id: 'note25_01', noteNumber: '29.01', title: 'Current tax for the year',
    suffixLabel: 'Current tax', showDoubleLine: true,
    rows: [
      { id: 'pbt', label: 'Profit before tax', value_cy: 0, value_py: 0 },
      { id: 'acc_dep', label: 'Accounting depreciation', value_cy: 0, value_py: 0 },
      { id: 'adj_profit', label: 'Adjusted profit', value_cy: 0, value_py: 0, isTotal: true },
      { id: 'tax_dep', label: 'Tax depreciation', value_cy: 0, value_py: 0 },
      { id: 'taxable_inc', label: 'Taxable total Income', value_cy: 0, value_py: 0, isTotal: true },
    ]
  },
];


export { buildInitialSections };