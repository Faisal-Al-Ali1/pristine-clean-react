import React from 'react';
import { User, Camera } from 'lucide-react';

const ProfileHeader = ({ user, onProfileImageChange }) => {
  return (
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
            onChange={onProfileImageChange}
            accept="image/*"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;