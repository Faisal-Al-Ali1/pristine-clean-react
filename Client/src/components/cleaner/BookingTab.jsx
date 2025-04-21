import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  Info,
  Loader2,
  ChevronLeft,
  ChevronRight,
  User,
  Home,
  Package
} from 'lucide-react';

export default function BookingsTab({
    bookings,
    loading,
    bookingFilter,
    handleFilterChange,
    handleCompleteBooking,
    updatingStatus,
    pagination,
    onPageChange
}) {
    const [expandedBookingId, setExpandedBookingId] = useState(null);

    const toggleBookingDetails = (bookingId) => {
        setExpandedBookingId(expandedBookingId === bookingId ? null : bookingId);
    };

    const formatBookingDateTime = (date, endTime) => {
        const bookingDate = new Date(date);
        const endDateTime = new Date(endTime);

        return (
            <div className="flex items-center">
                <div className="bg-blue-50 p-2 rounded-full mr-3">
                    <Calendar size={18} className="text-blue-600" />
                </div>
                <div>
                    <span className="font-medium">{bookingDate.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    })}</span>
                    <div className="text-sm text-gray-600 flex items-center mt-1">
                        <Clock size={14} className="mr-1 text-blue-500" />
                        <span>Expected completion by {endDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>
            </div>
        );
    };

    // Status badge color function
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'confirmed':
                return 'bg-blue-100 text-blue-800 border border-blue-200';
            case 'completed':
                return 'bg-green-100 text-green-800 border border-green-200';
            case 'canceled':
                return 'bg-red-100 text-red-800 border border-red-200';
            default: // pending
                return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            {/* Filter Tabs */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">My Bookings</h2>
                <div className="flex flex-wrap gap-2 bg-gray-50 p-2 rounded-lg shadow-sm">
                    <button
                        className={`flex items-center px-4 py-2 rounded-md transition-all ${
                            bookingFilter === 'pending' 
                                ? 'bg-blue-600 text-white shadow-md' 
                                : 'bg-white text-gray-700 border hover:bg-gray-100'
                        } hover:cursor-pointer`}
                        onClick={() => handleFilterChange('pending')}
                    >
                        <Clock size={16} className="mr-2" />
                        Pending
                    </button>
                    <button
                        className={`flex items-center px-4 py-2 rounded-md transition-all ${
                            bookingFilter === 'confirmed' 
                                ? 'bg-blue-600 text-white shadow-md' 
                                : 'bg-white text-gray-700 border hover:bg-gray-100'
                        } hover:cursor-pointer`}
                        onClick={() => handleFilterChange('confirmed')}
                    >
                        <CheckCircle size={16} className="mr-2" />
                        Confirmed
                    </button>
                    <button
                        className={`flex items-center px-4 py-2 rounded-md transition-all ${
                            bookingFilter === 'completed' 
                                ? 'bg-blue-600 text-white shadow-md' 
                                : 'bg-white text-gray-700 border hover:bg-gray-100'
                        } hover:cursor-pointer`}
                        onClick={() => handleFilterChange('completed')}
                    >
                        <CheckCircle size={16} className="mr-2" />
                        Completed
                    </button>
                    <button
                        className={`flex items-center px-4 py-2 rounded-md transition-all ${
                            bookingFilter === 'canceled' 
                                ? 'bg-blue-600 text-white shadow-md' 
                                : 'bg-white text-gray-700 border hover:bg-gray-100'
                        } hover:cursor-pointer`}
                        onClick={() => handleFilterChange('canceled')}
                    >
                        <XCircle size={16} className="mr-2" />
                        Canceled
                    </button>
                </div>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <Loader2 className="h-10 w-10 animate-spin text-blue-500 mx-auto mb-4" />
                        <p className="text-gray-500">Loading your bookings...</p>
                    </div>
                </div>
            ) : bookings.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-100">
                    <Calendar size={64} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-600 font-medium text-lg mb-2">No bookings found</p>
                    <p className="text-gray-500 max-w-md mx-auto">
                        {bookingFilter === 'pending'
                            ? "You don't have any pending bookings at the moment."
                            : bookingFilter === 'confirmed'
                                ? "You don't have any confirmed bookings scheduled."
                                : bookingFilter === 'completed'
                                    ? "You haven't completed any bookings yet."
                                    : "You don't have any canceled bookings."}
                    </p>
                </div>
            ) : (
                <>
                    {/* Bookings Grid */}
                    <div className="grid gap-6">
                        {bookings.map(booking => (
                            <div 
                                key={booking._id} 
                                className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-300 ${
                                    expandedBookingId === booking._id 
                                        ? 'border-blue-200 shadow-md' 
                                        : 'hover:shadow-md border-gray-200'
                                }`}
                            >
                                {/* Card Header with Status Badge */}
                                <div className="p-5 flex justify-between items-start">
                                    {/* Customer Info */}
                                    <div className="flex items-start">
                                        <div className="bg-gray-100 h-12 w-12 rounded-full flex items-center justify-center mr-4">
                                            <User size={24} className="text-gray-500" />
                                        </div>
                                        <div>
                                            <div className="flex items-center mb-1">
                                                <h3 className="font-semibold text-lg">{booking.user?.name || 'Customer'}</h3>
                                                <span className={`ml-3 px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(booking.status)}`}>
                                                    {booking.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Package size={14} className="mr-1" />
                                                <span>{booking.service?.name || 'Service'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Price Badge */}
                                    <div className="flex flex-col items-end">
                                        <div className="bg-green-50 border border-green-200 text-green-800 px-3 py-1 rounded-md font-medium">
                                            ${booking.service?.basePrice || '0'}
                                        </div>
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="px-5 pb-5 pt-2">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {/* Date and Time */}
                                        <div className="md:col-span-2">
                                            {formatBookingDateTime(booking.date, booking.endTime)}
                                        </div>

                                        {/* Location */}
                                        <div className="flex items-center md:col-span-2">
                                            <div className="bg-blue-50 p-2 rounded-full mr-3">
                                                <Home size={18} className="text-blue-600" />
                                            </div>
                                            <span className="text-gray-700">
                                                {booking.location?.street && `${booking.location.street}, `}
                                                {booking.location?.city && `${booking.location.city}, `}
                                                {booking.location?.country || 'Location not provided'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Expanded Details Section */}
                                    {expandedBookingId === booking._id && (
                                        <div className="mt-6 bg-gray-50 rounded-lg p-5 border border-gray-100">
                                            <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                                                <Info size={18} className="mr-2 text-blue-500" />
                                                Booking Details
                                            </h4>
                                            
                                            <div className="grid gap-6 md:grid-cols-2">
                                                {/* Duration */}
                                                <div className="flex items-start bg-white p-4 rounded-lg shadow-sm">
                                                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                                                        <Clock size={18} className="text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500 mb-1">Duration</p>
                                                        <p className="font-medium text-gray-800">{booking.service?.estimatedDuration || 0} hours</p>
                                                    </div>
                                                </div>

                                                {/* Phone */}
                                                <div className="flex items-start bg-white p-4 rounded-lg shadow-sm">
                                                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                                                        <Phone size={18} className="text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500 mb-1">Contact Phone</p>
                                                        <p className="font-medium text-gray-800">{booking.contactInfo?.phone || 'Not provided'}</p>
                                                    </div>
                                                </div>

                                                {/* Email */}
                                                <div className="flex items-start bg-white p-4 rounded-lg shadow-sm">
                                                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                                                        <Mail size={18} className="text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500 mb-1">Contact Email</p>
                                                        <p className="font-medium text-gray-800 break-all">{booking.contactInfo?.email || 'Not provided'}</p>
                                                    </div>
                                                </div>

                                                {/* Frequency */}
                                                <div className="flex items-start bg-white p-4 rounded-lg shadow-sm">
                                                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                                                        <Calendar size={18} className="text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500 mb-1">Frequency</p>
                                                        <p className="font-medium text-gray-800 capitalize">{booking.frequency || 'Once'}</p>
                                                    </div>
                                                </div>

                                                {/* Special Instructions */}
                                                <div className="md:col-span-2 bg-white p-4 rounded-lg shadow-sm">
                                                    <p className="text-sm text-gray-500 mb-2">Special Instructions</p>
                                                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                                                        <p className="text-yellow-800">{booking.specialInstructions || 'None provided'}</p>
                                                    </div>
                                                </div>

                                                {/* Cleaner Notes */}
                                                <div className="md:col-span-2 bg-white p-4 rounded-lg shadow-sm">
                                                    <p className="text-sm text-gray-500 mb-2">Cleaner Notes</p>
                                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                                        <p className="text-blue-800">{booking.cleanerNotes || 'None added'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Card Actions */}
                                    <div className="mt-5 flex justify-end space-x-3">
                                        <button
                                            className={`flex items-center px-4 py-2 rounded-md text-sm transition-all ${
                                                expandedBookingId === booking._id
                                                    ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                            } hover:cursor-pointer`}
                                            onClick={() => toggleBookingDetails(booking._id)}
                                        >
                                            {expandedBookingId === booking._id ? (
                                                <>
                                                    <ChevronUp size={16} className="mr-1" />
                                                    Hide Details
                                                </>
                                            ) : (
                                                <>
                                                    <ChevronDown size={16} className="mr-1" />
                                                    View Details
                                                </>
                                            )}
                                        </button>
                                        
                                        {booking.status === 'confirmed' && (
                                            <button
                                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm flex items-center transition-all shadow-sm hover:cursor-pointer"
                                                onClick={() => handleCompleteBooking(booking._id)}
                                                disabled={updatingStatus}
                                            >
                                                {updatingStatus ? (
                                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                ) : (
                                                    <CheckCircle size={16} className="mr-2" />
                                                )}
                                                Mark Complete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    <div className="mt-8 flex flex-wrap justify-between items-center bg-white p-4 rounded-lg shadow-sm border">
                        <div className="text-sm text-gray-600 mb-4 md:mb-0">
                            Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                            {pagination.total} bookings
                        </div>

                        <div className="flex space-x-2">
                            <button
                                onClick={() => onPageChange(pagination.page - 1)}
                                disabled={!pagination.hasPreviousPage}
                                className={`flex items-center px-4 py-2 rounded-md ${
                                    pagination.hasPreviousPage 
                                        ? 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700' 
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                } hover:cursor-pointer`}
                            >
                                <ChevronLeft size={16} className="mr-1" />
                                Previous
                            </button>

                            <div className="flex items-center px-4 py-2 bg-gray-50 rounded-md border">
                                Page {pagination.page} of {pagination.totalPages}
                            </div>

                            <button
                                onClick={() => onPageChange(pagination.page + 1)}
                                disabled={!pagination.hasNextPage}
                                className={`flex items-center px-4 py-2 rounded-md ${
                                    pagination.hasNextPage 
                                        ? 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700' 
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                } hover:cursor-pointer`}
                            >
                                Next
                                <ChevronRight size={16} className="ml-1" />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}