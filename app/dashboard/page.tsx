'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading';

const Dashboard = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setToken(token);
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return <Loading />;
  }

  return <div>{token ? 'Dashboard' : <Loading />}</div>;
};

export default Dashboard;
