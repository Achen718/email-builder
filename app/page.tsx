import Hero from '@/components/Hero';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/navigation/Navbar';

const HomePage = () => (
  <>
    <Navbar />
    <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
      <main className='flex flex-col gap-8 row-start-2 items-center sm:items-start'>
        <Hero />
      </main>
    </div>
    <Footer />
  </>
);
export default HomePage;
