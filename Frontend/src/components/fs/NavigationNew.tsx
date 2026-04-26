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
    <footer className="h-10 bg-[#0d1018] border-t border-white/[0.06] flex items-center px-1 shrink-0">
      <div className="flex h-full items-center overflow-x-auto no-scrollbar">
        <button
          onClick={() => router.push('/dashboard/my-companies')}
          className="h-full flex items-center gap-2 px-4 text-[#8a9ab5] hover:text-white hover:bg-white/[0.04] transition-colors border-r border-white/[0.06] font-medium text-sm"
        >
          <Home size={16} /> Dashboard
        </button>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => router.push(`/fs/${tab.toLowerCase()}`)}
            className={`h-full px-4 text-sm whitespace-nowrap transition-all relative border-r border-white/[0.06] ${
              activeTab === tab
                ? 'text-[#4f7df7] bg-[#4f7df7]/[0.07] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#4f7df7]'
                : 'text-[#8a9ab5] hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            {tab}
          </button>
        ))}
        <button className="h-full px-3 text-[#8a9ab5] hover:text-white hover:bg-white/[0.04] transition-colors">
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
