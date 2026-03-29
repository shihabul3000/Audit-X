import React from 'react';
import { SectionHeader, EditableValue, ValueRow } from '../Shared';

const IncomeTaxExpense: React.FC = () => {
  return (
    <>
      <div className="mb-6">
        <SectionHeader id="29" title="Income tax expense" />
        <div className="pl-8 py-2 text-[11px] space-y-1">
          <ValueRow label="Income tax expense" id2025="p9_tax_expense_2025" id2024="p9_tax_expense_2024" width="w-[60px]" />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 font-bold text-[11px] mb-2">
          <span className="bg-white text-black px-1 rounded border border-black text-[10px]">29.01</span>
          <span>. Current tax for the year</span>
        </div>
        <div className="pl-8 py-2 text-[11px] space-y-1">
          <ValueRow label="Current tax for the year" id2025="p9_current_tax_2025" id2024="p9_current_tax_2024" width="w-[60px]" />
        </div>
      </div>
    </>
  );
};

export default IncomeTaxExpense;
