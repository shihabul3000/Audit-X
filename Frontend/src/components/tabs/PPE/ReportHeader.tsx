import React from 'react';
import { usePPE } from './Shared';
import { getFormattedDate } from '../../../utils/dateFormatter';

export const ReportHeader: React.FC = () => {
  const { headerInfo, data } = usePPE();

  return (
    <div className="border-b-2 border-blue-900 mb-1 pb-2 p-2">
      <h1 className="font-bold text-base text-black uppercase">{data.company}</h1>
      <p className="text-xs text-black">{data.addr}</p>
      <div className="flex justify-between font-bold mt-2 pt-1 border-t border-gray-300">
        <span className="text-black">{headerInfo.reportTitle}</span>
        <span className="text-black italic">{headerInfo.annexure}</span>
      </div>
      <div className="text-[11px] font-bold text-black mt-1">
        As at <span className="underline">{getFormattedDate(data.reportingDate)}</span>
      </div>
    </div>
  );
};
