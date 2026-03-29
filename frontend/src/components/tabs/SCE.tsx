import React from 'react';
import { AuditReportData } from '../../types';
import { getFormattedDate, getPreviousYearDate, getPreviousDayDate } from '../../utils/dateFormatter';

interface SCEProps {
  data: AuditReportData;
}

export const SCE: React.FC<SCEProps> = ({ data }) => {
  return (
    <div className="w-full bg-white p-8 font-serif text-[11px] leading-tight text-black">
      <div className="max-w-5xl mx-auto border border-blue-800 p-1 min-h-full">
        {/* Header Section */}
        <div className="border-b-2 border-blue-900 mb-1 pb-1">
          <h1 className="font-bold text-base">{data.company}</h1>
          <p className="text-xs">{data.addr}</p>
        </div>
        
        <div className="mb-4">
          <h2 className="font-bold">Statement of changes in equity</h2>
          <p className="font-bold italic">For the year ended {getFormattedDate(data.reportingDate)}</p>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border-t border-black min-w-[800px]">
          <thead>
            <tr>
              <th rowSpan={2} className="border-b border-black text-left align-bottom py-2 px-1"></th>
              <th className="border border-black text-center py-1 px-1 w-20">Number of share</th>
              <th colSpan={5} className="border border-black text-center py-1 px-1">In Bangladesh Taka</th>
            </tr>
            <tr>
              <th className="border border-black text-center py-1 px-1">share</th>
              <th className="border border-black text-center py-1 px-1 w-24">Share capital</th>
              <th className="border border-black text-center py-1 px-1 w-24">Calls-in-arrear</th>
              <th className="border border-black text-center py-1 px-1 w-24">Share money deposit</th>
              <th className="border border-black text-center py-1 px-1 w-24">Retained earnings</th>
              <th className="border border-black text-center py-1 px-1 w-24">Total equity</th>
            </tr>
          </thead>
          <tbody>
            {/* 2023-2024 Section */}
            <tr>
              <td className="py-2 px-1 font-bold">Balance at {getPreviousYearDate(data.startDate)}</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
            </tr>
            <tr>
              <td className="py-1 px-1">Changes in accounting policy</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
            </tr>
            <tr className="border-t border-black">
              <td className="py-1 px-1 font-bold">Balance at {getPreviousYearDate(data.startDate)}</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
            </tr>
            <tr>
              <td className="py-1 px-1">Movement during the year</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
            </tr>
            <tr>
              <td className="py-1 px-1">Total comprehensive income for the year ended {getPreviousDayDate(data.startDate)}</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
            </tr>
            <tr className="border-y border-black font-bold">
              <td className="py-1 px-1">Balance at {getPreviousDayDate(data.startDate)}</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
            </tr>

            {/* 2024-2025 Section */}
            <tr><td colSpan={7} className="h-4"></td></tr>
            <tr>
              <td className="py-2 px-1 font-bold">Balance at {getFormattedDate(data.startDate)}</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
            </tr>
            <tr>
              <td className="py-1 px-1">Movement during the year</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
            </tr>
            <tr>
              <td className="py-1 px-1">Total comprehensive income for the year ended {getFormattedDate(data.reportingDate)}</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
            </tr>
            <tr className="border-y-2 border-black font-bold">
              <td className="py-1 px-1">Balance at {getFormattedDate(data.reportingDate)}</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
              <td className="text-right px-1">-</td>
            </tr>
          </tbody>
        </table>
        </div>
        
        <div className="mt-4">
          <p className="italic text-[10px]">Annexed notes form an integral parts of these Financial Statements.</p>
        </div>
      </div>
    </div>
  );
};
