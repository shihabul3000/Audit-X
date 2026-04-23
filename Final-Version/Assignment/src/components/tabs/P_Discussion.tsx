import React from 'react';
import { AuditReportData } from '../../types';
import { DiscussionContext } from './P_Discussion/Shared';

// Import modular page components
import { Page1 } from './P_Discussion/Page1';
import { Page2 } from './P_Discussion/Page2';
import { Page3 } from './P_Discussion/Page3';
import { Page4 } from './P_Discussion/Page4';
import { Page5 } from './P_Discussion/Page5';
import { Page6 } from './P_Discussion/Page6';
import { Page7 } from './P_Discussion/Page7';
import { Page8 } from './P_Discussion/Page8';
import { Page9 } from './P_Discussion/Page9';
import { Page10 } from './P_Discussion/Page10';
import { Page11 } from './P_Discussion/Page11';
import { Page12 } from './P_Discussion/Page12';
import { Page13 } from './P_Discussion/Page13';

export const P_Discussion: React.FC<{ data: AuditReportData; onUpdate: (data: Partial<AuditReportData>) => void }> = ({ data, onUpdate }) => {
  const { docStatuses, values } = data.discussionData;

  const handleStatusChange = (id: string, val: string) => {
    onUpdate({
      discussionData: {
        ...data.discussionData,
        docStatuses: { ...docStatuses, [id]: val }
      }
    });
  };

  const handleValueChange = (id: string, val: string) => {
    onUpdate({
      discussionData: {
        ...data.discussionData,
        values: { ...values, [id]: val }
      }
    });
  };

  const contextValue = {
    values,
    handleValueChange,
    docStatuses,
    handleStatusChange,
    data,
    onUpdate
  };

  return (
    <DiscussionContext.Provider value={contextValue}>
      <div className="w-full max-w-[1000px] mx-auto bg-gray-100 min-h-screen shadow-2xl overflow-x-auto">
        <div className="min-w-full w-fit">
          <Page1 data={data} onUpdate={onUpdate} docStatuses={docStatuses} handleStatusChange={handleStatusChange} />
          <Page2 docStatuses={docStatuses} handleStatusChange={handleStatusChange} />
          <Page3 docStatuses={docStatuses} handleStatusChange={handleStatusChange} />
          <Page4 docStatuses={docStatuses} handleStatusChange={handleStatusChange} />
          <Page5 docStatuses={docStatuses} handleStatusChange={handleStatusChange} />
          <Page6 />
          <Page7 docStatuses={docStatuses} handleStatusChange={handleStatusChange} />
          <Page8 docStatuses={docStatuses} handleStatusChange={handleStatusChange} />
          <Page9 docStatuses={docStatuses} handleStatusChange={handleStatusChange} />
          <Page10 docStatuses={docStatuses} handleStatusChange={handleStatusChange} />
          <Page11 docStatuses={docStatuses} handleStatusChange={handleStatusChange} />
          <Page12 docStatuses={docStatuses} handleStatusChange={handleStatusChange} />
          <Page13 />
        </div>
      </div>
    </DiscussionContext.Provider>
  );
};
