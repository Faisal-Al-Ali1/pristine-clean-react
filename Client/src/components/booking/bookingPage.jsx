import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'sonner';
import { 
  ChevronLeft, 
  Loader2, 
  AlertCircle,
  Check
} from 'lucide-react';
import ServiceSelection from './ServiceSelection';
import BookingForm from './BookingForm';
import PaymentStep from './PaymentStep';
import BookingSuccess from './BookingSuccess';

// Configure Axios
axios.defaults.withCredentials = true;

const BookingPage = () => {
  const [step, setStep] = useState(0);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:8000/api/services');
        setServices(response.data);
        setError(null);
      } catch (err) {
        const errorMessage = 'Failed to load services. Please try again.';
        setError(errorMessage);
        toast.error(errorMessage, {
          icon: <AlertCircle className="text-red-500" size={18} />,
          duration: 4000
        });
        console.error('Error fetching services:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleBookingSubmit = async (values) => {
    setIsLoading(true);
    try {
      const bookingData = {
        serviceId: values.serviceId,
        date: `${values.bookingDate}T${values.bookingTime}:00`,
        frequency: values.frequency,
        specialInstructions: values.specialInstructions,
        useUserAddress: values.addressOption === 'my-address',
        customLocation: values.addressOption === 'new-address' ? {
          street: values.street,
          city: values.city
        } : null,
        phone: values.phone
      };

      const response = await axios.post('http://localhost:8000/api/bookings', bookingData);
      
      // Handle both string (ID) and object service responses
      const serviceData = typeof response.data.data.service === 'string'
        ? services.find(s => s._id === response.data.data.service)
        : response.data.data.service;

      setBooking({
        ...response.data.data,
        service: serviceData || {
          name: 'Unknown Service',
          basePrice: 0,
          currency: 'USD',
          estimatedDuration: 0
        }
      });
      
      toast.success('Booking created successfully!', {
        icon: <Check className="text-green-500" size={18} />,
        duration: 3000
      });
      
      setStep(2);
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Booking failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage, {
        icon: <AlertCircle className="text-red-500" size={18} />,
        duration: 4000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const navigateBack = (targetStep) => {
    setError(null);
    setStep(targetStep);
  };

  const handleServiceSelection = (service) => {
    setSelectedService(service);
    setError(null);
    setStep(1);
    
    toast.info(`Selected: ${service.name}`, {
      duration: 2000
    });
  };

  const handlePaymentSuccess = () => {
    setStep(3);
    toast.success('Payment successful!', {
      icon: <Check className="text-green-500" size={18} />,
      duration: 3000
    });
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <ServiceSelection
            services={services}
            onSelect={handleServiceSelection}
            error={error}
            isLoading={isLoading}
          />
        );
      
      case 1:
        return selectedService ? (
          <BookingForm
            service={selectedService}
            onSubmit={handleBookingSubmit}
            onBack={() => navigateBack(0)}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <div className="flex justify-center items-center p-12">
            <button 
              onClick={() => navigateBack(0)}
              className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <ChevronLeft size={20} className="mr-1" />
              Return to service selection
            </button>
          </div>
        );
      
      case 2:
        return booking ? (
          <PaymentStep
            booking={booking}
            onBack={() => navigateBack(1)}
            onPaymentSuccess={handlePaymentSuccess}
          />
        ) : (
          <div className="max-w-4xl mx-auto p-8 text-center">
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
              <span className="text-gray-600">Preparing payment details...</span>
            </div>
          </div>
        );
      
      case 3:
        return booking ? (
          <BookingSuccess booking={booking} />
        ) : (
          navigateBack(0)
        );
      
      default:
        return navigateBack(0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Progress indicator */}
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <div className="flex justify-between items-center">
          {['Select Service', 'Booking Details', 'Payment', 'Confirmation'].map((label, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  idx <= step ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {idx < step ? (
                  <Check size={16} />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              <span className={`text-xs mt-1 hidden sm:block ${
                idx <= step ? 'text-indigo-600 font-medium' : 'text-gray-500'
              }`}>
                {label}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-2 h-1 w-full bg-gray-200 rounded">
          <div 
            className="h-1 bg-indigo-600 rounded transition-all duration-300" 
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      {renderStep()}
      
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
};

export default BookingPage;