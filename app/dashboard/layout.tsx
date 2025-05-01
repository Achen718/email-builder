import Dashboard from '@/components/dashboard/Dashboard';
import DashboardHeader from '@/components/dashboard/header/DashboardHeader';
import DashboardContainer from '@/components/dashboard/container/DashboardContainer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardContainer>
      <DashboardHeader />
      <Dashboard>{children}</Dashboard>
    </DashboardContainer>
  );
}
