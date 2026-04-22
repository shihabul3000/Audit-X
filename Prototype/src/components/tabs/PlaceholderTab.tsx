import React from 'react';
import { Tab } from '../../types';

interface PlaceholderTabProps {
  tabName: Tab;
}

export const PlaceholderTab: React.FC<PlaceholderTabProps> = ({ tabName }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50 text-gray-400">
      <h2 className="text-4xl font-light mb-4">{tabName}</h2>
      <p className="text-sm uppercase tracking-widest">Content for {tabName} view goes here</p>
      <div className="mt-8 p-4 border border-dashed border-gray-300 rounded-lg max-w-md text-center">
        <p className="text-xs italic">
          This is a modular placeholder. You can create a new component in 
          `src/components/tabs/{tabName}.tsx` and import it in `App.tsx` 
          to add specific functionality for this page.
        </p>
      </div>
    </div>
  );
};
