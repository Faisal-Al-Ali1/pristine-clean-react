import React, { useState, useEffect } from 'react';
import { User, Camera, Mail, Phone, MapPin, Save, X } from 'lucide-react';
import { getProfile, updateProfile } from '../../api/users';
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
      // Use shared getProfile method
      const data = await getProfile();

      // Update local state
      if (data?.user) {
        setUser(data.user);
        setName(data.user.name);
        setEmail(data.user.email);
        setPhone(data.user.phoneNumber || '');
        setAddress({
          street: data.user.address?.street || '',
          city: data.user.address?.city || '',
          country: 'Jordan',
        });
      }
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
    formData.append('country', 'Jordan');
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    try {
      // Use shared updateProfile method
      await updateProfile(formData);
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
                  style={{ backgroundImage: `url(${user.profilePicture})` }}
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