'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading';
import Sidebar from '@/components/dashboard/side-bar/Sidebar';

const Dashboard = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // replace with store dispatch
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setToken(token);
      setIsLoading(false);
    }
  }, [router]);

  return (
    <section className='dashboard-container'>
      {/* wrap protected routes */}
      {isLoading ? <Loading /> : <Sidebar />}
    </section>
  );
};

export default Dashboard;
