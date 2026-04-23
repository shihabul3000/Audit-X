import React from 'react';
import { SectionHeader, EditableValue, TableHeader, TableCell, Dropdown } from './Shared';

interface PageProps {
  docStatuses: Record<string, string>;
  handleStatusChange: (id: string, val: string) => void;
}

export const Page11: React.FC<PageProps> = ({ docStatuses, handleStatusChange }) => {
  return (
    <div className="bg-white p-4">
      <div className="mb-6">
        <SectionHeader id="16" title="Borrowings from bank" />
        <div className="pl-8 py-2 text-[11px] space-y-1">
          {['Long term borrowings', 'Short term borrowings', 'Current portion of long term borrowings'].map((item, idx) => (
            <div key={item} className="flex justify-between border-b border-gray-200 py-1">
              <span>{item}</span>
              <div className="flex gap-12 font-bold">
                <span className="min-w-[60px]"><EditableValue id={`p11_borrowing_${idx}_2025`} /></span>
                <span className="min-w-[60px]"><EditableValue id={`p11_borrowing_${idx}_2024`} /></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 font-bold text-[11px] mb-2">
          <span className="bg-white text-black px-1 rounded border border-black text-[10px]">16.01</span>
          <span>. Assets pledged as security against borrowings</span>
        </div>
        <div className="pl-8 py-2 text-[11px]">
          <p className="italic">Details of assets pledged as security are disclosed in the financial statements.</p>
        </div>
      </div>

      <div className="mb-6">
        <SectionHeader id="28" title="Finance costs" />
        <div className="pl-8 py-2 text-[11px] space-y-1">
          <div className="flex justify-between border-b border-gray-200 py-1">
            <span>Finance costs</span>
            <div className="flex gap-12 font-bold">
              <span className="min-w-[60px]"><EditableValue id="p11_finance_costs_2025" /></span>
              <span className="min-w-[60px]"><EditableValue id="p11_finance_costs_2024" /></span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 border border-blue-800 p-2 overflow-x-auto">
        <p className="text-[10px] italic font-bold mb-2">Bank loan verification:</p>
        <table className="w-full border-collapse border border-gray-400 min-w-[500px]">
          <thead>
            <tr className="bg-gray-100">
              <TableHeader>Loan Type & Bank</TableHeader>
              <TableHeader>Required documents</TableHeader>
              <TableHeader className="w-16">Doc</TableHeader>
            </tr>
          </thead>
          <tbody>
            <tr>
              <TableCell>HPSM Loan - SIBL</TableCell>
              <TableCell>Sanction letter, bank statement, mortgage deed</TableCell>
              <TableCell className="p-0"><Dropdown value={docStatuses['loan-sanction']} onChange={(v) => handleStatusChange('loan-sanction', v)} /></TableCell>
            </tr>
            <tr>
              <TableCell>LTR / Overdraft - DBBL</TableCell>
              <TableCell>Sanction letter, bank statement, interest calc</TableCell>
              <TableCell className="p-0"><Dropdown value={docStatuses['mortgage-deed']} onChange={(v) => handleStatusChange('mortgage-deed', v)} /></TableCell>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
