import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, CreditCard, Hash, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const BookingSuccess = ({ booking }) => {
  const navigate = useNavigate();
  
  if (!booking) return null;

  const bookingDate = booking.date ? new Date(booking.date) : new Date();
  
  // Show a confirmation toast when component mounts
  React.useEffect(() => {
    toast.success('Booking confirmed successfully!', {
      description: `Your ${booking.service?.name || 'service'} has been booked.`
    });
  }, [booking]);

  const handleBookAnother = () => {
    navigate('/services');
  };

  return (
    <div className="max-w-2xl mx-auto p-8 flex flex-col items-center bg-white rounded-xl shadow-lg">
      <div className="bg-green-100 p-6 rounded-full mb-6">
        <CheckCircle className="text-green-500 w-16 h-16" />
      </div>
      
      <h1 className="text-3xl font-bold mb-3 text-gray-800">Booking Confirmed!</h1>
      <p className="text-gray-600 mb-8 max-w-md text-center">
        Thank you for your booking. We've sent the confirmation details to your email.
      </p>
      
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 w-full mb-8 shadow-sm">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Booking Details</h2>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="bg-blue-50 p-2 rounded-lg mr-4">
              <CheckCircle className="text-blue-500 w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Service</p>
              <p className="font-medium">{booking.service?.name || 'Unknown Service'}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="bg-blue-50 p-2 rounded-lg mr-4">
              <Calendar className="text-blue-500 w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium">{bookingDate.toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="bg-blue-50 p-2 rounded-lg mr-4">
              <Clock className="text-blue-500 w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Time</p>
              <p className="font-medium">{bookingDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="bg-blue-50 p-2 rounded-lg mr-4">
              <CreditCard className="text-blue-500 w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="font-medium">{booking.service?.basePrice || 0} {booking.service?.currency || 'USD'}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="bg-blue-50 p-2 rounded-lg mr-4">
              <Hash className="text-blue-500 w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Reference</p>
              <p className="font-medium font-mono">{booking._id}</p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleBookAnother}
        className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center font-medium shadow-md"
      >
        Book Another Service
        <ArrowRight className="ml-2 w-4 h-4" />
      </button>
    </div>
  );
};

export default BookingSuccess;