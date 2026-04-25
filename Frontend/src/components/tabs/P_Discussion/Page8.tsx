import React from 'react';
import AdvanceIncomeTax from './Page8/AdvanceIncomeTax';
import DeferredTax from './Page8/DeferredTax';

interface PageProps {
  docStatuses: Record<string, string>;
  handleStatusChange: (id: string, val: string) => void;
}

export const Page8: React.FC<PageProps> = ({ docStatuses, handleStatusChange }) => {
  return (
    <div className="bg-white p-4">
      <AdvanceIncomeTax />
      <DeferredTax docStatuses={docStatuses} handleStatusChange={handleStatusChange} />
    </div>
  );
};
