import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import BookButton from '../components/bookButton';
import 'swiper/swiper-bundle.css';


const HomePage = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Back to top button logic
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.5) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Services data
  const services = [
    {
      icon: '🏠',
      title: 'Residential Cleaning',
      description: 'Keep your home sparkling clean and fresh.',
      features: ['Eco-friendly products', 'Spotless cleaning', 'Experienced team'],
      link: 'productDetails.html',
    },
    {
      icon: '🚗',
      title: 'Car Cleaning',
      description: 'Make your car shine inside and out.',
      features: ['Interior detailing', 'Exterior wash', 'Engine bay cleaning'],
      link: '#',
    },
    {
      icon: '🏢',
      title: 'Office Cleaning',
      description: 'Create a clean, professional workspace.',
      features: ['Desk sanitization', 'Window cleaning', 'Carpet vacuuming'],
      link: '#',
    },
    {
      icon: '🧹',
      title: 'Deep Cleaning',
      description: 'For a thorough and meticulous clean.',
      features: ['Grout cleaning', 'Baseboard scrubbing', 'Hard-to-reach areas'],
      link: '#',
    },
    {
      icon: '📦',
      title: 'Move-In / Move-Out Cleaning',
      description: 'Hassle-free cleaning for your big move.',
      features: ['Full property cleaning', 'Appliance scrubbing', 'Window cleaning'],
      link: '#',
    },
    {
      icon: '🏗️',
      title: 'After Renovation Cleaning',
      description: 'Eliminate dust and debris post-renovation.',
      features: ['Dust and debris removal', 'Deep surface cleaning', 'Glass and window cleaning'],
      link: '#',
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      image: '../images/sara.jpeg',
      name: 'Sarah',
      text: 'Pristine Clean has been a game-changer for my home! Their attention to detail is incredible, and I love that they use eco-friendly products. My house has never felt this fresh and welcoming. Highly recommend them to anyone looking for top-notch cleaning services!',
    },
    {
      image: '../images/ahmad.jpg',
      name: 'Ahmad',
      text: 'As a small business owner, keeping my office spotless is crucial for my clients. Pristine Clean delivers every time on time and with exceptional quality. They truly go above and beyond to ensure every corner is sparkling clean.',
    },
    {
      image: '../images/laila.jpg',
      name: 'Laila',
      text: 'I was amazed by how thorough the team at Pristine Clean was! They made my apartment feel brand new, and the booking process was so simple. Their professionalism and dedication really stand out. I can’t imagine using anyone else for my cleaning needs!',
    },
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-cover bg-center h-[80vh]" style={{
        backgroundImage: "url('../images/home.jpg')"
      }}>
        {/* Dimmed Overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        {/* Content */}
        <div className="h-full flex flex-col justify-center items-center text-center text-white relative">
          <h1 className="text-4xl font-semibold">A Cleaner, Brighter World with Pristine Clean</h1>
          <p className="text-lg mt-4">We deliver spotless results with unmatched care and precision.</p>
          <Link to="/bookingPage">
            <BookButton className="button1" />
          </Link>
        </div>
      </div>
    
      {/* Back to top button */}
      {showBackToTop && (
        <button
          type="button"
          className="!fixed bottom-5 end-4 rounded-full bg-blue-600 p-3 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-200 ease-in-out hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg"
          onClick={scrollToTop}
          style={{ zIndex: 9999 }}
        >
          <span className="[&>svg]:w-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
            </svg>
          </span>
        </button>
      )}

      {/* Slider Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto text-center px-4">
          <h2 className="text-3xl font-semibold mb-4">Our Cleaning Services</h2>
          <p className="text-gray-600 mb-8">
            Let us use our years of experience, skilled employees, and advanced procedures to ensure a clean and healthy
            environment for your employees, customers, and guests.
          </p>

          {/* Swiper Container */}
          <div className="relative">
            <Swiper
              modules={[Navigation]}
              spaceBetween={20}
              slidesPerView={1}
              navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              }}
              breakpoints={{
                640: { slidesPerView: 1 },
                1024: { slidesPerView: 2 },
                1280: { slidesPerView: 3 },
              }}
            >
              {services.map((service, index) => (
                <SwiperSlide key={index}>
                  <div className="bg-white rounded-2xl shadow-lg p-12 text-center transition-all hover:scale-105">
                    <div className="flex justify-center text-6xl text-blue-500 mb-6">{service.icon}</div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-900">{service.title}</h3>
                    <p className="text-gray-700 mb-4">{service.description}</p>
                    <ul className="text-left space-y-2 mb-2">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <span className="text-green-500 mr-2"><FontAwesomeIcon icon = {faCheckCircle} /></span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <a href={service.link}>
                      <button className="mt-4 px-4 py-2 text-blue-600 border border-blue-600 rounded-3xl hover:bg-blue-600 hover:text-white">
                        Learn More
                      </button>
                    </a>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Swiper Navigation */}
            <div className="swiper-button-prev absolute top-1/2 left-[-80px] transform -translate-y-1/2"></div>
            <div className="swiper-button-next absolute top-1/2 right-[-80px] transform -translate-y-1/2"></div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="relative bg-cover bg-center h-[90vh]" style={{ backgroundImage: "url('../images/whyUs.jpg')" }}>
        {/* Dimmed Overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        {/* Content */}
        <div className="h-full flex flex-col justify-center items-start text-left text-white relative px-12">
          <h2 className="text-4xl">Why Choose Us</h2>
          <p className="text-lg mt-4 max-w-4xl">
            Here in <span className="font-semibold">Pristine Clean</span>, we believe that a clean space is the
            foundation for a happy and productive life. Founded with a commitment to excellence, we specialize in
            providing professional cleaning services tailored to meet your unique needs. Whether it’s your home, office,
            or commercial space, we ensure every corner sparkles with perfection.
          </p>
          <h2 className="text-3xl mt-8">We provide</h2>
          <ul className="text-lg mt-6 space-y-3">
            <li className="flex items-start">
              <span className="text-green-500 mr-2"><FontAwesomeIcon icon = {faCheckCircle} /></span> One-off, weekly, or fortnightly visits
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2"><FontAwesomeIcon icon = {faCheckCircle} /></span> All cleaning materials and equipment
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2"><FontAwesomeIcon icon = {faCheckCircle} /></span> 100% satisfaction guarantee
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2"><FontAwesomeIcon icon = {faCheckCircle} /></span> Vetted & background-checked cleaners
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2"><FontAwesomeIcon icon = {faCheckCircle} /></span> Online booking and payment
            </li>
          </ul>
          <Link to='/bookingPage'>
            <BookButton className="button1" />
          </Link>
        </div>
      </div>

      {/* Testimonials Section */}
      <section className="bg-white py-12 px-6 lg:px-16 mb-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-semibold mb-8">Don’t Take Our Word For It</h2>
          <p className="text-gray-700 mb-12">Hear From Our Customers Themselves</p>
          <div className="grid lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                  </div>
                </div>
                <p className="text-gray-700 text-left">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;