import React from 'react';
import { AuditReportData } from '../../types';
import { getFormattedDate } from '../../utils/dateFormatter';

interface SCFProps {
  data: AuditReportData;
}

export const SCF: React.FC<SCFProps> = ({ data }) => {
  return (
    <div className="w-full bg-white p-8 font-serif text-[12px] leading-tight text-black">
      <div className="max-w-4xl mx-auto border border-blue-800 p-1 min-h-full">
        {/* Header Section */}
        <div className="border-b-2 border-blue-900 mb-1 pb-1">
          <h1 className="font-bold text-base">{data.company}</h1>
          <p className="text-xs">{data.addr}</p>
        </div>
        
        <div className="mb-4">
          <h2 className="font-bold">Statement of cash flows</h2>
          <div className="flex justify-between items-end">
            <p className="font-bold italic">For the year ended {getFormattedDate(data.reportingDate)}</p>
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
          <table className="w-full border-collapse border-t border-black min-w-[600px]">
          <tbody>
            {/* A) Operating Activities */}
            <tr className="font-bold border-b border-black">
              <td className="py-1">A) Cash flow from operating activities</td>
              <td className="w-28"></td>
              <td className="w-28"></td>
            </tr>
            <tr>
              <td className="pl-4 py-0.5">Profit before tax</td>
              <td className="text-right">-</td>
              <td className="text-right">-</td>
            </tr>
            <tr>
              <td className="pl-4 py-0.5">Finance costs</td>
              <td className="text-right">-</td>
              <td className="text-right">-</td>
            </tr>
            <tr>
              <td className="pl-4 py-0.5">(Gain) loss on disposal of property, plant and equipment</td>
              <td className="text-right">-</td>
              <td className="text-right">-</td>
            </tr>
            <tr>
              <td className="pl-4 py-0.5">Depreciation of property, plant and equipment</td>
              <td className="text-right">-</td>
              <td className="text-right">-</td>
            </tr>
            <tr>
              <td className="pl-4 py-0.5">Amortization of intangible assets</td>
              <td className="text-right border-b border-black">-</td>
              <td className="text-right border-b border-black">-</td>
            </tr>
            <tr className="font-bold italic">
              <td className="pl-4 py-1">Operating cash flows before movements in working capital</td>
              <td className="text-right border-b border-black">-</td>
              <td className="text-right border-b border-black">-</td>
            </tr>
            <tr>
              <td className="pl-4 py-0.5">(Increased)/decreased in Inventories</td>
              <td className="text-right">-</td>
              <td className="text-right">-</td>
            </tr>
            <tr>
              <td className="pl-4 py-0.5">(Increased)/decreased in Trade and other receivables</td>
              <td className="text-right">-</td>
              <td className="text-right">-</td>
            </tr>
            <tr>
              <td className="pl-4 py-0.5">(Increased)/decreased in Advances, deposits and prepayments</td>
              <td className="text-right">-</td>
              <td className="text-right">-</td>
            </tr>
            <tr>
              <td className="pl-4 py-0.5">(Increased)/decreased in Investments in financial assets</td>
              <td className="text-right">-</td>
              <td className="text-right">-</td>
            </tr>
            <tr>
              <td className="pl-4 py-0.5">(decreased)/increased in Advance received from customers</td>
              <td className="text-right">-</td>
              <td className="text-right">-</td>
            </tr>
            <tr>
              <td className="pl-4 py-0.5">(decreased)/increased in Trade and other payables</td>
              <td className="text-right">-</td>
              <td className="text-right">-</td>
            </tr>
            <tr>
              <td className="pl-4 py-0.5">(decreased)/increased in Provision for expense</td>
              <td className="text-right">-</td>
              <td className="text-right">-</td>
            </tr>
            <tr>
              <td className="pl-4 py-0.5">Finance costs paid</td>
              <td className="text-right">-</td>
              <td className="text-right">-</td>
            </tr>
            <tr>
              <td className="pl-4 py-0.5">Income tax paid</td>
              <td className="text-right border-b border-black">-</td>
              <td className="text-right border-b border-black">-</td>
            </tr>
            <tr className="font-bold italic border-b border-black">
              <td className="pl-4 py-1">Net cash (used in)/generated from operating activities</td>
              <td className="text-right border-b border-black">-</td>
              <td className="text-right border-b border-black">-</td>
            </tr>

            {/* B) Investing Activities */}
            <tr><td colSpan={3} className="h-4"></td></tr>
            <tr className="font-bold">
              <td className="py-1">B) Cash flow from investing activities</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td className="pl-4 py-0.5">Proceeds from disposal of Property, plant and equipment</td>
              <td className="text-right">-</td>
              <td className="text-right">-</td>
            </tr>
            <tr>
              <td className="pl-4 py-0.5">Purchase of Property, plant and equipment</td>
              <td className="text-right">-</td>
              <td className="text-right">-</td>
            </tr>
            <tr>
              <td className="pl-4 py-0.5">Proceeds from disposal of Intangible assets</td>
              <td className="text-right border-b border-black">-</td>
              <td className="text-right border-b border-black">-</td>
            </tr>
            <tr className="font-bold italic border-b border-black">
              <td className="pl-4 py-1">Net cash (used in)/generated from investing activities</td>
              <td className="text-right border-b border-black">-</td>
              <td className="text-right border-b border-black">-</td>
            </tr>

            {/* C) Financing Activities */}
            <tr><td colSpan={3} className="h-4"></td></tr>
            <tr className="font-bold">
              <td className="py-1">C) Cash flows from financing activities</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td className="pl-4 py-0.5">Received from Share capital</td>
              <td className="text-right">-</td>
              <td className="text-right">-</td>
            </tr>
            <tr>
              <td className="pl-4 py-0.5">(Repayment) of Borrowings from bank</td>
              <td className="text-right">-</td>
              <td className="text-right">-</td>
            </tr>
            <tr>
              <td className="pl-4 py-0.5">(Repayment) of Financial liabilities with related parties</td>
              <td className="text-right border-b border-black">-</td>
              <td className="text-right border-b border-black">-</td>
            </tr>
            <tr className="font-bold italic border-b border-black">
              <td className="pl-4 py-1">Net cash (used in)/generated from financing activities</td>
              <td className="text-right border-b border-black">-</td>
              <td className="text-right border-b border-black">-</td>
            </tr>

            {/* Summary */}
            <tr className="font-bold italic border-b border-black bg-gray-50">
              <td className="py-1">Net (decrease)/increase in cash and cash equivalents(A+B+C)</td>
              <td className="text-right border-b border-black">-</td>
              <td className="text-right border-b border-black">-</td>
            </tr>
            
            <tr><td colSpan={3} className="h-4"></td></tr>
            
            <tr className="border-t border-black">
              <td className="py-1">Cash and cash equivalents at beginning of year</td>
              <td className="text-right">-</td>
              <td className="text-right">-</td>
            </tr>
            <tr>
              <td className="py-1">Effect of foreign exchange rate changes</td>
              <td className="text-right border-b border-black">-</td>
              <td className="text-right border-b border-black">-</td>
            </tr>
            <tr className="font-bold border-y border-black">
              <td className="py-1">Cash and cash equivalents at end of year</td>
              <td className="text-right border-b border-black">-</td>
              <td className="text-right border-b border-black">-</td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};
