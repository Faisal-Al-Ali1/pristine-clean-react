import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import DashboardHome from "./DashboardHome";
import Bookings from "./Bookings";
import Customers from "./Customers";
import Cleaners from "./Cleaners";
import Services from "./Services";
import Payments from "./Payments";
import Communications from "./communications";
import AdminProfile from "./Profile";

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    
    window.addEventListener("resize", checkMobile);
    
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobile && isSidebarOpen) {
        const sidebar = document.getElementById("sidebar");
        const toggleButton = document.getElementById("sidebar-toggle");
        
        if (sidebar && 
            !sidebar.contains(e.target) && 
            toggleButton && 
            !toggleButton.contains(e.target)) {
          setIsSidebarOpen(false);
        }
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <div id="sidebar">
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      {/* Mobile Sidebar Toggle */}
      <button
        id="sidebar-toggle"
        className="md:hidden fixed bottom-4 right-4 z-50 p-3 bg-white text-blue-600 rounded-full shadow-lg hover:bg-blue-50 transition-colors duration-200"
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        <Menu size={20} />
      </button>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/cleaners" element={<Cleaners />} />
              <Route path="/services" element={<Services />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/communications" element={<Communications />} />
              <Route path="/profile" element={<AdminProfile />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}