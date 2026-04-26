'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, Check } from 'lucide-react';
import { notificationService } from '@/services/api/notification.service';

export default function NotificationsPage() {
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationService.getNotifications,
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markAllReadMutation = useMutation({
    mutationFn: notificationService.markAllRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  return (
    <div className="flex-1 bg-[#0f1117] p-8 overflow-y-auto text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#4f7df7]/15 border border-[#4f7df7]/20 flex items-center justify-center">
            <Bell size={20} className="text-[#4f7df7]" />
          </div>
          Notifications
        </h2>
        {notifications.some(n => !n.read) && (
          <button
            onClick={() => markAllReadMutation.mutate()}
            className="text-sm text-[#4f7df7] border border-[#4f7df7]/30 hover:border-[#4f7df7]/60 hover:bg-[#4f7df7]/10 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all"
          >
            <Check size={14} /> Mark all read
          </button>
        )}
      </div>

      <div className="space-y-3 max-w-2xl">
        {isLoading ? (
          <p className="text-[#8a9ab5]">Loading...</p>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12 text-[#8a9ab5]">
            <Bell size={48} className="mx-auto mb-4 opacity-20" />
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              className={`p-4 rounded-xl border transition-all relative overflow-hidden ${
                n.read
                  ? 'bg-[#0f1117] border-white/[0.05] opacity-60'
                  : 'bg-[#161b25] border-[#4f7df7]/15'
              }`}
            >
              {!n.read && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#4f7df7]" />
              )}
              <div className="flex justify-between items-start">
                <div className={!n.read ? 'pl-3' : ''}>
                  <p className="font-semibold text-white">{n.title}</p>
                  <p className="text-[#8a9ab5] text-sm mt-1">{n.message}</p>
                  <p className="text-[#8a9ab5]/60 text-xs mt-2">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
                {!n.read && (
                  <button
                    onClick={() => markReadMutation.mutate(n.id)}
                    className="text-[#4f7df7] hover:text-[#4f7df7]/70 p-1 transition-colors"
                  >
                    <Check size={16} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
