import React, { useState } from 'react';
import { usePPE } from './Shared';

export const Breakdown: React.FC = () => {
  const { totals, formatDisplay, parseValue, setBreakdown, breakdown } = usePPE();

  // Local raw editing state for admin expense input
  const [isEditing, setIsEditing] = useState(false);
  const [rawValue, setRawValue] = useState('');

  const adminExpense = parseValue(breakdown.adminExpense);
  const totalDepCharged = totals.depCharged;

  // Cost of sales = Total Depreciation Charged - Administrative Expense
  const costOfSales = totalDepCharged - adminExpense;

  // Total = Cost of Sales + Admin Expense = Total Dep Charged
  const breakdownTotal = costOfSales + adminExpense;

  const handleAdminFocus = () => {
    setIsEditing(true);
    const parsed = parseValue(breakdown.adminExpense);
    setRawValue(parsed !== 0 ? parsed.toString() : '');
  };

  const handleAdminBlur = () => {
    setIsEditing(false);
    const val = rawValue.replace(/,/g, '');
    const parsed = parseFloat(val);
    setBreakdown((prev: any) => ({
      ...prev,
      adminExpense: isNaN(parsed) ? '' : parsed.toString(),
    }));
  };

  const handleAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRawValue(e.target.value);
  };

  const adminDisplayValue = isEditing
    ? rawValue
    : adminExpense !== 0
    ? adminExpense.toLocaleString('en-US')
    : '';

  const tdBase = 'border-t border-b border-black text-[10px] font-serif';

  return (
    <div className="border-t-2 border-black mt-0">
      <table
        className="w-full border-collapse text-[10px] font-serif table-fixed"
      >
        <colgroup>
          {/* Match the 15-column layout of AssetTable */}
          <col style={{ width: '40px' }} />
          <col style={{ width: '180px' }} />
          <col style={{ width: '180px' }} />
          <col style={{ width: '100px' }} />
          <col style={{ width: '100px' }} />
          <col style={{ width: '100px' }} />
          <col style={{ width: '100px' }} />
          <col style={{ width: '50px' }} />
          <col style={{ width: '100px' }} />
          <col style={{ width: '100px' }} />
          <col style={{ width: '100px' }} />
          <col style={{ width: '100px' }} />
          <col style={{ width: '100px' }} />
          <col style={{ width: '100px' }} />
          <col style={{ width: '60px' }} />
        </colgroup>
        <tbody>
          {/* Row 1: Cost of Sales (auto-calculated) */}
          <tr>
            <td colSpan={12} className={`${tdBase} border-b-0 text-right pr-2 border-l border-black`}>
              <input
                type="text"
                className="border-none bg-transparent text-right outline-none font-serif text-[10px] w-48"
                value={breakdown.costOfSalesLabel}
                onChange={(e) =>
                  setBreakdown((prev: any) => ({
                    ...prev,
                    costOfSalesLabel: e.target.value,
                  }))
                }
              />
            </td>
            <td className={`${tdBase} border-b-0 text-center px-2 border-l border-black`}>▶</td>
            <td className={`${tdBase} border-b-0 text-right pr-2 bg-green-50 font-bold border-l border-r border-black`}>
              {formatDisplay(costOfSales)}
            </td>
            <td className={`${tdBase} border-b-0 border-r border-black no-print`} />
          </tr>

          {/* Row 2: Administrative Expense (editable) */}
          <tr>
            <td colSpan={12} className={`${tdBase} border-t-0 border-b-0 text-right pr-2 border-l border-black`}>
              <input
                type="text"
                className="border-none bg-transparent text-right outline-none font-serif text-[10px] w-48"
                value={breakdown.adminExpenseLabel}
                onChange={(e) =>
                  setBreakdown((prev: any) => ({
                    ...prev,
                    adminExpenseLabel: e.target.value,
                  }))
                }
              />
            </td>
            <td className={`${tdBase} border-t-0 border-b-0 text-center px-2 border-l border-black`}>▶</td>
            <td className={`${tdBase} border-t-0 border-b-0 bg-blue-50/30 border-l border-r border-black p-0`}>
              <input
                type="text"
                className="w-full bg-transparent text-right outline-none border-none font-serif text-[10px] p-1"
                value={adminDisplayValue}
                placeholder="-"
                onFocus={handleAdminFocus}
                onBlur={handleAdminBlur}
                onChange={handleAdminChange}
              />
            </td>
            <td className={`${tdBase} border-t-0 border-b-0 border-r border-black no-print`} />
          </tr>

          {/* Row 3: Total line */}
          <tr>
            <td colSpan={12} className={`${tdBase} border-t-0 border-b border-l border-black`} />
            <td className={`${tdBase} border-t-0 border-b border-l border-black`} />
            <td className={`${tdBase} border-t-0 border-b border-t border-l border-r border-black text-right pr-2 font-bold bg-gray-50`}>
              {formatDisplay(breakdownTotal)}
            </td>
            <td className={`${tdBase} border-t-0 border-b border-r border-black no-print`} />
          </tr>
        </tbody>
      </table>
    </div>
  );
};
