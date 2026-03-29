import React from 'react';
import { SectionHeader, EditableValue, parseNum, FormattedValue, DiscussionContext, ValueRow, TotalRow } from '../Shared';

const AdvanceFromCustomers: React.FC = () => {
  const ctx = React.useContext(DiscussionContext);
  const values = ctx?.values || {};

  const advanceItems = [
    'Advance received from customers',
    'Security money advance received from customers',
  ];

  const total2025 = [0, 1].reduce((sum, idx) => sum + parseNum(values[`p5_advance_${idx}_2025`]), 0);
  const total2024 = [0, 1].reduce((sum, idx) => sum + parseNum(values[`p5_advance_${idx}_2024`]), 0);

  return (
    <div className="mb-8">
      <SectionHeader id="19" title="Advance received from customers" />
      <div className="pl-8 py-2 text-[11px] space-y-1">
        {advanceItems.map((item, idx) => (
          <ValueRow key={item} label={item} id2025={`p5_advance_${idx}_2025`} id2024={`p5_advance_${idx}_2024`} width="w-[60px]" />
        ))}
        <TotalRow label="Total Advance received from customers" value2025={total2025} value2024={total2024} width="w-[60px]" />
      </div>
    </div>
  );
};

export default AdvanceFromCustomers;
