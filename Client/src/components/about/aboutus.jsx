import React from 'react';
import { Instagram, Twitter } from 'lucide-react';

const AboutUs = () => {
  // Team member data
  const teamMembers = [
    {
      name: "Lina Farah",
      role: "Operations Manager",
      bio: "Lina oversees the daily operations at Pristine Clean, ensuring every client receives top-notch service. With over 8 years of experience in the cleaning industry.",
      image: "../images/person2.jpeg"
    },
    {
      name: "Omar Haddad",
      role: "Senior Cleaning Specialist",
      bio: "Omar is a seasoned professional with a keen eye for detail. He has been with Pristine Clean for 5 years, specializing in both residential and commercial cleaning.",
      image: "../images/person3.jpeg"
    },
    {
      name: "Dana Khalil",
      role: "Client Relations Coordinator",
      bio: "Dana is the friendly face behind all client interactions at Pristine Clean. Her role is to ensure seamless communication, manage bookings, and address client inquiries.",
      image: "../images/person1.jpeg"
    }
  ];

  return (
    <div className="bg-gray-200">
      {/* Hero Section */}
      <div className="relative h-72">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/pexels-tima-miroshnichenko-6196238.jpg')",
            backgroundPosition: 'center top 35%',
          }}
        ></div>

        {/* Text content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
          <h1 className="text-white text-4xl font-bold">About Us</h1>
          <p className="text-white text-lg mt-4">
            Committed to Delivering a Cleaner, Healthier Environment for You.
          </p>
        </div>
      </div>

      {/* About Us Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16">
            {/* Our Journey */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Our Journey</h2>
              <p className="mt-6 text-gray-600">
                At Pristine Clean, our story began with a simple idea: to create cleaner, healthier spaces where
                people can thrive. Founded in [Year], we started as a small team passionate about delivering
                exceptional cleaning services. Armed with determination and a commitment to excellence, we dedicated
                ourselves to building trust with every client by treating their spaces as if they were our own.
              </p>
              <p className="mt-6 text-gray-600">
                Over the years, we've grown into a trusted name in the cleaning industry, serving homes and businesses
                across Jordan. Our journey has been defined by a relentless focus on quality, innovation, and customer
                satisfaction. From embracing eco-friendly cleaning solutions to introducing convenient online booking,
                we've continuously evolved to meet the needs of our clients.
              </p>
            </div>
            <div>
              <img
                src="../images/pexels-tima-miroshnichenko-6196677.jpg"
                alt="Our Journey Image"
                className="rounded-2xl shadow-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16">
            {/* Our Mission and Values */}
            <div>
              <img
                src="../images/pexels-pixabay-434163.jpg"
                alt="Our Mission Image"
                className="rounded-2xl shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Our Mission and Values</h2>
              <p className="mt-6 text-gray-600">
                At Pristine Clean, our mission is to create cleaner, healthier, and more inviting environments for
                our clients. By combining reliable service with eco-friendly cleaning solutions, we aim to deliver an
                experience that exceeds expectations. Every space we clean reflects our commitment to quality and care,
                helping our clients enjoy comfort and peace of mind.
              </p>
              <p className="mt-6 text-gray-600">
                Our core values guide everything we do. We strive for excellence by focusing on attention to detail and
                delivering top-notch results. Integrity and transparency are the foundation of our client relationships,
                while a customer-centric approach ensures our services are tailored to your unique needs. Sustainability is
                at the heart of our work as we prioritize environmentally friendly practices. Together, as a passionate and
                professional team, we enhance lives one clean space at a time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Improved Team Section */}
      <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header with accent line */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-4">
            <span className="h-0.5 w-12 bg-blue-500 mr-3"></span>
            <span className="text-blue-600 uppercase text-sm font-semibold">OUR TEAM</span>
            <span className="h-0.5 w-12 bg-blue-500 ml-3"></span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Meet the Expert Team at Pristine Clean
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Our skilled professionals are committed to delivering exceptional cleaning services for your home or business
          </p>
        </div>

        {/* Team members flex container */}
        <div className="flex flex-wrap justify-center gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:transform hover:scale-105 flex-shrink-0 w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
              <div className="relative">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover object-center"
                />
                <div className="absolute bottom-0 right-0 p-4 flex space-x-2">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 transition-colors duration-300">
                    <Instagram size={20} />
                  </button>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 transition-colors duration-300">
                    <Twitter size={20} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
    </div>
  );
};

export default AboutUs;