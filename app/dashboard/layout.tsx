import Dashboard from '@/components/dashboard/Dashboard';
import PrivateRoute from '@/components/protected-routes/PrivateRoute';
import DashboardHeader from '@/components/dashboard/header/DashboardHeader';
import DashboardContainer from '@/components/dashboard/container/DashboardContainer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivateRoute>
      <DashboardContainer>
        <DashboardHeader />
        <Dashboard>{children}</Dashboard>
      </DashboardContainer>
    </PrivateRoute>
  );
}
