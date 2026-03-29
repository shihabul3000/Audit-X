import React from 'react';
import { AuditReportData } from '../../types';
import { getFormattedDate } from '../../utils/dateFormatter';

interface SFPProps {
  data: AuditReportData;
}

export const SFP: React.FC<SFPProps> = ({ data }) => {
  const parseValue = (val: string | number): number => {
    if (!val || val === '' || val === '-') return 0;
    const str = typeof val === 'string' ? val.replace(/,/g, '').replace(/%/g, '').replace(/\(/g, '-').replace(/\)/g, '') : val.toString();
    const parsed = parseFloat(str);
    return isNaN(parsed) ? 0 : parsed;
  };

  const formatDisplay = (num: number): string => {
    if (num === 0) return '-';
    const absNum = Math.abs(num);
    const formatted = absNum.toLocaleString('en-US');
    return num < 0 ? `(${formatted})` : formatted;
  };

  const ppeTotals = data.ppe.assets.reduce((acc, asset) => {
    const co = parseValue(asset.costOpening);
    const ca = parseValue(asset.costAddition);
    const cd = parseValue(asset.costDisposal);
    const cc = co + ca - cd;

    const do_ = parseValue(asset.depOpening);
    const dc = parseValue(asset.depCharged);
    const da = parseValue(asset.depAdjustment);
    const dcl = do_ + dc + da;

    return {
      costOpening: acc.costOpening + co,
      costClosing: acc.costClosing + cc,
      depOpening: acc.depOpening + do_,
      depClosing: acc.depClosing + dcl,
    };
  }, { costOpening: 0, costClosing: 0, depOpening: 0, depClosing: 0 });

  return (
    <div className="w-full bg-white p-8 font-serif text-[13px] leading-tight text-black">
      <div className="max-w-4xl mx-auto border border-blue-800 p-1 min-h-full">
        {/* Header Section */}
        <div className="border-b-2 border-blue-900 mb-1 pb-1">
          <h1 className="font-bold text-base">{data.company}</h1>
          <p className="text-xs">{data.addr}</p>
        </div>

        <div className="mb-4">
          <h2 className="font-bold">Statement of financial position</h2>
          <div className="flex justify-between items-end">
            <p className="font-bold">As at {getFormattedDate(data.reportingDate)}</p>
            <div className="text-right">
              <p className="font-bold border-b border-black inline-block px-8">In Bangladesh Taka</p>
              <div className="flex gap-8 mt-1">
                <span className="w-24 text-center font-bold border-b border-black">{getFormattedDate(data.reportingDate)}</span>
                <span className="w-24 text-center font-bold border-b border-black">{getFormattedDate(data.startDate)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[600px]">
            <thead>
              <tr>
                <th className="text-left font-bold py-1">ASSETS</th>
                <th className="w-12 text-center font-bold border-b border-black">Notes</th>
                <th className="w-28"></th>
                <th className="w-28"></th>
              </tr>
            </thead>
            <tbody>
              {/* Non-current assets */}
              <tr className="font-bold">
                <td className="pl-0 py-1">Non-current assets</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td className="pl-4 py-0.5">Property, plant and equipment</td>
                <td className="text-center">4</td>
                <td className="text-right">{formatDisplay(ppeTotals.costClosing - ppeTotals.depClosing)}</td>
                <td className="text-right">{formatDisplay(ppeTotals.costOpening - ppeTotals.depOpening)}</td>
              </tr>
              <tr>
                <td className="pl-4 py-0.5">Intangible assets</td>
                <td className="text-center">5</td>
                <td className="text-right border-b border-black">-</td>
                <td className="text-right border-b border-black">-</td>
              </tr>
              <tr className="font-bold">
                <td className="pl-8 py-1">Total non-current assets</td>
                <td></td>
                <td className="text-right border-b border-black">-</td>
                <td className="text-right border-b border-black">-</td>
              </tr>

              {/* Current assets */}
              <tr className="font-bold">
                <td className="pl-0 py-1">Current assets</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td className="pl-4 py-0.5">Inventories</td>
                <td className="text-center">6</td>
                <td className="text-right">-</td>
                <td className="text-right">-</td>
              </tr>
              <tr>
                <td className="pl-4 py-0.5">Trade and other receivables</td>
                <td className="text-center">7</td>
                <td className="text-right">-</td>
                <td className="text-right">-</td>
              </tr>
              <tr>
                <td className="pl-4 py-0.5">Advances, deposits and prepayments</td>
                <td className="text-center">8</td>
                <td className="text-right">-</td>
                <td className="text-right">-</td>
              </tr>
              <tr>
                <td className="pl-4 py-0.5">Investments in financial assets</td>
                <td className="text-center">9</td>
                <td className="text-right">-</td>
                <td className="text-right">-</td>
              </tr>
              <tr>
                <td className="pl-4 py-0.5">Advance income tax</td>
                <td className="text-center">10</td>
                <td className="text-right">-</td>
                <td className="text-right">-</td>
              </tr>
              <tr>
                <td className="pl-4 py-0.5">Cash and cash equivalents</td>
                <td className="text-center">11</td>
                <td className="text-right border-b border-black">-</td>
                <td className="text-right border-b border-black">-</td>
              </tr>
              <tr className="font-bold">
                <td className="pl-8 py-1">Total current assets</td>
                <td></td>
                <td className="text-right border-b border-black">-</td>
                <td className="text-right border-b border-black">-</td>
              </tr>
              <tr className="font-bold bg-gray-50">
                <td className="pl-0 py-1 border-y border-black">Total assets</td>
                <td className="border-y border-black"></td>
                <td className="text-right border-y-2 border-black">-</td>
                <td className="text-right border-y-2 border-black">-</td>
              </tr>

              {/* EQUITY AND LIABILITIES */}
              <tr><td colSpan={4} className="h-4"></td></tr>
              <tr className="font-bold">
                <td className="text-left py-1 uppercase">EQUITY AND LIABILITIES</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>

              {/* Shareholders' equity */}
              <tr className="font-bold">
                <td className="pl-0 py-1">Shareholders' equity</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td className="pl-4 py-0.5">Share capital</td>
                <td className="text-center">12</td>
                <td className="text-right">-</td>
                <td className="text-right">-</td>
              </tr>
              <tr>
                <td className="pl-4 py-0.5">Calls-in-arrear</td>
                <td className="text-center">13</td>
                <td className="text-right">-</td>
                <td className="text-right">-</td>
              </tr>
              <tr>
                <td className="pl-4 py-0.5">Share money deposit</td>
                <td className="text-center">14</td>
                <td className="text-right">-</td>
                <td className="text-right">-</td>
              </tr>
              <tr>
                <td className="pl-4 py-0.5">Retained earnings</td>
                <td className="text-center">15</td>
                <td className="text-right border-b border-black">-</td>
                <td className="text-right border-b border-black">-</td>
              </tr>
              <tr className="font-bold italic">
                <td className="pl-8 py-1">Total equity</td>
                <td></td>
                <td className="text-right border-b border-black">-</td>
                <td className="text-right border-b border-black">-</td>
              </tr>

              {/* Non-current liabilities */}
              <tr className="font-bold">
                <td className="pl-0 py-1">Non-current liabilities</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td className="pl-4 py-0.5">Borrowings from bank</td>
                <td className="text-center">16</td>
                <td className="text-right">-</td>
                <td className="text-right">-</td>
              </tr>
              <tr>
                <td className="pl-4 py-0.5">Deferred tax liabilities</td>
                <td className="text-center">17</td>
                <td className="text-right">-</td>
                <td className="text-right">-</td>
              </tr>
              <tr>
                <td className="pl-4 py-0.5">Financial liabilities with related parties</td>
                <td className="text-center">18</td>
                <td className="text-right border-b border-black">-</td>
                <td className="text-right border-b border-black">-</td>
              </tr>
              <tr className="font-bold">
                <td className="pl-8 py-1">Total non-current liabilities</td>
                <td></td>
                <td className="text-right border-b border-black">-</td>
                <td className="text-right border-b border-black">-</td>
              </tr>

              {/* Current liabilities */}
              <tr className="font-bold">
                <td className="pl-0 py-1">Current liabilities</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td className="pl-4 py-0.5">Borrowings from bank - current portion</td>
                <td className="text-center">16</td>
                <td className="text-right">-</td>
                <td className="text-right">-</td>
              </tr>
              <tr>
                <td className="pl-4 py-0.5">Advance received from customers</td>
                <td className="text-center">19</td>
                <td className="text-right">-</td>
                <td className="text-right">-</td>
              </tr>
              <tr>
                <td className="pl-4 py-0.5">Trade and other payables</td>
                <td className="text-center">20</td>
                <td className="text-right">-</td>
                <td className="text-right">-</td>
              </tr>
              <tr>
                <td className="pl-4 py-0.5">Current tax payable</td>
                <td className="text-center">21</td>
                <td className="text-right">-</td>
                <td className="text-right">-</td>
              </tr>
              <tr>
                <td className="pl-4 py-0.5">Provision for expense</td>
                <td className="text-center">22</td>
                <td className="text-right border-b border-black">-</td>
                <td className="text-right border-b border-black">-</td>
              </tr>
              <tr className="font-bold">
                <td className="pl-8 py-1">Total current liabilities</td>
                <td></td>
                <td className="text-right border-b border-black">-</td>
                <td className="text-right border-b border-black">-</td>
              </tr>
              <tr className="font-bold">
                <td className="pl-8 py-1">Total liabilities</td>
                <td></td>
                <td className="text-right border-b border-black">-</td>
                <td className="text-right border-b border-black">-</td>
              </tr>
              <tr className="font-bold bg-gray-50">
                <td className="pl-0 py-1 border-y border-black uppercase">Total equity and liabilities</td>
                <td className="border-y border-black"></td>
                <td className="text-right border-y-2 border-black">-</td>
                <td className="text-right border-y-2 border-black">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
