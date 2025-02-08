import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhoneAlt, faEnvelope, faClock } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faInstagram, faFacebook } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-around gap-8">
          {/* Company Info */}
          <div className="sm:w-1/3">
            <h3 className="text-xl font-bold text-gray-900">Pristine Clean</h3>
            <p className="mt-4 text-gray-600">
              At Pristine Clean, we go beyond surface cleaning to deliver an unparalleled experience. Using
              eco-friendly products and modern techniques, we provide a cleaner, healthier environment for you
              to enjoy. Trust us to bring sparkle and care to every corner of your space, so you can focus on
              what truly matters.
            </p>
            <div className="flex justify-start space-x-4 mt-6">
              {/* Social Media Icons */}
              <a href="#" className="text-gray-700 hover:text-gray-900 text-lg">
                    <FontAwesomeIcon icon={faTwitter} className="text-2xl" />
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900 text-lg">
                    <FontAwesomeIcon icon={faInstagram} className="text-2xl" />
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900 text-lg">
                    <FontAwesomeIcon icon={faFacebook} className="text-2xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:w-1/3">
            <h3 className="text-xl font-bold text-gray-900">Quick Links</h3>
            <ul className="mt-4 space-y-4">
              <li><Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link></li>
              <li><Link to="/services" className="text-gray-600 hover:text-gray-900">Services</Link></li>
              <li><Link to="/aboutUs" className="text-gray-600 hover:text-gray-900">About Us</Link></li>
              <li><Link to="/contactUs" className="text-gray-600 hover:text-gray-900">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="sm:w-1/3">
            <h3 className="text-xl font-bold text-gray-900">Contact Information</h3>
            <ul className="mt-4 space-y-6 text-gray-600">
              {/* Address */}
              <li className="flex items-center">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-900 mr-4" />
                Zarqa, Jordan
              </li>
              {/* Phone */}
              <li className="flex items-center">
              <FontAwesomeIcon icon={faPhoneAlt} className="text-gray-900 mr-4" />
                +962-XXX-XXXX
              </li>
              {/* Email */}
              <li className="flex items-center">
              <FontAwesomeIcon icon={faEnvelope} className="text-gray-900 mr-4" />
                info@pristineclean.com
              </li>
              {/* Working Hours */}
              <li className="flex items-center">
              <FontAwesomeIcon icon={faClock} className="text-gray-900 mr-4" />
                <div>
                  <p>Sun - Thu: 8:00 AM - 5:00 PM</p>
                  <p>Fri - Sat: 10:00 AM - 3:00 PM</p>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="mt-10 border-t pt-6 flex flex-col sm:flex-row justify-between text-sm text-gray-600">
          <p className="text-center sm:text-left">&copy; Pristine Clean 2025. All Rights Reserved</p>
          <div className="space-x-4 text-center sm:text-right mt-4 sm:mt-0">
            <Link to="#" className="hover:underline">Terms of Use</Link>
            <Link to="#" className="hover:underline">Cookie Policy</Link>
            <Link to="#" className="hover:underline">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
