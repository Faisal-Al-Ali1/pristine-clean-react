import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/services" element={<Layout><Services /></Layout>} />
        <Route path="/login" element={<Layout><Login /></Layout>} />
        <Route path="/signup" element={<Layout><Signup /></Layout>} />
        <Route path="/aboutUs" element={<Layout><AboutUs /></Layout>} />
        <Route path="/contactUs" element={<Layout><ContactUs /></Layout>} />
        <Route path="/userProfile" element={<Layout><UserProfile /></Layout>} />
        <Route path="/productDetails" element={<Layout><ProductDetails /></Layout>} />
        <Route path="/bookingPage" element={<Layout><BookingPage /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
