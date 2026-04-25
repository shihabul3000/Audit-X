'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Pencil, Check, X, Bell } from 'lucide-react';
import { toast } from 'sonner';
import { companyService, type Company } from '@/services/api/company.service';
import { notificationService } from '@/services/api/notification.service';
import { authClient } from '@/lib/authClient';
import { useUIStore } from '@/store/useUIStore';
import type { User } from '@/services/api/auth.service';

interface SidebarNewProps {
  user: User;
}

export function SidebarNew({ user }: SidebarNewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { activeCompanyId, setActiveCompany } = useUIStore();

  const [isCreating, setIsCreating] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');

  const { data: companies = [] } = useQuery({
    queryKey: ['companies'],
    queryFn: companyService.getCompanies,
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationService.getNotifications,
    refetchInterval: 30000,
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const createMutation = useMutation({
    mutationFn: (name: string) => companyService.createCompany(name),
    onSuccess: (company) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      setActiveCompany(company.id);
      setIsCreating(false);
      setNewCompanyName('');
      router.push('/dashboard/my-companies');
    },
    onError: () => toast.error('Failed to create company'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => companyService.updateCompany(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      setEditingId(null);
    },
    onError: () => toast.error('Failed to update company'),
  });

  const handleSignOut = async () => {
    await authClient.signOut();
    queryClient.clear();
    router.push('/auth');
  };

  const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
  const isSuperAdmin = user.role === 'SUPER_ADMIN';

  return (
    <div className="w-64 bg-[#1a1a1a] border-r border-gray-800 flex flex-col h-full text-white shrink-0">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
          Audit-X
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {isAdmin && (
          <div className="space-y-1">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Management</div>
            <button
              onClick={() => router.push('/dashboard/my-companies')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${pathname.includes('/my-companies') ? 'bg-blue-600/20 text-blue-400 font-medium border border-blue-500/30' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}
            >
              My assigned companies
            </button>
            <button
              onClick={() => router.push('/dashboard/admin')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${pathname.includes('/admin') ? 'bg-blue-600/20 text-blue-400 font-medium border border-blue-500/30' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}
            >
              Firm Operations (Admin)
            </button>
            {isSuperAdmin && (
              <button
                onClick={() => router.push('/dashboard/system')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${pathname.includes('/system') ? 'bg-red-600/20 text-red-400 font-medium border border-red-500/30' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}
              >
                System Config (Super Admin)
              </button>
            )}
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-3 text-sm font-semibold text-gray-400 uppercase tracking-wider">
            <span>Companies</span>
            <button onClick={() => setIsCreating(true)} className="text-blue-400 hover:text-blue-300 text-lg leading-none">+</button>
          </div>

          {isCreating && (
            <form onSubmit={(e) => { e.preventDefault(); if (newCompanyName.trim()) createMutation.mutate(newCompanyName.trim()); }} className="mb-3">
              <input
                autoFocus
                type="text"
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
                onBlur={() => { if (!newCompanyName.trim()) setIsCreating(false); }}
                placeholder="Company name..."
                className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </form>
          )}

          <div className="space-y-1">
            {companies.map((company: Company) => (
              <div key={company.id} className="group relative">
                {editingId === company.id ? (
                  <form onSubmit={(e) => { e.preventDefault(); if (editedName.trim()) updateMutation.mutate({ id: company.id, name: editedName.trim() }); }} className="flex items-center bg-[#2a2a2a] border border-blue-500 rounded-lg p-1">
                    <input autoFocus type="text" value={editedName} onChange={(e) => setEditedName(e.target.value)} className="flex-1 px-2 py-1.5 bg-transparent text-sm text-white focus:outline-none" />
                    <button type="submit" className="p-1 text-emerald-400"><Check size={14} /></button>
                    <button type="button" onClick={() => setEditingId(null)} className="p-1 text-gray-400 hover:text-red-400"><X size={14} /></button>
                  </form>
                ) : (
                  <button
                    onClick={() => { setActiveCompany(company.id); router.push('/dashboard/my-companies'); }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex justify-between items-center ${activeCompanyId === company.id ? 'bg-blue-600 text-white font-medium' : 'text-gray-300 hover:bg-[#2a2a2a]'}`}
                  >
                    <span className="truncate">{company.name}</span>
                    <div onClick={(e) => { e.stopPropagation(); setEditingId(company.id); setEditedName(company.name); }} className={`p-1.5 rounded-md hover:bg-white/20 ${activeCompanyId === company.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      <Pencil size={14} />
                    </div>
                  </button>
                )}
              </div>
            ))}
            {companies.length === 0 && !isCreating && (
              <p className="text-gray-500 text-sm text-center py-4 italic">No companies yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-800 bg-[#161616]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-blue-500/20 text-blue-400">
                {user.role.replace('_', ' ')}
              </span>
            </div>
          </div>
          <button onClick={() => router.push('/dashboard/notifications')} className="relative p-2 text-gray-400 hover:text-white">
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>
        <button onClick={handleSignOut} className="w-full py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors">
          Sign Out
        </button>
      </div>
    </div>
  );
}
