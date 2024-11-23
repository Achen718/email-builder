import Dashboard from '@/components/dashboard/Dashboard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <Dashboard>{children}</Dashboard>
    </section>
  );
}
