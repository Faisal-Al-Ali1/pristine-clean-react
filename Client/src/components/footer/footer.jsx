import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhoneAlt, faEnvelope, faClock } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="flex flex-col sm:flex-row justify-between gap-8">
          {/* Company Info */}
          <div className="sm:w-1/4">
            <div className="flex items-center mb-4">
              <img src="../images/Logo2.png" alt="Pristine Clean Logo" className="h-8 w-auto mr-2" />
            </div>
            <p className="text-gray-400 text-sm mb-4">
            Pristine Clean—where eco-friendly meets spotless perfection!
            </p>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="text-blue-400 hover:text-blue-300">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="#" className="text-blue-400 hover:text-blue-300">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="#" className="text-blue-400 hover:text-blue-300">
                <FontAwesomeIcon icon={faYoutube} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="sm:w-1/5">
            <h3 className="text-lg font-semibold mb-6">Navigation</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
              <li><Link to="/services" className="text-gray-400 hover:text-white">Our Services</Link></li>
              <li><Link to="/aboutUs" className="text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link to="/contactUs" className="text-gray-400 hover:text-white">Contact us</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="sm:w-1/5">
            <h3 className="text-lg font-semibold mb-6">Services</h3>
            <ul className="space-y-3">
              <li><Link to="/services/residential" className="text-gray-400 hover:text-white">Residential Cleaning</Link></li>
              <li><Link to="/services/office" className="text-gray-400 hover:text-white">Office Cleaning</Link></li>
              <li><Link to="/services/moveInOut" className="text-gray-400 hover:text-white">Move In/Out Cleaning</Link></li>
              <li><Link to="/services/car" className="text-gray-400 hover:text-white">Car Cleaning</Link></li>
              <li><Link to="/services/renovation" className="text-gray-400 hover:text-white">After Renovation</Link></li>
              <li><Link to="/services/deep" className="text-gray-400 hover:text-white">Deep Cleaning</Link></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="sm:w-1/4">
            <h3 className="text-lg font-semibold mb-6">Contact Information</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-blue-400" />
                Zarqa, Jordan
              </li>
              <li className="flex items-center">
                <FontAwesomeIcon icon={faPhoneAlt} className="mr-2 text-blue-400" />
                +962-XXX-XXXX
              </li>
              <li className="flex items-center">
                <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-blue-400" />
                info@pristineclean.com
              </li>
              <li className="flex items-center">
                <FontAwesomeIcon icon={faClock} className="mr-2 text-blue-400" />
                Sun - Thu: 8:00 Am - 5:00 Pm
              </li>
              <li className="flex items-center pl-6">
                Fri - Sat: 10:00 Am - 3:00 Pm
              </li>
            </ul>
          </div>
        </div>

        {/* Divider Line */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
          <p>Copyright © 2025 Pristine Clean </p>
          <div className="space-x-6 mt-4 sm:mt-0">
            <Link to="/terms" className="hover:text-white">Terms of Use</Link>
            <Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;