import React from 'react';
import { EditableValue, TableCell, Dropdown, DiscussionContext } from '../Shared';
import { getFormattedDate } from '../../../../utils/dateFormatter';

interface RevenueSummaryProps {
  docStatuses: Record<string, string>;
  handleStatusChange: (id: string, val: string) => void;
}

const RevenueSummary: React.FC<RevenueSummaryProps> = ({ docStatuses, handleStatusChange }) => {
  const ctx = React.useContext(DiscussionContext);
  const data = ctx?.data;

  return (
    <div className="mt-4 border border-blue-800 p-2 overflow-x-auto">
      <div className="flex justify-between text-[11px] font-bold min-w-[500px]">
        <div className="space-y-1">
          <div>. Revenue</div>
          <div>Trade and other receivables</div>
          <div>Advance received from customers</div>
        </div>
        <div className="space-y-1 text-right">
          <div>BDT <EditableValue id="p5_summary_revenue" className="inline-block w-20" /></div>
          <div><EditableValue id="p5_summary_receivables" className="inline-block w-20" /></div>
          <div><EditableValue id="p5_summary_advance" className="inline-block w-20" /></div>
        </div>
      </div>
      <p className="text-[10px] italic mt-2">The key audit evidences are verified and found:</p>
      <table className="w-full border-collapse border border-gray-400 mt-2 min-w-[500px]">
        <tbody>
          <tr>
            <TableCell className="bg-gray-100 font-bold">Customer-wise movement & aging</TableCell>
            <TableCell>Customer-wise O/b, revenue, collection, rebate, C/b, b/debts</TableCell>
            <TableCell className="p-0 w-16"><Dropdown value={docStatuses['rev-customer-aging']} onChange={(v) => handleStatusChange('rev-customer-aging', v)} /></TableCell>
          </tr>
          <tr>
            <TableCell className="bg-gray-100 font-bold">General ledger: Trade receivable</TableCell>
            <TableCell>Selected customers GL: as per audit sample</TableCell>
            <TableCell className="p-0 w-16"><Dropdown value={docStatuses['rev-gl-trade']} onChange={(v) => handleStatusChange('rev-gl-trade', v)} /></TableCell>
          </tr>
          <tr>
            <TableCell className="bg-gray-100 font-bold">Invoices: Cut off test</TableCell>
            <TableCell>First 5 invoices (cut off {data ? getFormattedDate(data.startDate) : '01 Jul 24'}) & Last 5 invoices ({data ? getFormattedDate(data.reportingDate) : '30 Jun 25'})</TableCell>
            <TableCell className="p-0 w-16"><Dropdown value={docStatuses['rev-invoices-cutoff']} onChange={(v) => handleStatusChange('rev-invoices-cutoff', v)} /></TableCell>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default RevenueSummary;
