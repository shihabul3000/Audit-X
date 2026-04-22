import React from 'react';
import { SectionHeader, EditableValue, ValueRow } from '../Shared';

const Investments: React.FC = () => {
  return (
    <div className="mb-6">
      <SectionHeader id="9" title="Investments in financial assets" />
      <div className="pl-8 py-2 text-[11px] space-y-1">
        <ValueRow label="Investments in financial assets" id2025="p7_investments_2025" id2024="p7_investments_2024" width="w-[60px]" />
      </div>
    </div>
  );
};

export default Investments;
