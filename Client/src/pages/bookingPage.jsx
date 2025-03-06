import React, { useState } from 'react';

const BookingPage = () => {
    const [selectedExtras, setSelectedExtras] = useState([]);
    const [selectedFrequency, setSelectedFrequency] = useState(null);
    const [showCardInfo, setShowCardInfo] = useState(false);

    const toggleExtra = (extra) => {
        setSelectedExtras(prev => 
            prev.includes(extra) 
                ? prev.filter(e => e !== extra) 
                : [...prev, extra]
        );
    };

    const selectFrequency = (frequency) => {
        setSelectedFrequency(frequency);
    };

    const toggleCardInfo = (show) => {
        setShowCardInfo(show);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted", { selectedExtras, selectedFrequency, showCardInfo });
    };

    return (
        <div className="bg-gray-50">
          {/* Hero Section */}
            <div className="relative bg-cover bg-center h-72" style={{ backgroundImage: "url('../images/booking.jpg')" }}>
            {/* Dimmed Overlay */}
            <div className="absolute inset-0 bg-black opacity-50"></div>

            {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
                    <h1 className="text-white text-4xl font-bold">Booking Page</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="col-span-2 bg-white border border-gray-300 p-8 rounded-lg shadow-lg">
                    <h1 className="text-2xl text-center mb-8">Choose Your Service</h1>
                    <p className="text-sm text-gray-500 mb-4">Our flat rate pricing applies to whole home cleanings. For extra large or extra dirty homes the price may be more. For partial home cleans please call us.</p>

                    <form className="space-y-8" onSubmit={handleSubmit}>
                        {/* Choose Your Service */}
                        <div>
                            <h2 className="block text-lg mb-2">Choose Your Service</h2>
                            <select id="service" className="block w-full h-10 rounded-md border border-gray-500 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                <option>Residential Cleaning</option>
                                <option>Office Cleaning</option>
                                <option>Move-in/Move-out Cleaning</option>
                                <option>Deep Cleaning</option>
                                <option>After Renovation Cleaning</option>
                                <option>Car Cleaning</option>
                            </select>
                        </div>

                        {/* When Would You Like Us To Come */}
                        <div>
                            <h2 className="block text-lg mb-3">When Would You Like Us To Come?</h2>
                            <p className="text-sm text-gray-500 mb-2">Please choose a date and time that works for you. If your preferred time isn’t listed, feel free to call us to see if we can make it work.</p>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="date" className="col-span-1 h-10 rounded-md border border-gray-500 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                <select className="col-span-1 h-10 rounded-md border border-gray-500 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                    <option>--:--</option>
                                    <option>Morning</option>
                                    <option>Afternoon</option>
                                    <option>Evening</option>
                                </select>
                            </div>
                        </div>

                        {/* How Often Should We Come */}
                        <div>
                            <h2 className="block text-lg mb-2">How Often Should We Come?</h2>
                            <p className="text-sm text-gray-500 mb-4">Book Pristine Clean recurring plan and save 20% annually.</p>
                            <div className="flex gap-4">
                                {['Onetime', 'Weekly', 'Every 2 weeks', 'Every 4 weeks'].map((frequency) => (
                                    <button
                                        key={frequency}
                                        type="button"
                                        onClick={() => selectFrequency(frequency)}
                                        className={`flex-1 py-2 rounded-md font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                                            selectedFrequency === frequency
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {frequency}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Select Extras */}
                        <div>
                            <h2 className="block text-lg mb-2">Select Extras</h2>
                            <p className="text-sm text-gray-500 mb-10">Select any additional items you need cleaned. Any add-ons must be selected with all types of cleanings.</p>
                            <div className="grid grid-cols-4 gap-4">
                                {[
                                    { name: 'Inside Fridge', price: '35 JD', icon: '../images/fridge.png' },
                                    { name: 'Inside Oven', price: '35 JD', icon: '../images/gas-stove.png' },
                                    { name: 'Inside Cabinets', price: '20 JD', icon: '../images/cabinet.png' },
                                    { name: 'Clean Windows', price: '25 JD', icon: '../images/windows.png' },
                                ].map((extra) => (
                                    <button
                                        key={extra.name}
                                        type="button"
                                        onClick={() => toggleExtra(extra.name)}
                                        className={`flex flex-col items-center py-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                                            selectedExtras.includes(extra.name)
                                                ? 'bg-blue-50 text-blue-700 border-blue-500 hover:bg-blue-100 hover:text-blue-600'
                                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <img src={extra.icon} alt={extra.name} className="w-8 h-8 mb-2" />
                                        <span className="font-medium">{extra.name}</span>
                                        <span className="font-semibold">{extra.price}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div>
                            <h2 className="text-lg mb-4">Contact Information</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="First Name*" className="w-full h-10 border border-gray-500 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                <input type="text" placeholder="Last Name*" className="w-full h-10 border border-gray-500 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                <input type="email" placeholder="Email*" className="w-full h-10 border border-gray-500 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                <input type="tel" placeholder="Phone Number*" className="w-full h-10 border border-gray-500 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            </div>
                        </div>

                        {/* Service Address */}
                        <div>
                            <h2 className="text-lg mb-4">Service Address</h2>
                            <div className="grid grid-cols-3 gap-4">
                                <input type="text" placeholder="Enter A Location*" className="col-span-2 h-10 rounded-md border border-gray-500 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                <input type="text" placeholder="Apt #" className="h-10 rounded-md border border-gray-500 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div>
                            <h2 className="text-lg mb-4">Payment Method</h2>
                            <p className="text-sm text-gray-500 mb-10">Select Your Way of Payment</p>
                            <div className="flex justify-around gap-4 mb-4">
                                <label className="flex items-center gap-2">
                                    <input type="radio" name="payment" value="cash" onChange={() => toggleCardInfo(false)} />
                                    <span>Cash</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="radio" name="payment" value="paypal" onChange={() => toggleCardInfo(false)} />
                                    <span>Paypal</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="radio" name="payment" value="visa" onChange={() => toggleCardInfo(true)} />
                                    <span>Credit/Debit</span>
                                </label>
                            </div>

                            {/* Credit Card Information */}
                            {showCardInfo && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-3 gap-4">
                                        <input type="text" placeholder="Card Number" className="col-span-3 h-10 rounded-md border border-gray-500 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                        <input type="text" placeholder="Exp. Date (mm/yyyy)" className="col-span-1 h-10 rounded-md border border-gray-500 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                        <input type="text" placeholder="CVV" className="col-span-1 h-10 rounded-md border border-gray-500 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                    </div>
                                    <button type="button" className="w-full py-2 rounded-md bg-blue-500 text-white font-medium hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none">Save Card</button>
                                </div>
                            )}
                        </div>

                        {/* Anything Else We Should Know? */}
                        <div>
                            <h2 className="text-lg mb-4">Anything Else We Should Know?</h2>
                            <textarea placeholder="Please provide any special instructions here." className="w-full h-20 rounded-md border border-gray-500 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button type="submit" className="w-full py-2 rounded-md bg-blue-500 text-white font-medium hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none">Book Now</button>
                        </div>
                    </form>
                </div>

                {/* Summary Section */}
                <div className="col-span-1">
                    <div className="sticky top-8 bg-white p-6 rounded-lg shadow-lg border border-gray-300">
                        <h2 className="text-lg font-semibold mb-4">Your Summary</h2>
                        <div className="space-y-2">
                            <p className="flex items-center text-sm text-gray-700">
                                <span className="material-icons text-gray-500 mr-2">home</span>
                                Residential Cleaning
                            </p>
                            <p className="flex items-center text-sm text-gray-700">
                                <span className="material-icons text-gray-500 mr-2">calendar_today</span>
                                Choose service date...
                            </p>
                            <p className="flex items-center text-sm text-gray-700">
                                <span className="material-icons text-gray-500 mr-2">repeat</span>
                                {selectedFrequency || 'One-Time Cleaning'}
                            </p>
                        </div>
                        <div className="mt-4">
                            <label htmlFor="discount" className="block text-sm font-medium text-gray-700">Discount</label>
                            <div className="flex mt-1">
                                <input id="discount" type="text" placeholder="Discount" className="w-full h-8 rounded-l-md border border-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                <button className="rounded-r-md h-8 bg-blue-600 text-white px-4 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500">Apply</button>
                            </div>
                        </div>
                        <div className="mt-4 text-right text-blue-600 font-bold text-2xl">160.00 JD</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;