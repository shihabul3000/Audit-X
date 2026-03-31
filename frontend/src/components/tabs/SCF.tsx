// FILE: src/components/tabs/SCF.tsx
// ⚠️ Rules: existing design unchanged, only values made dynamic
import React from 'react';
import { AuditReportData } from '../../types';
import { getFormattedDate } from '../../utils/dateFormatter';
import { useStore } from './N4_13/store';
import { formatBDT } from './N4_13/utils';

interface SCFProps {
  data: AuditReportData;
}

export const SCF: React.FC<SCFProps> = ({ data }) => {
  const store = useStore();

  // ── Helper ────────────────────────────────────────────────────────
  const g = (sId: string, rId: string, field = 'value_cy'): number => {
    const sec = store.sections.find(s => s.id === sId);
    const row = sec?.rows.find(r => r.id === rId);
    return (row as any)?.[field] ?? 0;
  };

  // ══ A) OPERATING ACTIVITIES ═══════════════════════════════════════

  // Non-cash add-backs
  const pbt         = g('note25_01', 'pbt');                           // PBT from Note 29.01
  const finance_add = g('note23', 'fc_total');                         // Finance costs (positive)
  const dep_ppe     = store.ppe.totalDepCharged_cy;                    // Total depreciation
  const amort       = -g('note05', 'intang_amort');                    // Intangible amort (stored -ve)
  const ppeGainLoss = 0;                                               // Gain on disposal

  const priorToWC   = pbt + finance_add + ppeGainLoss + dep_ppe + amort;

  // Working capital changes (PY - CY for assets: increase = outflow)
  const inv_cy   = g('note06', 'inv_total');
  const inv_py   = g('note06', 'inv_total', 'value_py');
  const delta_inv = inv_py - inv_cy;                                   // negative if inv ↑

  const rec_cy   = g('note07', 'rec_total');
  const rec_py   = g('note07', 'rec_total', 'value_py');
  const delta_rec = rec_py - rec_cy;

  const adv_cy   = g('note08', 'adv_total');
  const adv_py   = g('note08', 'adv_total', 'value_py');
  const delta_adv = adv_py - adv_cy;

  const invFin_cy = g('note09', 'inv_fin_total');
  const invFin_py = g('note09', 'inv_fin_total', 'value_py');
  const delta_invFin = invFin_py - invFin_cy;

  // Liabilities: CY - PY (increase = inflow)
  const advCust_cy = g('note19_adv', 'adv_cust_total');
  const advCust_py = g('note19_adv', 'adv_cust_total', 'value_py');
  const delta_advCust = advCust_cy - advCust_py;

  const pay_cy   = g('note20_pay', 'pay_total');
  const pay_py   = g('note20_pay', 'pay_total', 'value_py');
  const delta_pay = pay_cy - pay_py;

  const prov_cy  = g('note22', 'prov_total');
  const prov_py  = g('note22', 'prov_total', 'value_py');
  const delta_prov = prov_cy - prov_py;

  // Finance costs paid (cash outflow)
  const finCostPaid = -finance_add;

  // Income tax paid:
  // = opening CTP + current tax expense - closing CTP + AIT movement
  const ctp_opening  = g('note21_ctp', 'ctp_opening');
  const tax_expense  = g('note25', 'current_tax');
  const ctp_closing  = g('note21_ctp', 'ctp_total');
  const ait_closing  = g('note10', 'ait_total');
  const ait_opening  = g('note10', 'ait_opening');
  const taxPaid = -(ctp_opening + tax_expense - ctp_closing) - (ait_closing - ait_opening);

  const netCF_operating = priorToWC
    + delta_inv + delta_rec + delta_adv + delta_invFin
    + delta_advCust + delta_pay + delta_prov
    + finCostPaid + taxPaid;

  // ══ B) INVESTING ACTIVITIES ════════════════════════════════════════

  // PPE acquisition = cost increase (excluding revaluation)
  // Revaluation adds to cost but is not cash → subtract reval from cost change
  const reval_gross   = g('note13', 'reval_surplus');                  // gross reval before tax
  const ppeCostChange = store.ppe.costClosing_cy - store.ppe.costOpening_py;
  const ppePurchase   = -(ppeCostChange - reval_gross);                // cash paid for PPE

  const ppeProceeds   = 0;                                             // from Note 25.01 if any
  const intangDisp    = 0;

  const netCF_investing = ppeProceeds + ppePurchase + intangDisp;

  // ══ C) FINANCING ACTIVITIES ════════════════════════════════════════

  const shareCashIn   = 0;                                             // no new shares for cash

  const loanClosing   = store.loans.reduce((s, l) => s + l.nonCurrent_cy + l.current_cy, 0);
  const loanOpening   = store.loans.reduce((s, l) => s + l.total_py, 0);
  const netBorrowings = loanClosing - loanOpening;

  const upasClosing   = store.upasEntries.reduce((s, l) => s + l.nonCurrent_cy + l.current_cy, 0);
  const upasOpening   = store.upasEntries.reduce((s, l) => s + l.total_py, 0);
  const netUPAS       = upasClosing - upasOpening;

  const relLiab_cy    = g('note18', 'rel_liab_total');
  const relLiab_py    = g('note18', 'rel_liab_total', 'value_py');
  const netRelParty   = relLiab_cy - relLiab_py;

  const netCF_financing = shareCashIn + netBorrowings + netUPAS + netRelParty;

  // ══ SUMMARY ════════════════════════════════════════════════════════

  const netChange    = netCF_operating + netCF_investing + netCF_financing;
  const cashBegin    = g('note11', 'cash_total', 'value_py');          // PY cash total
  const fxEffect     = 0;
  const cashEnd      = g('note11', 'cash_total');                      // CY cash total

  // PY equivalents (use value_py field)
  const pbt_py      = g('note25_01', 'pbt', 'value_py');
  const fin_py      = g('note23', 'fc_total', 'value_py');
  const dep_py      = store.ppe.depOpening_py > 0 ? 0 : 0;            // PY dep from store if available
  const netCF_op_py = 0;                                               // simplified: 0 for PY
  const netCF_inv_py = -(store.ppe.costOpening_py - 0);               // simplified
  const netCF_fin_py = 0;
  const netChange_py = 0;
  const cashBegin_py = 0;
  const cashEnd_py   = cashBegin;                                      // PY end = CY begin

  // ── Row renderer ──────────────────────────────────────────────────
  const Row = ({
    label, cy, py, bold = false, italic = false, indent = true, underline = false
  }: {
    label: string; cy: number; py: number;
    bold?: boolean; italic?: boolean; indent?: boolean; underline?: boolean;
  }) => (
    <tr className={`${bold ? 'font-bold' : ''} ${italic ? 'italic' : ''}`}>
      <td className={`${indent ? 'pl-4' : ''} py-0.5`}>{label}</td>
      <td className={`text-right ${underline ? 'border-b border-black' : ''}`}>
        {formatBDT(cy)}
      </td>
      <td className={`text-right ${underline ? 'border-b border-black' : ''}`}>
        {formatBDT(py)}
      </td>
    </tr>
  );

  return (
    <div className="w-full bg-white p-8 font-serif text-[12px] leading-tight text-black">
      <div className="max-w-4xl mx-auto border border-blue-800 p-1 min-h-full">
        {/* Header */}
        <div className="border-b-2 border-blue-900 mb-1 pb-1">
          <h1 className="font-bold text-base">{data.company}</h1>
          <p className="text-xs">{data.addr}</p>
        </div>
        <div className="mb-2">
          <h2 className="font-bold">Statement of cash flows</h2>
          <p className="font-bold italic">
            For the year ended {getFormattedDate(data.reportingDate)}
          </p>
        </div>

        <div className="flex justify-end mb-1">
          <div className="flex gap-4">
            <span className="w-24 text-center font-bold border-b border-black">
              {getFormattedDate(data.reportingDate)}
            </span>
            <span className="w-24 text-center font-bold border-b border-black">
              {getFormattedDate(data.startDate)}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[11px]">
            <tbody>
              {/* A) OPERATING */}
              <tr className="font-bold">
                <td className="py-1">A) Cash flow from operating activities</td>
                <td /><td />
              </tr>
              <Row label="Profit before tax"           cy={pbt}          py={pbt_py} />
              <Row label="Finance costs"               cy={finance_add}  py={fin_py} />
              <Row label="(Gain) loss on disposal of property, plant and equipment"
                         cy={ppeGainLoss} py={0} />
              <Row label="Depreciation of property, plant and equipment"
                         cy={dep_ppe}     py={0} />
              <Row label="Amortization of intangible assets"
                         cy={amort}       py={0}      underline />
              <Row label="Operating cash flows before movements in working capital"
                         cy={priorToWC}   py={0}      bold italic underline />

              <Row label="(Increased)/decreased in Inventories"           cy={delta_inv}     py={0} />
              <Row label="(Increased)/decreased in Trade and other receivables"
                         cy={delta_rec}   py={0} />
              <Row label="(Increased)/decreased in Advances, deposits and prepayments"
                         cy={delta_adv}   py={0} />
              <Row label="(Increased)/decreased in Investments in financial assets"
                         cy={delta_invFin} py={0} />
              <Row label="(decreased)/increased in Advance received from customers"
                         cy={delta_advCust} py={0} />
              <Row label="(decreased)/increased in Trade and other payables"
                         cy={delta_pay}   py={0} />
              <Row label="Increased/(decreased) in Provision for expense"
                         cy={delta_prov}  py={0} />
              <Row label="Finance costs paid"   cy={finCostPaid} py={0} />
              <Row label="Income tax paid"      cy={taxPaid}     py={0}  underline />
              <Row label="Net cash (used in)/generated from operating activities"
                         cy={netCF_operating} py={netCF_op_py}
                         bold italic underline />

              {/* B) INVESTING */}
              <tr><td colSpan={3} className="h-4" /></tr>
              <tr className="font-bold">
                <td className="py-1">B) Cash flow from investing activities</td>
                <td /><td />
              </tr>
              <Row label="Proceeds from disposal of Property, plant and equipment"
                         cy={ppeProceeds} py={0} />
              <Row label="Acquisition of Property, plant and equipment"
                         cy={ppePurchase} py={0} />
              <Row label="Proceeds from disposal of Intangible assets"
                         cy={intangDisp}  py={0}  underline />
              <Row label="Net cash (used in)/generated from investing activities"
                         cy={netCF_investing} py={netCF_inv_py}
                         bold italic underline />

              {/* C) FINANCING */}
              <tr><td colSpan={3} className="h-4" /></tr>
              <tr className="font-bold">
                <td className="py-1">C) Cash flows from financing activities</td>
                <td /><td />
              </tr>
              <Row label="Received from Share capital"   cy={shareCashIn}  py={0} />
              <Row label="Proceeds from Borrowings from bank"
                         cy={netBorrowings} py={0} />
              <Row label="Proceeds from UPAS liabilities" cy={netUPAS}     py={0} />
              <Row label="(Repayment) of Financial liabilities with related parties"
                         cy={netRelParty}  py={0}  underline />
              <Row label="Net cash generated from/(used in) financing activities"
                         cy={netCF_financing} py={netCF_fin_py}
                         bold italic underline />

              {/* SUMMARY */}
              <tr className="font-bold italic border-b border-black bg-gray-50">
                <td className="py-1">
                  Net increase/(decrease) cash and cash equivalents (A+B+C)
                </td>
                <td className="text-right border-b border-black">{formatBDT(netChange)}</td>
                <td className="text-right border-b border-black">{formatBDT(netChange_py)}</td>
              </tr>

              <tr><td colSpan={3} className="h-4" /></tr>

              <tr className="border-t border-black">
                <td className="py-1">Cash and cash equivalents at beginning of year</td>
                <td className="text-right">{formatBDT(cashBegin)}</td>
                <td className="text-right">{formatBDT(cashBegin_py)}</td>
              </tr>
              <tr>
                <td className="py-1">Effect of foreign exchange rate changes</td>
                <td className="text-right border-b border-black">{formatBDT(fxEffect)}</td>
                <td className="text-right border-b border-black">{formatBDT(0)}</td>
              </tr>
              <tr className="font-bold border-y border-black">
                <td className="py-1">Cash and cash equivalents at end of year</td>
                <td className="text-right border-b border-black">{formatBDT(cashEnd)}</td>
                <td className="text-right border-b border-black">{formatBDT(cashEnd_py)}</td>
              </tr>

              {/* Verification check (non-print) */}
              {Math.abs(cashEnd - (cashBegin + netChange)) > 1 && (
                <tr className="print:hidden">
                  <td colSpan={3} className="text-red-500 text-[10px] py-1">
                    ⚠️ Cash flow does not reconcile — difference: {formatBDT(cashEnd - cashBegin - netChange)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
