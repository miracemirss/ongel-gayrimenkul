'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to admin dashboard if authenticated, otherwise to login
    if (auth.isAuthenticated()) {
      router.replace('/onglgyrmnkl-admin/dashboard');
    } else {
      router.replace('/onglgyrmnkl-admin');
    }
  }, [router]);

  return null;
}

