import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout';
import HomePage from './components/home/homepage';
import Services from './components/services/services';
import Login from './components/login/login';
import Signup from './components/signup/signup';
import AboutUs from './components/about/aboutus';
import ContactUs from './components/contact/contactus';
import UserProfile from './components/profile/userProfile';
import ProductDetails from './components/details/productDetails';
import BookingPage from './components/booking/bookingPage';
import PaymentSuccess from './components/booking/PaymentSuccess';
import PaymentCancelled from './components/booking/PaymentCancelled';
import PaymentError from './components/booking/PaymentError';


function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/services" element={<Layout><Services /></Layout>} />
        <Route path="/services/:id" element={<Layout><ProductDetails /></Layout>} />
        <Route path="/login" element={<Layout><Login /></Layout>} />
        <Route path="/signup" element={<Layout><Signup /></Layout>} />
        <Route path="/aboutUs" element={<Layout><AboutUs /></Layout>} />
        <Route path="/contactUs" element={<Layout><ContactUs /></Layout>} />
        <Route path="/userProfile" element={<Layout><UserProfile /></Layout>} />
        <Route path="/bookingPage" element={<Layout><BookingPage /></Layout>} />
        <Route path="/payment-success" element={<Layout><PaymentSuccess /></Layout>} />
        <Route path="/payment-cancelled" element={<Layout><PaymentCancelled /></Layout>} />
        <Route path="/payment-error" element={<Layout><PaymentError /></Layout>} />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
