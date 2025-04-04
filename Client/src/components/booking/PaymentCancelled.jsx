import { useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, Grid } from 'lucide-react';

const PaymentCancelled = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const bookingId = params.get('bookingId');
  const message = params.get('message') || 'Payment was cancelled';

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-100 shadow-sm text-yellow-700 px-6 py-4 rounded-lg mb-6 flex items-center">
          <AlertTriangle className="text-yellow-500 mr-3 w-6 h-6" />
          <div>
            <h3 className="font-semibold text-yellow-800">Payment Cancelled</h3>
            <p className="text-yellow-700 text-sm">{message}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Your payment was not completed</h1>
            <p className="text-gray-600">No charges were made to your account. You can return to booking or browse other services.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            {bookingId && (
              <button
                onClick={() => navigate('/bookingPage')}
                className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return to Booking
              </button>
            )}
            
            <button
              onClick={() => navigate('/services')}
              className="px-5 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center"
            >
              <Grid className="w-4 h-4 mr-2" />
              Browse Services
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelled;