import React from 'react';
import Navbar from './navbar/navbar';
import Footer from './footer/footer';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbarAndFooter = location.pathname.startsWith("/admin-dash") || 
  location.pathname === "/login" || 
  location.pathname === "/signup";
  return (
    <div>
      {!hideNavbarAndFooter && <Navbar />}
      <main>{children}</main>
      {!hideNavbarAndFooter && <Footer />}
    </div>
  );
};

export default Layout;
