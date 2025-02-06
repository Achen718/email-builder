import Hero from '@/components/Hero';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/navigation/Navbar';
import HeroContainer from '@/components/layout/HeroContainer';

const HomePage = () => (
  <>
    <Navbar />
    <HeroContainer>
      <Hero />
    </HeroContainer>
    <Footer />
  </>
);
export default HomePage;
