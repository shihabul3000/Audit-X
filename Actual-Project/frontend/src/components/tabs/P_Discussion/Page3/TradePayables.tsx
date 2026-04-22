import React from 'react';
import { SectionHeader, EditableValue, parseNum, DiscussionContext, FormattedValue, ValueRow, TotalRow } from '../Shared';

const TradePayables: React.FC = () => {
  const ctx = React.useContext(DiscussionContext);
  const values = ctx?.values || {};

  const payableItems = [
    'Payable for Raw materials',
    'Payable for Packing materials',
    'Payable for transport contractors',
    'Payable for other services'
  ];

  const total2025 = payableItems.reduce((sum, _, idx) => sum + parseNum(values[`p3_payable_${idx}_2025`]), 0);
  const total2024 = payableItems.reduce((sum, _, idx) => sum + parseNum(values[`p3_payable_${idx}_2024`]), 0);

  return (
    <div className="mb-8">
      <SectionHeader id="20" title="Trade and other payables" />
      <div className="pl-8 py-2 text-[11px] space-y-1">
        {payableItems.map((item, idx) => (
          <ValueRow key={item} label={item} id2025={`p3_payable_${idx}_2025`} id2024={`p3_payable_${idx}_2024`} width="w-[60px]" />
        ))}
        <TotalRow label="Total" value2025={total2025} value2024={total2024} width="w-[60px]" />
      </div>
    </div>
  );
};

export default TradePayables;
