// FILE: src/components/tabs/PNL.tsx
// ⚠️ RULES: same as SFP — শুধু read, কোনো write নেই

import React from 'react';
import { useStore } from './N4_13/store';
import { formatBDT } from './N4_13/utils';

export const PNL: React.FC<{ data: any }> = ({ data }) => {
  const store = useStore();

  const g = (sId: string, rId: string, field = 'value_cy'): number => {
    const sec = store.sections.find(s => s.id === sId);
    const row = sec?.rows.find(r => r.id === rId);
    return (row as any)?.[field] ?? 0;
  };

  // ── CY values ────────────────────────────────────────────────────
  const revenue_cy     =  g('note19', 'net_revenue');
  const cos_cy         = -Math.abs(g('note20', 'cos_total'));
  const grossProfit_cy =  revenue_cy + cos_cy;

  const admin_cy       = -Math.abs(g('note21', 'adm_total'));
  const dist_cy        = -Math.abs(g('note26', 'dist_total'));
  const ebit_cy        =  grossProfit_cy + admin_cy + dist_cy;

  const otherInc_cy    =  g('note27', 'other_total');
  const finance_cy     = -Math.abs(g('note23', 'fc_total'));
  const pbt_cy         =  ebit_cy + otherInc_cy + finance_cy;

  const tax_cy         = -Math.abs(g('note25', 'tax_total'));
  const profit_cy      =  pbt_cy + tax_cy;

  const reval_cy       =  g('note13', 'reval_total');
  const totalComp_cy   =  profit_cy + reval_cy;

  // ── PY values ────────────────────────────────────────────────────
  const revenue_py     =  g('note19', 'net_revenue', 'value_py');
  const cos_py         = -Math.abs(g('note20', 'cos_total', 'value_py'));
  const grossProfit_py =  revenue_py + cos_py;

  const admin_py       = -Math.abs(g('note21', 'adm_total', 'value_py'));
  const dist_py        = -Math.abs(g('note26', 'dist_total', 'value_py'));
  const ebit_py        =  grossProfit_py + admin_py + dist_py;

  const otherInc_py    =  g('note27', 'other_total', 'value_py');
  const finance_py     = -Math.abs(g('note23', 'fc_total', 'value_py'));
  const pbt_py         =  ebit_py + otherInc_py + finance_py;

  const tax_py         = -Math.abs(g('note25', 'tax_total', 'value_py'));
  const profit_py      =  pbt_py + tax_py;

  const reval_py       =  g('note13', 'reval_total', 'value_py');
  const totalComp_py   =  profit_py + reval_py;

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
        <div className="mt-1">Statement of profit or loss and other comprehensive income</div>
        <div className="text-gray-600">For the year ended {store.company.reportingDateLabel}</div>
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

      {/* P&L Lines */}
      <Row label="Revenue" note={19} cy={revenue_cy} py={revenue_py} />
      <Row label="Cost of sales" note={20} cy={cos_cy} py={cos_py} />
      <TotalLine />
      <Row label="Gross profit" cy={grossProfit_cy} py={grossProfit_py} bold indent={false} />
      <DoubleLine />

      <Row label="Administrative expense" note={21} cy={admin_cy} py={admin_py} />
      <Row label="Distribution costs" note={22} cy={dist_cy} py={dist_py} />
      <TotalLine />
      <Row label="Earnings before interest and tax (EBIT)"
        cy={ebit_cy} py={ebit_py} bold indent={false} />
      <DoubleLine />

      <Row label="Other income" cy={otherInc_cy} py={otherInc_py} />
      <Row label="Finance costs" note={23} cy={finance_cy} py={finance_py} />
      <TotalLine />
      <Row label="Profit before tax" cy={pbt_cy} py={pbt_py} bold indent={false} />
      <DoubleLine />

      <Row label="Income tax expense" note={24} cy={tax_cy} py={tax_py} />
      <TotalLine />
      <Row label="PROFIT FOR THE YEAR" cy={profit_cy} py={profit_py} bold indent={false} />
      <DoubleLine />

      {/* OCI */}
      <div className="mt-4 font-bold">Other comprehensive income</div>
      <Row label="Gain on revaluation of PPE, net of tax"
        note={11} cy={reval_cy} py={reval_py} />
      <TotalLine />
      <Row label="TOTAL COMPREHENSIVE INCOME FOR THE YEAR"
        cy={totalComp_cy} py={totalComp_py} bold indent={false} />
      <DoubleLine />
    </div>
  );
};
