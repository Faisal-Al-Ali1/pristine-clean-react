import React from 'react';
import { User, Mail, Phone, MapPin, Check, X, Info, Settings, Loader2, Upload, Calendar, Award } from 'lucide-react';
import { updateCleanerProfile } from '../../api/cleaners';
import { toast } from 'sonner';

const SKILLS_OPTIONS = [
  'deep_cleaning',
  'car_cleaning',
  'residential_cleaning',
  'move_in_out',
  'office_cleaning',
  'after_renovation_cleaning'
];

export default function ProfileTab({ cleaner, loading, onProfileUpdate }) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    phoneNumber: '',
    address: {
      street: '',
      city: '',
      country: 'Jordan'
    },
    cleanerProfile: {
      bio: '',
      skills: []
    }
  });
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [profilePicture, setProfilePicture] = React.useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = React.useState('');

  // Initialize form data when cleaner data is available
  React.useEffect(() => {
    if (cleaner) {
      setFormData({
        name: cleaner.name || '',
        phoneNumber: cleaner.phoneNumber || '',
        address: {
          street: cleaner.address?.street || '',
          city: cleaner.address?.city || '',
          country: 'Jordan'
        },
        cleanerProfile: {
          bio: cleaner.cleanerProfile?.bio || '',
          skills: cleaner.cleanerProfile?.skills || []
        }
      });
      setProfilePicturePreview(cleaner.profilePicture || '');
    }
  }, [cleaner]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSkillChange = (e) => {
    const options = e.target.options;
    const selectedSkills = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedSkills.push(options[i].value);
      }
    }
    setFormData(prev => ({
      ...prev,
      cleanerProfile: {
        ...prev.cleanerProfile,
        skills: selectedSkills
      }
    }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setProfilePicturePreview(URL.createObjectURL(file));
    }
  };

  const formatSkillName = (skill) => {
    return skill
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Append all fields directly to FormData
      formDataToSend.append('name', formData.name);
      formDataToSend.append('phoneNumber', formData.phoneNumber);
      formDataToSend.append('address[street]', formData.address.street);
      formDataToSend.append('address[city]', formData.address.city);
      formDataToSend.append('cleanerProfile[bio]', formData.cleanerProfile.bio);
      
      // Append each skill individually
      formData.cleanerProfile.skills.forEach((skill, index) => {
        formDataToSend.append(`cleanerProfile[skills][${index}]`, skill);
      });
      
      // Append profile picture if exists
      if (profilePicture) {
        formDataToSend.append('profilePicture', profilePicture);
      }
  
      const updatedCleaner = await updateCleanerProfile(formDataToSend);
      
      // Update local state with the new data
      setFormData({
        name: updatedCleaner.name,
        phoneNumber: updatedCleaner.phoneNumber,
        address: {
          street: updatedCleaner.address.street,
          city: updatedCleaner.address.city,
          country: 'Jordan'
        },
        cleanerProfile: {
          bio: updatedCleaner.cleanerProfile.bio,
          skills: updatedCleaner.cleanerProfile.skills
        }
      });
  
      if (updatedCleaner.profilePicture) {
        setProfilePicturePreview(updatedCleaner.profilePicture);
      }
  
      toast.success('Profile updated successfully');
      onProfileUpdate(updatedCleaner); // Notify parent component
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 rounded-xl shadow p-6">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-gray-500">Loading profile information...</p>
          </div>
        </div>
      ) : cleaner ? (
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column - Profile Picture & Basic Info */}
          <div className="md:w-1/3 flex flex-col items-center">
            <div className="relative mb-6">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
                {profilePicturePreview ? (
                  <img 
                    src={profilePicturePreview} 
                    alt="Cleaner Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={64} className="text-blue-300" />
                )}
              </div>
              {isEditing && (
                <div className="absolute bottom-0 right-0 transform translate-x-1/4">
                  <label className="cursor-pointer flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-colors">
                    <Upload size={18} />
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleProfilePictureChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Cleaner Info */}
            <div className="text-center w-full">
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="text-2xl font-bold text-gray-800 text-center bg-white border border-gray-200 rounded-lg px-3 py-2 mb-3 w-full shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-300 focus:outline-none transition-all"
                  required
                />
              ) : (
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{cleaner?.name}</h2>
              )}
              
              {/* Active Status (read-only) */}
              <div className={`mt-2 inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium shadow-sm ${
                cleaner?.cleanerProfile?.isActive 
                  ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800' 
                  : 'bg-gradient-to-r from-red-100 to-red-200 text-red-800'
              }`}>
                {cleaner?.cleanerProfile?.isActive ? (
                  <>
                    <Check size={16} className="mr-1.5" />
                    Active
                  </>
                ) : (
                  <>
                    <X size={16} className="mr-1.5" />
                    Inactive
                  </>
                )}
              </div>

              {/* Member Since */}
              <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
                <Calendar size={14} className="mr-1.5" />
                <span>Member since {new Date(cleaner.createdAt).toLocaleDateString()}</span>
              </div>

              {/* Edit Profile Button moved here and centered */}
              {!isEditing ? (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Settings size={16} />
                    <span>Edit Profile</span>
                  </button>
                </div>
              ) : (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <Info size={14} className="inline mr-1" />
                    Update your profile information to appear in search results
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Detailed Info */}
          <div className="md:w-2/3">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-3 mb-4">
                    Contact Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <Mail size={18} className="text-gray-400" />
                        <span className="text-gray-800">{cleaner.email}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <div className="relative">
                        <Phone size={18} className="absolute left-3 top-3 text-gray-400" />
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className="w-full bg-white rounded-lg border border-gray-200 pl-10 pr-3 py-2.5 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 focus:outline-none transition-all"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
                    <MapPin size={18} className="text-blue-500" />
                    Address Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                      <input
                        type="text"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleInputChange}
                        className="w-full bg-white rounded-lg border border-gray-200 px-3 py-2.5 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 focus:outline-none transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleInputChange}
                        className="w-full bg-white rounded-lg border border-gray-200 px-3 py-2.5 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 focus:outline-none transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <span className="text-gray-800">Jordan</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cleaner Specific Info */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
                    <Award size={18} className="text-blue-500" />
                    Professional Information
                  </h3>
                  <div className="space-y-6">
                    {/* Bio */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">About Me</label>
                      <textarea
                        name="cleanerProfile.bio"
                        value={formData.cleanerProfile.bio}
                        onChange={handleInputChange}
                        className="w-full bg-white rounded-lg border border-gray-200 px-3 py-2.5 h-32 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 focus:outline-none transition-all"
                        placeholder="Tell clients about your cleaning experience, specialties, and why they should choose you"
                      />
                    </div>

                    {/* Skills */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Specialties</label>
                      <select
                        multiple
                        value={formData.cleanerProfile.skills}
                        onChange={handleSkillChange}
                        className="w-full bg-white rounded-lg border border-gray-200 px-3 py-2.5 h-auto min-h-[120px] focus:ring-2 focus:ring-blue-300 focus:border-blue-300 focus:outline-none transition-all"
                      >
                        {SKILLS_OPTIONS.map(skill => (
                          <option key={skill} value={skill} className="py-1">
                            {formatSkillName(skill)}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-2 flex items-center">
                        <Info size={12} className="mr-1" />
                        Hold Ctrl/Cmd to select multiple specialties
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-8 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setProfilePicture(null);
                      setProfilePicturePreview(cleaner.profilePicture || '');
                    }}
                    className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2"
                  >
                    <X size={18} />
                    <span>Cancel</span>
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md flex items-center gap-2"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check size={18} />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-3 mb-4">
                    Contact Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Email Address</h4>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Mail size={18} className="text-blue-500" />
                        <span className="text-gray-800 font-medium">{cleaner.email}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Phone Number</h4>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Phone size={18} className="text-blue-500" />
                        <span className="text-gray-800 font-medium">
                          {cleaner.phoneNumber || 'Not provided'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
                    <MapPin size={18} className="text-blue-500" />
                    Address Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Street Address</h4>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-800">
                          {cleaner.address?.street || 'Not provided'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">City</h4>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-800">
                          {cleaner.address?.city || 'Not provided'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Country</h4>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-800">
                          {cleaner.address?.country || 'Jordan'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cleaner Specific Info */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
                    <Award size={18} className="text-blue-500" />
                    Professional Information
                  </h3>
                  <div className="space-y-6">
                    {/* Bio */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">About Me</h4>
                      <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-400">
                        <p className="text-gray-700 italic">
                          {cleaner.cleanerProfile?.bio || 'No bio provided'}
                        </p>
                      </div>
                    </div>

                    {/* Skills */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Specialties</h4>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex flex-wrap gap-2">
                          {cleaner.cleanerProfile?.skills?.length > 0 ? (
                            cleaner.cleanerProfile.skills.map((skill, index) => (
                              <span 
                                key={index} 
                                className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm flex items-center"
                              >
                                <Check size={14} className="mr-1 text-blue-500" />
                                {formatSkillName(skill)}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500">No specialties listed</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <User size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">Failed to load profile data</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            Refresh Page
          </button>
        </div>
      )}
    </div>
  );
}