import React, { useState, useEffect } from 'react';
import { Home, Bell, LogOut, Menu, X, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../api/users';
import { toast, Toaster } from 'sonner';

export default function CleanerHeader({ cleanerName = "Alex Johnson" }) {
  const [notifications] = useState([
    { id: 1, message: "New booking assigned", read: false },
    { id: 2, message: "Schedule updated", read: false }
  ]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  
  // Close mobile menu and notifications when window resizes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close notifications panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notifications-container')) {
        setShowNotifications(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  const handleLogout = async () => {
    try {
      const toastId = toast.loading("Logging out...");
      await logout();
      
      toast.success("Logged out successfully!", {
        id: toastId,
        duration: 2000
      });

      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <Toaster position="top-right" richColors />
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Logo/Brand */}
            <div className="flex items-center space-x-3">
              {/* <img 
                src="/images/Logo2.png" 
                alt="Company Logo" 
                className="h-10 w-auto"
              /> */}
              <Home size={20}/>
              <h1 className="text-xl font-bold hidden md:block">Cleaner Portal</h1>
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden flex items-center" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Notification bell with badge */}
              <div className="relative notifications-container">
                <button 
                  className="p-2 hover:bg-blue-800 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                  onClick={() => setShowNotifications(!showNotifications)}
                  aria-label="Notifications"
                >
                  <Bell size={20} className="cursor-pointer" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl py-2 text-gray-800 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="font-medium">Notifications</h3>
                    </div>
                    {notifications.length > 0 ? (
                      <div className="max-h-60 overflow-y-auto">
                        {notifications.map(notification => (
                          <div 
                            key={notification.id} 
                            className={`px-4 py-3 hover:bg-gray-50 border-l-4 ${notification.read ? 'border-transparent' : 'border-blue-500'}`}
                          >
                            <p className="text-sm">{notification.message}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500">
                        No notifications
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* User profile */}
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-800 flex items-center justify-center shadow-inner">
                  <span className="font-medium">{cleanerName.charAt(0)}</span>
                </div>
                <span className="font-medium">{cleanerName}</span>
              </div>

              {/* Logout button */}
              <button 
                onClick={handleLogout}
                className="bg-white text-blue-700 hover:bg-blue-50 flex items-center px-4 py-2 rounded-lg transition-all hover:shadow-md font-medium hover:cursor-pointer"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-blue-700 rounded-b-lg shadow-lg py-4 animate-fadeIn">
              <div className="flex flex-col space-y-4 px-4">
                {/* User profile for mobile */}
                <div className="flex items-center space-x-3 pb-3 border-b border-blue-600">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-800 flex items-center justify-center shadow-inner">
                    <span className="font-medium">{cleanerName.charAt(0)}</span>
                  </div>
                  <span className="font-medium">{cleanerName}</span>
                </div>

                {/* Mobile notifications */}
                <div className="pb-3 border-b border-blue-600">
                  <button 
                    className="flex items-center justify-between w-full py-2"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <div className="flex items-center">
                      <Bell size={20} className="mr-3" />
                      <span>Notifications</span>
                    </div>
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                    <ChevronDown size={16} className={`transition-transform duration-200 ${showNotifications ? 'transform rotate-180' : ''}`} />
                  </button>
                  
                  {showNotifications && (
                    <div className="mt-2 bg-blue-800 rounded-lg py-2">
                      {notifications.length > 0 ? (
                        notifications.map(notification => (
                          <div 
                            key={notification.id} 
                            className={`px-4 py-3 hover:bg-blue-900 text-sm border-l-4 ${notification.read ? 'border-transparent' : 'border-blue-400'}`}
                          >
                            <p>{notification.message}</p>
                          </div>
                        ))
                      ) : (
                        <p className="px-4 py-3 text-sm text-blue-200">No notifications</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Logout button for mobile */}
                <button 
                  onClick={handleLogout}
                  className="flex items-center py-2"
                >
                  <LogOut size={20} className="mr-3" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}