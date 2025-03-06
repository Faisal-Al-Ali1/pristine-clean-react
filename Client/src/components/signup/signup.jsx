// src/pages/Signup.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [signUpMessage, setSignUpMessage] = useState('');

  
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) 
      setSignUpMessage('Passwords do not match');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Section (Image) */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="/images/signup-cover.jpg"
          alt="Background Image"
          className="absolute inset-0 object-cover h-full w-full"
          style={{ filter: 'brightness(0.5)' }} 
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-white text-3xl font-bold">Your Clean, Just a Click Away</h2>
          </div>
        </div>
      </div>

      {/* Right Section (Form) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800">Pristine Clean</h2>
            <p className="mt-3 text-gray-600">Sign up to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" id="sign-up-form">
            <button
              type="button"
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
            >
              <img src="/images/google.png" alt="Google Icon" className="w-5 h-5 mr-2" />
              Continue with Google
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="example@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Enter New Password
              </label>
              <input
                type={passwordVisible ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute top-8 right-3 flex items-center text-gray-500 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  style={{ fill: passwordVisible ? '#007bff' : 'currentColor' }}
                >
                  <path d="M10 3.5C5 3.5 1.2 7.28.5 10c.7 2.72 4.5 6.5 9.5 6.5s8.8-3.78 9.5-6.5c-.7-2.72-4.5-6.5-9.5-6.5zm0 11c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
                  <path d="M10 7a3 3 0 100 6 3 3 0 000-6z" />
                </svg>
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type={confirmPasswordVisible ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm Your Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute top-8 right-3 flex items-center text-gray-500 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  style={{ fill: confirmPasswordVisible ? '#007bff' : 'currentColor' }}
                >
                  <path d="M10 3.5C5 3.5 1.2 7.28.5 10c.7 2.72 4.5 6.5 9.5 6.5s8.8-3.78 9.5-6.5c-.7-2.72-4.5-6.5-9.5-6.5zm0 11c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
                  <path d="M10 7a3 3 0 100 6 3 3 0 000-6z" />
                </svg>
              </button>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start mt-4">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-500">
                I agree to the <Link to="#" className="text-blue-500 hover:underline">Terms of Service</Link> and{' '}
                <Link to="#" className="text-blue-500 hover:underline">Privacy Policy</Link>
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 cursor-pointer"
              >
                Continue
              </button>
            </div>
          </form>

          <p className="mt-4 text-sm text-center text-gray-500">
            Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
