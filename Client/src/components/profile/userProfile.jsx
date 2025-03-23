// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const UserProfile = () => {
//   const [user, setUser] = useState({});
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [profilePicture, setProfilePicture] = useState(null);
//   const [address, setAddress] = useState({
//     street: '',
//     city: '',
//     country: 'Jordan', // Default country as per your provided data
//   });

//   useEffect(() => {
//     // Fetch the user's profile data on component mount
//     const fetchProfile = async () => {
//       try {
//         const response = await axios.get('http://localhost:8000/api/auth/profile', { withCredentials: true });
//         setUser(response.data.user);
//         setName(response.data.user.name);
//         setEmail(response.data.user.email);
//         setPhone(response.data.user.phoneNumber || '');
//         setAddress(response.data.user.address || { street: '', city: '', country: 'Jordan' });
//       } catch (error) {
//         console.error('Error fetching profile:', error);
//       }
//     };

//     fetchProfile();
//   }, []);

//   const handleProfileImageChange = (e) => {
//     setProfilePicture(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append('name', name);
//     formData.append('email', email);
//     formData.append('phoneNumber', phone);
//     formData.append('street', address.street);
//     formData.append('city', address.city);
//     formData.append('country', address.country);
//     if (profilePicture) formData.append('profilePicture', profilePicture);
//     try {
//       const response = await axios.put('http://localhost:8000/api/auth/update-profile', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         withCredentials: true, // Make sure cookies are sent (for authentication)
//       });
//       alert('Profile updated successfully');
//     } catch (error) {
//       console.error('Error updating profile:', error);
//     }
//   };

//   return (
//     <section className="py-10 my-auto mb-12 mt-8">
//       <div className="lg:w-[80%] md:w-[90%] xs:w-[96%] mx-auto flex gap-4">
//         <div className="lg:w-[88%] md:w-[80%] sm:w-[88%] xs:w-full mx-auto shadow-2xl p-4 rounded-xl h-fit self-center bg-white">
//           <div>
//             <h1 className="lg:text-3xl md:text-2xl sm:text-xl xs:text-xl font-serif font-extrabold mb-5 text-gray-800">
//               Profile
//             </h1>
//             <form onSubmit={handleSubmit}>
//               {/* Profile and Cover Images */}
//               <div className="w-full rounded-sm bg-[url('https://images.unsplash.com/photo-1449844908441-8829872d2607?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw2fHxob21lfGVufDB8MHx8fDE3MTA0MDE1NDZ8MA&ixlib=rb-4.0.3&q=80&w=1080')] bg-cover bg-center bg-no-repeat items-center">
//                 <div
//                   id="profileImage"
//                   className="mx-auto flex justify-center w-[141px] h-[141px] bg-blue-300/20 rounded-full bg-cover bg-center bg-no-repeat"
//                   style={{ backgroundImage: `url(${user.profilePicture || '../images/user.png'})` }}
//                 >
//                   <div className="bg-white/90 rounded-full w-6 h-6 text-center ml-28 mt-4">
//                     <input
//                       type="file"
//                       name="profile"
//                       id="upload_profile"
//                       hidden
//                       onChange={handleProfileImageChange}
//                     />
//                     <label htmlFor="upload_profile">
//                       <svg
//                         data-slot="icon"
//                         className="w-6 h-5 text-blue-700 hover:cursor-pointer"
//                         fill="none"
//                         strokeWidth="1.5"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                         xmlns="http://www.w3.org/2000/svg"
//                         aria-hidden="true"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
//                         ></path>
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
//                         ></path>
//                       </svg>
//                     </label>
//                   </div>
//                 </div>
//               </div>
//               <h2 className="text-center mt-1 font-semibold text-gray-600">Upload Profile</h2>

//               {/* Name Input */}
//               <div className="w-full mb-4 mt-6">
//                 <label htmlFor="name" className="mb-2 text-gray-600">Name</label>
//                 <input
//                   type="text"
//                   id="name"
//                   name="name"
//                   className="mt-2 p-4 w-full border-2 rounded-lg text-gray-700 border-gray-300 bg-gray-100"
//                   placeholder="Enter your name"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                 />
//               </div>

//               {/* Email Input */}
//               <div className="w-full mb-4">
//                 <label htmlFor="email" className="mb-2 text-gray-600">Email</label>
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   className="mt-2 p-4 w-full border-2 rounded-lg text-gray-700 border-gray-300 bg-gray-100"
//                   placeholder="Enter your email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//               </div>

