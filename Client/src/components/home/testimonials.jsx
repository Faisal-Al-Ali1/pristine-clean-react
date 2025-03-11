import React from 'react';

const Testimonials = () => {
  // Testimonials data matching the image
  const testimonials = [
    {
      name: 'William Hazelip',
      role: 'Homeowner',
      rating: 5,
      title: 'Sparkling Clean Home',
      text: 'Pristine Clean has been a game-changer for my home!',
    },
    {
      name: 'Teresa Hamilton',
      role: 'Homeowner',
      rating: 5,
      title: 'Professional & Reliable',
      text: 'keeping my office clean is crucial for my clients hiring Pristine.',
    },
    {
      name: 'Louis Swanson',
      role: 'Homeowner',
      rating: 4,
      title: 'Flexible Scheduling',
      text: 'I was amazed by how thorough the team at Pristine Clean was!',
    },
  ];

  // Render star rating based on rating value
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={`text-2xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="bg-[#E9F2FE] py-12 px-4 mb-20">
      <div className="max-w-6xl mx-auto">
        {/* Header section */}
        <div className="flex items-center mb-4">
          <div className="text-blue-500 font-medium">/</div>
          <div className="ml-2 text-blue-500 font-medium uppercase">TESTIMONIALS</div>
        </div>
        
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800">
            Real Testimonials from<br />
            Satisfied Customers
          </h2>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-600 hover:cursor-pointer">
            Book Now!
          </button>
        </div>
        
        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                {/* Avatar placeholder - in the image these are actual photos */}
                <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center">
                  {/* Using first letter of name as placeholder */}
                  <span className="text-white font-bold">{testimonial.name.charAt(0)}</span>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-800">{testimonial.name}</p>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
              
              <div className="flex mb-2">
                {renderStars(testimonial.rating)}
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{testimonial.title}</h3>
              <p className="text-gray-600">{testimonial.text}</p>
            </div>
          ))}
        </div>
        
        {/* Image and stats section */}
        <div className="grid md:grid-cols-5 gap-6">
          {/* Image takes up 3/5 of the space */}
          <div className="md:col-span-3 rounded-lg overflow-hidden h-64">
            {/* Replace with your image */}
            <img
              src="../images/Image.png" // Replace with your image URL
              alt="Cleaning Staff"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Stats box takes up 2/5 of the space */}
          <div className="md:col-span-2 bg-blue-100 rounded-lg p-8 flex flex-col items-center justify-center">
            <span className="text-blue-500 text-2xl mb-2">★</span>
            <h3 className="text-6xl font-bold mb-2">30+</h3>
            <p className="text-gray-700">Expert Cleaners</p>
            <span className="text-gray-800 text-2xl mt-2">✦</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;