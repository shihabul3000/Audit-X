import React from 'react';
import { EditableValue, parseNum, FormattedValue, DiscussionContext, ValueRow, TotalRow } from '../Shared';

const CostOfProduction: React.FC = () => {
  const ctx = React.useContext(DiscussionContext);
  const values = ctx?.values || {};

  const total2025 = parseNum(values['p4_materials_2025']) + parseNum(values['p4_overhead_2025']);
  const total2024 = parseNum(values['p4_materials_2024']) + parseNum(values['p4_overhead_2024']);

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 font-bold text-[11px] mb-2">
        <span className="bg-white text-black px-1 rounded border border-black text-[10px]">24.01</span>
        <span>. Cost of Production</span>
      </div>
      <div className="pl-8 py-2 text-[11px] space-y-1">
        <ValueRow label="Materials used in production (Note: 24.02)" id2025="p4_materials_2025" id2024="p4_materials_2024" width="w-[60px]" />
        <ValueRow label="Production overhead (Note: 24.03)" id2025="p4_overhead_2025" id2024="p4_overhead_2024" width="w-[60px]" />
        <TotalRow label="Total Cost of Production" value2025={total2025} value2024={total2024} width="w-[60px]" />
      </div>
    </div>
  );
};

export default CostOfProduction;
