import React from 'react';
import { SectionHeader, EditableValue, ValueRow } from '../Shared';

const DistributionCosts: React.FC = () => {
  return (
    <div className="mb-6">
      <SectionHeader id="26" title="Distribution costs" />
      <div className="pl-8 py-2 text-[11px] space-y-1">
        <ValueRow label="Distribution costs" id2025="p6_dist_costs_2025" id2024="p6_dist_costs_2024" width="w-[60px]" />
      </div>
    </div>
  );
};

export default DistributionCosts;
