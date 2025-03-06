import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/login';
import Signup from './pages/signup';
import Layout from './components/layout';
import AboutUs from './pages/aboutus';
import ContactUs from './pages/contactus';
import UserProfile from './pages/userProfile';
import Services from './pages/services';
import ProductDetails from './pages/productDetails';
import BookingPage from './pages/bookingPage';

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
