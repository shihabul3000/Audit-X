'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Used by Google OAuth callback (/dashboard as callbackURL)
// Fetches user role and redirects to the correct dashboard
export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    fetch('/api/v1/users/me', { credentials: 'include' })
      .then(res => res.json())
      .then(json => {
        const role = (json?.data?.role || '').toUpperCase();
        if (role === 'SUPER_ADMIN') {
          router.replace('/dashboard/system');
        } else if (role === 'ADMIN') {
          router.replace('/dashboard/admin');
        } else {
          router.replace('/dashboard/my-companies');
        }
      })
      .catch(() => router.replace('/dashboard/my-companies'));
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen w-full bg-[#121212]">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
    </div>
  );
}
