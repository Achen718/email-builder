import DashboardHome from '@/components/dashboard/content/DashboardHome';

const DashboardPage = () => {
  return (
    <section className='dashboard-home-container'>
      {/* wrap protected routes */}
      <DashboardHome />
    </section>
  );
};

export default DashboardPage;