//               {/* Phone Number Input */}
//               <div className="w-full mb-4">
//                 <label htmlFor="phone" className="mb-2 text-gray-600">Phone Number</label>
//                 <input
//                   type="tel"
//                   id="phone"
//                   name="phone"
//                   className="mt-2 p-4 w-full border-2 rounded-lg text-gray-700 border-gray-300 bg-gray-100"
//                   placeholder="Enter your phone number"
//                   value={phone}
//                   onChange={(e) => setPhone(e.target.value)}
//                 />
//               </div>

//               {/* Address Input */}
//               <div className="w-full mb-4 mt-6">
//                 <label htmlFor="address" className="mb-2 text-gray-600">Address</label>
//                 <input
//                   type="text"
//                   id="street"
//                   name="street"
//                   className="mt-2 p-4 w-full border-2 rounded-lg text-gray-700 border-gray-300 bg-gray-100"
//                   placeholder="Street"
//                   value={address.street}
//                   onChange={(e) => setAddress({ ...address, street: e.target.value })}
//                 />
//                 <input
//                   type="text"
//                   id="city"
//                   name="city"
//                   className="mt-2 p-4 w-full border-2 rounded-lg text-gray-700 border-gray-300 bg-gray-100"
//                   placeholder="City"
//                   value={address.city}
//                   onChange={(e) => setAddress({ ...address, city: e.target.value })}
//                 />
//                 <select
//                   id="country"
//                   name="country"
//                   className="mt-2 p-4 w-full border-2 rounded-lg text-gray-700 border-gray-300 bg-gray-100"
//                   value={address.country}
//                   onChange={(e) => setAddress({ ...address, country: e.target.value })}
//                 >
//                   <option value="Jordan">Jordan</option>
//                   {/* You can add more countries here */}
//                 </select>
//               </div>

//               {/* Submit Buttons */}
//               <div className="flex justify-end mt-6 gap-2">
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
//                 >
//                   Save Changes
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default UserProfile;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Camera, Mail, Phone, MapPin, Save, X } from 'lucide-react';
import { Toaster, toast } from 'sonner';

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    country: 'Jordan',
  });

  // Fetch user profile data
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/auth/profile', { withCredentials: true });
      setUser(response.data.user);
      setName(response.data.user.name);
      setEmail(response.data.user.email);
      setPhone(response.data.user.phoneNumber || '');
      setAddress({
        street: response.data.user.address?.street || '',
        city: response.data.user.address?.city || '',
        country: 'Jordan', // Always set to Jordan
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load your profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle profile image change
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const newUser = { ...user, profilePicture: URL.createObjectURL(file) };
      setUser(newUser);
      toast.success('Profile picture updated. Save to apply changes.');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phoneNumber', phone);
    formData.append('street', address.street);
    formData.append('city', address.city);
    formData.append('country', 'Jordan'); // Always set to Jordan
    if (profilePicture) formData.append('profilePicture', profilePicture);

    try {
      const response = await axios.put('http://localhost:8000/api/auth/update-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      toast.success('Your profile has been updated');
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel button
  const handleCancel = () => {
    fetchProfile();
    toast.info('Changes discarded');
  };

  return (
    <section className="py-10 bg-gray-50 min-h-screen">
      <Toaster position="top-right" richColors />
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="h-48 w-full bg-gradient-to-r from-blue-500 to-indigo-600 relative">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <div
                  className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 bg-cover bg-center flex items-center justify-center overflow-hidden"
                  style={{ backgroundImage: `url(${user.profilePicture || '../images/user.png'})` }}
                >
                  {!user.profilePicture && <User size={48} className="text-gray-400" />}
                </div>
                <label
                  htmlFor="upload_profile"
                  className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <Camera size={18} className="text-blue-600" />
                </label>
                <input
                  type="file"
                  name="profile"
                  id="upload_profile"
                  hidden
                  onChange={handleProfileImageChange}
                  accept="image/*"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="pt-20 px-8 pb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h1>
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Name Input */}
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="pl-10 w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="pl-10 w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Phone Number Input */}
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="pl-10 w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                {/* Address Heading */}
                <div className="col-span-2 mt-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <MapPin size={18} className="text-blue-500" />
                    Address Information
                  </h2>
                </div>

                {/* Street Address */}
                <div className="col-span-2">
                  <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter your street address"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  />
                </div>

                {/* City */}
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter your city"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  />
                </div>

                {/* Country - Static Jordan */}
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    className="w-full p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-700"
                    value="Jordan"
                    readOnly
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end mt-8 gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 flex items-center gap-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X size={18} />
                  <span>Cancel</span>
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-1"></div>
                  ) : (
                    <Save size={18} />
                  )}
                  <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;