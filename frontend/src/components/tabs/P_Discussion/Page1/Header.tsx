import React from 'react';
import { AuditReportData } from '../../../../types';
import { getFormattedDate } from '../../../../utils/dateFormatter';
import { EditableValue } from '../Shared';

interface HeaderProps {
  data: AuditReportData;
  onUpdate: (data: Partial<AuditReportData>) => void;
}

const Header: React.FC<HeaderProps> = ({ data, onUpdate }) => {
  return (
    <div className="border-2 border-blue-800 p-2 mb-4">
      {/* Top Section: Company Name and Address */}
      <div className="mb-2 w-full">
        <input
          type="text"
          value={data.company}
          onChange={(e) => onUpdate({ company: e.target.value })}
          className="w-full text-lg font-bold text-black border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent py-0.5"
          placeholder="Company Name"
        />
        <textarea
          value={data.addr}
          onChange={(e) => onUpdate({ addr: e.target.value })}
          className="w-full text-[12px] border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent resize-none py-0.5 h-10"
          placeholder="Company Address"
        />
      </div>

      {/* Horizontal Divider */}
      <div className="border-b border-blue-400 mb-3 mx-1"></div>

      {/* Bottom Section: Left and Right columns */}
      <div className="flex justify-between items-stretch mx-1">
        {/* Left Column */}
        <div className="w-[60%] flex flex-col justify-between">
          <div className="text-center mb-6">
            <h2 className="text-blue-600 font-bold text-[14px]">FIRST DISCUSSION MEETING ON THE FINANCIAL STATEMENTS</h2>
            <div className="flex justify-center gap-4 mt-2 text-[12px]">
              <div className="flex items-center gap-2">
                <span className="text-blue-600">Period started</span>
                <span className="border border-black px-6 py-0.5 font-bold">{getFormattedDate(data.startDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-600">Ended</span>
                <span className="border border-black px-6 py-0.5 font-bold">{getFormattedDate(data.reportingDate)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-end text-[12px] mt-auto w-full mb-1">
            <div className="flex-grow border-b border-black pb-1 leading-none">
              <span>Drafting</span>
            </div>
            <div className="border border-black px-2 py-1 min-w-[140px] ml-2 leading-none flex items-center justify-center">
              <EditableValue id="p1_drafting_name" className="text-center w-full" />
            </div>
            <div className="ml-6 mr-2 pb-1 leading-none">Visit:</div>
            <div className="border border-black px-2 py-1 min-w-[140px] leading-none flex items-center justify-center">
              <EditableValue id="p1_visit_name" className="text-center w-full" />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-[35%] flex flex-col justify-between items-end">
          <p className="text-blue-600 text-[13px] mb-4 font-semibold">Date : 27 March 2026</p>
          
          <div className="w-full max-w-[280px] flex flex-col text-[12px] mt-auto">
            <div className="border-t border-b border-black py-1 mb-1 text-center">
              <span>In Bangladesh Taka</span>
            </div>
            <div className="flex w-full justify-between gap-1">
              <div className="w-1/2 border-b border-black text-center pb-1 font-bold">
                {getFormattedDate(data.reportingDate)}
              </div>
              <div className="w-1/2 border-b border-black text-center pb-1 font-bold">
                {getFormattedDate(data.startDate)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
