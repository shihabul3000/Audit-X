// FILE: src/components/tabs/SFP.tsx
import React from 'react';
import { useStore } from './N4_13/store';
import { formatBDT } from './N4_13/utils';

export const SFP: React.FC<{ data: any }> = ({ data }) => {
  const store = useStore();

  // ── Get row value from store ──────────────────────────────────────
  const g = (sId: string, rId: string, field = 'value_cy'): number => {
    const sec = store.sections.find(s => s.id === sId);
    const row = sec?.rows.find(r => r.id === rId);
    return (row as any)?.[field] ?? 0;
  };

  // ── Get note number from store (dynamic — matches N4-13 display) ──
  const noteNum = (sectionId: string): string => {
    const n = store.sections.find(s => s.id === sectionId)?.noteNumber ?? '';
    // For share capital: '12.02' → show as '12'
    return n.includes('.') && sectionId.startsWith('note12') ? n.split('.')[0] : n;
  };

  // ── NON-CURRENT ASSETS ────────────────────────────────────────────
  const ppe_cy      = g('note04', 'ppe_total');
  const ppe_py      = g('note04', 'ppe_total', 'value_py');
  const intang_cy   = g('note05', 'intang_nbv');
  const intang_py   = g('note05', 'intang_nbv', 'value_py');
  const totalNCA_cy = ppe_cy + intang_cy;
  const totalNCA_py = ppe_py + intang_py;

  // ── CURRENT ASSETS ────────────────────────────────────────────────
  const inv_cy      = g('note06', 'inv_total');
  const inv_py      = g('note06', 'inv_total', 'value_py');
  const rec_cy      = g('note07', 'rec_total');
  const rec_py      = g('note07', 'rec_total', 'value_py');
  const adv_cy      = g('note08', 'adv_total');
  const adv_py      = g('note08', 'adv_total', 'value_py');
  const invFin_cy   = g('note09', 'inv_fin_total');
  const invFin_py   = g('note09', 'inv_fin_total', 'value_py');
  const ait_cy      = g('note10', 'ait_total');
  const ait_py      = g('note10', 'ait_total', 'value_py');
  const cash_cy     = g('note11', 'cash_total');
  const cash_py     = g('note11', 'cash_total', 'value_py');
  const totalCA_cy  = inv_cy + rec_cy + adv_cy + invFin_cy + ait_cy + cash_cy;
  const totalCA_py  = inv_py + rec_py + adv_py + invFin_py + ait_py + cash_py;
  const totalA_cy   = totalNCA_cy + totalCA_cy;
  const totalA_py   = totalNCA_py + totalCA_py;

  // ── EQUITY ────────────────────────────────────────────────────────
  const shareAmt    = store.shareholders.reduce((s, sh) => s + sh.shares, 0)
                      * store.shareConfig.issuedFaceValue;
  const calls_cy    = g('note12_03', 'calls_total');
  const calls_py    = g('note12_03', 'calls_total', 'value_py');
  const reval_cy    = g('note13', 'reval_total');
  const reval_py    = g('note13', 'reval_total', 'value_py');
  const re_cy       = g('note14', 're_closing');
  const re_py       = g('note14', 're_closing', 'value_py');
  const totalEq_cy  = shareAmt + calls_cy + reval_cy + re_cy;
  const totalEq_py  = shareAmt + calls_py + reval_py + re_py;

  // ── NON-CURRENT LIABILITIES ───────────────────────────────────────
  const loanNC_cy   = store.loans.reduce((s, l) => s + l.nonCurrent_cy, 0);
  const loanNC_py   = store.loans.reduce((s, l) => s + l.total_py, 0);
  const upasNC_cy   = store.upasEntries.reduce((s, l) => s + l.nonCurrent_cy, 0);
  const upasNC_py   = store.upasEntries.reduce((s, l) => s + l.total_py, 0);
  const dtl_cy      = g('note17_dtl', 'dtl_total');
  const dtl_py      = g('note17_dtl', 'dtl_total', 'value_py');
  const relL_cy     = g('note18', 'rel_liab_total');
  const relL_py     = g('note18', 'rel_liab_total', 'value_py');
  const totalNCL_cy = loanNC_cy + upasNC_cy + dtl_cy + relL_cy;
  const totalNCL_py = loanNC_py + upasNC_py + dtl_py + relL_py;

  // ── CURRENT LIABILITIES ───────────────────────────────────────────
  const loanC_cy    = store.loans.reduce((s, l) => s + l.current_cy, 0);
  const loanC_py    = 0;
  const advC_cy     = g('note19_adv', 'adv_cust_total');
  const advC_py     = g('note19_adv', 'adv_cust_total', 'value_py');
  const pay_cy      = g('note20_pay', 'pay_total');
  const pay_py      = g('note20_pay', 'pay_total', 'value_py');
  const ctp_cy      = g('note21_ctp', 'ctp_total');
  const ctp_py      = g('note21_ctp', 'ctp_total', 'value_py');
  const prov_cy     = g('note22', 'prov_total');
  const prov_py     = g('note22', 'prov_total', 'value_py');
  const totalCL_cy  = loanC_cy + advC_cy + pay_cy + ctp_cy + prov_cy;
  const totalCL_py  = loanC_py + advC_py + pay_py + ctp_py + prov_py;
  const totalL_cy   = totalNCL_cy + totalCL_cy;
  const totalL_py   = totalNCL_py + totalCL_py;
  const totalEL_cy  = totalEq_cy + totalL_cy;
  const totalEL_py  = totalEq_py + totalL_py;

  // ── RENDER HELPERS ────────────────────────────────────────────────
  const SfpRow = ({
    label, sectionId, cy, py, bold = false, indent = true
  }: {
    label: string;
    sectionId?: string;   // ← pass section id, note number fetched dynamically
    cy: number;
    py: number;
    bold?: boolean;
    indent?: boolean;
  }) => (
    <div className={`flex justify-between py-0.5 ${bold ? 'font-bold' : ''}`}>
      <div className={`flex flex-1 gap-2 ${indent ? 'pl-8' : ''}`}>
        <span className="flex-1">{label}</span>
        {sectionId && (
          <span className="w-8 text-center text-gray-500 text-[10px] shrink-0">
            {noteNum(sectionId)}
          </span>
        )}
      </div>
      <div className="flex gap-6">
        <span className="w-32 text-right tabular-nums font-serif">{formatBDT(cy)}</span>
        <span className="w-32 text-right tabular-nums font-serif">{formatBDT(py)}</span>
      </div>
    </div>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <div className="font-bold mt-4 mb-1 text-gray-800 border-b border-gray-200 pb-0.5 text-[11px]">
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
        <div className="mt-0.5">Statement of financial position</div>
        <div className="text-gray-600 text-[10px]">
          As at {store.company.reportingDateLabel}
        </div>
        <div className="text-right text-[10px] text-gray-500 mt-1">
          In {store.company.currency}
        </div>
      </div>

      {/* Column headers */}
      <div className="flex justify-end mb-3">
        <div className="flex items-end gap-6">
          <div className="w-8" />
          <div className="w-32 text-center font-bold border-b border-gray-600 pb-0.5">
            {store.company.reportingDateLabel}
          </div>
          <div className="w-32 text-center font-bold border-b border-gray-600 pb-0.5">
            {store.company.priorDateLabel}
          </div>
        </div>
      </div>

      {/* ── ASSETS ── */}
      <div className="font-bold mb-1">ASSETS</div>

      <SectionHeader title="Non-current assets" />
      <SfpRow label="Property, plant and equipment" sectionId="note04" cy={ppe_cy} py={ppe_py} />
      <SfpRow label="Intangible assets"             sectionId="note05" cy={intang_cy} py={intang_py} />
      <TotalLine />
      <SfpRow label="Total non-current assets" cy={totalNCA_cy} py={totalNCA_py} bold indent={false} />
      <DoubleLine />

      <SectionHeader title="Current assets" />
      <SfpRow label="Inventories"                          sectionId="note06" cy={inv_cy}    py={inv_py} />
      <SfpRow label="Trade and other receivables"          sectionId="note07" cy={rec_cy}    py={rec_py} />
      <SfpRow label="Advances, deposits and prepayments"   sectionId="note08" cy={adv_cy}    py={adv_py} />
      <SfpRow label="Investments in financial assets"      sectionId="note09" cy={invFin_cy} py={invFin_py} />
      <SfpRow label="Advance income tax"                   sectionId="note10" cy={ait_cy}    py={ait_py} />
      <SfpRow label="Cash and cash equivalents"            sectionId="note11" cy={cash_cy}   py={cash_py} />
      <TotalLine />
      <SfpRow label="Total current assets" cy={totalCA_cy} py={totalCA_py} bold indent={false} />
      <DoubleLine />

      <SfpRow label="Total assets" cy={totalA_cy} py={totalA_py} bold indent={false} />
      <DoubleLine />

      {/* ── EQUITY AND LIABILITIES ── */}
      <div className="font-bold mt-4 mb-1">EQUITY AND LIABILITIES</div>

      <SectionHeader title="Shareholders' equity" />
      <SfpRow label="Share capital"       sectionId="note12_02" cy={shareAmt} py={shareAmt} />
      <SfpRow label="Calls-in-arrear"     sectionId="note12_03" cy={calls_cy} py={calls_py} />
      <SfpRow label="Revaluation surplus" sectionId="note13"    cy={reval_cy} py={reval_py} />
      <SfpRow label="Retained earnings"   sectionId="note14"    cy={re_cy}    py={re_py} />
      <TotalLine />
      <SfpRow label="Total equity" cy={totalEq_cy} py={totalEq_py} bold indent={false} />
      <DoubleLine />

      <SectionHeader title="Non-current liabilities" />
      <SfpRow label="Borrowings from bank"                    sectionId="note15"     cy={loanNC_cy} py={loanNC_py} />
      <SfpRow label="UPAS liabilities"                        sectionId="note16"     cy={upasNC_cy} py={upasNC_py} />
      <SfpRow label="Deferred tax liabilities"                sectionId="note17_dtl" cy={dtl_cy}    py={dtl_py} />
      <SfpRow label="Financial liabilities with related parties" sectionId="note18"  cy={relL_cy}   py={relL_py} />
      <TotalLine />
      <SfpRow label="Total non-current liabilities" cy={totalNCL_cy} py={totalNCL_py} bold indent={false} />
      <DoubleLine />

      <SectionHeader title="Current liabilities" />
      <SfpRow label="Borrowings from bank - current portion" sectionId="note15"     cy={loanC_cy} py={loanC_py} />
      <SfpRow label="Advance received from customers"        sectionId="note19_adv" cy={advC_cy}  py={advC_py} />
      <SfpRow label="Trade and other payables"               sectionId="note20_pay" cy={pay_cy}   py={pay_py} />
      <SfpRow label="Current tax payable"                    sectionId="note21_ctp" cy={ctp_cy}   py={ctp_py} />
      <SfpRow label="Provision for expense"                  sectionId="note22"     cy={prov_cy}  py={prov_py} />
      <TotalLine />
      <SfpRow label="Total current liabilities" cy={totalCL_cy} py={totalCL_py} bold indent={false} />
      <DoubleLine />

      <SfpRow label="Total liabilities"          cy={totalL_cy}  py={totalL_py}  bold indent={false} />
      <DoubleLine />
      <SfpRow label="Total equity and liabilities" cy={totalEL_cy} py={totalEL_py} bold indent={false} />
      <DoubleLine />

      {/* Balance check (non-print) */}
      {Math.abs(totalA_cy - totalEL_cy) > 1 && (
        <div className="mt-2 text-xs text-red-500 print:hidden">
          ⚠️ Does not balance — difference: {formatBDT(totalA_cy - totalEL_cy)}
        </div>
      )}
    </div>
  );
};
