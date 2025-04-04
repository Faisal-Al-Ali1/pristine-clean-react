import React from 'react';
import { History } from 'lucide-react';
import BookingCard from './BookingCard';

const BookingHistoryTab = ({ bookings, loading, onReview }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
        <History size={20} className="text-blue-500" />
        Your Booking History
      </h2>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <History size={40} className="text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-800">No booking history</h3>
          <p className="text-gray-600 mt-1">You haven't completed or cancelled any bookings yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => {
            const bookingKey = `${booking._id}-${booking.status}-${booking.updatedAt || booking.createdAt}`;
            return (
              <BookingCard
                key={bookingKey}
                booking={{
                  ...booking,
                  serviceName: booking.service?.name,
                  price: booking.service?.basePrice,
                  location: `${booking.location?.street}, ${booking.location?.city}`
                }}
                isUpcoming={false}
                onReview={onReview}
                hasReview={booking.hasReview}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookingHistoryTab;