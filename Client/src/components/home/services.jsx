import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BsHouseDoor, BsBuilding, BsBoxSeam } from 'react-icons/bs';
import { MdOutlineCleaningServices, MdConstruction, MdDirectionsCar } from 'react-icons/md';
import { getAllServices } from '../../api/services'; 

const Services = () => {
  const [services, setServices] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  // Static icons for each service type
  const serviceIcons = {
    'Residential Cleaning': <BsHouseDoor size={24} />,
    'Office Cleaning': <BsBuilding size={24} />,
    'Move In/Out Cleaning': <BsBoxSeam size={24} />,
    'Deep Cleaning': <MdOutlineCleaningServices size={24} />,
    'After Renovation Cleaning': <MdConstruction size={24} />,
    'Car Cleaning': <MdDirectionsCar size={24} />,
  };

  // Fetch services from the backend
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

  // Display loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-8 py-24 bg-white">
      {/* Header with blue accent and counter - improved margins */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-20">
        <div>
          <p className="text-blue-500 font-medium tracking-wide mb-3">/ WHY CHOOSE US</p>
          <h2 className="text-4xl font-bold text-gray-800">Our Cleaning Services</h2>
        </div>
        <div className="mt-6 md:mt-0 bg-gray-900 text-white rounded-lg p-5 relative">
          <span className="text-4xl font-bold">+341</span>
          <div className="text-sm mt-1">Project Finished</div>
          <span className="absolute top-3 right-3 text-blue-400 text-lg">✦</span>
        </div>
      </div>

      {/* Services flex container with improved spacing */}
      <div className="flex flex-wrap justify-between gap-x-5 gap-y-10">
        {services.map((service, index) => (
          <div key={service._id} className="flex w-full md:w-[calc(50%-1.25rem)] lg:w-[calc(33.333%-1.25rem)]">
            {/* Icon with better spacing */}
            <div className="mr-6">
              <div className="bg-blue-500 text-white w-14 h-14 rounded-lg flex items-center justify-center">
                {serviceIcons[service.name]} {/* Use the static icon based on service name */}
              </div>
            </div>

            {/* Content with improved spacing */}
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-4">{service.name}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <Link
                to={`/services/${service._id}`} // Link to the service details page
                className="inline-flex items-center text-gray-700 hover:text-blue-500 font-medium"
              >
                Read more
                <svg className="w-4 h-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;