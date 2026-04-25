import React from 'react';
import { EditableValue, TableCell, Dropdown } from '../Shared';

interface ExpenseSummaryProps {
  docStatuses: Record<string, string>;
  handleStatusChange: (id: string, val: string) => void;
}

const ExpenseSummary: React.FC<ExpenseSummaryProps> = ({ docStatuses, handleStatusChange }) => {
  return (
    <div className="border border-blue-800 p-2 mb-6 overflow-x-auto">
      <div className="flex justify-between text-[11px] font-bold mb-2 min-w-[500px]">
        <div className="space-y-1">
          <div>. Administrative expense</div>
          <div>. Distribution costs</div>
          <div>. Advances, deposits and prepayments</div>
          <div>. Provision for expense</div>
        </div>
        <div className="space-y-1 text-right">
          <div>BDT <EditableValue id="p2_summary_ppe" className="inline-block w-20" /></div>
          <div><EditableValue id="p2_summary_intangible" className="inline-block w-20" /></div>
          <div><EditableValue id="p2_summary_inventory" className="inline-block w-20" /></div>
          <div><EditableValue id="p2_summary_payables" className="inline-block w-20" /></div>
        </div>
      </div>
      <table className="w-full border-collapse border border-gray-400 mt-2 min-w-[500px]">
        <tbody>
          <tr>
            <TableCell className="bg-gray-100 font-bold">Salary and allowances</TableCell>
            <TableCell>Salary sheet, bank statement, tax chalan</TableCell>
            <TableCell className="p-0 w-16"><Dropdown value={docStatuses['salary-sheet']} onChange={(v) => handleStatusChange('salary-sheet', v)} /></TableCell>
          </tr>
          <tr>
            <TableCell className="bg-gray-100 font-bold">Rent and utilities</TableCell>
            <TableCell>Rent agreement, utility bills, TDS/VDS chalan</TableCell>
            <TableCell className="p-0 w-16"><Dropdown value={docStatuses['rent-agreement']} onChange={(v) => handleStatusChange('rent-agreement', v)} /></TableCell>
          </tr>
          <tr>
            <TableCell className="bg-gray-100 font-bold">VAT current account</TableCell>
            <TableCell>VAT-6.3, VAT-9.1, VAT current account register</TableCell>
            <TableCell className="p-0 w-16"><Dropdown value={docStatuses['vat-current-account']} onChange={(v) => handleStatusChange('vat-current-account', v)} /></TableCell>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseSummary;
