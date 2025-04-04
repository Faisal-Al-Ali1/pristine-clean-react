import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, LifeBuoy, Grid } from 'lucide-react';

const PaymentError = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const message = params.get('message') || 'An error occurred during payment processing';

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-red-50 border border-red-100 shadow-sm text-red-700 px-6 py-4 rounded-lg mb-6 flex items-center">
          <AlertCircle className="text-red-500 mr-3 w-6 h-6" />
          <div>
            <h3 className="font-semibold text-red-800">Payment Error</h3>
            <p className="text-red-700 text-sm">{message}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">We encountered an issue with your payment</h1>
            <p className="text-gray-600">Your payment could not be processed successfully. Please contact our support team for assistance.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <button
              onClick={() => navigate('/contactUs')}
              className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <LifeBuoy className="w-4 h-4 mr-2" />
              Contact Support
            </button>
            
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

export default PaymentError;