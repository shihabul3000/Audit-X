import React from 'react';
import { Plus } from 'lucide-react';
import { Tab } from '../types';

interface NavigationProps {
  tabs: Tab[];
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <footer className="h-10 bg-[#F3F3F3] border-t border-gray-300 flex items-center px-1 shadow-inner">
      <div className="flex h-full items-center overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              h-full px-4 text-sm whitespace-nowrap transition-all relative border-r border-gray-300
              ${activeTab === tab 
                ? 'bg-white text-[#107C41] font-semibold border-b-2 border-b-[#107C41]' 
                : 'text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            {tab}
          </button>
        ))}
        <button className="h-full px-3 text-gray-400 hover:bg-gray-200 transition-colors">
          <Plus size={18} />
        </button>
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </footer>
  );
};
