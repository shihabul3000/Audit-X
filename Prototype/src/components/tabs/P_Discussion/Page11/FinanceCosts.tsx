import React from 'react';
import { SectionHeader, EditableValue, ValueRow } from '../Shared';

const FinanceCosts: React.FC = () => {
  return (
    <div className="mb-6">
      <SectionHeader id="28" title="Finance costs" />
      <div className="pl-8 py-2 text-[11px] space-y-1">
        <ValueRow label="Finance costs" id2025="p11_finance_costs_2025" id2024="p11_finance_costs_2024" width="w-[60px]" />
      </div>
    </div>
  );
};

export default FinanceCosts;
