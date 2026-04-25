import React from 'react';
import { SectionHeader, EditableValue, FormattedValue, parseNum, DiscussionContext } from '../Shared';

const IntangibleAssets: React.FC = () => {
  const ctx = React.useContext(DiscussionContext);
  const values = ctx?.values || {};

  return (
    <div className="mt-8">
      <SectionHeader id="5" title="Intangible assets" />
      <div className="pl-8 py-2 text-[11px]">
        <div className="flex justify-between py-0.5">
          <span>At cost (Annexure A)</span>
          <div className="flex gap-12 text-right">
            <span className="min-w-[80px] inline-block"><EditableValue id="p2_intangible_cost_2025" /></span>
            <span className="min-w-[80px] inline-block"><EditableValue id="p2_intangible_cost_2024" /></span>
            <span className="text-blue-700 w-20 text-left">Annez ---&gt;</span>
          </div>
        </div>
        <div className="flex justify-between py-0.5">
          <span>Accumulated amortization (Annexure A)</span>
          <div className="flex gap-12 text-right">
            <span className="min-w-[80px] inline-block"><EditableValue id="p2_intangible_acc_2025" /></span>
            <span className="min-w-[80px] inline-block"><EditableValue id="p2_intangible_acc_2024" /></span>
            <span className="text-blue-700 w-20 text-left">Annez ---&gt;</span>
          </div>
        </div>
        <div className="flex justify-between border-t border-black mt-1 pt-0.5 font-bold">
          <span>Total</span>
          <div className="flex gap-12 text-right">
            <FormattedValue value={parseNum(values['p2_intangible_cost_2025']) + parseNum(values['p2_intangible_acc_2025'])} className="min-w-[80px]" />
            <FormattedValue value={parseNum(values['p2_intangible_cost_2024']) + parseNum(values['p2_intangible_acc_2024'])} className="min-w-[80px]" />
            <span className="w-20"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntangibleAssets;
