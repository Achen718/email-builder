'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';
import { useAppSelector } from '@/lib/hooks/hooks';
import { selectCurrentUser } from '@/lib/features/auth/authSelectors';
import BaseSkeleton from '../ui/skeletons/Skeleton';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAppSelector(selectCurrentUser);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className='unauthorized'>
        {/* unauthorized page */}
        <h1>Unauthorized :(</h1>
        <BaseSkeleton />
      </div>
    );
  }

  return <>{children}</>;
};

export default PrivateRoute;
