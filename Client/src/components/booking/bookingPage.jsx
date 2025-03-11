import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  FaHome,
  FaBuilding,
  FaBox,
  FaBroom,
  FaHardHat,
  FaCar,
  FaRedo,
  FaRegCalendar,
  FaRegClock,
} from 'react-icons/fa';

// Step 1: Service Selection
const ServiceStep = ({ values, setFieldValue }) => {
  const services = [
    { name: 'Residential Cleaning', icon: <FaHome /> },
    { name: 'Office Cleaning', icon: <FaBuilding /> },
    { name: 'Move In/Out Cleaning', icon: <FaBox /> },
    { name: 'Deep Cleaning', icon: <FaBroom /> },
    { name: 'After Renovation', icon: <FaHardHat /> },
    { name: 'Car Cleaning', icon: <FaCar /> },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Choose Your Service*</h2>
      <div className="grid grid-cols-3 gap-4">
        {services.map((service) => (
          <button
            key={service.name}
            type="button"
            className={`flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-blue-50 ${
              values.selectedService === service.name
                ? 'border-blue-500 bg-blue-50 text-blue-600'
                : 'border-gray-300'
            }`}
            onClick={() => setFieldValue('selectedService', service.name)}
          >
            <div className="text-blue-500 text-2xl mb-2">{service.icon}</div>
            <span>{service.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Step 2: Date and Time Selection
const DateTimeStep = ({ values, setFieldValue }) => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">When Would You Like Us To Come?</h2>
      <p className="text-sm text-gray-500 mb-4">Please choose a date and time that works for you.</p>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Cleaning date/time*</label>
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <Field
              type="date"
              name="selectedDate"
              className="block w-full rounded-md border border-gray-300 p-2 pl-10"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <FaRegCalendar />
            </div>
          </div>
          <div className="relative">
            <Field
              type="time"
              name="selectedTime"
              className="block w-full rounded-md border border-gray-300 p-2 pl-10"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <FaRegClock />
            </div>
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Duration*</label>
        <div className="relative">
          <Field
            type="time"
            name="selectedDuration"
            className="block w-full rounded-md border border-gray-300 p-2 pl-10"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <FaRegClock />
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 3: Frequency Selection
const FrequencyStep = ({ values, setFieldValue }) => {
  const frequencies = [
    { name: 'Onetime', discount: 0 },
    { name: 'Weekly', discount: 5 },
    { name: 'Every 2 weeks', discount: 10 },
    { name: 'Every 4 Weeks', discount: 15 },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">How Often Should We Come?</h2>
      <div className="grid grid-cols-4 gap-4">
        {frequencies.map((frequency) => (
          <button
            key={frequency.name}
            type="button"
            className={`p-3 border rounded-lg text-center relative ${
              values.selectedFrequency === frequency.name
                ? 'border-blue-500 bg-blue-50 text-blue-600'
                : 'border-gray-300'
            }`}
            onClick={() => setFieldValue('selectedFrequency', frequency.name)}
          >
            {frequency.name}
            {frequency.discount > 0 && values.selectedFrequency === frequency.name && (
              <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                Discount {frequency.discount}%
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

// Step 4: Facility Size
const FacilityStep = ({ values, setFieldValue }) => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Facility Size</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Area*</label>
        <div className="flex items-center gap-2 mb-1">
          <div className="text-sm text-gray-500">50 m</div>
          <Field
            type="range"
            name="facilitySize"
            min="50"
            max="75"
            className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
          />
          <div className="text-sm text-gray-500">75 m</div>
        </div>
      </div>
    </div>
  );
};

// Step 5: Contact Information
const ContactStep = () => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First name*</label>
          <Field
            type="text"
            name="firstName"
            placeholder="Enter"
            className="block w-full rounded-md border border-gray-300 p-2"
          />
          <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last name*</label>
          <Field
            type="text"
            name="lastName"
            placeholder="Enter"
            className="block w-full rounded-md border border-gray-300 p-2"
          />
          <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone number*</label>
          <Field
            type="tel"
            name="phoneNumber"
            placeholder="+962"
            className="block w-full rounded-md border border-gray-300 p-2"
          />
          <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-sm" />
        </div>
      </div>
    </div>
  );
};

// Main Wizard Form
const BookingPage = () => {
  const [step, setStep] = useState(0);

  const steps = [
    { component: ServiceStep, validationSchema: Yup.object({ selectedService: Yup.string().required('Required') }) },
    { component: DateTimeStep, validationSchema: Yup.object({ selectedDate: Yup.string().required('Required') }) },
    { component: FrequencyStep, validationSchema: Yup.object({ selectedFrequency: Yup.string().required('Required') }) },
    { component: FacilityStep, validationSchema: Yup.object({ facilitySize: Yup.number().required('Required') }) },
    { component: ContactStep, validationSchema: Yup.object({ firstName: Yup.string().required('Required') }) },
  ];

  const CurrentStep = steps[step].component;
  const currentValidationSchema = steps[step].validationSchema;

  return (
    <div className="bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 bg-white rounded-lg shadow p-6">
          <Formik
            initialValues={{
              selectedService: '',
              selectedDate: '',
              selectedTime: '',
              selectedDuration: '',
              selectedFrequency: '',
              facilitySize: 50,
              firstName: '',
              lastName: '',
              phoneNumber: '',
            }}
            validationSchema={currentValidationSchema}
            onSubmit={(values) => {
              console.log('Form submitted', values);
            }}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <CurrentStep values={values} setFieldValue={setFieldValue} />
                <div className="mt-6 flex justify-between">
                  {step > 0 && (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="py-2 px-4 bg-gray-300 rounded-md hover:bg-gray-400"
                    >
                      Back
                    </button>
                  )}
                  {step < steps.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setStep(step + 1)}
                      className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      Submit
                    </button>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;