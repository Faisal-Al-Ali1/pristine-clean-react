import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { login, getMe } from '../../api/users';  
import { Toaster, toast } from 'sonner';

const Login = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getMe();
        if (response.user) {
          setUser(response.user);
          if (response.user.role === 'admin') {
            toast.success('Welcome back, Admin!');
            setTimeout(() => navigate('/admin-dash'), 1500); 
          } else if (response.user.role === 'cleaner') {
            toast.success('Welcome back!');
            setTimeout(() => navigate('/cleaner-page'), 1500);
          } else {
            navigate('/');
          }
        }
      } catch (error) {
        console.log('Not authenticated:', error.message);
      }
    };

    checkAuth();
  }, [navigate, setUser]);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const redirectBasedOnRole = (role) => {
    if (role === 'admin') {
      toast.success('Welcome back, Admin!');
      setTimeout(() => navigate('/admin-dash'), 1500); 
    } else if (role === 'cleaner') {
      toast.success('Welcome back!');
      setTimeout(() => navigate('/cleaner-page'), 1500);
    } else {
      setTimeout(() => navigate('/'), 1000); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login({ email, password });
      
      const userData = await getMe();
      
      setUser(userData.user);
      
      toast.success('Logged in successfully!', { duration: 3000 });
      
      redirectBasedOnRole(userData.user.role);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMessage, { duration: 4000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Toaster with longer default duration */}
      <Toaster 
        position="top-right" 
        richColors 
        expand={true}
        duration={3000}
        visibleToasts={3}
      />
      
      {/* Left Section (Image) */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="/images/login-cover.jpeg"
          alt="Background"
          className="absolute inset-0 object-cover h-full w-full"
          style={{ filter: 'brightness(0.5)' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-white text-3xl font-bold">
              Let's Make Your Space Pristine Again!
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

          <form onSubmit={handleSubmit} className="mt-8 space-y-6" id="login-form">
            {/* Google Button (optional)
            <button
              type="button"
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
            >
              <img src="/images/google.png" alt="Google Icon" className="w-5 h-5 mr-2" />
              Continue with Google
            </button> */}

            {/* Divider
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div> */}

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
                required
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
                required
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
                disabled={isLoading}
                className={`w-full px-4 py-2 text-white rounded-md focus:outline-none cursor-pointer ${
                  isLoading ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600 focus:bg-blue-600'
                }`}
              >
                {isLoading ? 'Logging in...' : 'Continue'}
              </button>
            </div>
          </form>

          <p className="mt-6 text-sm text-center text-gray-500">
            Don't have an account yet?{' '}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
            .
          </p>

          {/* <p className="mt-4 text-sm text-center">
            <Link to="#" className="text-blue-500 hover:underline">
              Forgot password?
            </Link>
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default Login;