import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ServiceIcon } from './ServiceSelection';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Repeat, 
  ChevronRight, 
  Loader2, 
  Home, 
  Building 
} from 'lucide-react';

const BookingForm = ({ 
  service, 
  onSubmit, 
  onBack, 
  isLoading,
  error
}) => {
  // Guard clause if service is not available
  if (!service) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
        <div className="text-center py-8 text-red-500">
          Service information not available
        </div>
        <button
          onClick={onBack}
          className="flex items-center mx-auto px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Services
        </button>
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
        <h1 className="text-2xl font-bold text-gray-800">Book {service.name}</h1>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Formik
            initialValues={{
              serviceId: service._id,
              bookingDate: '',
              bookingTime: '',
              frequency: 'once',
              specialInstructions: '',
              addressOption: 'my-address',
              street: '',
              city: '',
              phone: ''
            }}
            validationSchema={Yup.object().shape({
                // Common fields
                bookingDate: Yup.date()
                  .required('Date is required')
                  .min(new Date(), 'Date cannot be in the past'),
                bookingTime: Yup.string()
                  .required('Time is required')
                  .test(
                    'business-hours',
                    'Must be between 8AM-8PM',
                    value => {
                      if (!value) return false;
                      const hours = parseInt(value.split(':')[0], 10);
                      return hours >= 8 && hours < 20;
                    }
                  ),
                phone: Yup.string()
                  .required('Phone is required')
                  .matches(/^[0-9]{10}$/, 'Invalid phone number'),
                addressOption: Yup.string().required(),
                
                // Conditional fields
                street: Yup.string().when('addressOption', {
                  is: (value) => value === 'new-address',
                  then: Yup.string().required('Street is required'),
                  otherwise: Yup.string().notRequired()
                }),
                city: Yup.string().when('addressOption', {
                  is: (value) => value === 'new-address',
                  then: Yup.string().required('City is required'),
                  otherwise: Yup.string().notRequired()
                })
              })}
            onSubmit={onSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form className="space-y-6">
                {/* When Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="flex items-center text-lg font-semibold mb-4 text-gray-800">
                    <Calendar size={18} className="mr-2 text-indigo-500" />
                    When should we come?
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="bookingDate" className="block text-sm font-medium mb-1 text-gray-700">
                        Date*
                      </label>
                      <Field 
                        id="bookingDate"
                        name="bookingDate"
                        type="date" 
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        min={new Date().toISOString().split('T')[0]}
                      />
                      <ErrorMessage 
                        name="bookingDate" 
                        component="div" 
                        className="text-red-500 text-sm mt-1" 
                      />
                    </div>
                    <div>
                      <label htmlFor="bookingTime" className="block text-sm font-medium mb-1 text-gray-700">
                        Time (8AM-8PM)*
                      </label>
                      <Field 
                        id="bookingTime"
                        name="bookingTime"
                        type="time" 
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        min="08:00" 
                        max="19:30"
                      />
                      <ErrorMessage 
                        name="bookingTime" 
                        component="div" 
                        className="text-red-500 text-sm mt-1" 
                      />
                    </div>
                  </div>
                </div>

                {/* Frequency Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="flex items-center text-lg font-semibold mb-4 text-gray-800">
                    <Repeat size={18} className="mr-2 text-indigo-500" />
                    How often?
                  </h2>
                  <Field 
                    as="select"
                    name="frequency"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="once">One-time</option>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Every 2 weeks</option>
                    <option value="monthly">Monthly</option>
                  </Field>
                </div>

                {/* Location Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="flex items-center text-lg font-semibold mb-4 text-gray-800">
                    <MapPin size={18} className="mr-2 text-indigo-500" />
                    Where?
                  </h2>
                  <div role="group" aria-labelledby="address-option-group">
                    <div className="space-y-3">
                      <label className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-indigo-50 cursor-pointer transition-colors">
                        <Field 
                          type="radio"
                          name="addressOption"
                          value="my-address"
                          className="mr-3 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                        />
                        <Home size={16} className="mr-2 text-indigo-500" />
                        <span>Use my saved address</span>
                      </label>
                      <label className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-indigo-50 cursor-pointer transition-colors">
                        <Field 
                          type="radio"
                          name="addressOption"
                          value="new-address"
                          className="mr-3 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                        />
                        <Building size={16} className="mr-2 text-indigo-500" />
                        <span>Use a different address</span>
                      </label>
                    </div>

                    {values.addressOption === 'new-address' && (
                      <div className="mt-4 space-y-3 p-4 bg-gray-50 rounded-md">
                        <div>
                          <label htmlFor="street" className="block text-sm font-medium mb-1 text-gray-700">
                            Street*
                          </label>
                          <Field 
                            id="street"
                            name="street"
                            type="text" 
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                          <ErrorMessage 
                            name="street" 
                            component="div" 
                            className="text-red-500 text-sm mt-1" 
                          />
                        </div>
                        <div>
                          <label htmlFor="city" className="block text-sm font-medium mb-1 text-gray-700">
                            City*
                          </label>
                          <Field 
                            id="city"
                            name="city"
                            type="text" 
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                          <ErrorMessage 
                            name="city" 
                            component="div" 
                            className="text-red-500 text-sm mt-1" 
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="flex items-center text-lg font-semibold mb-4 text-gray-800">
                    <Phone size={18} className="mr-2 text-indigo-500" />
                    Contact Information
                  </h2>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-1 text-gray-700">
                      Phone Number*
                    </label>
                    <Field 
                      id="phone"
                      name="phone"
                      type="tel" 
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="07XXXXXXXX"
                    />
                    <ErrorMessage 
                      name="phone" 
                      component="div" 
                      className="text-red-500 text-sm mt-1" 
                    />
                  </div>
                </div>

                {/* Special Instructions */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="flex items-center text-lg font-semibold mb-4 text-gray-800">
                    <MessageSquare size={18} className="mr-2 text-indigo-500" />
                    Special Instructions
                  </h2>
                  <Field 
                    as="textarea"
                    name="specialInstructions"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    rows={3}
                    placeholder="Any special requests or access instructions..."
                  />
                </div>

                {/* Form Actions */}
                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={onBack}
                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    disabled={isLoading}
                  >
                    <ArrowLeft size={16} className="mr-2" />
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <Loader2 size={16} className="animate-spin mr-2" />
                        Booking...
                      </span>
                    ) : (
                      <>
                        Continue to Payment
                        <ChevronRight size={16} className="ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">Order Summary</h2>
            
            <div className="flex items-start mb-4">
              <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                <ServiceIcon name={service.name} />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">{service.name}</h3>
                <p className="text-sm text-gray-600">
                  <Clock size={14} className="inline mr-1" />
                  {service.estimatedDuration || 0} hours
                </p>
              </div>
            </div>

            {service.includedServices?.length > 0 && (
              <div className="space-y-2 mb-6 bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium text-gray-700">Includes:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {service.includedServices.map((item, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {item.title && (
                        <span className="font-medium">{item.title}:</span>
                      )}{' '}
                      {item.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between mb-2 text-gray-600">
                <span>Subtotal:</span>
                <span>{service.basePrice || 0} {service.currency || 'USD'}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-gray-800">
                <span>Total:</span>
                <span>{service.basePrice || 0} {service.currency || 'USD'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;