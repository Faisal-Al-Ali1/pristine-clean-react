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

// Step 2: Dynamic Fields Based on Service
const DynamicFieldsStep = ({ values }) => {
  switch (values.selectedService) {
    case 'Residential Cleaning':
      return (
        <div>
          <h2 className="text-lg font-semibold mb-4">Residential Cleaning Details</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Rooms*</label>
            <Field
              type="number"
              name="numberOfRooms"
              className="block w-full rounded-md border border-gray-300 p-2"
            />
          </div>
        </div>
      );
    case 'Office Cleaning':
      return (
        <div>
          <h2 className="text-lg font-semibold mb-4">Office Cleaning Details</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Office Size (m²)*</label>
            <Field
              type="number"
              name="officeSize"
              className="block w-full rounded-md border border-gray-300 p-2"
            />
          </div>
        </div>
      );
    case 'Car Cleaning':
      return (
        <div>
          <h2 className="text-lg font-semibold mb-4">Car Cleaning Details</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Car Type*</label>
            <Field
              as="select"
              name="carType"
              className="block w-full rounded-md border border-gray-300 p-2"
            >
              <option value="">Select</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Truck">Truck</option>
            </Field>
          </div>
        </div>
      );
    default:
      return null;
  }
};

// Step 3: Common Fields
const CommonFieldsStep = ({ values, setFieldValue }) => {
  const frequencies = [
    { name: 'Onetime', discount: 0 },
    { name: 'Weekly', discount: 5 },
    { name: 'Every 2 weeks', discount: 10 },
    { name: 'Every 4 Weeks', discount: 15 },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Common Details</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date*</label>
          <Field
            type="date"
            name="selectedDate"
            className="block w-full rounded-md border border-gray-300 p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Time*</label>
          <Field
            type="time"
            name="selectedTime"
            className="block w-full rounded-md border border-gray-300 p-2"
          />
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Frequency*</label>
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
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Information*</label>
        <Field
          type="text"
          name="firstName"
          placeholder="First Name"
          className="block w-full rounded-md border border-gray-300 p-2"
        />
        <Field
          type="text"
          name="lastName"
          placeholder="Last Name"
          className="block w-full rounded-md border border-gray-300 p-2 mt-2"
        />
        <Field
          type="tel"
          name="phoneNumber"
          placeholder="Phone Number"
          className="block w-full rounded-md border border-gray-300 p-2 mt-2"
        />
      </div>
    </div>
  );
};

// Step 4: Payment
const PaymentStep = ({ values, setFieldValue }) => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Fill your payment method</h2>
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        {/* Card Payment Section */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Field
              type="radio"
              id="cardPayment"
              name="paymentMethod"
              value="card"
              className="form-radio h-5 w-5 text-blue-600"
            />
            <label htmlFor="cardPayment" className="ml-2 text-gray-700">
              Card
            </label>
          </div>
          {values.paymentMethod === 'card' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Information</label>
                <Field
                  type="text"
                  name="cardNumber"
                  placeholder="1234 1234 1234 1234"
                  className="block w-full rounded-md border border-gray-300 p-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">MM/YY</label>
                  <Field
                    type="text"
                    name="cardExpiry"
                    placeholder="MM/YY"
                    className="block w-full rounded-md border border-gray-300 p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CW</label>
                  <Field
                    type="text"
                    name="cardCw"
                    placeholder="CW"
                    className="block w-full rounded-md border border-gray-300 p-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                <Field
                  type="text"
                  name="cardholderName"
                  placeholder="Full name on card"
                  className="block w-full rounded-md border border-gray-300 p-2"
                />
              </div>
            </div>
          )}
        </div>

        {/* Cash on Hand Section */}
        <div className="flex items-center">
          <Field
            type="radio"
            id="cashOnHand"
            name="paymentMethod"
            value="cash"
            className="form-radio h-5 w-5 text-blue-600"
          />
          <label htmlFor="cashOnHand" className="ml-2 text-gray-700">
            Cash on hand
          </label>
        </div>
      </div>
    </div>
  );
};

// Step 5: Summary
const SummaryStep = ({ values }) => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Summary</h2>
      <div className="space-y-2">
        <p><strong>Service:</strong> {values.selectedService}</p>
        {values.selectedService === 'Residential Cleaning' && (
          <p><strong>Number of Rooms:</strong> {values.numberOfRooms}</p>
        )}
        {values.selectedService === 'Office Cleaning' && (
          <p><strong>Office Size:</strong> {values.officeSize} m²</p>
        )}
        {values.selectedService === 'Car Cleaning' && (
          <p><strong>Car Type:</strong> {values.carType}</p>
        )}
        <p><strong>Date:</strong> {values.selectedDate}</p>
        <p><strong>Time:</strong> {values.selectedTime}</p>
        <p><strong>Frequency:</strong> {values.selectedFrequency}</p>
        <p><strong>Name:</strong> {values.firstName} {values.lastName}</p>
        <p><strong>Phone:</strong> {values.phoneNumber}</p>
        <p><strong>Payment Method:</strong> {values.paymentMethod}</p>
        {values.paymentMethod === 'card' && (
          <>
            <p><strong>Card Number:</strong> {values.cardNumber}</p>
            <p><strong>Card Expiry:</strong> {values.cardExpiry}</p>
            <p><strong>Cardholder Name:</strong> {values.cardholderName}</p>
          </>
        )}
      </div>
    </div>
  );
};

// Main Wizard Form
const BookingPage = () => {
  const [step, setStep] = useState(0);

  const steps = [
    { component: ServiceStep, validationSchema: Yup.object({ selectedService: Yup.string().required('Required') }) },
    { component: DynamicFieldsStep, validationSchema: Yup.object({}) },
    { component: CommonFieldsStep, validationSchema: Yup.object({ selectedDate: Yup.string().required('Required') }) },
    { component: PaymentStep, validationSchema: Yup.object({ paymentMethod: Yup.string().required('Required') }) },
    { component: SummaryStep, validationSchema: Yup.object({}) },
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
              selectedFrequency: '',
              firstName: '',
              lastName: '',
              phoneNumber: '',
              paymentMethod: '',
              cardNumber: '',
              cardExpiry: '',
              cardCw: '',
              cardholderName: '',
              numberOfRooms: '',
              officeSize: '',
              carType: '',
            }}
            validationSchema={currentValidationSchema}
            onSubmit={(values) => {
              const filteredValues = { ...values };

              switch (filteredValues.selectedService) {
                case 'Residential Cleaning':
                  delete filteredValues.officeSize;
                  delete filteredValues.carType;
                  break;
                case 'Office Cleaning':
                  delete filteredValues.numberOfRooms;
                  delete filteredValues.carType;
                  break;
                case 'Car Cleaning':
                  delete filteredValues.numberOfRooms;
                  delete filteredValues.officeSize;
                  break;
                default:
                  break;
              }

              if (filteredValues.paymentMethod === 'cash') {
                delete filteredValues.cardNumber;
                delete filteredValues.cardExpiry;
                delete filteredValues.cardCw;
                delete filteredValues.cardholderName;
              }

              console.log('Form submitted', filteredValues);
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
                  {console.log('Current step:', step, ' / steps.length:', steps.length)}
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
                      Book Now
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