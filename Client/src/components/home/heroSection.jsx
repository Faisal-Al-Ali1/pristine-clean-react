import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="relative bg-white min-h-screen">
      {/* Decorative stars */}
      <div className="absolute top-8 right-8 text-blue-300 text-3xl">✦</div>
      <div className="absolute left-20 top-40 text-blue-300 text-3xl">✦</div>
      <div className="absolute right-8 top-80 text-blue-300 text-3xl">✦</div>
      
      {/* Header section */}
      <div className="container mx-auto px-4 pt-12 pb-16">
        <div className="text-center">
          <p className="text-blue-500 font-medium tracking-wider text-sm mb-6">/ PRISTINE - CLEANING SERVICE</p>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 max-w-4xl mx-auto leading-tight">
            A Cleaner, Brighter, beautiful World with Pristine Clean
          </h1>
          
          <p className="text-gray-600 mt-6 mb-8">
            we deliver spotless results with unmatched care and precision
          </p>
          
          <Link to="/bookingPage">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-md transition-all hover:cursor-pointer">
              Book now
            </button>
          </Link>
        </div>
      </div>
      
      {/* Video and blue bottom section */}
      <div className="flex flex-col items-center w-full">
        {/* Video section */}
        <div className="w-full max-w-5xl rounded-lg overflow-hidden z-10">
          <video 
            className="w-full h-auto rounded-lg object-cover"
            poster="/images/window-cleaners-poster.jpg"
            controls={false}
            loop 
            autoPlay 
            muted 
          >
            <source src="../images/video-home.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        
        {/* Blue bottom section */}
        <div className="w-full bg-[#2E84F5] h-100 mt-[-20rem] z-0"></div>
      </div>
    </div>
  );
};

export default HeroSection;