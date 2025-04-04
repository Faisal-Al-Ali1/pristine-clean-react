import React, { useState } from 'react';
import { Toaster, toast } from 'sonner';
import { submitContactForm } from '../../api/contact';
import { MapPin, Phone, Mail, Twitter, Instagram, Facebook, Send, Loader } from 'lucide-react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submissionData = {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      };

      const response = await submitContactForm(submissionData);
      
      toast.success(response.message);
      
      setFormData({
        name: '',
        email: '',
        subject: 'General Inquiry',
        message: ''
      });
    } catch (error) {
      console.error('Submission error:', error);
      
      if (error.data?.errors?.message) {
        toast.error(error.data.errors.message);
      } else if (error.errors) {
        Object.values(error.errors).forEach(err => {
          toast.error(err);
        });
      } else {
        toast.error(error.message || 'Failed to submit contact form. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <Toaster position="top-right" richColors />
      
      {/* Hero Section */}
      <div className="relative h-80">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('../images/pexels-jonathanborba-28576645.jpg')",
          }}
        ></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-white text-5xl font-bold tracking-tight">Contact Us</h1>
          <div className="w-24 h-1 bg-blue-500 my-6"></div>
          <p className="text-white text-xl max-w-2xl">
            We'd love to hear from you. Reach out to Pristine Clean for inquiries, bookings, or feedback.
          </p>
        </div>
      </div>

      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Contact Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Location Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="rounded-full bg-blue-50 w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <MapPin className="text-blue-600 w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">Our Location</h3>
              <p className="text-center text-gray-600">Dr. Mohammad Al Basher St, Zarqa</p>
            </div>
            
            {/* Phone Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="rounded-full bg-blue-50 w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Phone className="text-blue-600 w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">Phone Number</h3>
              <p className="text-center text-gray-600">+962 789176614</p>
            </div>
            
            {/* Email Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="rounded-full bg-blue-50 w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Mail className="text-blue-600 w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">Email Address</h3>
              <p className="text-center text-gray-600">faisal.fd.ali@gmail.com</p>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-2 bg-blue-600 text-white p-8 rounded-xl shadow-lg">
              <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
              <p className="mb-8 opacity-90">Need more details? We're here to help with any questions you might have.</p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold">Location</h3>
                    <p className="opacity-90">Dr. Mohammad Al Basher St, Zarqa</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="w-6 h-6 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold">Phone</h3>
                    <p className="opacity-90">+962 789176614</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="w-6 h-6 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold">Email</h3>
                    <p className="opacity-90">faisal.fd.ali@gmail.com</p>
                  </div>
                </div>
              </div>
              
              {/* Social Media */}
              <div className="mt-12">
                <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="bg-blue-500 p-3 rounded-full hover:bg-blue-400 transition-colors" target="_blank" rel="noopener noreferrer">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a href="#" className="bg-blue-500 p-3 rounded-full hover:bg-blue-400 transition-colors" target="_blank" rel="noopener noreferrer">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="#" className="bg-blue-500 p-3 rounded-full hover:bg-blue-400 transition-colors" target="_blank" rel="noopener noreferrer">
                    <Facebook className="w-5 h-5" />
                  </a>
                </div>
              </div>
              
              {/* Decorative Element */}
              <div className="absolute bottom-0 right-0 opacity-10">
                <Mail className="w-48 h-48" />
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3 bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Get In Touch</h2>
              <p className="text-gray-600 mb-8">Have a question or need assistance? Send us a message!</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Support">Support</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="How can we help you?"
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg flex items-center justify-center font-medium transition-all hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section with Title */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Find Us</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Visit our location in Zarqa to meet our team in person
          </p>
        </div>
        
        <div className="rounded-xl overflow-hidden shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3381.3897576302284!2d36.08261977567354!3d32.05870537397211!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151b65cd4d8f17e1%3A0x30e86b8a97e4ac7d!2sOrange%20Digital%20Village%20Zarqa!5e0!3m2!1sen!2sjo!4v1737142763031!5m2!1sen!2sjo"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;