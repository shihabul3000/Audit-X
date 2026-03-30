// FILE: src/components/tabs/SFP.tsx
// ⚠️ RULES:
// 1. useStore() থেকে শুধু read করবে — কোনো write নেই
// 2. Design/styling existing PNL বা অন্য tabs-এর মতো হবে
// 3. Note references Excel-এর মতো দেখাবে (e.g., "Note 4")
// 4. formatBDT import করবে N4_13/utils থেকে

import React from 'react';
import { useStore } from './N4_13/store';
import { formatBDT } from './N4_13/utils';

export const SFP: React.FC<{ data: any }> = ({ data }) => {
  const store = useStore();

  // ── Helper ───────────────────────────────────────────────────────
  const g = (sId: string, rId: string, field = 'value_cy'): number => {
    const sec = store.sections.find(s => s.id === sId);
    const row = sec?.rows.find(r => r.id === rId);
    return (row as any)?.[field] ?? 0;
  };

  // ── NON-CURRENT ASSETS ───────────────────────────────────────────
  const ppe_cy        = g('note04', 'ppe_total');
  const ppe_py        = g('note04', 'ppe_total', 'value_py');
  const intang_cy     = g('note05', 'intang_nbv');
  const intang_py     = g('note05', 'intang_nbv', 'value_py');
  const totalNCA_cy   = ppe_cy + intang_cy;
  const totalNCA_py   = ppe_py + intang_py;

  // ── CURRENT ASSETS ───────────────────────────────────────────────
  const inv_cy        = g('note06', 'inv_total');
  const inv_py        = g('note06', 'inv_total', 'value_py');
  const rec_cy        = g('note07', 'rec_total');
  const rec_py        = g('note07', 'rec_total', 'value_py');
  const adv_cy        = g('note08', 'adv_total');
  const adv_py        = g('note08', 'adv_total', 'value_py');
  const invFin_cy     = g('note09', 'inv_fin_total');
  const invFin_py     = g('note09', 'inv_fin_total', 'value_py');
  const ait_cy        = g('note10', 'ait_total');
  const ait_py        = g('note10', 'ait_total', 'value_py');
  const cash_cy       = g('note11', 'cash_total');
  const cash_py       = g('note11', 'cash_total', 'value_py');
  const totalCA_cy    = inv_cy + rec_cy + adv_cy + invFin_cy + ait_cy + cash_cy;
  const totalCA_py    = inv_py + rec_py + adv_py + invFin_py + ait_py + cash_py;
  const totalAssets_cy = totalNCA_cy + totalCA_cy;
  const totalAssets_py = totalNCA_py + totalCA_py;

  // ── EQUITY ───────────────────────────────────────────────────────
  const totalShares   = store.shareholders.reduce((s, sh) => s + sh.shares, 0);
  const shareAmt      = totalShares * store.shareConfig.issuedFaceValue;
  const calls_cy      = g('note12_03', 'calls_total');
  const calls_py      = g('note12_03', 'calls_total', 'value_py');
  const reval_cy      = g('note13', 'reval_total');
  const reval_py      = g('note13', 'reval_total', 'value_py');
  const re_cy         = g('note14', 're_closing');
  const re_py         = g('note14', 're_closing', 'value_py');
  const totalEq_cy    = shareAmt + calls_cy + reval_cy + re_cy;
  const totalEq_py    = shareAmt + calls_py + reval_py + re_py;

  // ── NON-CURRENT LIABILITIES ──────────────────────────────────────
  const loanNC_cy     = store.loans.reduce((s, l) => s + l.nonCurrent_cy, 0);
  const loanNC_py     = store.loans.reduce((s, l) => s + l.total_py, 0);
  const upasNC_cy     = store.upasEntries.reduce((s, l) => s + l.nonCurrent_cy, 0);
  const upasNC_py     = store.upasEntries.reduce((s, l) => s + l.total_py, 0);
  const dtl_cy        = g('note17_dtl', 'dtl_total');
  const dtl_py        = g('note17_dtl', 'dtl_total', 'value_py');
  const relLiab_cy    = g('note18', 'rel_liab_total');
  const relLiab_py    = g('note18', 'rel_liab_total', 'value_py');
  const totalNCL_cy   = loanNC_cy + upasNC_cy + dtl_cy + relLiab_cy;
  const totalNCL_py   = loanNC_py + upasNC_py + dtl_py + relLiab_py;

  // ── CURRENT LIABILITIES ──────────────────────────────────────────
  const loanC_cy      = store.loans.reduce((s, l) => s + l.current_cy, 0);
  const loanC_py      = 0; // current portion PY — user inputs separately if needed
  const advCust_cy    = g('note19_adv', 'adv_cust_total');
  const advCust_py    = g('note19_adv', 'adv_cust_total', 'value_py');
  const payables_cy   = g('note20_pay', 'pay_total');
  const payables_py   = g('note20_pay', 'pay_total', 'value_py');
  const taxPay_cy     = g('note21_ctp', 'ctp_total');
  const taxPay_py     = g('note21_ctp', 'ctp_total', 'value_py');
  const prov_cy       = g('note22', 'prov_total');
  const prov_py       = g('note22', 'prov_total', 'value_py');
  const totalCL_cy    = loanC_cy + advCust_cy + payables_cy + taxPay_cy + prov_cy;
  const totalCL_py    = loanC_py + advCust_py + payables_py + taxPay_py + prov_py;
  const totalLiab_cy  = totalNCL_cy + totalCL_cy;
  const totalLiab_py  = totalNCL_py + totalCL_py;
  const totalEqLiab_cy = totalEq_cy + totalLiab_cy;
  const totalEqLiab_py = totalEq_py + totalLiab_py;

  // ── RENDER HELPERS ───────────────────────────────────────────────
  const Row = ({ label, note, cy, py, bold = false, indent = true }: {
    label: string; note?: number | string; cy: number; py: number;
    bold?: boolean; indent?: boolean;
  }) => (
    <div className={`flex justify-between py-0.5 ${bold ? 'font-bold' : ''}`}>
      <div className={`flex flex-1 ${indent ? 'pl-8' : ''}`}>
        <span className="flex-1">{label}</span>
        {note !== undefined && (
          <span className="w-8 text-center text-gray-500 text-[10px]">{note}</span>
        )}
      </div>
      <div className="flex gap-6">
        <span className="w-32 text-right tabular-nums">{formatBDT(cy)}</span>
        <span className="w-32 text-right tabular-nums">{formatBDT(py)}</span>
      </div>
    </div>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <div className="font-bold mt-4 mb-1 text-gray-800 border-b border-gray-300 pb-0.5">
      {title}
    </div>
  );

  const TotalLine = () => (
    <div className="flex justify-end mt-0.5">
      <div className="flex gap-6">
        <div className="w-32 border-t border-gray-600" />
        <div className="w-32 border-t border-gray-600" />
      </div>
    </div>
  );

  const DoubleLine = () => (
    <div className="flex justify-end mt-0.5">
      <div className="flex gap-6">
        <div className="w-32 border-t-2 border-double border-gray-800" />
        <div className="w-32 border-t-2 border-double border-gray-800" />
      </div>
    </div>
  );

  return (
    <div className="w-full bg-white p-8 font-serif text-[11px] leading-tight text-black">
      {/* Header */}
      <div className="text-center mb-4 border-b-2 border-gray-800 pb-2">
        <div className="font-bold text-base">{store.company.companyName}</div>
        <div className="mt-1">Statement of financial position</div>
        <div className="text-gray-600">As at {store.company.reportingDateLabel}</div>
      </div>

      {/* Column headers */}
      <div className="flex justify-end mb-2">
        <div className="flex gap-6 text-center font-bold">
          <div className="w-8 text-gray-500 text-[10px]">Notes</div>
          <div className="w-32 border-b border-gray-600 pb-0.5">
            {store.company.reportingDateLabel}
          </div>
          <div className="w-32 border-b border-gray-600 pb-0.5">
            {store.company.priorDateLabel}
          </div>
        </div>
      </div>

      {/* ASSETS */}
      <div className="font-bold mt-2">ASSETS</div>
      <SectionHeader title="Non-current assets" />
      <Row label="Property, plant and equipment" note={4} cy={ppe_cy} py={ppe_py} />
      <Row label="Intangible assets" cy={intang_cy} py={intang_py} />
      <TotalLine />
      <Row label="Total non-current assets" cy={totalNCA_cy} py={totalNCA_py} bold indent={false} />
      <DoubleLine />

      <SectionHeader title="Current assets" />
      <Row label="Inventories" note={5} cy={inv_cy} py={inv_py} />
      <Row label="Trade and other receivables" note={6} cy={rec_cy} py={rec_py} />
      <Row label="Advances, deposits and prepayments" note={7} cy={adv_cy} py={adv_py} />
      <Row label="Investments in financial assets" cy={invFin_cy} py={invFin_py} />
      <Row label="Advance income tax" note={8} cy={ait_cy} py={ait_py} />
      <Row label="Cash and cash equivalents" note={9} cy={cash_cy} py={cash_py} />
      <TotalLine />
      <Row label="Total current assets" cy={totalCA_cy} py={totalCA_py} bold indent={false} />
      <DoubleLine />

      <Row label="Total assets" cy={totalAssets_cy} py={totalAssets_py} bold indent={false} />
      <DoubleLine />

      {/* EQUITY AND LIABILITIES */}
      <div className="font-bold mt-4">EQUITY AND LIABILITIES</div>
      <SectionHeader title="Shareholders' equity" />
      <Row label="Share capital" note={10} cy={shareAmt} py={shareAmt} />
      <Row label="Calls-in-arrear" cy={calls_cy} py={calls_py} />
      <Row label="Revaluation surplus" note={11} cy={reval_cy} py={reval_py} />
      <Row label="Retained earnings" note={12} cy={re_cy} py={re_py} />
      <TotalLine />
      <Row label="Total equity" cy={totalEq_cy} py={totalEq_py} bold indent={false} />
      <DoubleLine />

      <SectionHeader title="Non-current liabilities" />
      <Row label="Borrowings from bank" note={13} cy={loanNC_cy} py={loanNC_py} />
      <Row label="UPAS liabilities" note={14} cy={upasNC_cy} py={upasNC_py} />
      <Row label="Deferred tax liabilities" note={15} cy={dtl_cy} py={dtl_py} />
      <Row label="Financial liabilities with related parties" cy={relLiab_cy} py={relLiab_py} />
      <TotalLine />
      <Row label="Total non-current liabilities" cy={totalNCL_cy} py={totalNCL_py} bold indent={false} />
      <DoubleLine />

      <SectionHeader title="Current liabilities" />
      <Row label="Borrowings from bank - current portion" note={13} cy={loanC_cy} py={loanC_py} />
      <Row label="Advance received from customers" cy={advCust_cy} py={advCust_py} />
      <Row label="Trade and other payables" note={16} cy={payables_cy} py={payables_py} />
      <Row label="Current tax payable" note={17} cy={taxPay_cy} py={taxPay_py} />
      <Row label="Provision for expense" note={18} cy={prov_cy} py={prov_py} />
      <TotalLine />
      <Row label="Total current liabilities" cy={totalCL_cy} py={totalCL_py} bold indent={false} />
      <DoubleLine />

      <Row label="Total liabilities" cy={totalLiab_cy} py={totalLiab_py} bold indent={false} />
      <DoubleLine />

      <Row label="Total equity and liabilities" cy={totalEqLiab_cy} py={totalEqLiab_py} bold indent={false} />
      <DoubleLine />

      {/* Balance check */}
      {Math.abs(totalAssets_cy - totalEqLiab_cy) > 1 && (
        <div className="mt-2 text-red-500 text-[10px] print:hidden">
          ⚠️ Balance sheet does not balance: difference = {formatBDT(totalAssets_cy - totalEqLiab_cy)}
        </div>
      )}
    </div>
  );
};
