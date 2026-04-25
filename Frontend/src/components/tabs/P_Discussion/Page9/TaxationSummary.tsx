import React from 'react';
import { TableCell, Dropdown } from '../Shared';

interface TaxationSummaryProps {
  docStatuses: Record<string, string>;
  handleStatusChange: (id: string, val: string) => void;
}

const TaxationSummary: React.FC<TaxationSummaryProps> = ({ docStatuses, handleStatusChange }) => {
  return (
    <div className="mt-4 border border-blue-800 p-2">
      <div className="bg-cyan-400 text-black px-2 py-0.5 font-bold italic text-[11px] text-center mb-2">
        TAXATION
      </div>
      <table className="w-full border-collapse border border-gray-400">
        <tbody>
          <tr>
            <TableCell className="bg-gray-100 font-bold w-1/3">Tax calculation</TableCell>
            <TableCell>Profit before tax, tax rate, tax credits, TDS</TableCell>
            <TableCell className="p-0 w-16"><Dropdown value={docStatuses['tax-challan']} onChange={(v) => handleStatusChange('tax-challan', v)} /></TableCell>
          </tr>
          <tr>
            <TableCell className="bg-gray-100 font-bold">Tax challan / payment</TableCell>
            <TableCell>Previous year tax assessment, current year TDS/AIT</TableCell>
            <TableCell className="p-0 w-16"><Dropdown value={docStatuses['tax-challan-payment']} onChange={(v) => handleStatusChange('tax-challan-payment', v)} /></TableCell>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TaxationSummary;
