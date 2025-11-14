import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const router = useRouter();
  const { data: authData, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (authData?.user) {
        router.push('/dashboard');
      } else {
        router.push('/auth/login');
      }
    }
  }, [authData, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}
