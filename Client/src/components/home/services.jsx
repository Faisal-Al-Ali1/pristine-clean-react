import React from 'react';
import { Link } from 'react-router-dom';
// Using React Icons which includes multiple icon libraries
import { BsHouseDoor, BsBuilding, BsBoxSeam } from 'react-icons/bs';
import { MdOutlineCleaningServices, MdConstruction, MdDirectionsCar } from 'react-icons/md';

const Services = () => {
  const services = [
    {
      icon: <BsHouseDoor size={24} />,
      title: "Residential Cleaning",
      description: "Comprehensive cleaning solutions for your home.",
      link: "/services/residential"
    },
    {
      icon: <BsBuilding size={24} />,
      title: "Office Cleaning",
      description: "Keep your workspace spotless and professional.",
      link: "/services/office"
    },
    {
      icon: <BsBoxSeam size={24} />,
      title: "Move In/Out Cleaning",
      description: "Make your transition seamless with a thorough cleaning.",
      link: "/services/moving"
    },
    {
      icon: <MdOutlineCleaningServices size={24} />,
      title: "Deep Cleaning",
      description: "Intensive cleaning to tackle those hard-to-reach spots.",
      link: "/services/deep"
    },
    {
      icon: <MdConstruction size={24} />,
      title: "After Renovation",
      description: "Anyone knows the mess that comes with it.",
      link: "/services/renovation"
    },
    {
      icon: <MdDirectionsCar size={24} />,
      title: "Car Cleaning",
      description: "A comprehensive detail and deep clean for your vehicle",
      link: "/services/car"
    }
  ];

  return (
    <div className="container mx-auto px-8 py-24 bg-white"> {/* Adjusted padding */}
    {/* Header with blue accent and counter - improved margins */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-20"> {/* Adjusted margin-bottom */}
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
    <div className="flex flex-wrap justify-between gap-x-5 gap-y-10"> {/* Adjusted gap */}
    {services.map((service, index) => (
        <div key={index} className="flex w-full md:w-[calc(50%-1.25rem)] lg:w-[calc(33.333%-1.25rem)]"> {/* Adjusted width for responsiveness */}
        {/* Icon with better spacing */}
        <div className="mr-6"> {/* Adjusted margin-right */}
            <div className="bg-blue-500 text-white w-14 h-14 rounded-lg flex items-center justify-center">
            {service.icon}
            </div>
        </div>
        
        {/* Content with improved spacing */}
        <div className="flex-1">
            <h3 className="text-xl font-semibold mb-4">{service.title}</h3> {/* Adjusted margin-bottom */}
            <p className="text-gray-600 mb-4">{service.description}</p> {/* Adjusted margin-bottom */}
            <Link 
            to={service.link} 
            className="inline-flex items-center text-gray-700 hover:text-blue-500 font-medium"
            >
            Read more 
            <svg className="w-4 h-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
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