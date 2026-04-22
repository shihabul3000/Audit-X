import fs from 'fs';
import { recalculate } from './src/components/tabs/N4_13/recalculate.ts';
import { buildInitialSections } from './src/components/tabs/N4_13/sections.ts';

function getDefaultNotesData() {
  return {
    company: { companyName: '', address: '', reportingDateLabel: '', priorDateLabel: '', currency: 'BDT' },
    ppe: { costClosing_cy: 0, costOpening_py: 0, depClosing_cy: 0, depOpening_py: 0, totalDepCharged_cy: 0, adminDep_cy: 0, taxBase_cy: 0 },
    shareConfig: { authorizedShares: 10000, authorizedFaceValue: 100, issuedShares: 1000, issuedFaceValue: 100 },
    taxConfig: { rateOnRevenue_cy: 0.006, rateOnRevenue_py: 0.006, rateOnIncome_cy: 0.275, rateOnIncome_py: 0.275 },
    shareholders: [{ id: '1', name: 'Md. Shareholder', shares: 1000 }],
    bankAccounts: [{ id: 'b1', bankName: 'Bank', accountNo: '123', value_cy: 1000, value_py: 500 }],
    loans: [{ id: 'l1', lenderName: 'Lender', accountNo: '321', nonCurrent_cy: 200, current_cy: 100, total_py: 400 }],
    upasEntries: [],
    sections: buildInitialSections()
  };
}

const prevData = getDefaultNotesData();
// Fill dummy data for tests
prevData.sections.forEach((s: any) => {
  s.rows.forEach((r: any) => {
    r.value_cy = 999;
    r.value_py = 888;
  });
});

const newData = JSON.parse(JSON.stringify(prevData));
newData.sections.forEach((newSection: any) => {
  newSection.rows.forEach((newRow: any) => {
    newRow.value_py = newRow.value_cy;
    newRow.value_cy = 0;
  });
});

const findRow = (sId: string, rId: string) =>
  newData.sections.find((s:any) => s.id === sId)?.rows.find((r:any) => r.id === rId);
const prevRow = (sId: string, rId: string) =>
  prevData.sections.find((s:any) => s.id === sId)?.rows.find((r:any) => r.id === rId);

const carryMap = [
  { s: 'note14', from: 're_closing', to: 're_opening' },       // Retained Earnings
  { s: 'note20', from: 'cos_close_fg', to: 'cos_open_fg' },    // Finished Goods
  { s: 'note20_02', from: 'rm_close', to: 'rm_open' },         // Raw Materials
  { s: 'note20_02', from: 'pm_close', to: 'pm_open' },         // Packing Materials
  { s: 'note20_03', from: 'wip_close', to: 'wip_open' },       // Work-in-Progress
  { s: 'note20_04', from: 'ps_close', to: 'ps_open' },         // Production Supplies
  { s: 'note08_01', from: 'vat_total', to: 'vat_opening' },    // Advance for VAT
  { s: 'note10', from: 'ait_total', to: 'ait_opening' },       // AIT opening
  { s: 'note17_dtl', from: 'dtl_total', to: 'dtl_opening' },   // DTL opening
  { s: 'note21_ctp', from: 'ctp_total', to: 'ctp_opening' },   // CTP opening
];

carryMap.forEach(m => {
  const rowToUpdate = findRow(m.s, m.to);
  const sourceRow = prevRow(m.s, m.from);
  if (rowToUpdate && sourceRow) {
    rowToUpdate.value_cy = sourceRow.value_cy;
  }
});

newData.ppe = { costClosing_cy: 0, costOpening_py: 999, depClosing_cy: 0, depOpening_py: 999, totalDepCharged_cy: 0, adminDep_cy: 0, taxBase_cy: 0 };
newData.bankAccounts = prevData.bankAccounts.map((acc: any) => ({ ...acc, value_py: acc.value_cy, value_cy: 0 }));
newData.loans = prevData.loans.map((loan: any) => ({ ...loan, total_py: loan.nonCurrent_cy + loan.current_cy, nonCurrent_cy: 0, current_cy: 0 }));
newData.upasEntries = prevData.upasEntries.map((upas: any) => ({ ...upas, total_py: upas.nonCurrent_cy + upas.current_cy, nonCurrent_cy: 0, current_cy: 0 }));
newData.shareConfig = { ...prevData.shareConfig };
newData.taxConfig = { ...prevData.taxConfig };

recalculate(newData);

const nonZeroCY = newData.sections.flatMap((s: any) => s.rows.filter((r: any) => r.value_cy !== 0 && r.value_cy !== -0).map((r: any) => `${s.id}.${r.id} = ${r.value_cy}`));
console.log("NON ZERO ROWS:", nonZeroCY.length);
console.log(nonZeroCY);
