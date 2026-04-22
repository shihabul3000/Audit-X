import React from 'react';
import CashAndCashEquivalents from './Page10/CashAndCashEquivalents';
import BankVerification from './Page10/BankVerification';

interface PageProps {
  docStatuses: Record<string, string>;
  handleStatusChange: (id: string, val: string) => void;
}

export const Page10: React.FC<PageProps> = ({ docStatuses, handleStatusChange }) => {
  return (
    <div className="bg-white p-4">
      <CashAndCashEquivalents />
      <BankVerification docStatuses={docStatuses} handleStatusChange={handleStatusChange} />
    </div>
  );
};
