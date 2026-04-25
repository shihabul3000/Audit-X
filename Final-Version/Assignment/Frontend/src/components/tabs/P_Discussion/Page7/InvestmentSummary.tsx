import React from 'react';
import { TableCell, Dropdown } from '../Shared';

interface InvestmentSummaryProps {
  docStatuses: Record<string, string>;
  handleStatusChange: (id: string, val: string) => void;
}

const InvestmentSummary: React.FC<InvestmentSummaryProps> = ({ docStatuses, handleStatusChange }) => {
  return (
    <div className="border border-blue-800 p-2 overflow-x-auto">
      <p className="text-[10px] italic font-bold">Investment summary:</p>
      <table className="w-full border-collapse border border-gray-400 mt-2 min-w-[500px]">
        <tbody>
          <tr>
            <TableCell className="bg-gray-100 font-bold">Investment in FDR with SIBL</TableCell>
            <TableCell>FDR certificate, bank statement, interest calc</TableCell>
            <TableCell className="p-0 w-16"><Dropdown value={docStatuses['fdr-statement']} onChange={(v) => handleStatusChange('fdr-statement', v)} /></TableCell>
          </tr>
          <tr>
            <TableCell className="bg-gray-100 font-bold">Investment in share - At Teen Agro Ltd</TableCell>
            <TableCell>Share certificate, board resolution, payment doc</TableCell>
            <TableCell className="p-0 w-16"><Dropdown value={docStatuses['share-certificate']} onChange={(v) => handleStatusChange('share-certificate', v)} /></TableCell>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default InvestmentSummary;
