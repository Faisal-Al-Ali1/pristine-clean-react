import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Save, X, Shield, Key } from 'lucide-react';
import { updateProfile, getProfile } from '../../api/users';
import { toast } from 'sonner';

const AdminProfile = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      country: 'Jordan'
    },
    role: '',
    lastLogin: '',
    profilePicture: null
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch admin profile data
  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        setLoading(true);
        const response = await getProfile();
        const userData = response.user;
        console.log(userData);
        setProfileData({
          name: userData.name,
          email: userData.email,
          phone: userData.phoneNumber || '',
          address: {
            street: userData.address?.street || '',
            city: userData.address?.city || '',
            country: userData.address?.country || 'Jordan'
          },
          role: userData.role,
          lastLogin: userData.lastLogin || '',
          profilePicture: userData.profilePicture
        });
        setPreviewImage(userData.profilePicture || '');
      } catch (error) {
        console.error('Error fetching admin profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, []);

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', profileData.name);
    formData.append('email', profileData.email);
    formData.append('phoneNumber', profileData.phone);
    formData.append('street', profileData.address.street);
    formData.append('city', profileData.address.city);
    formData.append('country', profileData.address.country);
    if (profileImage) {
      formData.append('profilePicture', profileImage);
    }

    try {
      setLoading(true);
      const response = await updateProfile(formData);
      const updatedUser = response.user;
      toast.success('Profile updated successfully');
      setIsEditing(false);
      
      setProfileData({
        ...profileData,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phoneNumber || '',
        address: {
          street: updatedUser.address?.street || '',
          city: updatedUser.address?.city || '',
          country: updatedUser.address?.country || 'Jordan'
        },
        profilePicture: updatedUser.profilePicture
      });
      setPreviewImage(updatedUser.profilePicture || '');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel button
  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values
    getProfile().then(response => {
      const userData = response.user;
      setProfileData({
        name: userData.name,
        email: userData.email,
        phone: userData.phoneNumber || '',
        address: {
          street: userData.address?.street || '',
          city: userData.address?.city || '',
          country: userData.address?.country || 'Jordan'
        },
        role: userData.role,
        lastLogin: userData.lastLogin || '',
        profilePicture: userData.profilePicture
      });
      setPreviewImage(userData.profilePicture || '');
    });
    toast.info('Changes discarded');
  };

  // Format last login date
  const formatLastLogin = (dateString) => {
    if (!dateString) return 'Never logged in';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Picture Section */}
        <div className="md:w-1/3 flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-40 h-40 rounded-full bg-gray-100 border-4 border-white shadow-md overflow-hidden">
              {previewImage ? (
                <img 
                  src={previewImage} 
                  alt="Admin Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <User size={48} />
                </div>
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </label>
            )}
          </div>

          {/* Admin Info */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">{profileData.name}</h2>
            <div className="flex items-center justify-center gap-2 mt-1 text-blue-600">
              <Shield size={16} />
              <span className="text-sm font-medium">{profileData.role}</span>
            </div>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <User size={16} />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* Profile Form Section */}
        <div className="md:w-2/3">
          {isEditing ? (
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
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
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
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
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
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    />
                  </div>
                </div>

                {/* Role - Static */}
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Shield size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="role"
                      name="role"
                      className="pl-10 w-full p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-700"
                      value={profileData.role}
                      readOnly
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
                    value={profileData.address.street}
                    onChange={(e) => setProfileData({
                      ...profileData, 
                      address: {...profileData.address, street: e.target.value}
                    })}
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
                    value={profileData.address.city}
                    onChange={(e) => setProfileData({
                      ...profileData, 
                      address: {...profileData.address, city: e.target.value}
                    })}
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
                    value={profileData.address.country}
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
          ) : (
            <div className="space-y-6">
              {/* View Mode */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Full Name</h3>
                  <p className="flex items-center gap-2 text-gray-800">
                    <User size={16} className="text-gray-400" />
                    {profileData.name}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Email Address</h3>
                  <p className="flex items-center gap-2 text-gray-800">
                    <Mail size={16} className="text-gray-400" />
                    {profileData.email}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Phone Number</h3>
                  <p className="flex items-center gap-2 text-gray-800">
                    <Phone size={16} className="text-gray-400" />
                    {profileData.phone || 'Not provided'}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Role</h3>
                  <p className="flex items-center gap-2 text-gray-800">
                    <Shield size={16} className="text-gray-400" />
                    {profileData.role}
                  </p>
                </div>
              </div>

              {/* Address Section */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                  <MapPin size={18} className="text-blue-500" />
                  Address Information
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Street Address</h3>
                    <p className="text-gray-800">
                      {profileData.address.street || 'Not provided'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">City</h3>
                    <p className="text-gray-800">
                      {profileData.address.city || 'Not provided'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Country</h3>
                    <p className="text-gray-800">
                      {profileData.address.country}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;