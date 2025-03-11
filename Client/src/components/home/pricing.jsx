import React, { useState } from 'react';
import { BsCheck } from 'react-icons/bs';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const pricingPlans = [
    {
      name: 'BASIC PACKAGE',
      price: billingCycle === 'monthly' ? '59.00' : '590.00',
      popular: false,
      features: [
        'Dusting of all surfaces',
        'Sweeping and mopping floors',
        'Vacuuming carpets and rugs',
        'Cleaning of kitchen surfaces',
        'Cleaning of bathroom surfaces',
        'Emptying trash bins'
      ]
    },
    {
      name: 'ENTERPRISE PACKAGE',
      price: billingCycle === 'monthly' ? '69.00' : '690.00',
      popular: true,
      features: [
        'All services in the Basic Plan',
        'Detailed dusting',
        'Wiping down of kitchen appt',
        'Cleaning inside the microwave',
        'Changing bed linens',
        'Spot cleaning walls and doors'
      ]
    },
    {
      name: 'PREMIUM PACKAGE',
      price: billingCycle === 'monthly' ? '99.00' : '990.00',
      popular: false,
      features: [
        'All services in the Clean Plan',
        'Deep cleaning of kitchen appt',
        'baseboards, door frames, & vents',
        'Organization of closets pantries',
        'Carpet, upholstery spot cleaning',
        'Detailed bathroom cleaning'
      ]
    }
  ];

  return (
    <div className="bg-blue-500 w-full text-center py-20">
      {/* Pricing Header */}
      <div className="pb-12">
        <p className="text-blue-100 uppercase tracking-wider text-sm mb-3 font-medium">/OUR PRICING</p>
        <h2 className="text-white text-4xl font-bold px-4 max-w-3xl mx-auto leading-tight">
          Choose From Our Lowest Plans and Prices
        </h2>
      </div>

      {/* Billing Toggle */}
      <div className="mb-12">
        <div className="bg-white inline-flex rounded-full p-1 shadow-lg">
          <button
            className={`px-8 py-3 rounded-full font-medium transition-all ${
              billingCycle === 'monthly' ? 'bg-blue-500 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setBillingCycle('monthly')}
          >
            Monthly
          </button>
          <button
            className={`px-8 py-3 rounded-full font-medium transition-all ${
              billingCycle === 'yearly' ? 'bg-blue-500 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setBillingCycle('yearly')}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="flex flex-col lg:flex-row justify-center items-stretch gap-6 px-4 max-w-6xl mx-auto">
        {pricingPlans.map((plan, index) => (
          <div 
            key={index} 
            className={`bg-white rounded-xl shadow-xl w-full lg:w-1/3 flex flex-col transition-transform hover:scale-105`}
          >
            {plan.popular && (
              <div className="bg-blue-100 text-blue-600 py-2 px-4 rounded-t-xl font-medium text-sm">
                MOST POPULAR
              </div>
            )}
            <div className="p-8 flex-1 flex flex-col">
              <h3 className="font-bold text-xl mb-6 text-gray-800">{plan.name}</h3>
              
              <div className="border-t border-gray-100 py-6 mb-2">
                <span className="text-blue-500 text-sm font-medium">JOD </span>
                <span className="text-blue-500 text-5xl font-bold">{plan.price}</span>
                <span className="text-blue-500 text-sm">/{billingCycle === 'monthly' ? 'Monthly' : 'Yearly'}</span>
              </div>
              
              <div className="text-left flex-1">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-blue-500 mr-2 mt-1"><BsCheck size={18} /></span>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <button className={`w-full py-4 px-6 rounded-lg font-medium transition-all border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white hover:cursor-pointer`}>
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Additional trust elements */}
      <div className="mt-12 text-white text-center">
        <p className="opacity-90 max-w-xl mx-auto">
          All plans include a 100% satisfaction guarantee. 
          No contracts required - cancel or change your plan anytime.
        </p>
      </div>
    </div>
  );
};

export default Pricing;