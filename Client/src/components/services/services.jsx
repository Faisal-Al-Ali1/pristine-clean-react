import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllServices } from '../../api/services'; 

const Services = () => {
  const [services, setServices] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getAllServices(); 
        setServices(data); 
        setLoading(false); 
      } catch (err) {
        setError(err.message); 
        setLoading(false); 
      }
    };

    fetchServices(); 
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Hero Section - Full-width with better gradient overlay */}
      <div className="relative h-96">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url('../images/Dicas & Truques_ Limpeza!.jpeg')",
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

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service._id} 
                className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-2"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={service.imageUrl} 
                    alt={service.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
                  <p className="mt-3 text-gray-600">{service.description}</p>
                  <Link
                    to={`/services/${service._id}`} 
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