// src/pages/Login.jsx
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

const Login = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Messages
  const [loginMessage, setLoginMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginMessage('');
    setIsSuccess(false);

    try {
      // 1) Send login request to your Node.js backend
      const response = await axios.post('http://localhost:8000/api/auth/login', {
        email,
        password
      },{ withCredentials: true });

      // 2) If successful (HTTP 200), display success message
      if (response.status === 200) {
        setLoginMessage(response.data.message); // e.g. "Logged in successfully"
        setIsSuccess(true);

        // 3) Update the user state in AuthContext
        setUser(response.data.user); // Store the user in context

        // 4) (Optional) redirect after 2-3 seconds, or immediately
        setTimeout(() => {
          // Replace '/dashboard' with whatever page you want
          navigate('/'); 
        }, 2000);
      }
    } catch (error) {
      // 5) If error, display the error message from the server (e.g., "Invalid email or password")
      if (error.response && error.response.data && error.response.data.message) {
        setLoginMessage(error.response.data.message);
      } else {
        setLoginMessage('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Section (Image) */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="/images/login-cover.jpeg"
          alt="Background Image"
          className="absolute inset-0 object-cover h-full w-full"
          style={{ filter: 'brightness(0.5)' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-white text-3xl font-bold">
              Let’s Make Your Space Pristine Again!
            </h2>
          </div>
        </div>
      </div>

      {/* Right Section (Form) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800">Pristine Clean</h2>
            <p className="mt-3 text-gray-600">Sign in to access your account</p>
          </div>

          {/* Message (Success or Error) */}
          {loginMessage && (
            <div
              className={`mt-4 p-2 text-center font-semibold ${
                isSuccess ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {loginMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6" id="login-form">
            {/* Google Button (optional) */}
            <button
              type="button"
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
            >
              <img src="/images/google.png" alt="Google Icon" className="w-5 h-5 mr-2" />
              Continue with Google
            </button>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
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
                Password
              </label>
              <input
                type={passwordVisible ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Your password"
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

          <p className="mt-6 text-sm text-center text-gray-500">
            Don’t have an account yet?{' '}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
            .
          </p>

          <p className="mt-4 text-sm text-center">
            <Link to="#" className="text-blue-500 hover:underline">
              Forgot password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
