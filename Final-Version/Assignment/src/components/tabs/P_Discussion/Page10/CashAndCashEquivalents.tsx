import React from 'react';
import { SectionHeader, EditableValue, ValueRow } from '../Shared';

const CashAndCashEquivalents: React.FC = () => {
  return (
    <>
      <div className="mb-6">
        <SectionHeader id="11" title="Cash and cash equivalents" />
        <div className="pl-8 py-2 text-[11px] space-y-1">
          <ValueRow label="Cash in hand" id2025="p10_cash_hand_2025" id2024="p10_cash_hand_2024" width="w-[60px]" />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 font-bold text-[11px] mb-2">
          <span className="bg-white text-black px-1 rounded border border-black text-[10px]">11.01</span>
          <span>. Cash at bank(s)</span>
        </div>
        <div className="pl-8 py-2 text-[11px] space-y-1">
          <ValueRow label="Cash at bank(s)" id2025="p10_cash_bank_2025" id2024="p10_cash_bank_2024" width="w-[60px]" />
        </div>
      </div>
    </>
  );
};

export default CashAndCashEquivalents;
