import React from 'react';
import { SectionHeader, EditableValue, ValueRow } from '../Shared';

const AdvanceIncomeTax: React.FC = () => {
  return (
    <div className="mb-8">
      <SectionHeader id="10" title="Advance income tax" />
      <div className="pl-8 py-2 text-[11px] space-y-1">
        <ValueRow label="Advance income tax" id2025="p8_ait_2025" id2024="p8_ait_2024" width="w-[60px]" />
      </div>
    </div>
  );
};

export default AdvanceIncomeTax;
