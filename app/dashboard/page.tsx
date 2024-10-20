'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading';
import Sidebar from '@/components/dashboard/Sidebar';

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

  return <section>{token ? <Sidebar /> : <Loading />}</section>;
};

export default Dashboard;
