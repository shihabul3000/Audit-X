import React from 'react';
import { AuditReportData } from '../../types';
import { getFormattedDate } from '../../utils/dateFormatter';

interface PNLProps {
  data: AuditReportData;
}

export const PNL: React.FC<PNLProps> = ({ data }) => {
  return (
    <div className="w-full bg-white p-8 font-serif text-[13px] leading-tight text-black">
      <div className="max-w-4xl mx-auto border border-blue-800 p-1 min-h-full">
        {/* Header Section */}
        <div className="border-b-2 border-blue-900 mb-1 pb-1">
          <h1 className="font-bold text-base">{data.company}</h1>
          <p className="text-xs">{data.addr}</p>
        </div>
        
        <div className="mb-4">
          <h2 className="font-bold">Statement of profit or loss and other comprehensive income</h2>
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
          <table className="w-full border-collapse min-w-[600px]">
          <thead>
            <tr>
              <th className="w-auto"></th>
              <th className="w-12 text-center font-bold border-b border-black">Notes</th>
              <th className="w-28"></th>
              <th className="w-28"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="font-bold py-1">Revenue</td>
              <td className="text-center font-bold">23</td>
              <td className="text-right">-</td>
              <td className="text-right">-</td>
            </tr>
            <tr>
              <td className="py-1">Cost of sales</td>
              <td className="text-center font-bold">24</td>
              <td className="text-right border-b border-black">-</td>
              <td className="text-right border-b border-black">-</td>
            </tr>
            <tr className="italic">
              <td className="py-1">Gross profit</td>
              <td></td>
              <td className="text-right border-b border-black">-</td>
              <td className="text-right border-b border-black">-</td>
            </tr>

            <tr><td colSpan={4} className="h-4"></td></tr>
            
            <tr>
              <td className="py-1">Administrative expense</td>
              <td className="text-center font-bold">25</td>
              <td className="text-right">-</td>
              <td className="text-right">-</td>
            </tr>
            <tr>
              <td className="py-1">Distribution costs</td>
              <td className="text-center font-bold">26</td>
              <td className="text-right border-b border-black">-</td>
              <td className="text-right border-b border-black">-</td>
            </tr>
            <tr className="italic font-bold">
              <td className="py-1">Earnings before interest and tax (EBIT)</td>
              <td></td>
              <td className="text-right border-b border-black">-</td>
              <td className="text-right border-b border-black">-</td>
            </tr>

            <tr><td colSpan={4} className="h-4"></td></tr>

            <tr>
              <td className="py-1">Other income</td>
              <td className="text-center font-bold">27</td>
              <td className="text-right">-</td>
              <td className="text-right">-</td>
            </tr>
            <tr>
              <td className="py-1">Finance costs</td>
              <td className="text-center font-bold">28</td>
              <td className="text-right border-b border-black">-</td>
              <td className="text-right border-b border-black">-</td>
            </tr>
            <tr className="italic font-bold">
              <td className="py-1">Profit before tax</td>
              <td></td>
              <td className="text-right border-b border-black">-</td>
              <td className="text-right border-b border-black">-</td>
            </tr>
            <tr>
              <td className="py-1">Income tax expense</td>
              <td className="text-center font-bold">29</td>
              <td className="text-right border-b border-black">-</td>
              <td className="text-right border-b border-black">-</td>
            </tr>
            <tr className="font-bold uppercase">
              <td className="py-1 border-y border-black">PROFIT FOR THE YEAR</td>
              <td className="border-y border-black"></td>
              <td className="text-right border-y-2 border-black">-</td>
              <td className="text-right border-y-2 border-black">-</td>
            </tr>

            <tr><td colSpan={4} className="h-8"></td></tr>

            <tr>
              <td className="py-1 italic">Other comprehensive income</td>
              <td></td>
              <td className="text-right border-b border-black">-</td>
              <td className="text-right border-b border-black">-</td>
            </tr>
            <tr className="font-bold uppercase bg-gray-50">
              <td className="py-1 border-y border-black">TOTAL COMPREHENSIVE INCOME FOR THE YEAR</td>
              <td className="border-y border-black"></td>
              <td className="text-right border-y-2 border-black">-</td>
              <td className="text-right border-y-2 border-black">-</td>
            </tr>
          </tbody>
        </table>
        </div>
        
        <div className="mt-4">
          <p className="italic text-xs">Annexed notes form an integral parts of these Financial Statements.</p>
        </div>
      </div>
    </div>
  );
};
