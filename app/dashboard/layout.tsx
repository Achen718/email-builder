import Dashboard from '@/components/dashboard/Dashboard';
import PrivateRoute from '@/components/protected-routes/PrivateRoute';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivateRoute>
      <section>
        <Dashboard>{children}</Dashboard>
      </section>
    </PrivateRoute>
  );
}
