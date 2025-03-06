import React from 'react';
import { Link } from 'react-router-dom';

const Services = () => {
  return (
    <div className="bg-gray-200">
      {/* Hero Section */}
      <div className="relative h-72">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('../images/Dicas\\ &\\ Truques_\\ Limpeza!.jpeg')",
        }}
      ></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
          <h1 className="text-white text-4xl font-bold">Our Services</h1>
          <p className="text-white text-lg mt-4">
            From homes to offices to cars, we deliver pristine results every time. 
         </p>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="mt-4 text-2xl text-gray-600">
              Explore the wide range of services we offer to meet your cleaning needs.
            </p>
          </div>
          <div className="mt-16 mb-16 flex flex-wrap justify-center gap-8">
            {/* Service 1 */}
            <div className="max-w-xs text-center bg-white shadow-md rounded-lg p-4">
              <img
                src="../images/residental.jpeg"
                alt="Residential Cleaning"
                className="mx-auto rounded-full h-32 w-32 object-cover"
              />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Residential Cleaning</h3>
              <p className="mt-2 text-sm text-gray-600">Comprehensive cleaning solutions for your home.</p>
              <Link to="/productDetails" className="text-blue-600 font-semibold mt-4 inline-block">
                Read More →
              </Link>
            </div>
            {/* Service 2 */}
            <div className="max-w-xs text-center bg-white shadow-md rounded-lg p-4">
              <img
                src="../images/offices.jpeg"
                alt="Office Cleaning"
                className="mx-auto rounded-full h-32 w-32 object-cover"
              />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Office Cleaning</h3>
              <p className="mt-2 text-sm text-gray-600">Keep your workspace spotless and professional.</p>
              <Link to="#!" className="text-blue-600 font-semibold mt-4 inline-block">
                Read More →
              </Link>
            </div>
            {/* Service 3 */}
            <div className="max-w-xs text-center bg-white shadow-md rounded-lg p-4">
              <img
                src="../images/Move In & out.jpeg"
                alt="Move-In/Move-Out Cleaning"
                className="mx-auto rounded-full h-32 w-32 object-cover"
              />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Move-In/Move-Out Cleaning</h3>
              <p className="mt-2 text-sm text-gray-600">Make your transition seamless with a thorough cleaning.</p>
              <Link to="#!" className="text-blue-600 font-semibold mt-4 inline-block">
                Read More →
              </Link>
            </div>
            {/* Service 4 */}
            <div className="max-w-xs text-center bg-white shadow-md rounded-lg p-4">
              <img
                src="../images/deep.jpeg"
                alt="Deep Cleaning"
                className="mx-auto rounded-full h-32 w-32 object-cover"
              />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Deep Cleaning</h3>
              <p className="mt-2 text-sm text-gray-600">Intensive cleaning to tackle those hard-to-reach spots.</p>
              <Link to="#!" className="text-blue-600 font-semibold mt-4 inline-block">
                Read More →
              </Link>
            </div>
            {/* Service 5 */}
            <div className="max-w-xs text-center bg-white shadow-md rounded-lg p-4">
              <img
                src="../images/After Renovation.jpeg"
                alt="After Renovation"
                className="mx-auto rounded-full h-32 w-32 object-cover"
              />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">After Renovation</h3>
              <p className="mt-2 text-sm text-gray-600">
                Anyone who has done a renovation project knows the mess that comes with it.
              </p>
              <Link to="#!" className="text-blue-600 font-semibold mt-4 inline-block">
                Read More →
              </Link>
            </div>
            {/* Service 6 */}
            <div className="max-w-xs text-center bg-white shadow-md rounded-lg p-4">
              <img
                src="../images/Car Cleaning.jpeg"
                alt="Car Cleaning"
                className="mx-auto rounded-full h-32 w-32 object-cover"
              />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Car Cleaning</h3>
              <p className="mt-2 text-sm text-gray-600">A comprehensive detail and deep clean For your vehicle</p>
              <Link to="#!" className="text-blue-600 font-semibold mt-4 inline-block">
                Read More →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
