import React from 'react';
import { TableHeader, TableCell, EditableValue, Dropdown } from '../Shared';

interface AssetTableProps {
  docStatuses: Record<string, string>;
  handleStatusChange: (id: string, val: string) => void;
}

const AssetTable: React.FC<AssetTableProps> = ({ docStatuses, handleStatusChange }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-400 min-w-[600px]">
        <thead>
        <tr>
          <TableHeader className="text-center w-1/4">Assets</TableHeader>
          <TableHeader className="text-center w-1/6">30 June 2025 WDV</TableHeader>
          <TableHeader className="text-center w-1/2">Required documents</TableHeader>
          <TableHeader className="text-center w-1/12">Doc</TableHeader>
        </tr>
      </thead>
      <tbody>
        {/* Machinery */}
        <tr>
          <TableCell rowSpan={5} className="text-center font-bold">Machinery</TableCell>
          <TableCell rowSpan={5} className="text-center font-bold">
            <EditableValue id="p2_machinery_wdv" className="text-center font-bold" />
          </TableCell>
          <TableCell>Import/supplier's invoice</TableCell>
          <TableCell className="p-0"><Dropdown value={docStatuses['machinery-invoice']} onChange={(v) => handleStatusChange('machinery-invoice', v)} /></TableCell>
        </tr>
        <tr><TableCell>Payment/voucher doc</TableCell><TableCell className="p-0"><Dropdown value={docStatuses['machinery-voucher']} onChange={(v) => handleStatusChange('machinery-voucher', v)} /></TableCell></tr>
        <tr><TableCell>Physical verification</TableCell><TableCell className="p-0"><Dropdown value={docStatuses['machinery-physical']} onChange={(v) => handleStatusChange('machinery-physical', v)} /></TableCell></tr>
        <tr><TableCell>Entry in PPE list</TableCell><TableCell className="p-0"><Dropdown value={docStatuses['machinery-ppe']} onChange={(v) => handleStatusChange('machinery-ppe', v)} /></TableCell></tr>
        <tr><TableCell>General ledger</TableCell><TableCell className="p-0"><Dropdown value={docStatuses['machinery-ledger']} onChange={(v) => handleStatusChange('machinery-ledger', v)} /></TableCell></tr>

        {/* Motor vehicles */}
        <tr>
          <TableCell rowSpan={5} className="text-center font-bold">Motor vehicles</TableCell>
          <TableCell rowSpan={5} className="text-center font-bold">
            <EditableValue id="p2_motor_wdv" className="text-center font-bold" />
          </TableCell>
          <TableCell>Supplier's invoice/MR</TableCell>
          <TableCell className="p-0"><Dropdown value={docStatuses['motor-invoice']} onChange={(v) => handleStatusChange('motor-invoice', v)} /></TableCell>
        </tr>
        <tr><TableCell>Registration/Blue book doc</TableCell><TableCell className="p-0"><Dropdown value={docStatuses['motor-registration']} onChange={(v) => handleStatusChange('motor-registration', v)} /></TableCell></tr>
        <tr><TableCell>Tax token/fitness</TableCell><TableCell className="p-0"><Dropdown value={docStatuses['motor-tax']} onChange={(v) => handleStatusChange('motor-tax', v)} /></TableCell></tr>
        <tr><TableCell>Physical verification</TableCell><TableCell className="p-0"><Dropdown value={docStatuses['motor-physical']} onChange={(v) => handleStatusChange('motor-physical', v)} /></TableCell></tr>
        <tr><TableCell>Entry in PPE list</TableCell><TableCell className="p-0"><Dropdown value={docStatuses['motor-ppe']} onChange={(v) => handleStatusChange('motor-ppe', v)} /></TableCell></tr>
        
        {/* Furniture and fixtures */}
        <tr>
          <TableCell rowSpan={5} className="text-center font-bold">Furniture and fixtures</TableCell>
          <TableCell rowSpan={5} className="text-center font-bold">
            <EditableValue id="p2_furniture_wdv" className="text-center font-bold" />
          </TableCell>
          <TableCell>General ledger</TableCell>
          <TableCell className="p-0"><Dropdown value={docStatuses['furniture-ledger']} onChange={(v) => handleStatusChange('furniture-ledger', v)} /></TableCell>
        </tr>
        <tr><TableCell>Supplier's invoice</TableCell><TableCell className="p-0"><Dropdown value={docStatuses['furniture-invoice']} onChange={(v) => handleStatusChange('furniture-invoice', v)} /></TableCell></tr>
        <tr><TableCell>MR & payment doc</TableCell><TableCell className="p-0"><Dropdown value={docStatuses['furniture-payment']} onChange={(v) => handleStatusChange('furniture-payment', v)} /></TableCell></tr>
        <tr><TableCell>Physical verification</TableCell><TableCell className="p-0"><Dropdown value={docStatuses['furniture-physical']} onChange={(v) => handleStatusChange('furniture-physical', v)} /></TableCell></tr>
        <tr><TableCell>Entry in PPE list</TableCell><TableCell className="p-0"><Dropdown value={docStatuses['furniture-ppe']} onChange={(v) => handleStatusChange('furniture-ppe', v)} /></TableCell></tr>

        {/* Office equipment */}
        <tr>
          <TableCell rowSpan={5} className="text-center font-bold">Office equipment</TableCell>
          <TableCell rowSpan={5} className="text-center font-bold">
            <EditableValue id="p2_office_wdv" className="text-center font-bold" />
          </TableCell>
          <TableCell>General ledger</TableCell>
          <TableCell className="p-0"><Dropdown value={docStatuses['office-ledger']} onChange={(v) => handleStatusChange('office-ledger', v)} /></TableCell>
        </tr>
        <tr><TableCell>Supplier's invoice</TableCell><TableCell className="p-0"><Dropdown value={docStatuses['office-invoice']} onChange={(v) => handleStatusChange('office-invoice', v)} /></TableCell></tr>
        <tr><TableCell>MR & payment doc</TableCell><TableCell className="p-0"><Dropdown value={docStatuses['office-payment']} onChange={(v) => handleStatusChange('office-payment', v)} /></TableCell></tr>
        <tr><TableCell>Physical verification</TableCell><TableCell className="p-0"><Dropdown value={docStatuses['office-physical']} onChange={(v) => handleStatusChange('office-physical', v)} /></TableCell></tr>
        <tr><TableCell>Entry in PPE list</TableCell><TableCell className="p-0"><Dropdown value={docStatuses['office-ppe']} onChange={(v) => handleStatusChange('office-ppe', v)} /></TableCell></tr>
      </tbody>
    </table>
  </div>
);
};

export default AssetTable;
