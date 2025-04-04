import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { 
  Calendar, Repeat, MapPin, Home, Building, 
  Phone, MessageSquare, X, ArrowLeft 
} from 'lucide-react';
import { updateBooking } from '../../api/bookings';
import { toast } from 'sonner';

const EditBookingModal = ({ booking, onClose, onUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Format helpers
  const formatDateForInput = (dateString) => {
    if (!dateString) return new Date().toISOString().split('T')[0];
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const formatTimeForInput = (timeString) => {
    if (!timeString) return '08:00';
    const date = new Date(timeString);
    return date.toISOString().split('T')[1].substring(0, 5);
  };

  // Business hours validation
  const validateBusinessHours = (timeValue) => {
    if (!timeValue) return false;
    const hours = parseInt(timeValue.split(':')[0], 10);
    return hours >= 8 && hours < 20; // 8AM to 7:59PM
  };

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      // Create full ISO datetime string in UTC
      const dateTimeISO = `${values.bookingDate}T${values.bookingTime}:00Z`;
      const dateTimeObj = new Date(dateTimeISO);

      // Verify time is valid
      if (!validateBusinessHours(values.bookingTime)) {
        throw new Error('Selected time must be between 8AM and 8PM');
      }

      // Prepare payload
      const payload = {
        date: dateTimeISO,
        frequency: values.frequency,
        specialInstructions: values.specialInstructions,
        phone: values.phone,
        useUserAddress: values.addressOption === 'my-address',
        customLocation: values.addressOption === 'new-address' ? {
          street: values.street,
          city: values.city
        } : undefined
      };

      console.log('Submitting payload:', payload); // Debug log

      const response = await updateBooking(booking._id, payload);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to update booking');
      }

      onUpdate(response.data);
      toast.success('Booking updated successfully');
      onClose();
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.message || 'Failed to update booking');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center p-4 z-50 transition-all duration-300">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden transform transition-all">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white p-5 border-b flex justify-between items-center z-10">
          <h1 className="text-2xl font-bold text-gray-800">Edit Booking</h1>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6">
          <Formik
            initialValues={{
              bookingDate: formatDateForInput(booking.date),
              bookingTime: formatTimeForInput(booking.startTime || booking.date),
              frequency: booking.frequency || 'once',
              specialInstructions: booking.specialInstructions || '',
              addressOption: booking.location?.street ? 'new-address' : 'my-address',
              street: booking.location?.street || '',
              city: booking.location?.city || '',
              phone: booking.contactInfo?.phone || ''
            }}
            validationSchema={Yup.object().shape({
              bookingDate: Yup.date()
                .required('Date is required')
                .min(new Date(), 'Date cannot be in the past'),
              bookingTime: Yup.string()
                .required('Time is required')
                .test(
                  'business-hours',
                  'Must be between 8AM-8PM',
                  validateBusinessHours
                ),
              phone: Yup.string()
                .required('Phone is required')
                .matches(/^[0-9]{10}$/, 'Invalid phone number'),
              street: Yup.string().when('addressOption', {
                is: 'new-address',
                then: Yup.string().required('Street is required'),
              }),
              city: Yup.string().when('addressOption', {
                is: 'new-address',
                then: Yup.string().required('City is required'),
              })
            })}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, setFieldValue }) => (
              <Form id="editBookingForm" className="space-y-6">
                {/* When Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
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
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => {
                          setFieldValue('bookingDate', e.target.value);
                        }}
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
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        min="08:00" 
                        max="19:30"
                        onChange={(e) => {
                          const time = e.target.value;
                          setFieldValue('bookingTime', time);
                          
                          // Validate time immediately
                          if (time && !validateBusinessHours(time)) {
                            setFieldValue('bookingTime', '08:00');
                            toast.error('Please select a time between 8AM and 8PM');
                          }
                        }}
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
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
                  <h2 className="flex items-center text-lg font-semibold mb-4 text-gray-800">
                    <Repeat size={18} className="mr-2 text-indigo-500" />
                    How often?
                  </h2>
                  <Field 
                    as="select"
                    name="frequency"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  >
                    <option value="once">One-time</option>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Every 2 weeks</option>
                    <option value="monthly">Monthly</option>
                  </Field>
                </div>

                {/* Location Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
                  <h2 className="flex items-center text-lg font-semibold mb-4 text-gray-800">
                    <MapPin size={18} className="mr-2 text-indigo-500" />
                    Where?
                  </h2>
                  <div role="group" aria-labelledby="address-option-group">
                    <div className="space-y-3">
                      <label className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-indigo-50 cursor-pointer transition-colors duration-200">
                        <Field 
                          type="radio"
                          name="addressOption"
                          value="my-address"
                          className="mr-3 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                        />
                        <Home size={16} className="mr-2 text-indigo-500" />
                        <span>Use my saved address</span>
                      </label>
                      <label className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-indigo-50 cursor-pointer transition-colors duration-200">
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
                      <div className="mt-4 space-y-3 p-4 bg-gray-50 rounded-md border border-gray-100">
                        <div>
                          <label htmlFor="street" className="block text-sm font-medium mb-1 text-gray-700">
                            Street*
                          </label>
                          <Field 
                            id="street"
                            name="street"
                            type="text" 
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
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
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
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
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
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
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
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
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
                  <h2 className="flex items-center text-lg font-semibold mb-4 text-gray-800">
                    <MessageSquare size={18} className="mr-2 text-indigo-500" />
                    Special Instructions
                  </h2>
                  <Field 
                    as="textarea"
                    name="specialInstructions"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    rows={3}
                    placeholder="Any special requests or access instructions..."
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 bg-white p-5 border-t flex justify-between items-center shadow-inner">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            disabled={isLoading}
          >
            <ArrowLeft size={16} className="mr-2" />
            Cancel
          </button>
          <button
            type="submit"
            form="editBookingForm"
            className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors duration-200"
            disabled={isLoading}
          >
            {isLoading ? (
              'Updating...'
            ) : (
              'Update Booking'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBookingModal;