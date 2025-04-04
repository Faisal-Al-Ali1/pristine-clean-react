import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ArrowLeft, 
  CreditCard, 
  Banknote, 
  Calendar, 
  Clock, 
  Repeat, 
  ChevronRight, 
  Loader2, 
  AlertCircle, 
  CheckCircle 
} from 'lucide-react';
import { ServiceIcon } from './ServiceSelection';

// Configure Axios
axios.defaults.withCredentials = true;

const PaymentStep = ({ booking, onBack, onPaymentSuccess }) => {
  const [safeBooking, setSafeBooking] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (booking) {
      setSafeBooking({
        ...booking,
        service: {
          name: booking.service?.name || 'Service',
          estimatedDuration: booking.service?.estimatedDuration || 0,
          basePrice: booking.service?.basePrice || 0,
          currency: booking.service?.currency || 'USD',
          ...booking.service
        },
        date: booking.date ? new Date(booking.date) : new Date()
      });
    }
  }, [booking]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:8000/api/payments', {
        bookingId: booking._id,
        paymentMethod,
        ...(paymentMethod === 'credit_card' && { cardDetails })
      });

      if (paymentMethod === 'paypal') {
        window.location.href = response.data.approvalUrl;
      } else {
        onPaymentSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!safeBooking) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
          <span className="text-gray-600">Loading payment details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Complete Your Booking</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <PaymentForm 
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            cardDetails={cardDetails}
            setCardDetails={setCardDetails}
            error={error}
            isProcessing={isProcessing}
            onSubmit={handleSubmit}
            onBack={onBack}
          />
        </div>

        <div className="md:col-span-1">
          <OrderSummary booking={safeBooking} />
        </div>
      </div>
    </div>
  );
};

const PaymentForm = ({ paymentMethod, setPaymentMethod, cardDetails, setCardDetails, error, isProcessing, onSubmit, onBack }) => (
  <form onSubmit={onSubmit} className="bg-white p-6 rounded-lg shadow-sm">
    <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Payment Method</h2>
    
    {error && (
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 shadow-sm">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle size={18} className="text-red-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    )}

    <div className="space-y-4">
      {/* Payment method options */}
      <PaymentOption 
        method="credit_card" 
        icon={<CreditCard className="text-indigo-500" size={18} />}
        label="Credit/Debit Card"
        active={paymentMethod === 'credit_card'}
        onClick={() => setPaymentMethod('credit_card')}
      >
        {paymentMethod === 'credit_card' && (
          <CardForm 
            cardDetails={cardDetails}
            setCardDetails={setCardDetails}
          />
        )}
      </PaymentOption>

      <PaymentOption 
        method="paypal" 
        icon={
          <svg width="16" height="16" viewBox="0 0 24 24" className="text-indigo-500">
            <path fill="currentColor" d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.542c-.013.076-.026.175-.041.254-.58 2.975-2.52 4.562-5.577 4.562h-1.256c-.524 0-.968.382-1.05.9l-1.263 8.12c-.06.377.213.723.592.723h3.727c.46 0 .85-.334.922-.788l.038-.227.732-4.634.047-.256a.93.93 0 0 1 .922-.788h.581c3.775 0 6.737-1.534 7.606-5.97.36-1.847.174-3.388-.783-4.354" />
          </svg>
        }
        label="PayPal"
        active={paymentMethod === 'paypal'}
        onClick={() => setPaymentMethod('paypal')}
      />

      <PaymentOption 
        method="cash" 
        icon={<Banknote className="text-indigo-500" size={18} />}
        label="Cash on Delivery"
        active={paymentMethod === 'cash'}
        onClick={() => setPaymentMethod('cash')}
      />
    </div>

    <div className="mt-6 flex justify-between">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
        disabled={isProcessing}
      >
        <ArrowLeft size={16} className="mr-2" />
        Back
      </button>
      <button
        type="submit"
        className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
        disabled={isProcessing}
      >
        {isProcessing ? (
          <span className="flex items-center">
            <Loader2 size={16} className="animate-spin mr-2" />
            Processing...
          </span>
        ) : (
          <span className="flex items-center">
            Complete Payment
            <CheckCircle size={16} className="ml-2" />
          </span>
        )}
      </button>
    </div>
  </form>
);

