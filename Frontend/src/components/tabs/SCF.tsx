// FILE: src/components/tabs/SCF.tsx
// ⚠️ Rules: existing design unchanged, only values made dynamic
import React from 'react';
import { AuditReportData } from '../../types';
import { getFormattedDate } from '../../utils/dateFormatter';
import { useStore } from './N4_13/store';
import { formatBDT } from './N4_13/utils';
import { useAuditDataAPI } from '../../hooks/useAuditDataAPI';

interface SCFProps {
  data: AuditReportData;
}

export const SCF: React.FC<SCFProps> = ({ data }) => {
  const store = useStore();
  const { notesData } = useAuditDataAPI();

  // Previous year notes — for now we use null (prev year data not available in this view)
  // In a full implementation, this would fetch the previous year's notes from the API
  const getPrevYearNotes = () => {
    return null;
  };

  const prevYearNotes = getPrevYearNotes();

  // ── Calculation Engine ────────────────────────────────────────────
  const calculateCF = (notes: any) => {
    if (!notes) {
      return {
        pbt: 0, finance_add: 0, ppeGainLoss: 0, dep_ppe: 0, amort: 0, priorToWC: 0,
        delta_inv: 0, delta_rec: 0, delta_adv: 0, delta_invFin: 0, delta_advCust: 0, delta_pay: 0, delta_prov: 0,
        finCostPaid: 0, taxPaid: 0, netCF_operating: 0, ppeProceeds: 0, ppePurchase: 0, intangDisp: 0, netCF_investing: 0,
        shareCashIn: 0, netBorrowings: 0, netUPAS: 0, netRelParty: 0, netCF_financing: 0, netChange: 0, cashBegin: 0, cashEnd: 0
      };
    }

    const g = (sId: string, rId: string, field = 'value_cy'): number => {
      const sec = notes.sections?.find((s: any) => s.id === sId);
      const row = sec?.rows?.find((r: any) => r.id === rId);
      return (row as any)?.[field] ?? 0;
    };

    // ── A) OPERATING ──
    const pbt = g('note25_01', 'pbt');
    const finance_add = g('note23', 'fc_total');
    const dep_ppe = notes.ppe?.totalDepCharged_cy || 0;
    const amort = -g('note05', 'intang_amort');
    const ppeGainLoss = 0;
    const priorToWC = pbt + finance_add + ppeGainLoss + dep_ppe + amort;

    // WC Changes (PY - CY)
    const delta_inv = g('note06', 'inv_total', 'value_py') - g('note06', 'inv_total');
    const delta_rec = g('note07', 'rec_total', 'value_py') - g('note07', 'rec_total');
    const delta_adv = g('note08', 'adv_total', 'value_py') - g('note08', 'adv_total');
    const delta_invFin = g('note09', 'inv_fin_total', 'value_py') - g('note09', 'inv_fin_total');
    
    // Liabilities (CY - PY)
    const delta_advCust = g('note19_adv', 'adv_cust_total') - g('note19_adv', 'adv_cust_total', 'value_py');
    const delta_pay = g('note20_pay', 'pay_total') - g('note20_pay', 'pay_total', 'value_py');
    const delta_prov = g('note22', 'prov_total') - g('note22', 'prov_total', 'value_py');

    const finCostPaid = -finance_add;
    const taxPaid = -(g('note21_ctp', 'ctp_opening') + g('note25', 'current_tax') - g('note21_ctp', 'ctp_total')) 
                    - (g('note10', 'ait_total') - g('note10', 'ait_opening'));

    const netCF_operating = priorToWC + delta_inv + delta_rec + delta_adv + delta_invFin 
                          + delta_advCust + delta_pay + delta_prov + finCostPaid + taxPaid;

    // ── B) INVESTING ──
    const reval_gross = g('note13', 'reval_surplus');
    const ppeCostChange = (notes.ppe?.costClosing_cy || 0) - (notes.ppe?.costOpening_py || 0);
    const ppePurchase = -(ppeCostChange - reval_gross);
    const ppeProceeds = 0;
    const intangDisp = 0;
    const netCF_investing = ppeProceeds + ppePurchase + intangDisp;

    // ── C) FINANCING ──
    const shareCashIn = 0;
    
    const loanClosing = notes.loans?.reduce((s: any, l: any) => s + l.nonCurrent_cy + l.current_cy, 0) || 0;
    const loanOpening = notes.loans?.reduce((s: any, l: any) => s + l.total_py, 0) || 0;
    const netBorrowings = loanClosing - loanOpening;

    const upasClosing = notes.upasEntries?.reduce((s: any, l: any) => s + l.nonCurrent_cy + l.current_cy, 0) || 0;
    const upasOpening = notes.upasEntries?.reduce((s: any, l: any) => s + l.total_py, 0) || 0;
    const netUPAS = upasClosing - upasOpening;

    const netRelParty = g('note18', 'rel_liab_total') - g('note18', 'rel_liab_total', 'value_py');
    const netCF_financing = shareCashIn + netBorrowings + netUPAS + netRelParty;

    // ── SUMMARY ──
    const netChange = netCF_operating + netCF_investing + netCF_financing;
    const cashBegin = g('note11', 'cash_total', 'value_py');
    const cashEnd = g('note11', 'cash_total');

    return {
      pbt, finance_add, ppeGainLoss, dep_ppe, amort, priorToWC,
      delta_inv, delta_rec, delta_adv, delta_invFin, delta_advCust, delta_pay, delta_prov,
      finCostPaid, taxPaid, netCF_operating, ppeProceeds, ppePurchase, intangDisp, netCF_investing,
      shareCashIn, netBorrowings, netUPAS, netRelParty, netCF_financing, netChange, cashBegin, cashEnd
    };
  };

  const cyCF = calculateCF(store);
  const pyCF = calculateCF(prevYearNotes);
  const fxEffect = 0;

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
      <td />
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
          <table className="w-full border-collapse text-[11px] table-fixed">
            <colgroup>
              <col />
              <col className="w-24" />
              <col className="w-4" />
              <col className="w-24" />
            </colgroup>
            <tbody>
              {/* A) OPERATING */}
              <tr className="font-bold">
                <td className="py-1">A) Cash flow from operating activities</td>
                <td /><td /><td />
              </tr>
              <Row label="Profit before tax"           cy={cyCF.pbt}          py={pyCF.pbt} />
              <Row label="Finance costs"               cy={cyCF.finance_add}  py={pyCF.finance_add} />
              <Row label="(Gain) loss on disposal of property, plant and equipment"
                         cy={cyCF.ppeGainLoss} py={pyCF.ppeGainLoss} />
              <Row label="Depreciation of property, plant and equipment"
                         cy={cyCF.dep_ppe}     py={pyCF.dep_ppe} />
              <Row label="Amortization of intangible assets"
                         cy={cyCF.amort}       py={pyCF.amort}      underline />
              <Row label="Operating cash flows before movements in working capital"
                         cy={cyCF.priorToWC}   py={pyCF.priorToWC}      bold italic underline />

              <Row label="(Increased)/decreased in Inventories"           cy={cyCF.delta_inv}     py={pyCF.delta_inv} />
              <Row label="(Increased)/decreased in Trade and other receivables"
                         cy={cyCF.delta_rec}   py={pyCF.delta_rec} />
              <Row label="(Increased)/decreased in Advances, deposits and prepayments"
                         cy={cyCF.delta_adv}   py={pyCF.delta_adv} />
              <Row label="(Increased)/decreased in Investments in financial assets"
                         cy={cyCF.delta_invFin} py={pyCF.delta_invFin} />
              <Row label="(decreased)/increased in Advance received from customers"
                         cy={cyCF.delta_advCust} py={pyCF.delta_advCust} />
              <Row label="(decreased)/increased in Trade and other payables"
                         cy={cyCF.delta_pay}   py={pyCF.delta_pay} />
              <Row label="Increased/(decreased) in Provision for expense"
                         cy={cyCF.delta_prov}  py={pyCF.delta_prov} />
              <Row label="Finance costs paid"   cy={cyCF.finCostPaid} py={pyCF.finCostPaid} />
              <Row label="Income tax paid"      cy={cyCF.taxPaid}     py={pyCF.taxPaid}  underline />
              <Row label="Net cash (used in)/generated from operating activities"
                         cy={cyCF.netCF_operating} py={pyCF.netCF_operating}
                         bold italic underline />

              {/* B) INVESTING */}
              <tr><td colSpan={4} className="h-4" /></tr>
              <tr className="font-bold">
                <td className="py-1">B) Cash flow from investing activities</td>
                <td /><td /><td />
              </tr>
              <Row label="Proceeds from disposal of Property, plant and equipment"
                         cy={cyCF.ppeProceeds} py={pyCF.ppeProceeds} />
              <Row label="Acquisition of Property, plant and equipment"
                         cy={cyCF.ppePurchase} py={pyCF.ppePurchase} />
              <Row label="Proceeds from disposal of Intangible assets"
                         cy={cyCF.intangDisp}  py={pyCF.intangDisp}  underline />
              <Row label="Net cash (used in)/generated from investing activities"
                         cy={cyCF.netCF_investing} py={pyCF.netCF_investing}
                         bold italic underline />

              {/* C) FINANCING */}
              <tr><td colSpan={4} className="h-4" /></tr>
              <tr className="font-bold">
                <td className="py-1">C) Cash flows from financing activities</td>
                <td /><td /><td />
              </tr>
              <Row label="Received from Share capital"   cy={cyCF.shareCashIn}  py={pyCF.shareCashIn} />
              <Row label="Proceeds from Borrowings from bank"
                         cy={cyCF.netBorrowings} py={pyCF.netBorrowings} />
              <Row label="Proceeds from UPAS liabilities" cy={cyCF.netUPAS}     py={pyCF.netUPAS} />
              <Row label="(Repayment) of Financial liabilities with related parties"
                         cy={cyCF.netRelParty}  py={pyCF.netRelParty}  underline />
              <Row label="Net cash generated from/(used in) financing activities"
                         cy={cyCF.netCF_financing} py={pyCF.netCF_financing}
                         bold italic underline />

              {/* SUMMARY */}
              <tr className="font-bold italic border-b border-black bg-gray-50">
                <td className="py-1">
                  Net increase/(decrease) cash and cash equivalents (A+B+C)
                </td>
                <td className="text-right border-b border-black">{formatBDT(cyCF.netChange)}</td>
                <td className="border-b border-black" />
                <td className="text-right border-b border-black">{formatBDT(pyCF.netChange)}</td>
              </tr>

              <tr><td colSpan={4} className="h-4" /></tr>

              <tr className="border-t border-black">
                <td className="py-1">Cash and cash equivalents at beginning of year</td>
                <td className="text-right border-t border-black">{formatBDT(cyCF.cashBegin)}</td>
                <td className="border-t border-black" />
                <td className="text-right border-t border-black">{formatBDT(pyCF.cashBegin)}</td>
              </tr>
              <tr>
                <td className="py-1">Effect of foreign exchange rate changes</td>
                <td className="text-right border-b border-black">{formatBDT(fxEffect)}</td>
                <td className="border-b border-black" />
                <td className="text-right border-b border-black">{formatBDT(0)}</td>
              </tr>
              <tr className="font-bold border-b border-black">
                <td className="py-1">Cash and cash equivalents at end of year</td>
                <td className="text-right border-b border-black">{formatBDT(cyCF.cashEnd)}</td>
                <td className="border-b border-black" />
                <td className="text-right border-b border-black">{formatBDT(pyCF.cashEnd)}</td>
              </tr>

              {/* Verification check (non-print) */}
              {Math.abs(cyCF.cashEnd - (cyCF.cashBegin + cyCF.netChange)) > 1 && (
                <tr className="print:hidden">
                  <td colSpan={4} className="text-red-500 text-[10px] py-1">
                    ⚠️ Cash flow does not reconcile — difference: {formatBDT(cyCF.cashEnd - cyCF.cashBegin - cyCF.netChange)}
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
