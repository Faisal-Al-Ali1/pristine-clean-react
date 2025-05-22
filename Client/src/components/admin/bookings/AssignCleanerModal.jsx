import React from 'react';
import { X, ChevronDown, User, Calendar, MapPin, Home, ClipboardList } from 'lucide-react';

function AssignCleanerModal({
  visible,
  booking,
  cleaners,
  selectedCleaner,
  cleanerNotes,
  onClose,
  onSelectCleaner,
  onChangeNotes,
  onConfirm
}) {
  if (!visible) return null;

  const renderCleanerOption = (cleaner) => {
    const skills = cleaner.cleanerProfile?.skills || [];
    return (
      <div className="py-2">
        <div className="font-medium text-gray-800">{cleaner.name}</div>
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
        {skills.length === 0 && (
          <span className="text-xs text-gray-400 italic">No skills specified</span>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-100">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              {booking?.assignedCleaner ? 'Reassign Cleaner' : 'Assign Cleaner'}
            </h3>
            <p className="text-sm text-gray-500 mt-1">Select the best cleaner for this booking</p>
          </div>
          <button
            className="text-gray-500 hover:bg-gray-100 p-1 rounded-full transition-colors"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {booking && (
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Home size={18} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">{booking.service?.name}</h4>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Calendar size={14} className="mr-1.5" />
                    {booking.date}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <User size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Customer</p>
                    <p className="font-medium text-sm">{booking.user?.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <MapPin size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="font-medium text-sm">
                      {booking.location.street}, {booking.location.city}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="flex items-center text-sm font-medium text-gray-700 gap-2">
              <User size={16} />
              Select Cleaner
            </label>
            <div className="relative">
              <select
                className="w-full p-3 pl-10 border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                value={selectedCleaner || ''}
                onChange={(e) => onSelectCleaner(e.target.value)}
              >
                <option value="">Select a cleaner</option>
                {cleaners.map((cleaner) => (
                  <option key={cleaner._id} value={cleaner._id}>
                    {cleaner.name}  
                  </option>
                ))}
              </select>
              <div className="absolute left-3 top-3.5 text-gray-400">
                <User size={16} />
              </div>
              <ChevronDown className="absolute right-3 top-3.5 text-gray-400" size={16} />
            </div>
          </div>

          {/* Display selected cleaner details with skills as tags */}
          {selectedCleaner && (
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <User size={16} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-blue-800">Selected Cleaner</h4>
                  <p className="text-sm text-blue-600 mt-1">
                    {cleaners.find((c) => c._id === selectedCleaner)?.name || 'Selected cleaner'}
                  </p>
                  {(() => {
                    const selectedCleanerData = cleaners.find((c) => c._id === selectedCleaner);
                    const skills = selectedCleanerData?.cleanerProfile?.skills || [];
                    return skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {skills.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-block px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded-full font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="flex items-center text-sm font-medium text-gray-700 gap-2">
              <ClipboardList size={16} />
              Cleaner Notes
            </label>
            <textarea
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-32 bg-gray-50"
              placeholder="Add special instructions, access codes, or specific requirements..."
              value={cleanerNotes}
              onChange={(e) => onChangeNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-end space-x-3 bg-gray-50 rounded-b-xl">
          <button
            className="px-5 py-2.5 bg-white text-gray-700 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200 font-medium"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed font-medium shadow-sm shadow-blue-100"
            disabled={!selectedCleaner}
            onClick={onConfirm}
          >
            {booking?.assignedCleaner ? 'Reassign' : 'Assign'} Cleaner
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssignCleanerModal;