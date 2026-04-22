// FILE: src/components/tabs/PNL.tsx
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

  // ── Get note number dynamically from store ────────────────────────
  const noteNum = (sectionId: string): string =>
    store.sections.find(s => s.id === sectionId)?.noteNumber ?? '';

  // ── CY ────────────────────────────────────────────────────────────
  const rev_cy = g('note19', 'net_revenue');
  const cos_cy = -Math.abs(g('note20', 'cos_total'));
  const gp_cy = rev_cy + cos_cy;
  const admin_cy = -Math.abs(g('note21', 'adm_total'));
  const dist_cy = -Math.abs(g('note26', 'dist_total'));
  const ebit_cy = gp_cy + admin_cy + dist_cy;
  const other_cy = g('note27', 'other_total');
  const fin_cy = -Math.abs(g('note23', 'fc_total'));
  const pbt_cy = ebit_cy + other_cy + fin_cy;
  const tax_cy = -Math.abs(g('note25', 'tax_total'));
  const profit_cy = pbt_cy + tax_cy;
  const reval_cy = g('note13', 'reval_total');
  const totalC_cy = profit_cy + reval_cy;

  // ── PY ────────────────────────────────────────────────────────────
  const rev_py = g('note19', 'net_revenue', 'value_py');
  const cos_py = -Math.abs(g('note20', 'cos_total', 'value_py'));
  const gp_py = rev_py + cos_py;
  const admin_py = -Math.abs(g('note21', 'adm_total', 'value_py'));
  const dist_py = -Math.abs(g('note26', 'dist_total', 'value_py'));
  const ebit_py = gp_py + admin_py + dist_py;
  const other_py = g('note27', 'other_total', 'value_py');
  const fin_py = -Math.abs(g('note23', 'fc_total', 'value_py'));
  const pbt_py = ebit_py + other_py + fin_py;
  const tax_py = -Math.abs(g('note25', 'tax_total', 'value_py'));
  const profit_py = pbt_py + tax_py;
  const reval_py = g('note13', 'reval_total', 'value_py');
  const totalC_py = profit_py + reval_py;

  // ── RENDER HELPERS ────────────────────────────────────────────────
  const PnlRow = ({
    label, sectionId, cy, py, bold = false, indent = true
  }: {
    label: string;
    sectionId?: string;
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
        <div className="mt-0.5">
          Statement of profit or loss and other comprehensive income
        </div>
        <div className="text-gray-600 text-[10px]">
          For the year ended {store.company.reportingDateLabel}
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

      {/* P&L */}
      <PnlRow label="Revenue" sectionId="note19" cy={rev_cy} py={rev_py} />
      <PnlRow label="Cost of sales" sectionId="note20" cy={cos_cy} py={cos_py} />
      <TotalLine />
      <PnlRow label="Gross profit" cy={gp_cy} py={gp_py} bold indent={false} />
      <DoubleLine />

      <PnlRow label="Administrative expense" sectionId="note21" cy={admin_cy} py={admin_py} />
      <PnlRow label="Distribution costs" sectionId="note26" cy={dist_cy} py={dist_py} />
      <TotalLine />
      <PnlRow label="Earnings before interest and tax (EBIT)"
        cy={ebit_cy} py={ebit_py} bold indent={false} />
      <DoubleLine />

      <PnlRow label="Other income" sectionId="note27" cy={other_cy} py={other_py} />
      <PnlRow label="Finance costs" sectionId="note23" cy={fin_cy} py={fin_py} />
      <TotalLine />
      <PnlRow label="Profit before tax" cy={pbt_cy} py={pbt_py} bold indent={false} />
      <DoubleLine />

      <PnlRow label="Income tax expense" sectionId="note25" cy={tax_cy} py={tax_py} />
      <TotalLine />
      <PnlRow label="PROFIT FOR THE YEAR" cy={profit_cy} py={profit_py} bold indent={false} />
      <DoubleLine />

      {/* OCI */}
      {/* <div className="font-bold mt-4 mb-1">Other comprehensive income

      </div> */}
      <PnlRow
        label="Other comprehensive income"
        // sectionId="note13"
        cy={reval_cy}
        py={reval_py}
      />
      <TotalLine />
      <PnlRow
        label="TOTAL COMPREHENSIVE INCOME FOR THE YEAR"
        cy={totalC_cy}
        py={totalC_py}
        bold
        indent={false}
      />
      <DoubleLine />
    </div>
  );
};
