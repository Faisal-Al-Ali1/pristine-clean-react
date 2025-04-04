import React from 'react';
import { User, Mail, Phone, MapPin, Save, X } from 'lucide-react';
import { updateProfile } from '../../api/users';
import { toast } from 'sonner';

const PersonalInfoTab = ({
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  address,
  setAddress,
  profilePicture,
  loading,
  fetchProfile,
}) => {
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

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
    }
  };

  // Handle cancel button
  const handleCancel = () => {
    fetchProfile();
    toast.info('Changes discarded');
  };

  return (
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
  );
};

export default PersonalInfoTab;