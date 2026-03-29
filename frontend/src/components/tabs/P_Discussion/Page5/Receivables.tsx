import React from 'react';
import { SectionHeader, EditableValue, parseNum, FormattedValue, DiscussionContext, ValueRow, TotalRow } from '../Shared';

const Receivables: React.FC = () => {
  const ctx = React.useContext(DiscussionContext);
  const values = ctx?.values || {};

  const receivableItems = [
    'Trade receivable',
    'Other receivables',
    'Secured receivables (cheque on hand)',
    'Provision for bad and doubtful debts',
  ];

  const total2025 = [0, 1, 2].reduce((sum, idx) => sum + parseNum(values[`p5_receivable_${idx}_2025`]), 0) - parseNum(values['p5_receivable_3_2025']);
  const total2024 = [0, 1, 2].reduce((sum, idx) => sum + parseNum(values[`p5_receivable_${idx}_2024`]), 0) - parseNum(values['p5_receivable_3_2024']);

  return (
    <div className="mb-8">
      <SectionHeader id="7" title="Trade and other receivables" />
      <div className="pl-8 py-2 text-[11px] space-y-1">
        {receivableItems.map((item, idx) => (
          <ValueRow key={item} label={item} id2025={`p5_receivable_${idx}_2025`} id2024={`p5_receivable_${idx}_2024`} width="w-[60px]" />
        ))}
        <TotalRow label="Total Trade and other receivables" value2025={total2025} value2024={total2024} width="w-[60px]" />
      </div>
    </div>
  );
};

export default Receivables;
