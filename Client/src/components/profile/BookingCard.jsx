import React from 'react';
import { toast } from 'sonner';

const BookingCard = ({
  booking,
  isUpcoming = false,
  onCancel,
  onEdit,
  onReview,
  hasReview = false
}) => {

  // Simplified date formatting - display exactly as stored in DB
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleCancelClick = () => {
    if (booking.status === 'completed') {
      toast.error('Completed bookings cannot be cancelled');
      return;
    }
    if (onCancel) {
      onCancel(booking._id);
    }
  };

  const handleEditClick = () => {
    if (onEdit) {
      onEdit(booking);
    }
  };

  const handleReviewClick = () => {
    if (onReview) {
      onReview(booking);
    }
  };

  // Determine if booking should be treated as upcoming based only on status
  const isBookingUpcoming = () => {
    return booking.status === 'confirmed' || booking.status === 'pending';
  };

  // Status display component
  const BookingStatus = () => {
    const statusConfig = {
      completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' },
      confirmed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Confirmed' },
      pending: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Pending' }
    };

    const config = statusConfig[booking.status?.toLowerCase()] ||
      { bg: 'bg-gray-100', text: 'text-gray-800', label: booking.status || 'Unknown' };

    return (
      <span className={`px-2 py-1 text-xs rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {booking.serviceName || 'Unknown Service'}
                </h3>
                <BookingStatus />
              </div>

              <p className="text-gray-600 mb-1">
                <span className="font-medium">Date:</span> {formatDate(booking.date)}
              </p>

              <p className="text-gray-600 mb-1">
                <span className="font-medium">Time:</span> {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
              </p>

              {booking.location && (
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Location:</span> {booking.location}
                </p>
              )}

              <p className="text-gray-600 mb-1">
                <span className="font-medium">Assigned Cleaner:</span> {booking.assignedCleaner?.name || 'N/A'}
              </p>

              <div className="mt-2">
                <p className="text-gray-700 font-medium">
                  {booking.price?.toFixed(2)} {booking.service?.currency || 'JOD'}
                </p>
              </div>
            </div>

            <div className="mt-4 sm:mt-0 flex sm:flex-col gap-2 justify-end">
              {isUpcoming && isBookingUpcoming() && (
                <>
                  <button
                    onClick={handleEditClick}
                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleCancelClick}
                    className="px-3 py-1.5 border border-red-300 text-red-600 text-sm rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              )}

              {!isUpcoming && !hasReview && booking.status === 'completed' && (
                <button
                  onClick={handleReviewClick}
                  className="px-3 py-1.5 bg-amber-500 text-white text-sm rounded-lg hover:bg-amber-600 transition-colors"
                >
                  Leave Review
                </button>
              )}

              {!isUpcoming && hasReview && (
                <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-800">
                  Review Submitted
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingCard;