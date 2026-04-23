import React from 'react';
import { SectionHeader, EditableValue, ValueRow } from '../Shared';

const OtherIncome: React.FC = () => {
  return (
    <div className="mb-6">
      <SectionHeader id="27" title="Other income" />
      <div className="pl-8 py-2 text-[11px] space-y-1">
        <ValueRow label="Other income" id2025="p7_other_income_2025" id2024="p7_other_income_2024" width="w-[60px]" />
      </div>
    </div>
  );
};

export default OtherIncome;
