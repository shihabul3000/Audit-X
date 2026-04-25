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
    <div className="flex-1 bg-[#121212] p-8 overflow-y-auto text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Bell size={28} className="text-blue-400" /> Notifications
        </h2>
        {notifications.some(n => !n.read) && (
          <button onClick={() => markAllReadMutation.mutate()} className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
            <Check size={14} /> Mark all read
          </button>
        )}
      </div>

      <div className="space-y-3 max-w-2xl">
        {isLoading ? (
          <p className="text-gray-500">Loading...</p>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Bell size={48} className="mx-auto mb-4 opacity-20" />
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              className={`p-4 rounded-xl border transition-all ${n.read ? 'bg-[#1a1a1a] border-gray-800 opacity-60' : 'bg-[#1e2a3a] border-blue-800/50'}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-white">{n.title}</p>
                  <p className="text-gray-400 text-sm mt-1">{n.message}</p>
                  <p className="text-gray-600 text-xs mt-2">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
                {!n.read && (
                  <button onClick={() => markReadMutation.mutate(n.id)} className="text-blue-400 hover:text-blue-300 p-1">
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
