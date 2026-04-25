import React from 'react';
import IntangibleAssets from './Page2/IntangibleAssets';

interface PageProps {
  docStatuses: Record<string, string>;
  handleStatusChange: (id: string, val: string) => void;
}

export const Page2: React.FC<PageProps> = ({ docStatuses, handleStatusChange }) => {
  return (
    <div className="bg-white p-4">
      <IntangibleAssets />
    </div>
  );
};
