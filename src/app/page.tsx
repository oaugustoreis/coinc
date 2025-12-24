'use client';

import { useAuth } from '@/components/auth-provider';
import MainApp from '@/components/main-app';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loading from './loading';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <Loading />;
  }

  return <MainApp user={user} />;
}
