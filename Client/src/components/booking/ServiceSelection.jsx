import React from 'react';
import { FaHome, FaBuilding, FaBroom, FaCar, FaBox, FaHardHat, FaArrowRight } from 'react-icons/fa';

const ServiceIcon = ({ name = '' }) => {
  switch (true) {
    case name.includes('Residential'): return <FaHome className="text-indigo-500 text-2xl" />;
    case name.includes('Office'): return <FaBuilding className="text-indigo-500 text-2xl" />;
    case name.includes('Deep'): return <FaBroom className="text-indigo-500 text-2xl" />;
    case name.includes('Move'): return <FaBox className="text-indigo-500 text-2xl" />;
    case name.includes('Renovation'): return <FaHardHat className="text-indigo-500 text-2xl" />;
    case name.includes('Car'): return <FaCar className="text-indigo-500 text-2xl" />;
    default: return <FaHome className="text-indigo-500 text-2xl" />;
  }
};

const ServiceSelection = ({ services = [], onSelect, error }) => (
  <div className="max-w-6xl mx-auto p-6 bg-white mt-8 mb-10">
    <h1 className="text-3xl font-bold mb-2 text-gray-800">Select Your Cleaning Service</h1>
    <p className="text-gray-600 mb-8">Choose the service that best fits your needs</p>
    
    {error && (
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 shadow-sm">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    )}

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {services.map(service => (
        <div 
          key={service._id}
          className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-indigo-400 group"
          onClick={() => onSelect(service)}
        >
          <div className="px-6 py-6 flex items-center">
            <div className="mr-4 bg-indigo-100 p-3 rounded-lg group-hover:bg-indigo-200 transition-colors duration-300">
              <ServiceIcon name={service.name} />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">{service.name}</h2>
          </div>
          
          <div className="px-6 pb-6">
            <p className="text-gray-600 mb-5 line-clamp-2">{service.description}</p>
            
            <div className="flex justify-between items-center">
              <div>
                <span className="text-2xl font-bold text-gray-800">{service.basePrice}</span>
                <span className="text-gray-600 ml-1">{service.currency}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-medium">
                  {service.estimatedDuration} hours
                </span>
                <FaArrowRight className="ml-3 text-indigo-500 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ServiceSelection;
export { ServiceIcon };