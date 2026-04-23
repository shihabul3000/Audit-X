import React from 'react';
import { AuditReportData } from '../../types';
import { getFormattedDate } from '../../utils/dateFormatter';

interface CoverProps {
  data: AuditReportData;
  onUpdate: (data: Partial<AuditReportData>) => void;
}

export const Cover: React.FC<CoverProps> = ({ data, onUpdate }) => {
  const reportingDate = data.reportingDate || '2025-06-30';
  const startDate = data.startDate || '2024-07-01';

  const getParts = (dateString: string) => {
    if (!dateString) return { dd: '', mm: '', yyyy: '' };
    const parts = dateString.split('-');
    if (parts.length !== 3) return { dd: '', mm: '', yyyy: '' };

    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);

    const localDate = new Date(year, month, day);

    return {
      dd: localDate.getDate().toString().padStart(2, '0'),
      mm: localDate.toLocaleString('en-US', { month: 'long' }),
      yyyy: localDate.getFullYear().toString()
    };
  };

  const repParts = getParts(reportingDate);
  const startParts = getParts(startDate);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.currentTarget.tagName === 'INPUT') {
        e.preventDefault();
        const container = e.currentTarget.closest('.space-y-4');
        if (container) {
          const inputs = Array.from(container.querySelectorAll('input, textarea')) as (HTMLInputElement | HTMLTextAreaElement)[];
          const index = inputs.indexOf(e.currentTarget);
          if (index > -1 && index < inputs.length - 1) {
            inputs[index + 1].focus();
          }
        }
      }
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center p-8 bg-[#E4E4E4]">
      {/* Date Configuration Table */}
      <div className="absolute top-8 left-8">
        <table className="border-collapse text-sm select-none">
          <thead>
            <tr>
              <th></th>
              <th className="text-[#3b82f6] font-normal px-2 pb-1">DD</th>
              <th className="text-[#3b82f6] font-normal px-2 pb-1 w-24">MM</th>
              <th className="text-[#3b82f6] font-normal px-2 pb-1">YYYY</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-gray-700 pr-4 py-1">Reporting date</td>
              <td className="border border-black bg-transparent relative hover:bg-black/5 transition-colors">
                <input type="date" min="1990-01-01" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" value={reportingDate} onChange={(e) => onUpdate({ reportingDate: e.target.value })} />
                <div className="w-10 text-gray-800 text-center py-0.5 pointer-events-none relative z-0">{repParts.dd}</div>
              </td>
              <td className="border border-black bg-transparent relative hover:bg-black/5 transition-colors">
                <input type="date" min="1990-01-01" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" value={reportingDate} onChange={(e) => onUpdate({ reportingDate: e.target.value })} />
                <div className="w-24 text-gray-800 text-center text-[13px] leading-tight flex items-center justify-center min-h-[26px] pointer-events-none relative z-0">{repParts.mm}</div>
              </td>
              <td className="border border-black bg-transparent relative hover:bg-black/5 transition-colors">
                <input type="date" min="1990-01-01" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" value={reportingDate} onChange={(e) => onUpdate({ reportingDate: e.target.value })} />
                <div className="w-14 text-gray-800 text-center py-0.5 pointer-events-none relative z-0">{repParts.yyyy}</div>
              </td>
            </tr>
            <tr>
              <td className="text-gray-700 pr-4 py-1">Start date</td>
              <td className="border border-black bg-transparent relative hover:bg-black/5 transition-colors">
                <input type="date" min="1990-01-01" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" value={startDate} onChange={(e) => onUpdate({ startDate: e.target.value })} />
                <div className="w-10 text-gray-800 text-center py-0.5 pointer-events-none relative z-0">{startParts.dd}</div>
              </td>
              <td className="border border-black bg-transparent relative hover:bg-black/5 transition-colors">
                <input type="date" min="1990-01-01" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" value={startDate} onChange={(e) => onUpdate({ startDate: e.target.value })} />
                <div className="w-24 text-gray-800 text-center text-[13px] leading-tight flex items-center justify-center min-h-[26px] pointer-events-none relative z-0">{startParts.mm}</div>
              </td>
              <td className="border border-black bg-transparent relative hover:bg-black/5 transition-colors">
                <input type="date" min="1990-01-01" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" value={startDate} onChange={(e) => onUpdate({ startDate: e.target.value })} />
                <div className="w-14 text-gray-800 text-center py-0.5 pointer-events-none relative z-0">{startParts.yyyy}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Main Report Box */}
      <div className="relative z-10 bg-white border-2 border-black w-full max-w-2xl p-10 text-center shadow-lg">
        <div className="relative z-20 space-y-2">
          <h1 className="text-2xl font-bold text-black uppercase tracking-tight">Independent Auditor's Report</h1>
          <p className="text-lg text-black italic">and</p>
          <h2 className="text-xl font-bold text-black uppercase tracking-tight">Audited Financial Statements</h2>
          <p className="text-lg text-black italic">of</p>

          <div className="pt-4 space-y-4">
            <input
              type="text"
              value={data.company}
              onChange={(e) => onUpdate({ company: e.target.value })}
              onKeyDown={handleKeyDown}
              className="w-full text-2xl font-bold text-center border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent py-1"
              placeholder="Company Name"
            />

            <textarea
              value={data.addr}
              onChange={(e) => onUpdate({ addr: e.target.value })}
              onKeyDown={handleKeyDown}
              className="w-full text-sm text-center border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent resize-none py-1 h-12"
              placeholder="Company Address"
            />

            <div className="w-full text-lg font-bold text-center py-1">
              As at {getFormattedDate(data.reportingDate)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

