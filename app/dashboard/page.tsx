'use client';
import DashboardContent from '@/components/dashboard/content/DashboardContent';

const DashboardPage = () => {
  return (
    <section className='dashboard-home-container'>
      {/* wrap protected routes */}
      <DashboardContent />
    </section>
  );
};

export default DashboardPage;
