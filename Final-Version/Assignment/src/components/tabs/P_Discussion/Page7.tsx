import React from 'react';
import ExpenseSummary from './Page7/ExpenseSummary';
import Investments from './Page7/Investments';
import OtherIncome from './Page7/OtherIncome';
import InvestmentSummary from './Page7/InvestmentSummary';

interface PageProps {
  docStatuses: Record<string, string>;
  handleStatusChange: (id: string, val: string) => void;
}

export const Page7: React.FC<PageProps> = ({ docStatuses, handleStatusChange }) => {
  return (
    <div className="bg-white p-4">
      <ExpenseSummary docStatuses={docStatuses} handleStatusChange={handleStatusChange} />
      <Investments />
      <OtherIncome />
      <InvestmentSummary docStatuses={docStatuses} handleStatusChange={handleStatusChange} />
    </div>
  );
};
