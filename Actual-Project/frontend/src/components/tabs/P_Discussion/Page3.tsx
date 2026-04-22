import React from 'react';
import Inventories from './Page3/Inventories';
import TradePayables from './Page3/TradePayables';

interface PageProps {
  docStatuses: Record<string, string>;
  handleStatusChange: (id: string, val: string) => void;
}

export const Page3: React.FC<PageProps> = ({ docStatuses, handleStatusChange }) => {
  return (
    <div className="bg-white p-4">
      <Inventories docStatuses={docStatuses} handleStatusChange={handleStatusChange} />
      <TradePayables />
    </div>
  );
};
