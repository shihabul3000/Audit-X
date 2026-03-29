import React from 'react';
import { SectionHeader, EditableValue, parseNum, FormattedValue, DiscussionContext, ValueRow, TotalRow } from '../Shared';

const AdvancesDeposits: React.FC = () => {
  const ctx = React.useContext(DiscussionContext);
  const values = ctx?.values || {};

  const items = ['Advances', 'Deposits', 'Prepayments'];
  const total2025 = [0, 1, 2].reduce((sum, idx) => sum + parseNum(values[`p6_advances_${idx}_2025`]), 0);
  const total2024 = [0, 1, 2].reduce((sum, idx) => sum + parseNum(values[`p6_advances_${idx}_2024`]), 0);

  return (
    <>
      <div className="mb-6">
        <SectionHeader id="8" title="Advances, deposits and prepayments" />
        <div className="pl-8 py-2 text-[11px] space-y-1">
          {items.map((item, idx) => (
            <ValueRow key={item} label={item} id2025={`p6_advances_${idx}_2025`} id2024={`p6_advances_${idx}_2024`} width="w-[60px]" />
          ))}
          <TotalRow label="Total Advances, deposits and prepayments" value2025={total2025} value2024={total2024} width="w-[60px]" />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 font-bold text-[11px] mb-2">
          <span className="bg-white text-black px-1 rounded border border-black text-[10px]">8.01</span>
          <span>. Advance for VAT</span>
        </div>
        <div className="pl-8 py-2 text-[11px] space-y-1">
          <ValueRow label="Advance for VAT (VAT current account)" id2025="p6_vat_2025" id2024="p6_vat_2024" width="w-[60px]" />
        </div>
      </div>
    </>
  );
};

export default AdvancesDeposits;
