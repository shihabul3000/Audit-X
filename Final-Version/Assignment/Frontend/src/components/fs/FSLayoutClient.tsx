'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/store/useUIStore';

export function FSLayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { activeYearId } = useUIStore();

  useEffect(() => {
    if (!activeYearId) {
      router.push('/dashboard/my-companies');
    }
  }, [activeYearId, router]);

  if (!activeYearId) return null;

  return <>{children}</>;
}
