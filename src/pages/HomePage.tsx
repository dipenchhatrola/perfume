import { useState } from 'react';
import HeroSection from 'components/HeroSection';
import ProductGrid from 'pages/ProductGrid';
import Ingrediants from 'pages/Ingrediants';
import Notes from 'pages/Notes';
import IntroVideo from 'pages/IntroVIdeo';
import InstagramSection from 'pages/InstagramSection';
import Testimonials from 'pages/Testimonials';

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Verified Image URLs


  return (
    <div className="min-h-screen bg-[#FDFCFB] text-gray-900 font-light overflow-x-hidden">
      <HeroSection />
      <ProductGrid />
      <Ingrediants />
      <Notes />
      <IntroVideo />
      <Testimonials />
      <InstagramSection />
    </div>
  );
};

export default HomePage;