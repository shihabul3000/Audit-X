import React from 'react';
import { SectionHeader, EditableValue, ValueRow } from '../Shared';

const ProvisionForExpense: React.FC = () => {
  const items = ['Provision for expense', 'Provision for audit fee', 'Provision for income tax'];

  return (
    <div className="mb-6">
      <SectionHeader id="22" title="Provision for expense" />
      <div className="pl-8 py-2 text-[11px] space-y-1">
        {items.map((item, idx) => (
          <ValueRow key={item} label={item} id2025={`p6_provision_${idx}_2025`} id2024={`p6_provision_${idx}_2024`} width="w-[60px]" />
        ))}
      </div>
    </div>
  );
};

export default ProvisionForExpense;
