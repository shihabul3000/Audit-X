import React from 'react';
import { EditableValue, ValueRow, DiscussionContext } from '../Shared';

const Note4_01: React.FC = () => {
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

  const netCurrent = costClosing - depClosing;
  const netPrev = costOpening - depOpening;

  return (
    <div className="mb-4 border border-black">
      <div className="bg-cyan-400 text-black px-2 py-0.5 font-bold italic text-[11px] text-center border-b border-black">
        New disclosure added as per IAS 16
      </div>
      <div className="p-2">
        <div className="flex items-center gap-2 font-bold text-[11px] mb-2">
          <span className="bg-white text-black px-1 rounded border border-black text-[10px]">4.01</span>
          <span>. Category of assets</span>
        </div>
        <div className="text-[10px] space-y-1 min-w-[450px]">
          <ValueRow
            label="Property, plant and equipment are in active use"
            val2025={netCurrent}
            val2024={netPrev}
            width="w-[60px]"
            extra={<span className="text-blue-700 w-24">Annez ---&gt;</span>}
          />
          <ValueRow
            label="Assets under construction (AUC) or temporarily idle"
            id2025="p1_auc_2025"
            id2024="p1_auc_2024"
            width="w-[60px]"
            extra={<span className="text-blue-700 w-24">Annez ---&gt;</span>}
          />
          <ValueRow
            label="Fully depreciated assets are still in use - cost (0)"
            id2025="p1_fully_dep_2025"
            id2024="p1_fully_dep_2024"
            width="w-[60px]"
            extra={<span className="text-blue-700 w-24">Annez ---&gt;</span>}
          />
          <ValueRow
            label="Assets classified as held for sale or discontinued operation"
            id2025="p1_held_for_sale_2025"
            id2024="p1_held_for_sale_2024"
            width="w-[60px]"
            extra={<span className="w-24"></span>}
          />
        </div>
      </div>
    </div>
  );
};

export default Note4_01;
