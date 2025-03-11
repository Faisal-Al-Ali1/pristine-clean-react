import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';

const ProductDetails = () => {
  const includedServices = [
    {
      id: 1,
      title: "Living Areas",
      description: "Dusting, vacuuming, and mopping floors; cleaning furniture and surfaces."
    },
    {
      id: 2,
      title: "Kitchen",
      description: "Wiping countertops, cleaning sinks, and sanitizing high-touch areas; exterior cleaning of appliances."
    },
    {
      id: 3,
      title: "Bathrooms",
      description: "Scrubbing sinks, toilets, showers, and tubs; cleaning mirrors and wiping surfaces."
    },
    {
      id: 4,
      title: "Bedrooms",
      description: "Dusting furniture, changing bed linens (if provided), and tidying spaces."
    }
  ];

  const benefitsList = [
    {
      id: 1,
      title: "Reliable Professionals",
      description: "Experienced cleaning professionals you can trust.",
      icon: "../images/icons8-professionals-64.png"
    },
    {
      id: 2,
      title: "Eco-Friendly",
      description: "Use of eco-friendly and non-toxic products for a healthier home.",
      icon: "../images/icons8-eco-friendly-64.png"
    },
    {
      id: 3,
      title: "Customizable Options",
      description: "Flexible cleaning plans to meet your specific needs.",
      icon: "../images/icons8-affordable-64 (1).png"
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section - Modern full-width design with better text positioning */}
      <div className="relative h-[500px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('../images/residental.jpeg')",
          }}
        ></div>
        <div className="absolute inset-0 flex flex-col justify-center max-w-4xl mx-auto px-6 text-white">
          <h1 className="text-5xl font-bold">Residential Cleaning</h1>
          <div className="w-24 h-1 bg-blue-500 my-6"></div>
          <p className="text-xl max-w-2xl">
            A clean home is a happy home, and our Residential Cleaning service is here to make yours shine. Whether it's a routine cleaning or a one-time deep clean, our team ensures every corner of your home is spotless and refreshed.
          </p>
        </div>
      </div>

      {/* Modern Clean Feature Image Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2">
            <img 
              src="../images/residental.jpeg" 
              alt="Modern Clean Home" 
              className="rounded-lg shadow-xl object-cover h-full w-full"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-gray-900">Professional Home Cleaning</h2>
            <div className="w-16 h-1 bg-blue-500 my-4"></div>
            <p className="text-gray-700 text-lg mb-6">
              Our residential cleaning service is designed to give you back your time and provide a spotless, 
              healthy environment for you and your family. We pay attention to every detail, using premium 
              equipment and eco-friendly products.
            </p>
            <Link to="/bookingPage">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center hover:cursor-pointer">
                Book a Cleaning
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* What's Included - Clean card-based design */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">What's Included</h2>
            <div className="w-16 h-1 bg-blue-500 mx-auto my-4"></div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Our comprehensive cleaning service covers all the essential areas of your home
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {includedServices.map(service => (
              <div key={service.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Check className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
                    <p className="mt-2 text-gray-600">{service.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Modern icon-based layout */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Us?</h2>
            <div className="w-16 h-1 bg-blue-500 mx-auto my-4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefitsList.map(benefit => (
              <div key={benefit.id} className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow">
                <div className="inline-block p-4 bg-blue-50 rounded-full mb-4">
                  <img src={benefit.icon} alt={benefit.title} className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - More attractive design with original blue color */}
      <section className="bg-blue-600 py-16 mb-15">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready for a Spotless Home?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Book your residential cleaning service today and experience the difference.
          </p>
          <Link to="/bookingPage">
            <button className="bg-white hover:bg-gray-100 text-blue-600 font-semibold py-3 px-8 rounded-lg transition-colors text-lg shadow-lg hover:cursor-pointer">
              Book Now
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;