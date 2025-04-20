import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  X, User, Mail, Lock, Phone, MapPin, Home, Check, Star, RefreshCw 
} from 'lucide-react';
import { toast } from 'sonner';

const UpdateCleanerModal = ({ visible, cleaner, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: {
      street: '',
      city: ''
    },
    skills: [],
  });
  const [loading, setLoading] = useState(false);

  const skillsOptions = [
    'residential_cleaning',
    'deep_cleaning',
    'office_cleaning',
    'move_in_out',
    'car_cleaning',
    'after_renovation_cleaning'
  ];

  useEffect(() => {
    if (cleaner) {
      setFormData({
        name: cleaner.name,
        email: cleaner.email,
        password: '',
        phoneNumber: cleaner.phoneNumber,
        address: cleaner.address || { street: '', city: '' },
        skills: cleaner.cleanerProfile?.skills || [],
        isActive: cleaner.cleanerProfile?.isActive
      });
    }
  }, [cleaner]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('address.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSkillsChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const skills = checked 
        ? [...prev.skills, value]
        : prev.skills.filter(skill => skill !== value);
      return { ...prev, skills };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:8000/api/admin/bookings/cleaner/${cleaner._id}`,
        formData
      );
      toast.success('Cleaner updated successfully');
      onSuccess();
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to update cleaner';
      toast.error(errMsg);
      console.error('Failed to update cleaner:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-gray-100">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Update Cleaner</h3>
            <p className="text-sm text-gray-500 mt-1">Edit {cleaner?.name}'s profile details</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:bg-gray-100 p-1 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="flex items-center text-sm font-medium text-gray-700 gap-2">
              <User size={16} />
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                required
              />
              <User size={16} className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="flex items-center text-sm font-medium text-gray-700 gap-2">
              <Mail size={16} />
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                required
              />
              <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="flex items-center text-sm font-medium text-gray-700 gap-2">
              <Phone size={16} />
              Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                required
              />
              <Phone size={16} className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="flex items-center text-sm font-medium text-gray-700 gap-2">
              <MapPin size={16} />
              Address
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleInputChange}
                  placeholder="Street"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                />
                <Home size={16} className="absolute left-3 top-3 text-gray-400" />
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                />
                <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="flex items-center text-sm font-medium text-gray-700 gap-2">
              <Star size={16} />
              Cleaning Skills
            </label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {skillsOptions.map((skill) => (
                <label 
                  key={skill} 
                  className={`flex items-center p-2 rounded-lg border cursor-pointer transition-colors ${
                    formData.skills.includes(skill) 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    value={skill}
                    checked={formData.skills.includes(skill)}
                    onChange={handleSkillsChange}
                    className="hidden"
                  />
                  <div className={`w-5 h-5 rounded border flex items-center justify-center mr-2 ${
                    formData.skills.includes(skill) 
                      ? 'bg-blue-500 border-blue-500' 
                      : 'bg-white border-gray-300'
                  }`}>
                    {formData.skills.includes(skill) && <Check size={14} className="text-white" />}
                  </div>
                  <span className="text-sm capitalize">{skill.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-white text-gray-700 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed font-medium shadow-sm shadow-blue-100 flex items-center"
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin mr-2" />
                  Updating...
                </>
              ) : 'Update Cleaner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCleanerModal;