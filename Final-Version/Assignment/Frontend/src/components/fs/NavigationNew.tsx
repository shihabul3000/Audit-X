'use client';

import { useRouter } from 'next/navigation';
import { Plus, Home } from 'lucide-react';
import type { Tab } from '@/types';

interface NavigationNewProps {
  tabs: Tab[];
  activeTab: Tab;
}

export function NavigationNew({ tabs, activeTab }: NavigationNewProps) {
  const router = useRouter();

  return (
    <footer className="h-10 bg-[#F3F3F3] border-t border-gray-300 flex items-center px-1 shadow-inner shrink-0">
      <div className="flex h-full items-center overflow-x-auto no-scrollbar">
        <button
          onClick={() => router.push('/dashboard/my-companies')}
          className="h-full flex items-center gap-2 px-4 text-gray-600 hover:text-white hover:bg-emerald-600 transition-colors border-r border-gray-300 font-medium text-sm"
        >
          <Home size={16} /> Dashboard
        </button>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => router.push(`/fs/${tab.toLowerCase()}`)}
            className={`h-full px-4 text-sm whitespace-nowrap transition-all relative border-r border-gray-300 ${
              activeTab === tab
                ? 'bg-white text-[#107C41] font-semibold border-b-2 border-b-[#107C41]'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
        <button className="h-full px-3 text-gray-400 hover:bg-gray-200 transition-colors">
          <Plus size={18} />
        </button>
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </footer>
  );
}
