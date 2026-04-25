'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { authService } from '@/services/api/auth.service';
import { SidebarNew } from './SidebarNew';

export function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['me'],
    queryFn: authService.getMe,
    retry: false,
  });

  useEffect(() => {
    if (!isLoading && isError) {
      router.push('/auth');
    }
  }, [isLoading, isError, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-[#121212] text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen w-full bg-[#121212] overflow-hidden font-sans">
      <SidebarNew user={user} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
