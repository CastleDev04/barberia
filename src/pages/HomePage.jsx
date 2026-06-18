import Layout from '../components/layout/Layout';
import HeroSection from '../components/home/HeroSection';
import ServicesSection from '../components/home/ServicesSection';
import MapSection from '../components/home/MapSection';
import SocialsSection from '../components/home/SocialsSection';

export default function HomePage() {
  return (
    <Layout>
      <HeroSection />
      <div className="deco-line" />
      <ServicesSection />
      <div className="deco-line" />
      <MapSection />
      <div className="deco-line" />
      <SocialsSection />
    </Layout>
  );
}
