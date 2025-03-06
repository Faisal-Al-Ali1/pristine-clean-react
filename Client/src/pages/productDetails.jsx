import React from 'react';
import { Link } from 'react-router-dom';
import BookButton from '../components/bookButton';

const ProductDetails = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className='relative h-96'>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('../images/residental.jpeg')",
        }}
      ></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white">
          <h1 className="text-4xl font-bold">Residential Cleaning</h1>
          <p className="text-lg mt-4">
            A clean home is a happy home, and our Residential Cleaning service is here to make yours shine. Whether it’s a routine cleaning or a one-time deep clean, our team ensures every corner of your home is spotless and refreshed.
          </p>
        </div>
      </div>

      {/* What's Included */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center">What’s Included</h2>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-green-500 mr-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M16.707 4.293a1 1 0 010 1.414l-9 9a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L7 12.586l8.293-8.293a1 1 0 011.414 0z" />
            </svg>
            <p className="text-gray-700"><strong>Living Areas:</strong> Dusting, vacuuming, and mopping floors; cleaning furniture and surfaces.</p>
          </div>
          <div className="flex items-start">
            <svg className="w-6 h-6 text-green-500 mr-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M16.707 4.293a1 1 0 010 1.414l-9 9a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L7 12.586l8.293-8.293a1 1 0 011.414 0z" />
            </svg>
            <p className="text-gray-700"><strong>Kitchen:</strong> Wiping countertops, cleaning sinks, and sanitizing high-touch areas; exterior cleaning of appliances.</p>
          </div>
          <div className="flex items-start">
            <svg className="w-6 h-6 text-green-500 mr-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M16.707 4.293a1 1 0 010 1.414l-9 9a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L7 12.586l8.293-8.293a1 1 0 011.414 0z" />
            </svg>
            <p className="text-gray-700"><strong>Bathrooms:</strong> Scrubbing sinks, toilets, showers, and tubs; cleaning mirrors and wiping surfaces.</p>
          </div>
          <div className="flex items-start">
            <svg className="w-6 h-6 text-green-500 mr-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M16.707 4.293a1 1 0 010 1.414l-9 9a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L7 12.586l8.293-8.293a1 1 0 011.414 0z" />
            </svg>
            <p className="text-gray-700"><strong>Bedrooms:</strong> Dusting furniture, changing bed linens (if provided), and tidying spaces.</p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center">Why Choose Us?</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-8">
            <div className="max-w-xs text-center">
              <img src="../images/icons8-eco-friendly-64.png" alt="Eco-Friendly" className="mx-auto h-16 w-16" />
              <h3 className="mt-4 text-lg font-semibold">Eco-Friendly</h3>
              <p className="mt-2 text-sm text-gray-600">We use eco-friendly products to protect your family and the environment.</p>
            </div>
            <div className="max-w-xs text-center">
              <img src="../images/icons8-professionals-64.png" alt="Trained Professionals" className="mx-auto h-16 w-16" />
              <h3 className="mt-4 text-lg font-semibold">Trained Professionals</h3>
              <p className="mt-2 text-sm text-gray-600">Our team is highly trained and ensures top-quality service every time.</p>
            </div>
            <div className="max-w-xs text-center">
              <img src="../images/icons8-affordable-64 (1).png" alt="Affordable Pricing" className="mx-auto h-16 w-16" />
              <h3 className="mt-4 text-lg font-semibold">Affordable Pricing</h3>
              <p className="mt-2 text-sm text-gray-600">We offer competitive pricing without compromising quality.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900">Ready to Book?</h2>
          <p className="mt-4 text-lg text-gray-600">Experience the difference with our exceptional cleaning services.</p>
          <Link to="/bookingPage">
            <BookButton className='button'/>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
