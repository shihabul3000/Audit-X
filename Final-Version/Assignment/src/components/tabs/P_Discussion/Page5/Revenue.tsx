import React from 'react';
import { SectionHeader, EditableValue, parseNum, FormattedValue, DiscussionContext, ValueRow, TotalRow } from '../Shared';

const Revenue: React.FC = () => {
  const ctx = React.useContext(DiscussionContext);
  const values = ctx?.values || {};

  const revenueItems = [
    'Sales/bill received',
    'Export sales',
    "Distributors' product price discount",
    "Distributors' volume discount",
    'Channel sale commission/rebate',
    'Sales performance incentive rebate',
    'VAT on sales',
  ];

  const total2025 = [0, 1].reduce((sum, idx) => sum + parseNum(values[`p5_revenue_${idx}_2025`]), 0) - 
                    [2, 3, 4, 5, 6].reduce((sum, idx) => sum + parseNum(values[`p5_revenue_${idx}_2025`]), 0);

  const total2024 = [0, 1].reduce((sum, idx) => sum + parseNum(values[`p5_revenue_${idx}_2024`]), 0) - 
                    [2, 3, 4, 5, 6].reduce((sum, idx) => sum + parseNum(values[`p5_revenue_${idx}_2024`]), 0);

  return (
    <div className="mb-8">
      <SectionHeader id="23" title="Revenue" />
      <div className="pl-8 py-2 text-[11px] space-y-1">
        {revenueItems.map((item, idx) => (
          <ValueRow key={item} label={item} id2025={`p5_revenue_${idx}_2025`} id2024={`p5_revenue_${idx}_2024`} width="w-[60px]" />
        ))}
        <TotalRow label="Total Revenue" value2025={total2025} value2024={total2024} width="w-[60px]" />
      </div>
    </div>
  );
};

export default Revenue;
