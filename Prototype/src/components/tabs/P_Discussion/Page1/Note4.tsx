import React from 'react';
import { SectionHeader, DiscussionContext, ValueRow, TotalRow } from '../Shared';

const Note4: React.FC = () => {
  const ctx = React.useContext(DiscussionContext);
  const ppe = ctx?.data?.ppe;

  const costOpening = ppe?.assets.reduce((sum, a) => sum + (parseFloat(a.costOpening.replace(/,/g, '')) || 0), 0) || 0;
  const costAddition = ppe?.assets.reduce((sum, a) => sum + (parseFloat(a.costAddition.replace(/,/g, '')) || 0), 0) || 0;
  const costDisposal = ppe?.assets.reduce((sum, a) => sum + (parseFloat(a.costDisposal.replace(/,/g, '')) || 0), 0) || 0;
  const costClosing = costOpening + costAddition - costDisposal;

  const depOpening = ppe?.assets.reduce((sum, a) => sum + (parseFloat(a.depOpening.replace(/,/g, '')) || 0), 0) || 0;
  const depCharged = ppe?.assets.reduce((sum, a) => sum + (parseFloat(a.depCharged.replace(/,/g, '')) || 0), 0) || 0;
  const depAdjustment = ppe?.assets.reduce((sum, a) => sum + (parseFloat(a.depAdjustment.replace(/,/g, '')) || 0), 0) || 0;
  const depClosing = depOpening + depCharged + depAdjustment;

  return (
    <div className="mb-4">
      <SectionHeader id="4" title="Property, plant and equipment" />
      <div className="pl-8 py-2 text-[11px] min-w-[400px]">
        <ValueRow label="At cost (Annexure A)" val2025={costClosing} val2024={costOpening} />
        <ValueRow label="Accumulated depreciation (Annexure A)" val2025={depClosing} val2024={depOpening} />
        <TotalRow 
          label="Total" 
          value2025={costClosing - depClosing} 
          value2024={costOpening - depOpening} 
        />
      </div>
    </div>
  );
};

export default Note4;
