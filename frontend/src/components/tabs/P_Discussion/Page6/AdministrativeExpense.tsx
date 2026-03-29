import React from 'react';
import { SectionHeader, EditableValue, ValueRow } from '../Shared';

const AdministrativeExpense: React.FC = () => {
  return (
    <>
      <div className="mb-6">
        <SectionHeader id="25" title="Administrative expense" />
        <div className="pl-8 py-2 text-[11px] space-y-1">
          <ValueRow label="Administrative expense" id2025="p6_admin_exp_2025" id2024="p6_admin_exp_2024" width="w-[60px]" />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 font-bold text-[11px] mb-2">
          <span className="bg-white text-black px-1 rounded border border-black text-[10px]">25.01</span>
          <span>. Gain on sale of assets</span>
        </div>
        <div className="pl-8 py-2 text-[11px] space-y-1">
          <ValueRow label="Gain on sale of assets" id2025="p6_gain_sale_2025" id2024="p6_gain_sale_2024" width="w-[60px]" />
        </div>
      </div>
    </>
  );
};

export default AdministrativeExpense;
