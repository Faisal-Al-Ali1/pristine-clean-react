import React, { useEffect, useState } from 'react';
import HeroSection from './heroSection';
import Services from './services';
import WhyUs from './whyUs';
import TestimonialsSection from './testimonials';
import Pricing from './pricing';

const HomePage = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.5) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-white">
      <HeroSection />
      <Services />
      <WhyUs />
      {/* <Pricing /> */}
      <TestimonialsSection />

      {showBackToTop && (
        <button
          type="button"
          className="!fixed bottom-5 end-4 rounded-full bg-blue-600 p-3 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-200 ease-in-out hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg"
          onClick={scrollToTop}
          style={{ zIndex: 9999 }}
        >
          <span className="[&>svg]:w-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
};

export default HomePage;