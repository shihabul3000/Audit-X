import React from 'react';
import CostOfSales from './Page4/CostOfSales';
import CostOfProduction from './Page4/CostOfProduction';

interface PageProps {
  docStatuses: Record<string, string>;
  handleStatusChange: (id: string, val: string) => void;
}

export const Page4: React.FC<PageProps> = ({ docStatuses, handleStatusChange }) => {
  return (
    <div className="bg-white p-4">
      <CostOfSales docStatuses={docStatuses} handleStatusChange={handleStatusChange} />
      <CostOfProduction />
    </div>
  );
};
