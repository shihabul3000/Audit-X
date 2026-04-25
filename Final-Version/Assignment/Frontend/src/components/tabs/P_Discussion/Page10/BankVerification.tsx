import React from 'react';
import { TableHeader, TableCell, Dropdown } from '../Shared';

interface BankVerificationProps {
  docStatuses: Record<string, string>;
  handleStatusChange: (id: string, val: string) => void;
}

const BankVerification: React.FC<BankVerificationProps> = ({ docStatuses, handleStatusChange }) => {
  return (
    <div className="mt-4 border border-blue-800 p-2 overflow-x-auto">
      <p className="text-[10px] italic font-bold mb-2">Bank account verification:</p>
      <table className="w-full border-collapse border border-gray-400 min-w-[500px]">
        <thead>
          <tr className="bg-gray-100">
            <TableHeader>Bank Name & A/C No</TableHeader>
            <TableHeader>Required documents</TableHeader>
            <TableHeader className="w-16">Doc</TableHeader>
          </tr>
        </thead>
        <tbody>
          <tr>
            <TableCell>Social Islami Bank Ltd - A/C 00123</TableCell>
            <TableCell>Bank statement, bank confirmation, reconciliation</TableCell>
            <TableCell className="p-0"><Dropdown value={docStatuses['bank-statement']} onChange={(v) => handleStatusChange('bank-statement', v)} /></TableCell>
          </tr>
          <tr>
            <TableCell>Dutch Bangla Bank Ltd - A/C 44556</TableCell>
            <TableCell>Bank statement, bank confirmation, reconciliation</TableCell>
            <TableCell className="p-0"><Dropdown value={docStatuses['bank-confirmation']} onChange={(v) => handleStatusChange('bank-confirmation', v)} /></TableCell>
          </tr>
          <tr>
            <TableCell className="font-bold">Cash on hand</TableCell>
            <TableCell>Cash count sheet, management representation</TableCell>
            <TableCell className="p-0"><Dropdown value={docStatuses['cash-on-hand']} onChange={(v) => handleStatusChange('cash-on-hand', v)} /></TableCell>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default BankVerification;