const PaymentOption = ({ method, icon, label, active, onClick, children }) => (
  <div 
    className={`p-4 border rounded-lg cursor-pointer transition-all ${
      active ? 'border-indigo-500 bg-indigo-50 shadow-sm' : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30'
    }`}
    onClick={onClick}
  >
    <div className="flex items-center">
      <div className={`p-2 rounded-full ${active ? 'bg-indigo-100' : 'bg-gray-100'} mr-3`}>
        {icon}
      </div>
      <span className={active ? 'font-medium text-indigo-700' : 'text-gray-700'}>{label}</span>
    </div>
    {children}
  </div>
);

const CardForm = ({ cardDetails, setCardDetails }) => (
  <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-md">
    <FormField
      label="Card Number"
      value={cardDetails.number}
      onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
      placeholder="1234 5678 9012 3456"
      icon={<CreditCard size={16} className="text-gray-400" />}
    />
    <div className="grid grid-cols-2 gap-4">
      <FormField
        label="Expiry Date"
        value={cardDetails.expiry}
        onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
        placeholder="MM/YY"
      />
      <FormField
        label="CVV"
        value={cardDetails.cvc}
        onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value})}
        placeholder="123"
      />
    </div>
    <FormField
      label="Cardholder Name"
      value={cardDetails.name}
      onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
      placeholder="Full Name"
    />
  </div>
);

const FormField = ({ label, icon, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-1 text-gray-700">{label}</label>
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
      )}
      <input
        type="text"
        className={`w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
          icon ? 'pl-10' : ''
        }`}
        required
        {...props}
      />
    </div>
  </div>
);

const OrderSummary = ({ booking }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
    <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 text-gray-800">Order Summary</h2>
    
    <div className="flex items-start mb-4">
      <div className="p-2 bg-indigo-100 rounded-lg mr-3">
        <ServiceIcon name={booking.service.name} />
      </div>
      <div>
        <h3 className="font-medium text-gray-800">{booking.service.name}</h3>
        <p className="text-sm text-gray-600">
          <Clock size={14} className="inline mr-1" />
          {booking.service.estimatedDuration} hours
        </p>
      </div>
    </div>

    <div className="space-y-2 mb-6 bg-gray-50 p-4 rounded-md">
      <h3 className="font-medium text-gray-700 mb-2">Service Details:</h3>
      <p className="text-sm flex items-center text-gray-600 mb-2">
        <Calendar size={14} className="mr-2 text-indigo-500" />
        <span>
          <strong>Date:</strong> {booking.date.toLocaleDateString()}
        </span>
      </p>
      <p className="text-sm flex items-center text-gray-600 mb-2">
        <Clock size={14} className="mr-2 text-indigo-500" />
        <span>
          <strong>Time:</strong> {booking.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </span>
      </p>
      <p className="text-sm flex items-center text-gray-600">
        <Repeat size={14} className="mr-2 text-indigo-500" />
        <span>
          <strong>Frequency:</strong> {booking.frequency === 'once' ? 'One-time' : 
            booking.frequency === 'weekly' ? 'Weekly' :
            booking.frequency === 'biweekly' ? 'Bi-weekly' : 'Monthly'}
        </span>
      </p>
    </div>

    <div className="border-t pt-4 mt-4">
      <div className="flex justify-between font-bold text-lg text-gray-800">
        <span>Total:</span>
        <span>{booking.service.basePrice} {booking.service.currency}</span>
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">
        {booking.frequency !== 'once' ? 'Recurring payment' : 'One-time payment'}
      </p>
    </div>
  </div>
);

export default PaymentStep;