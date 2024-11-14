'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading';
import Dashboard from '@/components/dashboard/Dashboard';

const DashboardPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // replace with store dispatch
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  return (
    <section className='dashboard-container'>
      {/* wrap protected routes */}
      {isLoading ? <Loading /> : <Dashboard />}
    </section>
  );
};

export default DashboardPage;
