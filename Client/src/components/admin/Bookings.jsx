import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookingsFilters from './bookings/BookingsFilters';
import AssignCleanerModal from './bookings/AssignCleanerModal';
import { 
  Calendar, 
  User, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  CheckCircle, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { format } from 'date-fns';
import { toast, Toaster } from 'sonner';


axios.defaults.withCredentials = true;

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [cleaners, setCleaners] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Filters
  const [filters, setFilters] = useState({
    status: '',
    dateRange: null, 
  });

  // Modal
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedCleaner, setSelectedCleaner] = useState(null);
  const [cleanerNotes, setCleanerNotes] = useState('');

  // Endpoints
  const BASE_URL = 'http://localhost:8000/api/admin/bookings';
  const CLEANERS_URL = 'http://localhost:8000/api/admin/bookings/cleaners';

  // ============ FETCHERS ============
  const fetchBookings = async (opts = {}) => {
    setLoading(true);
    const {
      page = pagination.current,
      limit = pagination.pageSize,
      status = filters.status,
      dateRange = filters.dateRange,
    } = opts;

    try {
      const params = { page, limit };
      if (status) params.status = status;
      if (dateRange && dateRange[0] && dateRange[1]) {
        params.startDate = dateRange[0];
        params.endDate = dateRange[1];
      }

      const response = await axios.get(BASE_URL, { params });
      const { data, total, message } = response.data;
      setBookings(data || []);
      setPagination((prev) => ({
        ...prev,
        current: page,
        pageSize: limit,
        total: total || 0,
      }));
    // If the server sent a message, toast it
    if (message) {
      toast.success(message);
    }
  } catch (error) {
    // Show server error if present
    const errMsg = error.response?.data?.message || 'Failed to fetch bookings';
    toast.error(errMsg);
    console.error('Error fetching bookings:', error);
  } finally {
    setLoading(false);
  }
};

  const fetchCleaners = async () => {
    try {
      const response = await axios.get(CLEANERS_URL);
      setCleaners(response.data.data || []);
      // If there's a message from the server, show it
      if (response.data.message) {
        toast.success(response.data.message);
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to fetch cleaners';
      toast.error(errMsg);
      console.error('Error fetching cleaners:', error);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchCleaners();
    // eslint-disable-next-line
  }, []);

  // ============ ACTIONS ============
  const handlePageChange = (pageNumber) => {
    fetchBookings({ page: pageNumber });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // re-fetch with new filters
    fetchBookings({
      status: newFilters.status,
      dateRange: newFilters.dateRange,
    });
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const response = await axios.put(`${BASE_URL}/${bookingId}`);
      const canceledBooking = response.data.data;
      const successMsg = response.data.message || 'Booking canceled successfully!';

      // Update the local state
      const updated = bookings.map((b) =>
        b._id === bookingId ? canceledBooking : b
      );
      setBookings(updated);
    // Display success from the server
    toast.success(successMsg);
  } catch (error) {
    const errMsg = error.response?.data?.message || 'Failed to cancel booking';
    toast.error(errMsg);
    console.error('Failed to cancel booking:', error);
  }
};

const handleAssignCleaner = async () => {
  if (!selectedBooking || !selectedCleaner) {
    toast.error('Please select a cleaner first');
    return;
  }

  try {
    const response = await axios.put(
      `${BASE_URL}/${selectedBooking._id}/assign-cleaner`,
      {
        cleanerId: selectedCleaner,
        cleanerNotes,
      }
    );
    const updatedBooking = response.data.data;
    const successMsg = response.data.message || 'Cleaner assigned successfully!';

    // Update local bookings array
    const updated = bookings.map((b) =>
      b._id === updatedBooking._id ? updatedBooking : b
    );
    setBookings(updated);

    // close modal
    setAssignModalVisible(false);
    // show server success if available
    toast.success(successMsg);
  } catch (error) {
    const errMsg = error.response?.data?.message || 'Failed to assign cleaner';
    toast.error(errMsg);
    console.error('Failed to assign cleaner:', error);
  }
};

  // ============ RENDER HELPERS ============
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} />;
      case 'confirmed':
      case 'pending':
        return <Clock size={16} />;
      case 'canceled':
        return <X size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-600';
      case 'confirmed':
        return 'bg-blue-100 text-blue-600';
      case 'pending':
        return 'bg-amber-100 text-amber-600';
      case 'canceled':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const formatDate = (d) => {
    if (!d) return 'N/A';
    return format(new Date(d), 'dd.MM.yyyy - h:mm a');
  };

  // ============ UI ============
  return (

    <>
      {/* Sonner Toaster Provider */}
      <Toaster position="top-right" richColors expand={false} />

    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Calendar className="text-blue-600 mr-3" size={24} />
          <h1 className="text-2xl font-bold text-gray-800">Bookings Management</h1>
        </div>
      </div>

      {/* Filters */}
      <BookingsFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left">Booking ID</th>
                    <th className="px-6 py-3 text-left">Customer</th>
                    <th className="px-6 py-3 text-left">Service</th>
                    <th className="px-6 py-3 text-left">Date & Time</th>
                    <th className="px-6 py-3 text-left">Location</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Cleaner</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium">
                        #{booking._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                            <User size={16} />
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">{booking.user.name}</div>
                            <div className="text-xs text-gray-500">{booking.user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{booking.service.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div>{formatDate(booking.date)}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {booking.location.street}, {booking.location.city}, {booking.location.country}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          <span className="ml-1 capitalize">{booking.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {booking.assignedCleaner ? (
                          <div className="font-medium">{booking.assignedCleaner.name}</div>
                        ) : (
                          <span className="text-gray-400">Not assigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {['pending', 'confirmed'].includes(booking.status) && (
                            <>
                              <button
                                className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors cursor-pointer"
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setCleanerNotes('');
                                  setSelectedCleaner(booking.assignedCleaner?._id || null);
                                  setAssignModalVisible(true);
                                }}
                              >
                                {booking.assignedCleaner ? 'Reassign' : 'Assign'}
                              </button>
                              <button
                                className="px-3 py-1.5 bg-red-50 text-red-600 text-sm rounded hover:bg-red-100 transition-colors hover:cursor-pointer"
                                onClick={() => handleCancelBooking(booking._id)}
                              >
                                Cancel
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.total > pagination.pageSize && (
              <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Showing {((pagination.current - 1) * pagination.pageSize) + 1} to {Math.min(pagination.current * pagination.pageSize, pagination.total)} of {pagination.total} bookings
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
          </>
        )}
      </div>

      {/* Assign Cleaner Modal */}
      <AssignCleanerModal
        visible={assignModalVisible}
        booking={selectedBooking}
        cleaners={cleaners}
        selectedCleaner={selectedCleaner}
        cleanerNotes={cleanerNotes}
        onClose={() => setAssignModalVisible(false)}
        onSelectCleaner={setSelectedCleaner}
        onChangeNotes={setCleanerNotes}
        onConfirm={handleAssignCleaner}
      />
    </div>
    </>
  );
}

export default Bookings;
