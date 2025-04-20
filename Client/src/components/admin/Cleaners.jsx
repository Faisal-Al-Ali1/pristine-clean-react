import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Users, Search, Plus, Star, Calendar, ChevronDown,
  ChevronRight, ChevronLeft, Filter, Edit2, Trash2,
  MapPin, Phone, Mail, Check, Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { toast, Toaster } from 'sonner';
import CreateCleanerModal from './cleaners/CreateCleanerModal';
import UpdateCleanerModal from './cleaners/UpdateCleanerModal';
import CleanersFilters from './cleaners/CleanersFilters';

axios.defaults.withCredentials = true;

function Cleaners() {
  // State management
  const [cleaners, setCleaners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedCleaner, setExpandedCleaner] = useState(null);
  const [cleanerBookings, setCleanerBookings] = useState({});
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [currentCleaner, setCurrentCleaner] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [togglingCleaner, setTogglingCleaner] = useState(null);

  // Pagination
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  // API endpoints
  const BASE_URL = 'http://localhost:8000/api/admin/bookings/cleaners';
  const CLEANER_URL = 'http://localhost:8000/api/admin/bookings/cleaner';

  // Fetch cleaners on component mount
  useEffect(() => {
    fetchCleaners();
  }, [filterStatus, searchQuery]);

  // Fetch cleaners from API
  const fetchCleaners = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: pagination.pageSize,
        ...(filterStatus !== 'all' && { isActive: filterStatus }),
        ...(searchQuery && { search: searchQuery })
      };

      const response = await axios.get(BASE_URL, { params });
      const { data, total, message } = response.data;

      setCleaners(data || []);
      setPagination(prev => ({
        ...prev,
        current: page,
        total: total || 0
      }));

      if (message) toast.success(message);
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to fetch cleaners';
      toast.error(errMsg);
      console.error('Error fetching cleaners:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch bookings for a specific cleaner
  const fetchCleanerBookings = async (cleanerId) => {
    if (cleanerBookings[cleanerId]) return;

    try {
      const response = await axios.get(`${CLEANER_URL}/${cleanerId}`);
      setCleanerBookings(prev => ({
        ...prev,
        [cleanerId]: response.data.data || []
      }));
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to fetch cleaner bookings';
      toast.error(errMsg);
      console.error('Error fetching cleaner bookings:', error);
    }
  };

  // Toggle cleaner expanded view
  const toggleCleanerExpand = (cleanerId) => {
    if (expandedCleaner === cleanerId) {
      setExpandedCleaner(null);
    } else {
      setExpandedCleaner(cleanerId);
      fetchCleanerBookings(cleanerId);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      fetchCleaners(1);
    }
  };

  // Handle filter change
  const handleFilterChange = (status) => {
    setFilterStatus(status);
    fetchCleaners(1);
  };

  // Handle page change
  const handlePageChange = (page) => {
    fetchCleaners(page);
  };

  // Toggle cleaner active state
  const handleCleanerState = async (cleanerId) => {
    const cleaner = cleaners.find(c => c._id === cleanerId);
    const isCurrentlyActive = cleaner?.cleanerProfile?.isActive;

    const action = isCurrentlyActive ? 'deactivate' : 'activate';

    // Show confirmation toast
    toast.custom((t) => (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-full max-w-md">
        <h3 className="font-medium text-gray-800 mb-2">
          {`${action.charAt(0).toUpperCase() + action.slice(1)} Cleaner`}
        </h3>
        <p className="text-gray-600 mb-4">
          {`Are you sure you want to ${action} ${cleaner.name}?`}
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => toast.dismiss(t)}
            className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg hover:cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t);
              setTogglingCleaner(cleanerId);

              try {
                const endpoint = `${CLEANER_URL}/${cleanerId}/${action}`;
                await axios.put(endpoint);

                fetchCleaners(pagination.current);
                toast.success(`Cleaner ${action}d successfully`);
              } catch (error) {
                const errMsg = error.response?.data?.message || `Failed to ${action} cleaner`;
                toast.error(errMsg);
                console.error(`Failed to ${action} cleaner:`, error);
              } finally {
                setTogglingCleaner(null);
              }
            }}
            className="px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg hover:cursor-pointer"
          >
            Confirm
          </button>
        </div>
      </div>
    ));
  };

  // Render helper for availability status
  const renderAvailabilityStatus = (cleaner) => {
    const isActive = cleaner.cleanerProfile?.isActive;
    const status = isActive ? 'Active' : 'Inactive';
    const statusClass = isActive
      ? 'bg-green-100 text-green-600'
      : 'bg-red-100 text-red-600';

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusClass}`}>
        {status}
      </span>
    );
  };

  // Format date helper
  const formatDate = (d) => {
    if (!d) return 'N/A';
    return format(new Date(d), 'dd.MM.yyyy - h:mm a');
  };

  // Render booking status
  const getBookingStatusStyle = (status) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-600';
      case 'confirmed': return 'bg-blue-100 text-blue-600';
      case 'pending': return 'bg-amber-100 text-amber-600';
      case 'canceled': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <>
      <Toaster position="top-right" richColors expand={false} />

      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Users className="text-blue-600 mr-3" size={24} />
            <h1 className="text-2xl font-bold text-gray-800">Cleaners Management</h1>
          </div>
          <button
            onClick={() => setCreateModalVisible(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors hover:cursor-pointer"
          >
            <Plus size={18} className="mr-2" />
            Add New Cleaner
          </button>
        </div>

        {/* Filters & Search */}
        <div className="relative flex-grow max-w-md mb-6">
          <input
            type="text"
            placeholder="Search cleaners..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
          <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
        </div>

        {/* Filters */}
        <CleanersFilters
          filters={{ status: filterStatus }}
          onFilterChange={(newFilters) => handleFilterChange(newFilters.status)}
        />

        {/* Cleaners List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {cleaners.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No cleaners found.
                </div>
              ) : (
                cleaners.map((cleaner) => (
                  <div key={cleaner._id} className="flex flex-col">
                    {/* Cleaner Info Row */}
                    <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                      <div className="flex items-center flex-grow">
                        <button
                          className="p-1 mr-2 text-gray-500 hover:bg-gray-100 rounded-full hover:cursor-pointer"
                          onClick={() => toggleCleanerExpand(cleaner._id)}
                        >
                          {expandedCleaner === cleaner._id ?
                            <ChevronDown size={18} /> :
                            <ChevronRight size={18} />
                          }
                        </button>

                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                          {cleaner.profilePicture ? (
                            <img
                              src={cleaner.profilePicture}
                              alt={cleaner.name}
                              className="h-12 w-12 rounded-full object-cover"
                            />
                          ) : (
                            cleaner.name.split(' ').map(n => n[0]).join('').toUpperCase()
                          )}
                        </div>

                        <div className="min-w-0 flex-grow">
                          <h3 className="font-medium text-gray-800">{cleaner.name}</h3>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <Mail size={14} className="mr-1" />
                            {cleaner.email}
                            <span className="mx-2">•</span>
                            <Phone size={14} className="mr-1" />
                            {cleaner.phoneNumber || 'N/A'}
                          </div>
                        </div>

                        <div className="px-4 flex items-center">
                          <MapPin size={16} className="text-gray-400 mr-1" />
                          <span className="text-sm text-gray-600">{cleaner.address?.city || 'N/A'}</span>
                        </div>

                        <div className="px-4">
                          {renderAvailabilityStatus(cleaner)}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setCurrentCleaner(cleaner);
                            setUpdateModalVisible(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                        >
                          <Edit2 size={16} className='hover:cursor-pointer' />
                        </button>

                        <button
                          onClick={() => handleCleanerState(cleaner._id)}
                          disabled={togglingCleaner === cleaner._id}
                          className={`p-2 rounded-full ${cleaner.cleanerProfile?.isActive
                              ? 'text-red-600 hover:bg-red-50'
                              : 'text-green-600 hover:bg-green-50'
                            } ${togglingCleaner === cleaner._id ? 'opacity-50 cursor-wait' : ''}`}
                          title={cleaner.cleanerProfile?.isActive ? 'Deactivate cleaner' : 'Activate cleaner'}
                        >
                          {togglingCleaner === cleaner._id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : cleaner.cleanerProfile?.isActive ? (
                            <Trash2 size={16} className='hover:cursor-pointer' />
                          ) : (
                            <Check size={16} className='hover:cursor-pointer' />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expanded View with Bookings */}
                    {expandedCleaner === cleaner._id && (
                      <div className="bg-gray-50 pl-16 pr-4 py-4 border-t border-gray-100">
                        <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                          <Calendar size={16} className="mr-2 text-blue-600" />
                          Assigned Bookings
                        </h4>

                        {!cleanerBookings[cleaner._id] ? (
                          <div className="py-3 flex justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                          </div>
                        ) : cleanerBookings[cleaner._id].length === 0 ? (
                          <div className="py-3 text-center text-gray-500 text-sm">
                            No bookings assigned to this cleaner.
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                              <thead className="bg-gray-100 text-xs uppercase text-gray-600">
                                <tr>
                                  <th className="px-3 py-2 text-left">Booking ID</th>
                                  <th className="px-3 py-2 text-left">Customer</th>
                                  <th className="px-3 py-2 text-left">Service</th>
                                  <th className="px-3 py-2 text-left">Date & Time</th>
                                  <th className="px-3 py-2 text-left">Location</th>
                                  <th className="px-3 py-2 text-left">Status</th>
                                  <th className="px-3 py-2 text-left">Notes</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                {cleanerBookings[cleaner._id].map((booking) => (
                                  <tr key={booking._id} className="hover:bg-gray-100">
                                    <td className="px-3 py-2 font-medium">
                                      #{booking._id.slice(-6).toUpperCase()}
                                    </td>
                                    <td className="px-3 py-2">{booking.user?.name || 'N/A'}</td>
                                    <td className="px-3 py-2">{booking.service?.name || 'N/A'}</td>
                                    <td className="px-3 py-2">{formatDate(booking.date)}</td>
                                    <td className="px-3 py-2">
                                      {booking.location?.street && `${booking.location.street}, ${booking.location.city}` || 'N/A'}
                                    </td>
                                    <td className="px-3 py-2">
                                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getBookingStatusStyle(booking.status)}`}>
                                        {booking.status || 'N/A'}
                                      </span>
                                    </td>
                                    <td className="px-3 py-2 max-w-xs truncate">
                                      {booking.cleanerNotes || 'No notes'}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                        <div className="mt-3 border-t border-gray-200 pt-3">
                          <h4 className="font-medium text-gray-700 mb-2">Additional Information</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Bio</p>
                              <p className="mt-1 text-sm">
                                {cleaner.cleanerProfile?.bio || 'No bio provided'}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500">Skills</p>
                              <div className="mt-1 flex flex-wrap gap-1">
                                {cleaner.cleanerProfile?.skills?.length ? (
                                  cleaner.cleanerProfile.skills.map((skill, index) => (
                                    <span key={index} className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs">
                                      {skill.replace('_', ' ')}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-gray-400">No skills listed</span>
                                )}
                              </div>
                            </div>
                            <div>
                              <p className="text-gray-500">Member Since</p>
                              <p className="mt-1">{format(new Date(cleaner.createdAt || new Date()), 'dd MMM yyyy')}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Stats</p>
                              <div className="mt-1 flex gap-4">
                                <span className="text-sm">
                                  Assigned: {cleaner.stats?.assignedBookings || 0}
                                </span>
                                <span className="text-sm">
                                  Completed: {cleaner.stats?.completedBookings || 0}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Pagination */}
          {pagination.total > pagination.pageSize && (
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Showing {((pagination.current - 1) * pagination.pageSize) + 1} to {Math.min(pagination.current * pagination.pageSize, pagination.total)} of {pagination.total} cleaners
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className={`p-2 rounded-md ${pagination.current === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                  disabled={pagination.current === 1}
                  onClick={() => handlePageChange(pagination.current - 1)}
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: Math.ceil(pagination.total / pagination.pageSize) }, (_, i) => i + 1)
                  .filter(page =>
                    page === 1 ||
                    page === Math.ceil(pagination.total / pagination.pageSize) ||
                    (page >= pagination.current - 1 && page <= pagination.current + 1)
                  )
                  .map((page, index, array) => (
                    <React.Fragment key={page}>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="px-2 text-gray-400">...</span>
                      )}
                      <button
                        className={`px-3 py-1 rounded ${pagination.current === page ? 'bg-blue-100 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  ))
                }

                <button
                  className={`p-2 rounded-md ${pagination.current === Math.ceil(pagination.total / pagination.pageSize) ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                  disabled={pagination.current === Math.ceil(pagination.total / pagination.pageSize)}
                  onClick={() => handlePageChange(pagination.current + 1)}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateCleanerModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onSuccess={() => {
          fetchCleaners();
          setCreateModalVisible(false);
        }}
      />

      <UpdateCleanerModal
        visible={updateModalVisible}
        cleaner={currentCleaner}
        onClose={() => setUpdateModalVisible(false)}
        onSuccess={() => {
          fetchCleaners();
          setUpdateModalVisible(false);
        }}
      />
    </>
  );
}

export default Cleaners;