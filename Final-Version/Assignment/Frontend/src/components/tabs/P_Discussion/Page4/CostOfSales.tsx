import React from 'react';
import { SectionHeader, EditableValue, Dropdown, parseNum, FormattedValue, DiscussionContext, ValueRow, TotalRow } from '../Shared';

interface CostOfSalesProps {
  docStatuses: Record<string, string>;
  handleStatusChange: (id: string, val: string) => void;
}

const CostOfSales: React.FC<CostOfSalesProps> = ({ docStatuses, handleStatusChange }) => {
  const ctx = React.useContext(DiscussionContext);
  const values = ctx?.values || {};

  const total2025 = parseNum(values['p4_cos_opening_2025']) + 
                    parseNum(values['p4_cos_production_2025']) - 
                    parseNum(values['p4_cos_sample_2025']) - 
                    parseNum(values['p4_cos_closing_2025']);

  const total2024 = parseNum(values['p4_cos_opening_2024']) + 
                    parseNum(values['p4_cos_production_2024']) - 
                    parseNum(values['p4_cos_sample_2024']) - 
                    parseNum(values['p4_cos_closing_2024']);

  return (
    <div className="mb-8">
      <SectionHeader id="24" title="Cost of sales" />
      <div className="pl-8 py-2 text-[11px] space-y-1">
        <ValueRow 
          label="Opening inventory - Finished goods" 
          id2025="p4_cos_opening_2025" 
          id2024="p4_cos_opening_2024" 
          width="w-[60px]"
          extra={<div className="w-24 h-5"><Dropdown value={docStatuses['cos-opening']} onChange={(v) => handleStatusChange('cos-opening', v)} options={['Correct', 'Wrong', 'Rectified']} /></div>}
        />
        <ValueRow 
          label="Cost of Production (Note: 24.01)" 
          id2025="p4_cos_production_2025" 
          id2024="p4_cos_production_2024" 
          width="w-[60px]"
          extra={<div className="w-24 h-5"><Dropdown value={docStatuses['cos-production']} onChange={(v) => handleStatusChange('cos-production', v)} options={['Correct', 'Wrong', 'Rectified']} /></div>}
        />
        <ValueRow 
          label="Product sample costs" 
          id2025="p4_cos_sample_2025" 
          id2024="p4_cos_sample_2024" 
          width="w-[60px]"
          className="mt-4"
          extra={<div className="w-24 h-5"><Dropdown value={docStatuses['cos-sample']} onChange={(v) => handleStatusChange('cos-sample', v)} options={['Correct', 'Wrong', 'Rectified']} /></div>}
        />
        <ValueRow 
          label="Closing inventory - Finished goods (Note: 6)" 
          id2025="p4_cos_closing_2025" 
          id2024="p4_cos_closing_2024" 
          width="w-[60px]"
          extra={<div className="w-24 h-5"><Dropdown value={docStatuses['cos-closing']} onChange={(v) => handleStatusChange('cos-closing', v)} options={['Correct', 'Wrong', 'Rectified']} /></div>}
        />
        <TotalRow 
          label="Total Cost of Sales" 
          value2025={total2025} 
          value2024={total2024} 
          width="w-[60px]"
          extra={<div className="w-24"></div>}
        />
      </div>
      <div className="bg-red-600 text-white text-center py-0.5 font-bold italic text-[11px] mt-4">
        Item-wise movement not found
      </div>
    </div>
  );
};

export default CostOfSales;
