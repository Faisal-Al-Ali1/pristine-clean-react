import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="relative px-4 py-5 flex justify-between items-center bg-white shadow-lg">
        <Link className="text-3xl font-bold leading-none" to="/">
          <span className="text-blue-600">Pristine Clean</span>
        </Link>

        {/* Mobile Burger Icon */}
        <div className="lg:hidden">
          <button onClick={toggleMobileMenu} className="navbar-burger flex items-center text-blue-600 p-3">
            <svg className="block h-4 w-4 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <title>Mobile menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
            </svg>
          </button>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex lg:items-center ml-10 lg:w-auto lg:space-x-8">
          <li><Link className="text-md text-gray-500 hover:text-gray-800" to="/">Home</Link></li>
          <li><Link className="text-md text-gray-500 hover:text-gray-800" to="/services">Services</Link></li>
          <li><Link className="text-md text-gray-500 hover:text-gray-800" to="/aboutUs">About us</Link></li>
          <li><Link className="text-md text-gray-500 hover:text-gray-800" to="/contactUs">Contact us</Link></li>
        </ul>

        {/* Search Bar */}
        <div className="hidden lg:flex lg:items-center lg:ml-10 lg:flex-grow">
          <input type="text" placeholder="Search..."
            className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
        </div>

        {/* Auth Buttons (Sign In/Sign Up) */}
        <div id="authButtons" className="hidden lg:flex lg:items-center">
          <Link className="py-2 px-4 sm:px-6 bg-gray-200 hover:bg-gray-300 text-sm text-gray-900 font-bold rounded-xl transition duration-200"
            to="/login">Sign In</Link>
          <Link className="py-2 px-4 sm:px-6 bg-blue-600 hover:bg-blue-700 text-sm text-white font-bold rounded-xl transition duration-200 ml-3"
            to="/signup">Sign Up</Link>
        </div>

        {/* Profile Icon and Sign Out Button (Hidden by Default) */}
        <div id="userProfile" className="hidden lg:flex gap-3 lg:items-center">
          <Link to="/userProfile">
            <img id="profileIcon" src="../images/user.png" alt="Profile Icon" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full cursor-pointer" />
          </Link>
          <button id="signOutButton" className="py-2 px-3 sm:px-4 bg-red-600 hover:bg-red-700 text-sm text-white rounded-xl transition duration-200 ml-3">
            Sign Out
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`navbar-menu relative z-50 ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="navbar-backdrop fixed inset-0 bg-gray-800 opacity-25" onClick={closeMobileMenu}></div>
        <nav className="fixed top-0 left-0 bottom-0 flex flex-col w-5/6 max-w-sm py-6 px-6 bg-white border-r overflow-y-auto">
          <div className="flex items-center mb-8">
            <Link className="mr-auto text-blue-600 text-3xl font-bold leading-none" to="/">Pristine Clean</Link>
            <button onClick={closeMobileMenu} className="navbar-close">
              <svg className="h-6 w-6 text-gray-600 cursor-pointer hover:text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <ul>
            <li><Link className="block p-4 text-md font-semibold text-gray-500 hover:bg-gray-200 hover:text-blue-600 rounded" to="/">Home</Link></li>
            <li><Link className="block p-4 text-md font-semibold text-gray-500 hover:bg-gray-200 hover:text-blue-600 rounded" to="/services">Services</Link></li>
            <li><Link className="block p-4 text-md font-semibold text-gray-500 hover:bg-gray-200 hover:text-blue-600 rounded" to="/aboutUs">About us</Link></li>
            <li><Link className="block p-4 text-md font-semibold text-gray-500 hover:bg-gray-200 hover:text-blue-600 rounded" to="/contactUs">Contact us</Link></li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Navbar;

