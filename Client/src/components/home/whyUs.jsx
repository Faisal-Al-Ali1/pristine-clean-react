import React from 'react';
import { Link } from 'react-router-dom';
import { BsCalendarCheck, BsShieldCheck, BsAward } from 'react-icons/bs';
import { MdOutlineCleaningServices, MdPayments } from 'react-icons/md';

const WhyUs = () => {

  const benefits = [
    {
      text: "One-off, weekly or fortnightly visits",
      icon: <BsCalendarCheck className="text-blue-500 text-xl mr-3" />
    },
    {
      text: "All cleaning materials and equipment included",
      icon: <MdOutlineCleaningServices className="text-blue-500 text-xl mr-3" />
    },
    {
      text: "100% satisfaction guarantee",
      icon: <BsAward className="text-blue-500 text-xl mr-3" />
    },
    {
      text: "Vetted & background-checked cleaners",
      icon: <BsShieldCheck className="text-blue-500 text-xl mr-3" />
    },
    {
      text: "Easy online booking and secure payment",
      icon: <MdPayments className="text-blue-500 text-xl mr-3" />
    }
  ];

  return (
    <div className="container mx-auto px-6 py-24 bg-gray-50">
      <div className="flex flex-col md:flex-row items-center gap-16">
        {/* Left side - Image with experience counter and testimonial */}
        <div className="relative w-full md:w-2/5">
          <img 
            src="..\images\person2.jpeg" 
            alt="Professional cleaner with supplies" 
            className="w-full rounded-xl shadow-lg object-cover"
          />
          
          {/* Experience counter */}
          <div className="absolute -bottom-6 right-8 bg-gray-900 text-white rounded-lg p-6 shadow-xl transform transition-transform hover:scale-105">
            <div className="text-5xl font-bold text-blue-400">12+</div>
            <div className="text-sm mt-1 text-gray-200">Years of<br />Excellence</div>
            <span className="absolute top-3 right-3 text-blue-400 text-xl">✦</span>
          </div>
        </div>
        
        {/* Right side - Content */}
        <div className="w-full md:w-3/5">
          <h2 className="text-4xl font-bold text-gray-800 mb-3">Why Choose Pristine Clean</h2>
          <div className="h-1 w-24 bg-blue-500 mb-6"></div>
          
          <p className="text-gray-600 text-lg mb-8">
            At Pristine Clean, we believe that a spotless environment is essential for your wellbeing. 
            Our professional team is dedicated to transforming your space into a clean, refreshing sanctuary 
            that you'll love coming home to.
          </p>
          
          {/* Benefits list */}
          <div className="space-y-5 mb-10">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                {benefit.icon}
                <span className="font-medium">{benefit.text}</span>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/bookingPage">
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-8 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center hover:cursor-pointer">
                Book Your Cleaning
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </button>
            </Link>
            
            <Link to="/services">
              <button className="border-2 border-blue-500 text-blue-500 hover:bg-blue-50 font-semibold py-4 px-8 rounded-lg transition-all hover:cursor-pointer">
                Explore Services
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyUs;