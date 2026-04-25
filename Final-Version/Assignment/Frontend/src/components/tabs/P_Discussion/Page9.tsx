import React from 'react';
import CurrentTaxPayable from './Page9/CurrentTaxPayable';
import IncomeTaxExpense from './Page9/IncomeTaxExpense';
import TaxationSummary from './Page9/TaxationSummary';

interface PageProps {
  docStatuses: Record<string, string>;
  handleStatusChange: (id: string, val: string) => void;
}

export const Page9: React.FC<PageProps> = ({ docStatuses, handleStatusChange }) => {
  return (
    <div className="bg-white p-4">
      <CurrentTaxPayable />
      <IncomeTaxExpense />
      <TaxationSummary docStatuses={docStatuses} handleStatusChange={handleStatusChange} />
    </div>
  );
};
