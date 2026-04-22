import React from 'react';
import { SectionHeader, EditableValue, TableHeader, TableCell, ValueRow } from './Shared';

export const Page13: React.FC = () => {
  return (
    <div className="bg-white p-4">
      <div className="mb-8">
        <SectionHeader id="15" title="Retained earnings" />
        <div className="pl-8 py-2 text-[11px] space-y-1">
          <ValueRow label="Opening balance" id2025="p13_re_opening_2025" id2024="p13_re_opening_2024" width="w-[60px]" />
          <ValueRow label="Net profit for the year" id2025="p13_re_profit_2025" id2024="p13_re_profit_2024" width="w-[60px]" />
          <ValueRow label="Dividend paid" id2025="p13_re_dividend_2025" id2024="p13_re_dividend_2024" width="w-[60px]" />
        </div>
      </div>

      <div className="mb-8">
        <SectionHeader id="18" title="Financial liabilities with related parties" />
        <div className="pl-8 py-2 text-[11px] space-y-1">
          <ValueRow label="Financial liabilities with related parties" id2025="p13_related_liabilities_2025" id2024="p13_related_liabilities_2024" width="w-[60px]" />
        </div>
      </div>

      <div className="mt-4 border border-blue-800 p-2 overflow-x-auto">
        <div className="bg-cyan-400 text-black px-2 py-0.5 font-bold italic text-[11px] text-center mb-2 min-w-[500px]">
          SHAREHOLDING SUMMARY
        </div>
        <table className="w-full border-collapse border border-gray-400 text-[10px] min-w-[500px]">
          <thead>
            <tr className="bg-gray-100">
              <TableHeader>Name of the shareholders</TableHeader>
              <TableHeader>No. of shares</TableHeader>
              <TableHeader>Value (Tk.)</TableHeader>
              <TableHeader>% of holding</TableHeader>
            </tr>
          </thead>
          <tbody>
            {['Sponsor / Director', 'Government', 'Institutional', 'Foreign', 'Public'].map((item, idx) => (
              <tr key={item}>
                <TableCell>{item}</TableCell>
                <TableCell className="text-right"><EditableValue id={`p13_share_count_${idx}`} /></TableCell>
                <TableCell className="text-right"><EditableValue id={`p13_share_value_${idx}`} /></TableCell>
                <TableCell className="text-right"><EditableValue id={`p13_share_percent_${idx}`} /></TableCell>
              </tr>
            ))}
            <tr className="font-bold bg-gray-50">
              <TableCell>Total</TableCell>
              <TableCell className="text-right"><EditableValue id="p13_share_total_count" /></TableCell>
              <TableCell className="text-right"><EditableValue id="p13_share_total_value" /></TableCell>
              <TableCell className="text-right">100%</TableCell>
            </tr>
          </tbody>
        </table>
        <div className="mt-4 p-2 bg-gray-50 border border-gray-300">
          <p className="text-[10px] italic">Notes: All shareholding information is verified with RJSC returns and share register.</p>
          <div className="flex justify-end gap-4 mt-4">
            <div className="text-center w-32 border-t border-black pt-1 text-[10px]">Prepared By</div>
            <div className="text-center w-32 border-t border-black pt-1 text-[10px]">Reviewed By</div>
          </div>
        </div>
      </div>
    </div>
  );
};
