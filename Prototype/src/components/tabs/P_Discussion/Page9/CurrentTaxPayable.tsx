import React from 'react';
import { SectionHeader, EditableValue, ValueRow } from '../Shared';

const CurrentTaxPayable: React.FC = () => {
  return (
    <div className="mb-6">
      <SectionHeader id="21" title="Current tax payable" />
      <div className="pl-8 py-2 text-[11px] space-y-1">
        <ValueRow label="Current tax payable" id2025="p9_tax_payable_2025" id2024="p9_tax_payable_2024" width="w-[60px]" />
      </div>
    </div>
  );
};

export default CurrentTaxPayable;
