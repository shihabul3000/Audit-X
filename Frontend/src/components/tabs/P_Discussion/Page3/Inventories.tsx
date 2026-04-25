import React from 'react';
import { SectionHeader, EditableValue, Dropdown, parseNum, DiscussionContext, FormattedValue, ValueRow, TotalRow } from '../Shared';

interface InventoriesProps {
  docStatuses: Record<string, string>;
  handleStatusChange: (id: string, val: string) => void;
}

const Inventories: React.FC<InventoriesProps> = ({ docStatuses, handleStatusChange }) => {
  const ctx = React.useContext(DiscussionContext);
  const values = ctx?.values || {};

  const inventoryItems = [
    { label: 'Finished goods', id: 'inv-finished' },
    { label: 'Work-in-progress', id: 'inv-wip' },
    { label: 'Raw materials', id: 'inv-raw' },
    { label: 'Packing materials', id: 'inv-packing' },
    { label: 'Production supplies and spare parts', id: 'inv-spare' },
  ];

  const total2025 = inventoryItems.reduce(
    (sum, item) => sum + parseNum(values[`p3_${item.id}_2025`]), 0
  ) + parseNum(values['p3_inv_transit_2025']);

  const total2024 = inventoryItems.reduce(
    (sum, item) => sum + parseNum(values[`p3_${item.id}_2024`]), 0
  ) + parseNum(values['p3_inv_transit_2024']);

  return (
    <div className="mb-8">
      <SectionHeader id="6" title="Inventories" />
      <div className="pl-8 py-2 text-[11px] space-y-1">
        {inventoryItems.map(item => (
          <ValueRow 
            key={item.id} 
            label={item.label} 
            id2025={`p3_${item.id}_2025`} 
            id2024={`p3_${item.id}_2024`} 
            width="w-[60px]"
            extra={<div className="w-16 h-5"><Dropdown value={docStatuses[item.id]} onChange={(v) => handleStatusChange(item.id, v)} options={['Yes', 'No', 'N/A']} /></div>}
          />
        ))}
        <ValueRow 
          label="Inventory-in-transit - raw materials" 
          id2025="p3_inv_transit_2025" 
          id2024="p3_inv_transit_2024" 
          width="w-[60px]"
          extra={<div className="w-16 h-5"><Dropdown value={docStatuses['inv-transit']} onChange={(v) => handleStatusChange('inv-transit', v)} options={['Yes', 'No', 'N/A']} /></div>}
        />
        <TotalRow 
          label="Total" 
          value2025={total2025} 
          value2024={total2024} 
          width="w-[60px]"
          extra={<div className="w-16"></div>}
        />
      </div>
    </div>
  );
};

export default Inventories;
