import Footer from '@/components/layout/Footer';
import Navbar from '@/components/navigation/Navbar';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <section>{children}</section>
      <Footer />
    </>
  );
}
