import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhoneAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faInstagram, faFacebook } from '@fortawesome/free-brands-svg-icons';

const ContactUs = () => {
  return (
    <div className="bg-gray-100">
      {/* Hero Section */}
      <div className="relative h-72">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('../images/pexels-jonathanborba-28576645.jpg')",
        }}
      ></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
          <h1 className="text-white text-4xl font-bold">Contact Us</h1>
          <p className="text-white text-lg mt-4">
            Reach out to us in Pristine Clean for any inquiries, bookings, or feedback.
          </p>
        </div>
      </div>

      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Contact Information */}
            <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center text-center">
              <h2 className="text-center font-bold text-gray-800 text-3xl mb-5">Contact Information</h2>
              <p className="mt-1 mb-5 text-gray-600">Say something to start a live chat!</p>
              <ul className="space-y-8 text-gray-700">
                {/* Location */}
                <li>
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-2xl text-gray-800 mb-2" />
                  <h3 className="text-lg font-semibold text-gray-800">Location</h3>
                  <p className="text-sm text-gray-600">Dr. Mohammad Al Basher St, Zarqa</p>
                </li>
                {/* Phone */}
                <li>
                  <FontAwesomeIcon icon={faPhoneAlt} className="text-2xl text-gray-800 mb-2" />
                  <h3 className="text-lg font-semibold text-gray-800">Phone</h3>
                  <p className="text-sm text-gray-600">+962 789176614</p>
                </li>
                {/* Email */}
                <li>
                  <FontAwesomeIcon icon={faEnvelope} className="text-2xl text-gray-800 mb-2" />
                  <h3 className="text-lg font-semibold text-gray-800">Email</h3>
                  <p className="text-sm text-gray-600">faisal.fd.ali@gmail.com</p>
                </li>
              </ul>

              {/* Social Media */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800">Look for us on :</h3>
                <div className="flex justify-center space-x-6 mt-4">
                  <a href="#" className="hover:text-blue-600" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faTwitter} className="text-2xl" />
                  </a>
                  <a href="#" className="hover:text-blue-600" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faInstagram} className="text-2xl" />
                  </a>
                  <a href="#" className="hover:text-blue-600" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faFacebook} className="text-2xl" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl text-center text-3xl font-bold text-gray-800">Get In Touch</h2>
              <p className="mt-4 text-center text-gray-600">Any question or remark? Just write us a message!</p>
              <form className="mt-9 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                  <option selected hidden>
                    Select Subject
                  </option>
                  <option>General Inquiry</option>
                  <option>Feedback</option>
                  <option>Support</option>
                </select>
                <textarea
                  placeholder="Write your message..."
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Google Maps */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 mb-10">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3381.3897576302284!2d36.08261977567354!3d32.05870537397211!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151b65cd4d8f17e1%3A0x30e86b8a97e4ac7d!2sOrange%20Digital%20Village%20Zarqa!5e0!3m2!1sen!2sjo!4v1737142763031!5m2!1sen!2sjo"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default ContactUs;
