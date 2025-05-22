import React, { useState } from 'react';
import axios from 'axios';
import { 
  X, User, Mail, Lock, Phone, MapPin, Home, Check, Star, Eye, EyeOff
} from 'lucide-react';
import { toast } from 'sonner';

const CreateCleanerModal = ({ visible, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: {
      street: '',
      city: ''
    },
    skills: [],
  });

  const initialFormData = {
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: {
      street: '',
      city: ''
    },
    skills: [],
  };
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const skillsOptions = [
    'residential_cleaning',
    'deep_cleaning',
    'office_cleaning',
    'move_in_out',
    'car_cleaning',
    'after_renovation_cleaning'
  ];

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

  const resetForm = () => {
    setFormData(initialFormData);
    setShowPassword(false);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/admin/bookings/cleaner', formData);
      toast.success('Cleaner created successfully');
      resetForm();
      onSuccess();
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to create cleaner';
      toast.error(errMsg);
      console.error('Failed to create cleaner:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-gray-100 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 p-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl z-10">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Create New Cleaner</h3>
            <p className="text-xs text-gray-500 mt-1">Add a new cleaning professional</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:bg-gray-100 p-1 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          {/* Name Field */}
          <div className="space-y-1">
            <label className="flex items-center text-xs font-medium text-gray-700 gap-1">
              <User size={14} />
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-sm"
                placeholder="John Doe"
                required
              />
              <User size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-1">
            <label className="flex items-center text-xs font-medium text-gray-700 gap-1">
              <Mail size={14} />
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-sm"
                placeholder="cleaner@example.com"
                required
              />
              <Mail size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="flex items-center text-xs font-medium text-gray-700 gap-1">
              <Lock size={14} />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-8 pr-8 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-sm"
                placeholder="At least 8 characters"
                minLength={8}
                required
              />
              <Lock size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Phone Field */}
          <div className="space-y-1">
            <label className="flex items-center text-xs font-medium text-gray-700 gap-1">
              <Phone size={14} />
              Phone
            </label>
            <div className="relative">
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-sm"
                placeholder="07"
                required
              />
              <Phone size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
            </div>
          </div>

          {/* Address Fields */}
          <div className="space-y-1">
            <label className="flex items-center text-xs font-medium text-gray-700 gap-1">
              <MapPin size={14} />
              Address
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleInputChange}
                  placeholder="Street"
                  className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-sm"
                />
                <Home size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-sm"
                />
                <MapPin size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Skills Checkboxes */}
          <div className="space-y-1">
            <label className="flex items-center text-xs font-medium text-gray-700 gap-1">
              <Star size={14} />
              Skills
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {skillsOptions.map((skill) => (
                <label 
                  key={skill} 
                  className={`flex items-center p-1.5 rounded-md border cursor-pointer transition-colors text-xs ${
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
                  <div className={`w-4 h-4 rounded border flex items-center justify-center mr-1.5 ${
                    formData.skills.includes(skill) 
                      ? 'bg-blue-500 border-blue-500' 
                      : 'bg-white border-gray-300'
                  }`}>
                    {formData.skills.includes(skill) && <Check size={12} className="text-white" />}
                  </div>
                  <span className="capitalize">{skill.replace(/_/g, ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-2 pt-4 sticky bottom-0 bg-white pb-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed text-sm font-medium flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCleanerModal;