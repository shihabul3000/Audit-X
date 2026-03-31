// FILE: src/components/tabs/SCE.tsx
// ⚠️ Rules: existing design unchanged, only values made dynamic
import React from 'react';
import { AuditReportData } from '../../types';
import { getFormattedDate, getPreviousYearDate, getPreviousDayDate } from '../../utils/dateFormatter';
import { useStore } from './N4_13/store';
import { formatBDT } from './N4_13/utils';

interface SCEProps {
  data: AuditReportData;
}

export const SCE: React.FC<SCEProps> = ({ data }) => {
  const store = useStore();

  // ── Helper: get row value from store ─────────────────────────────
  const g = (sId: string, rId: string, field = 'value_cy'): number => {
    const sec = store.sections.find(s => s.id === sId);
    const row = sec?.rows.find(r => r.id === rId);
    return (row as any)?.[field] ?? 0;
  };

  // ── Share config ──────────────────────────────────────────────────
  const totalShares = store.shareholders.reduce((s, sh) => s + sh.shares, 0)
    || store.shareConfig.issuedShares;
  const shareCapital = totalShares * store.shareConfig.issuedFaceValue
    || g('note12_02', 'issued_capital');

  // ══ SECTION 1: Prior Year (PY-1 → PY closing) ════════════════════

  // Opening balance (01 July PY-1):
  const py1_shares  = totalShares;
  const py1_cap     = shareCapital;
  const py1_calls   = g('note12_03', 'calls_total', 'value_py');
  const py1_reval   = g('note13', 'reval_total', 'value_py');   // 0 for most
  const py1_re      = g('note14', 're_opening', 'value_py');
  const py1_total   = py1_cap + py1_calls + py1_reval + py1_re;

  // Comprehensive income (year ended 30 June PY):
  const ci_py_reval = 0;                                        // no reval in PY
  const ci_py_re    = g('note14', 're_income', 'value_py');
  const ci_py_total = ci_py_reval + ci_py_re;

  // Closing balance (30 June PY):
  const py_close_shares = totalShares;
  const py_close_cap    = shareCapital;
  const py_close_calls  = g('note12_03', 'calls_total', 'value_py');
  const py_close_reval  = g('note13', 'reval_total', 'value_py');
  const py_close_re     = g('note14', 're_closing', 'value_py');
  const py_close_total  = py_close_cap + py_close_calls + py_close_reval + py_close_re;

  // ══ SECTION 2: Current Year (PY opening → CY closing) ════════════

  // Opening balance (01 July PY = closing of section 1):
  const cy_open_shares = totalShares;
  const cy_open_cap    = shareCapital;
  const cy_open_calls  = py_close_calls;
  const cy_open_reval  = py_close_reval;
  const cy_open_re     = g('note14', 're_opening');             // CY opening RE
  const cy_open_total  = cy_open_cap + cy_open_calls + cy_open_reval + cy_open_re;

  // Comprehensive income (year ended 30 June CY):
  const ci_cy_reval  = g('note13', 'reval_total');              // CY revaluation
  const ci_cy_re     = g('note14', 're_income');                // CY profit for year
  const ci_cy_total  = ci_cy_reval + ci_cy_re;

  // Closing balance (30 June CY):
  const cy_close_shares = totalShares;
  const cy_close_cap    = g('note12_02', 'issued_capital') || shareCapital;
  const cy_close_calls  = g('note12_03', 'calls_total');
  const cy_close_reval  = g('note13', 'reval_total');
  const cy_close_re     = g('note14', 're_closing');
  const cy_close_total  = cy_close_cap + cy_close_calls + cy_close_reval + cy_close_re;

  // ── Table cell renderer ───────────────────────────────────────────
  const Td = ({ val, bold = false }: { val: number | string; bold?: boolean }) => (
    <td className={`text-right px-1 ${bold ? 'font-bold' : ''}`}>
      {typeof val === 'number' ? formatBDT(val) : val}
    </td>
  );

  const numFmt = (n: number) => n === 0 ? '-' : n.toLocaleString('en-IN');

  return (
    <div className="w-full bg-white p-8 font-serif text-[11px] leading-tight text-black">
      <div className="max-w-5xl mx-auto border border-blue-800 p-1 min-h-full">
        {/* Header */}
        <div className="border-b-2 border-blue-900 mb-1 pb-1">
          <h1 className="font-bold text-base">{data.company}</h1>
          <p className="text-xs">{data.addr}</p>
        </div>
        <div className="mb-4">
          <h2 className="font-bold">Statement of changes in equity</h2>
          <p className="font-bold italic">
            For the year ended {getFormattedDate(data.reportingDate)}
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border-t border-black min-w-[800px]">
            <thead>
              <tr>
                <th rowSpan={2} className="border-b border-black text-left align-bottom py-2 px-1 w-48" />
                <th className="border border-black text-center py-1 px-1 w-20">
                  Number of shares
                </th>
                <th colSpan={5} className="border border-black text-center py-1 px-1">
                  In Bangladesh Taka
                </th>
              </tr>
              <tr>
                <th className="border border-black text-center py-1 px-1">Shares</th>
                <th className="border border-black text-center py-1 px-1 w-24">Share capital</th>
                <th className="border border-black text-center py-1 px-1 w-24">Calls-in-arrear</th>
                <th className="border border-black text-center py-1 px-1 w-24">Revaluation surplus</th>
                <th className="border border-black text-center py-1 px-1 w-24">Retained earnings</th>
                <th className="border border-black text-center py-1 px-1 w-24">Total equity</th>
              </tr>
            </thead>
            <tbody>
              {/* ── Section 1: Prior Year ── */}
              <tr>
                <td className="py-2 px-1 font-bold">
                  Balance at {getPreviousYearDate(data.startDate)}
                </td>
                <td className="text-right px-1">{numFmt(py1_shares)}</td>
                <Td val={py1_cap} />
                <Td val={py1_calls} />
                <Td val={py1_reval} />
                <Td val={py1_re} />
                <Td val={py1_total} bold />
              </tr>
              <tr>
                <td className="py-1 px-1">Changes in accounting policy</td>
                <td className="text-right px-1">-</td>
                <Td val={0} /><Td val={0} /><Td val={0} /><Td val={0} /><Td val={0} />
              </tr>
              <tr className="border-t border-black">
                <td className="py-1 px-1 font-bold">
                  Balance at {getPreviousYearDate(data.startDate)}
                </td>
                <td className="text-right px-1">{numFmt(py1_shares)}</td>
                <Td val={py1_cap} /><Td val={py1_calls} />
                <Td val={py1_reval} /><Td val={py1_re} />
                <Td val={py1_total} bold />
              </tr>
              <tr>
                <td className="py-1 px-1">Movement during the year</td>
                <td className="text-right px-1">-</td>
                <Td val={0} /><Td val={0} /><Td val={0} /><Td val={0} /><Td val={0} />
              </tr>
              <tr>
                <td className="py-1 px-1">
                  Total comprehensive income for the year ended {getPreviousDayDate(data.startDate)}
                </td>
                <td className="text-right px-1">-</td>
                <Td val={0} /><Td val={0} />
                <Td val={ci_py_reval} />
                <Td val={ci_py_re} />
                <Td val={ci_py_total} bold />
              </tr>
              <tr className="border-y border-black font-bold">
                <td className="py-1 px-1">Balance at {getPreviousDayDate(data.startDate)}</td>
                <td className="text-right px-1">{numFmt(py_close_shares)}</td>
                <Td val={py_close_cap} />
                <Td val={py_close_calls} />
                <Td val={py_close_reval} />
                <Td val={py_close_re} />
                <Td val={py_close_total} bold />
              </tr>

              {/* ── Section 2: Current Year ── */}
              <tr><td colSpan={7} className="h-4" /></tr>
              <tr>
                <td className="py-2 px-1 font-bold">
                  Balance at {getFormattedDate(data.startDate)}
                </td>
                <td className="text-right px-1">{numFmt(cy_open_shares)}</td>
                <Td val={cy_open_cap} />
                <Td val={cy_open_calls} />
                <Td val={cy_open_reval} />
                <Td val={cy_open_re} />
                <Td val={cy_open_total} bold />
              </tr>
              <tr>
                <td className="py-1 px-1">Movement during the year</td>
                <td className="text-right px-1">-</td>
                <Td val={0} /><Td val={0} /><Td val={0} /><Td val={0} /><Td val={0} />
              </tr>
              <tr>
                <td className="py-1 px-1">
                  Total comprehensive income for the year ended {getFormattedDate(data.reportingDate)}
                </td>
                <td className="text-right px-1">-</td>
                <Td val={0} /><Td val={0} />
                <Td val={ci_cy_reval} />
                <Td val={ci_cy_re} />
                <Td val={ci_cy_total} bold />
              </tr>
              <tr className="border-y-2 border-black font-bold">
                <td className="py-1 px-1">Balance at {getFormattedDate(data.reportingDate)}</td>
                <td className="text-right px-1">{numFmt(cy_close_shares)}</td>
                <Td val={cy_close_cap} />
                <Td val={cy_close_calls} />
                <Td val={cy_close_reval} />
                <Td val={cy_close_re} />
                <Td val={cy_close_total} bold />
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <p className="italic text-[10px]">
            Annexed notes form an integral parts of these Financial Statements.
          </p>
        </div>
      </div>
    </div>
  );
};
