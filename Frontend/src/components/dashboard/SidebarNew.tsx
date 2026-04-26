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
    <div className="w-64 bg-[#0d1018] border-r border-white/[0.06] flex flex-col h-full text-white shrink-0">
      {/* Logo header */}
      <div className="p-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4f7df7] to-[#6366f1] flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <h2 className="text-lg font-bold tracking-tight text-white">
            Audit<span className="text-[#4f7df7]">-X</span>
          </h2>
        </div>
      </div>

      {/* Scrollable nav area */}
      <div className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
        {isAdmin && (
          <div className="space-y-1">
            <div className="text-[10px] font-semibold text-[#4a5568] uppercase tracking-widest px-2 mb-2">
              Management
            </div>
            <button
              onClick={() => router.push('/dashboard/my-companies')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                pathname.includes('/my-companies')
                  ? 'bg-[#4f7df7]/10 text-[#4f7df7] font-medium border border-[#4f7df7]/20'
                  : 'text-[#8a9ab5] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              My assigned companies
            </button>
            <button
              onClick={() => router.push('/dashboard/admin')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                pathname.includes('/admin')
                  ? 'bg-[#4f7df7]/10 text-[#4f7df7] font-medium border border-[#4f7df7]/20'
                  : 'text-[#8a9ab5] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Firm Operations (Admin)
            </button>
            {isSuperAdmin && (
              <button
                onClick={() => router.push('/dashboard/system')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                  pathname.includes('/system')
                    ? 'bg-red-500/10 text-red-400 font-medium border border-red-500/20'
                    : 'text-[#8a9ab5] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                System Config (Super Admin)
              </button>
            )}
          </div>
        )}

        {/* Companies section */}
        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-[10px] font-semibold text-[#4a5568] uppercase tracking-widest">
              Companies
            </span>
            <button
              onClick={() => setIsCreating(true)}
              className="w-5 h-5 rounded flex items-center justify-center text-[#4f7df7] hover:bg-[#4f7df7]/10 transition-colors text-base leading-none"
            >
              +
            </button>
          </div>

          {isCreating && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newCompanyName.trim()) createMutation.mutate(newCompanyName.trim());
              }}
              className="mb-2"
            >
              <input
                autoFocus
                type="text"
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
                onBlur={() => { if (!newCompanyName.trim()) setIsCreating(false); }}
                placeholder="Company name..."
                className="w-full px-3 py-2 bg-[#161b25] border border-white/[0.08] rounded-lg text-sm text-white placeholder-[#4a5568] focus:outline-none focus:border-[#4f7df7] transition-colors"
              />
            </form>
          )}

          <div className="space-y-0.5">
            {companies.map((company: Company) => (
              <div key={company.id} className="group relative">
                {editingId === company.id ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (editedName.trim()) updateMutation.mutate({ id: company.id, name: editedName.trim() });
                    }}
                    className="flex items-center bg-[#161b25] border border-[#4f7df7]/40 rounded-lg p-1"
                  >
                    <input
                      autoFocus
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="flex-1 px-2 py-1.5 bg-transparent text-sm text-white focus:outline-none"
                    />
                    <button type="submit" className="p-1 text-emerald-400 hover:text-emerald-300">
                      <Check size={14} />
                    </button>
                    <button type="button" onClick={() => setEditingId(null)} className="p-1 text-[#8a9ab5] hover:text-red-400">
                      <X size={14} />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => { setActiveCompany(company.id); router.push('/dashboard/my-companies'); }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-center gap-2.5 ${
                      activeCompanyId === company.id
                        ? 'bg-[#4f7df7]/10 text-white border border-[#4f7df7]/20'
                        : 'text-[#8a9ab5] hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    {/* Initial-letter avatar */}
                    <span className={`w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold shrink-0 ${
                      activeCompanyId === company.id
                        ? 'bg-[#4f7df7]/20 text-[#4f7df7]'
                        : 'bg-white/[0.06] text-[#8a9ab5]'
                    }`}>
                      {company.name.charAt(0).toUpperCase()}
                    </span>
                    <span className="truncate flex-1">{company.name}</span>
                    {/* Hover-reveal edit icon */}
                    <div
                      onClick={(e) => { e.stopPropagation(); setEditingId(company.id); setEditedName(company.name); }}
                      className="p-1 rounded hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    >
                      <Pencil size={13} className="text-[#8a9ab5]" />
                    </div>
                  </button>
                )}
              </div>
            ))}
            {companies.length === 0 && !isCreating && (
              <p className="text-[#4a5568] text-xs text-center py-4 italic">No companies yet</p>
            )}
          </div>
        </div>
      </div>

      {/* User footer */}
      <div className="p-4 border-t border-white/[0.06] bg-[#0a0c10]/60">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            {/* Gradient avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4f7df7] to-[#6366f1] flex items-center justify-center text-white font-bold text-sm shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              {/* Role badge */}
              <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-[#4f7df7]/15 text-[#4f7df7] border border-[#4f7df7]/20">
                {user.role.replace('_', ' ')}
              </span>
            </div>
          </div>
          {/* Notification bell */}
          <button
            onClick={() => router.push('/dashboard/notifications')}
            className="relative p-2 text-[#8a9ab5] hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/[0.08] rounded-lg transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
