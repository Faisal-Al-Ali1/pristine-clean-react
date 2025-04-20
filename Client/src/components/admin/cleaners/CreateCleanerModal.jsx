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

  // Initial form state
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

  // Reset form function
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
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-gray-100">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Create New Cleaner</h3>
            <p className="text-sm text-gray-500 mt-1">Add a new cleaning professional to your team</p>
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
                placeholder="John Doe"
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
                placeholder="cleaner@example.com"
                required
              />
              <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="flex items-center text-sm font-medium text-gray-700 gap-2">
              <Lock size={16} />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                placeholder="At least 8 characters"
                minLength={8}
                required
              />
              <Lock size={16} className="absolute left-3 top-3 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
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
                placeholder="07"
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
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : 'Create Cleaner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCleanerModal;