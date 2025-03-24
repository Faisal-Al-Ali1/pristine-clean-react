// // src/pages/Signup.jsx
// import React, { useState, useContext } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { AuthContext } from '../../context/AuthContext';
// import axios from 'axios';

// const Signup = () => {
//   const { setUser } = useContext(AuthContext);
//   const navigate = useNavigate();

//   // Form states
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [termsChecked, setTermsChecked] = useState(false);

//   // Toggle visibility states
//   const [passwordVisible, setPasswordVisible] = useState(false);
//   const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

//   // For displaying messages
//   const [signUpMessage, setSignUpMessage] = useState('');
//   const [isSuccessMessage, setIsSuccessMessage] = useState(false);

//   const togglePasswordVisibility = () => {
//     setPasswordVisible(!passwordVisible);
//   };

//   const toggleConfirmPasswordVisibility = () => {
//     setConfirmPasswordVisible(!confirmPasswordVisible);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Reset messages
//     setSignUpMessage('');
//     setIsSuccessMessage(false);

//     // 1) Basic client-side checks
//     if (password !== confirmPassword) {
//       setSignUpMessage('Passwords do not match.');
//       return;
//     }

//     if (!termsChecked) {
//       setSignUpMessage('Please accept the Terms of Service before signing up.');
//       return;
//     }

//     try {
//       // 2) Post data to back-end
//       const response = await axios.post('http://localhost:8000/api/auth/register', {
//         name,
//         email,
//         password
//       },{ withCredentials: true });

//       // 3) If status is 201 => success
//       if (response.status === 201) {
//         setSignUpMessage(response.data.message);  // "User registered successfully"
//         setIsSuccessMessage(true);

//         // 4) Update the user state in AuthContext
//         setUser(response.data.user); // Store the user in context

//         // 5) Wait 3 seconds and redirect to /login
//         setTimeout(() => {
//           navigate('/');
//         }, 2000);
//       }
//     } catch (error) {
//       // 6) Handle errors (Joi validation, user exists, etc.)
//       if (error.response && error.response.data && error.response.data.message) {
//         setSignUpMessage(error.response.data.message);
//       } else {
//         setSignUpMessage('An error occurred. Please try again.');
//       }
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Left Section (Image) */}
//       <div className="hidden lg:block lg:w-1/2 relative">
//         <img
//           src="/images/signup-cover.jpg"
//           alt="Background"
//           className="absolute inset-0 object-cover h-full w-full"
//           style={{ filter: 'brightness(0.5)' }}
//         />
//         <div className="absolute inset-0 flex items-center justify-center">
//           <div className="text-center">
//             <h2 className="text-white text-3xl font-bold">Your Clean, Just a Click Away</h2>
//           </div>
//         </div>
//       </div>

//       {/* Right Section (Form) */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white">
//         <div className="w-full max-w-md">
//           {/* Header */}
//           <div className="text-center">
//             <h2 className="text-4xl font-bold text-gray-800">Pristine Clean</h2>
//             <p className="mt-3 text-gray-600">Sign up to get started</p>
//           </div>

//           {/* Display success or error message */}
//           {signUpMessage && (
//             <div
//               className={`mt-4 p-2 text-center font-semibold ${
//                 isSuccessMessage ? 'text-green-600' : 'text-red-600'
//               }`}
//             >
//               {signUpMessage}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="mt-6 space-y-4">
//             {/* Google Button (optional) */}
//             <button
//               type="button"
//               className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
//             >
//               <img src="/images/google.png" alt="Google Icon" className="w-5 h-5 mr-2" />
//               Continue with Google
//             </button>

//             {/* Divider */}
//             <div className="relative my-4">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-300"></div>
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-2 bg-white text-gray-500">Or</span>
//               </div>
//             </div>

//             {/* Name */}
//             <div>
//               <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//                 Name
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 placeholder="Your Name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="block w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300"
//               />
//             </div>

//             {/* Email */}
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                 Email Address
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 placeholder="example@example.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="block w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300"
//               />
//             </div>

//             {/* Password */}
//             <div className="relative">
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                 Enter New Password
//               </label>
//               <input
//                 type={passwordVisible ? 'text' : 'password'}
//                 id="password"
//                 placeholder="Your Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="block w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300"
//               />
//               <button
//                 type="button"
//                 onClick={togglePasswordVisibility}
//                 className="absolute top-8 right-3 flex items-center text-gray-500 cursor-pointer"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                   style={{ fill: passwordVisible ? '#007bff' : 'currentColor' }}
//                 >
//                   <path d="M10 3.5C5 3.5 1.2 7.28.5 10c.7 2.72 4.5 6.5 9.5 6.5s8.8-3.78 9.5-6.5c-.7-2.72-4.5-6.5-9.5-6.5zm0 11c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
//                   <path d="M10 7a3 3 0 100 6 3 3 0 000-6z" />
//                 </svg>
//               </button>
//             </div>

//             {/* Confirm Password */}
//             <div className="relative">
//               <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
//                 Confirm Password
//               </label>
//               <input
//                 type={confirmPasswordVisible ? 'text' : 'password'}
//                 id="confirmPassword"
//                 placeholder="Confirm Your Password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 className="block w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300"
//               />
//               <button
//                 type="button"
//                 onClick={toggleConfirmPasswordVisibility}
//                 className="absolute top-8 right-3 flex items-center text-gray-500 cursor-pointer"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                   style={{ fill: confirmPasswordVisible ? '#007bff' : 'currentColor' }}
//                 >
//                   <path d="M10 3.5C5 3.5 1.2 7.28.5 10c.7 2.72 4.5 6.5 9.5 6.5s8.8-3.78 9.5-6.5c-.7-2.72-4.5-6.5-9.5-6.5zm0 11c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
//                   <path d="M10 7a3 3 0 100 6 3 3 0 000-6z" />
//                 </svg>
//               </button>
//             </div>

//             {/* Terms Checkbox */}
//             <div className="flex items-start mt-4">
//               <input
//                 id="terms"
//                 name="terms"
//                 type="checkbox"
//                 checked={termsChecked}
//                 onChange={(e) => setTermsChecked(e.target.checked)}
//                 className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//               />
//               <label htmlFor="terms" className="ml-2 block text-sm text-gray-500">
//                 I agree to the{' '}
//                 <Link to="#" className="text-blue-500 hover:underline">
//                   Terms of Service
//                 </Link>{' '}
//                 and{' '}
//                 <Link to="#" className="text-blue-500 hover:underline">
//                   Privacy Policy
//                 </Link>
//               </label>
//             </div>

//             {/* Submit Button */}
//             <div>
//               <button
//                 type="submit"
//                 className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 cursor-pointer"
//               >
//                 Continue
//               </button>
//             </div>
//           </form>

//           <p className="mt-4 text-sm text-center text-gray-500">
//             Already have an account?{' '}
//             <Link to="/login" className="text-blue-500 hover:underline">
//               Login
//             </Link>.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;

// src/pages/Signup.jsx
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { register } from '../../api/users';

const Signup = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsChecked, setTermsChecked] = useState(false);

  // Toggle visibility states
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // For displaying messages
  const [signUpMessage, setSignUpMessage] = useState('');
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSignUpMessage('');
    setIsSuccessMessage(false);

    // 1) Basic client-side checks
    if (password !== confirmPassword) {
      setSignUpMessage('Passwords do not match.');
      return;
    }
    if (!termsChecked) {
      setSignUpMessage('Please accept the Terms of Service before signing up.');
      return;
    }

    try {
      // 2) Use the shared `register` function
      const data = await register({ name, email, password });

      // 3) Check response status or data
      setSignUpMessage(data.message || 'User registered successfully');
      setIsSuccessMessage(true);

      // 4) Update AuthContext with the returned user info
      if (data.user) {
        setUser(data.user);
      }

      // 5) Wait 3 seconds and redirect to '/'
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      // 6) Handle errors (e.g., user already exists, validation fails, etc.)
      if (error.response && error.response.data && error.response.data.message) {
        setSignUpMessage(error.response.data.message);
      } else {
        setSignUpMessage('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Section (Image) */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="/images/signup-cover.jpg"
          alt="Background"
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
          {/* Header */}
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800">Pristine Clean</h2>
            <p className="mt-3 text-gray-600">Sign up to get started</p>
          </div>

          {/* Display success or error message */}
          {signUpMessage && (
            <div
              className={`mt-4 p-2 text-center font-semibold ${
                isSuccessMessage ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {signUpMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
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
                checked={termsChecked}
                onChange={(e) => setTermsChecked(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-500">
                I agree to the{' '}
                <Link to="#" className="text-blue-500 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="#" className="text-blue-500 hover:underline">
                  Privacy Policy
                </Link>
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
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
