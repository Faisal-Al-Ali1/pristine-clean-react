import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // Make sure the AuthContext is properly set up
import { logout } from '../../api/users';

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext); // Access the user from AuthContext
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {

      await logout(); // Call the shared logout method

      setUser(null); // Clear user state

      navigate('/'); // Redirect to home or login
      
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      <nav className="relative px-4 py-5 flex justify-between items-center bg-[#F3F8FE] shadow-lg">
        {/* Logo */}
        <Link to="/">
          <img src="../images/Logo.png" alt="Pristine Clean Logo" className="h-10" />
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
          <li><Link className="text-md text-gray-700 hover:text-gray-900" to="/">Home</Link></li>
          <li><Link className="text-md text-gray-700 hover:text-gray-900" to="/services">Services</Link></li>
          <li><Link className="text-md text-gray-700 hover:text-gray-900" to="/aboutUs">About us</Link></li>
          <li><Link className="text-md text-gray-700 hover:text-gray-900" to="/contactUs">Contact us</Link></li>
        </ul>

        {/* Auth Buttons (Sign In/Sign Up) or Profile & Logout */}
        <div id="authButtons" className="hidden lg:flex lg:items-center">
          {!user ? (
            <>
              <Link className="py-2 px-4 sm:px-6 bg-gray-200 hover:bg-gray-300 text-sm text-gray-900 font-bold rounded-xl transition duration-200"
                to="/login">Sign In</Link>
              <Link className="py-2 px-4 sm:px-6 bg-blue-600 hover:bg-blue-700 text-sm text-white font-bold rounded-xl transition duration-200 ml-3"
                to="/signup">Sign Up</Link>
            </>
          ) : (
            <>
              {/* Profile Image */}
              <Link to="/userProfile" className="ml-3">
                <img
                  src="../images/user.png" // Replace with your profile image path
                  alt="Profile"
                  className="h-10 w-10 rounded-full cursor-pointer"
                />
              </Link>
              <button
                onClick={handleLogout}
                className="ml-4 py-2 px-4 sm:px-6 bg-gray-200 hover:bg-gray-300 text-sm text-red-600 font-bold rounded-xl transition duration-200 hover:cursor-pointer"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`navbar-menu relative z-50 ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="navbar-backdrop fixed inset-0 bg-gray-800 opacity-25" onClick={closeMobileMenu}></div>
        <nav className="fixed top-0 left-0 bottom-0 flex flex-col w-5/6 max-w-sm py-6 px-6 bg-white border-r overflow-y-auto">
          <div className="flex items-center mb-8">
            <Link className="mr-auto" to="/">
              <img src="../images/Logo.png" alt="Pristine Clean Logo" className="h-10" />
            </Link>
            <button onClick={closeMobileMenu} className="navbar-close">
              <svg className="h-6 w-6 text-gray-600 cursor-pointer hover:text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
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
