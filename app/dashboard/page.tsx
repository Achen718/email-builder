import Dashboard from '@/components/dashboard/Dashboard';

const DashboardPage = () => {
  return (
    <section className='dashboard-container'>
      {/* wrap protected routes */}
      <Dashboard />
    </section>
  );
};

export default DashboardPage;
