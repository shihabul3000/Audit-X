import React from 'react';
import Receivables from './Page5/Receivables';
import AdvanceFromCustomers from './Page5/AdvanceFromCustomers';
import Revenue from './Page5/Revenue';
import RevenueSummary from './Page5/RevenueSummary';

interface PageProps {
  docStatuses: Record<string, string>;
  handleStatusChange: (id: string, val: string) => void;
}

export const Page5: React.FC<PageProps> = ({ docStatuses, handleStatusChange }) => {
  return (
    <div className="bg-white p-4">
      <Receivables />
      <AdvanceFromCustomers />
      <Revenue />
      <RevenueSummary docStatuses={docStatuses} handleStatusChange={handleStatusChange} />
    </div>
  );
};
