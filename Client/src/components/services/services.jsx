import React from 'react';
import { Link } from 'react-router-dom';

const Services = () => {
  const services = [
    {
      id: 1,
      title: "Residential Cleaning",
      description: "Comprehensive cleaning solutions for your home.",
      image: "../images/residental.jpeg",
      link: "/productDetails"
    },
    {
      id: 2,
      title: "Office Cleaning",
      description: "Keep your workspace spotless and professional.",
      image: "../images/offices.jpeg",
      link: "#!"
    },
    {
      id: 3,
      title: "Move-In/Move-Out Cleaning",
      description: "Make your transition seamless with a thorough cleaning.",
      image: "../images/Move In & out.jpeg",
      link: "#!"
    },
    {
      id: 4,
      title: "Deep Cleaning",
      description: "Intensive cleaning to tackle those hard-to-reach spots.",
      image: "../images/deep.jpeg",
      link: "#!"
    },
    {
      id: 5,
      title: "After Renovation",
      description: "Anyone who has done a renovation project knows the mess that comes with it.",
      image: "../images/After Renovation.jpeg",
      link: "#!"
    },
    {
      id: 6,
      title: "Car Cleaning",
      description: "A comprehensive detail and deep clean for your vehicle.",
      image: "../images/Car Cleaning.jpeg",
      link: "#!"
    }
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section - Full-width with better gradient overlay */}
      <div className="relative h-96">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url('../images/Dicas\\ &\\ Truques_\\ Limpeza!.jpeg')",
          }}
        ></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-white text-5xl font-bold tracking-tight">Our Services</h1>
          <div className="w-24 h-1 bg-blue-500 my-6"></div>
          <p className="text-white text-xl max-w-2xl">
            From homes to offices to cars, we deliver pristine results every time.
            Professional cleaning tailored to your needs.
          </p>
        </div>
      </div>

      {/* Services Section - Improved layout and spacing */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">What We Offer</h2>
            <div className="w-16 h-1 bg-blue-500 mx-auto my-4"></div>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our wide range of professional cleaning services designed to meet your specific needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div 
                key={service.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-2"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                  <p className="mt-3 text-gray-600">{service.description}</p>
                  <Link 
                    to={service.link} 
                    className="mt-4 inline-flex items-center py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Learn More
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;