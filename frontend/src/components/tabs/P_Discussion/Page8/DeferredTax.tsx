import React from 'react';
import { SectionHeader, EditableValue, TableHeader, TableCell, Dropdown, ValueRow } from '../Shared';

interface DeferredTaxProps {
  docStatuses: Record<string, string>;
  handleStatusChange: (id: string, val: string) => void;
}

const DeferredTax: React.FC<DeferredTaxProps> = ({ docStatuses, handleStatusChange }) => {
  return (
    <>
      <div className="mb-8">
        <SectionHeader id="17" title="Deferred tax liabilities" />
        <div className="pl-8 py-2 text-[11px] space-y-1">
          <ValueRow label="Deferred tax liabilities" id2025="p8_dtl_2025" id2024="p8_dtl_2024" width="w-[60px]" />
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-2 font-bold text-[11px] mb-2">
          <span className="bg-white text-black px-1 rounded border border-black text-[10px]">17.01</span>
          <span>. Deferred tax liability on taxable/(deductible) cumulative temporary differences</span>
        </div>
        <table className="w-full border-collapse border border-gray-400 text-[10px]">
          <thead>
            <tr className="bg-gray-100">
              <TableHeader>Particulars</TableHeader>
              <TableHeader>Carrying amount</TableHeader>
              <TableHeader>Tax base</TableHeader>
              <TableHeader>Temporary difference</TableHeader>
            </tr>
          </thead>
          <tbody>
            {['Property, plant and equipment', 'Intangible assets', 'Provision for bad debts', 'Provision for gratuity'].map((item, idx) => (
              <tr key={item}>
                <TableCell>{item}</TableCell>
                <TableCell className="text-right"><EditableValue id={`p8_dt_carrying_${idx}`} /></TableCell>
                <TableCell className="text-right"><EditableValue id={`p8_dt_taxbase_${idx}`} /></TableCell>
                <TableCell className="text-right"><EditableValue id={`p8_dt_tempdiff_${idx}`} /></TableCell>
              </tr>
            ))}
            <tr className="font-bold bg-gray-50">
              <TableCell>Total temporary difference</TableCell>
              <TableCell className="text-right"><EditableValue id="p8_dt_total_carrying" /></TableCell>
              <TableCell className="text-right"><EditableValue id="p8_dt_total_taxbase" /></TableCell>
              <TableCell className="text-right"><EditableValue id="p8_dt_total_tempdiff" /></TableCell>
            </tr>
          </tbody>
        </table>
        <div className="mt-4 border border-blue-800 p-2">
          <table className="w-full border-collapse border border-gray-400">
            <tbody>
              <tr>
                <TableCell className="bg-gray-100 font-bold">Deferred tax calculation</TableCell>
                <TableCell>Tax rate, temporary difference, previous year balance</TableCell>
                <TableCell className="p-0 w-16"><Dropdown value={docStatuses['deferred-tax-calc']} onChange={(v) => handleStatusChange('deferred-tax-calc', v)} /></TableCell>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DeferredTax;
