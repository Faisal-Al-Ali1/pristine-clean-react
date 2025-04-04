import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import BookingCard from './BookingCard';

const UpcomingBookingsTab = ({ bookings, loading, onCancel, onEdit }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
        <Calendar size={20} className="text-blue-500" />
        Your Upcoming Bookings
      </h2>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-blue-50 rounded-lg p-6 text-center">
          <Clock size={40} className="text-blue-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-800">No upcoming bookings</h3>
          <p className="text-gray-600 mt-1">You don't have any services booked for the future.</p>
          <a href="/services" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Browse Services
          </a>
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
                isUpcoming={true}
                onCancel={onCancel}
                onEdit={onEdit}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UpcomingBookingsTab;