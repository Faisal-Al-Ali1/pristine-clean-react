import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, Loader, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import BookingSuccess from './BookingSuccess';

// Configure Axios
axios.defaults.withCredentials = true;

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const bookingId = params.get('bookingId');
        
        if (!bookingId) {
          throw new Error('No booking ID provided');
        }

        const response = await axios.get(`http://localhost:8000/api/bookings/${bookingId}`);
        setBooking(response.data.data);
        
        // Show a success toast when payment is verified
        toast.success('Payment confirmed!', {
          description: 'Your payment has been processed successfully.'
        });
      } catch (error) {
        console.error('Error fetching booking:', error);
        setError('Failed to load booking details');
        
        // Show error toast
        toast.error('Payment verification failed', {
          description: error.message || 'Could not retrieve booking details'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [location.search, navigate]);

  // Handle navigation to error page
  useEffect(() => {
    if (error && !loading) {
      navigate('/payment-error', {
        state: { message: error }
      });
    }
  }, [error, loading, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <div className="flex justify-center mb-6">
            <Loader className="animate-spin text-blue-500 w-12 h-12" />
          </div>
          <h1 className="text-2xl font-bold mb-2 text-gray-800">Verifying your payment</h1>
          <p className="text-gray-600">Just a moment while we confirm your transaction...</p>
        </div>
      </div>
    );
  }

  return booking ? (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-green-50 border border-green-100 shadow-sm text-green-700 px-6 py-4 rounded-lg mb-6 flex items-center">
          <CheckCircle className="text-green-500 mr-3 w-6 h-6" />
          <div>
            <h3 className="font-semibold text-green-800">Payment Successful</h3>
            <p className="text-green-700 text-sm">Your transaction has been completed successfully.</p>
          </div>
        </div>
        <BookingSuccess booking={booking} />
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
        <div className="bg-yellow-50 p-4 rounded-lg mb-6">
          <AlertTriangle className="text-yellow-500 w-10 h-10 mx-auto" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Payment Processed</h2>
        <p className="mt-3 text-gray-600">Your payment was successful, but we're still retrieving your booking details.</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;