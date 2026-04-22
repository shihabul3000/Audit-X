import React from 'react';
import { SectionHeader, EditableValue, ValueRow } from '../Shared';

const Borrowings: React.FC = () => {
  return (
    <>
      <div className="mb-6">
        <SectionHeader id="16" title="Borrowings from bank" />
        <div className="pl-8 py-2 text-[11px] space-y-1">
          {['Long term borrowings', 'Short term borrowings', 'Current portion of long term borrowings'].map((item, idx) => (
            <ValueRow key={item} label={item} id2025={`p11_borrowing_${idx}_2025`} id2024={`p11_borrowing_${idx}_2024`} width="w-[60px]" />
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 font-bold text-[11px] mb-2">
          <span className="bg-white text-black px-1 rounded border border-black text-[10px]">16.01</span>
          <span>. Assets pledged as security against borrowings</span>
        </div>
        <div className="pl-8 py-2 text-[11px]">
          <p className="italic">Details of assets pledged as security are disclosed in the financial statements.</p>
        </div>
      </div>
    </>
  );
};

export default Borrowings;
