'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to new admin route
    router.replace('/onglgyrmnkl-admin');
  }, [router]);

  return null;
}

