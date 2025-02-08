import React from 'react';

const AboutUs = () => {
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
                Over the years, we’ve grown into a trusted name in the cleaning industry, serving homes and businesses
                across Jordan. Our journey has been defined by a relentless focus on quality, innovation, and customer
                satisfaction. From embracing eco-friendly cleaning solutions to introducing convenient online booking,
                we’ve continuously evolved to meet the needs of our clients.
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

      {/* Our Dedicated Team Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Our Dedicated Team</h2>
            <p className="mt-4 text-lg text-gray-600">Meet some of the faces behind Pristine Clean</p>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-8">
            {/* Team Member 1 */}
            <div className="max-w-xs text-center">
              <img
                src="../images/person2.jpeg"
                alt="Lina Farah"
                className="mx-auto rounded-full h-32 w-32 object-cover"
              />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Lina Farah</h3>
              <p className="text-sm text-blue-600">Operations Manager</p>
              <p className="mt-2 text-sm text-gray-600">
                Lina oversees the daily operations at Pristine Clean, ensuring every client receives top-notch service.
                With over 8 years of experience in the cleaning industry.
              </p>
            </div>
            {/* Team Member 2 */}
            <div className="max-w-xs text-center">
              <img
                src="../images/person3.jpeg"
                alt="Omar Haddad"
                className="mx-auto rounded-full h-32 w-32 object-cover"
              />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Omar Haddad</h3>
              <p className="text-sm text-blue-600">Senior Cleaning Specialist</p>
              <p className="mt-2 text-sm text-gray-600">
                Omar is a seasoned professional with a keen eye for detail. He has been with Pristine Clean for 5 years,
                specializing in both residential and commercial cleaning.
              </p>
            </div>
            {/* Team Member 3 */}
            <div className="max-w-xs text-center">
              <img
                src="../images/person1.jpeg"
                alt="Dana Khalil"
                className="mx-auto rounded-full h-32 w-32 object-cover"
              />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Dana Khalil</h3>
              <p className="text-sm text-blue-600">Client Relations Coordinator</p>
              <p className="mt-2 text-sm text-gray-600">
                Dana is the friendly face behind all client interactions at Pristine Clean. Her role is to ensure seamless
                communication, manage bookings, and address client inquiries.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
