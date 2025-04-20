import React, { useState } from "react";
import { Menu, Bell, User, ChevronDown, LogOut, User as ProfileIcon } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { logout } from '../../api/users';
import { toast, Toaster } from "sonner";

export default function Header({ toggleSidebar }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Show loading toast
      const toastId = toast.loading("Logging out...");

      // Perform logout
      await logout();

      // Update toast to success
      toast.success("Logged out successfully!", {
        id: toastId,
        duration: 2000
      });

      // Wait for 2 seconds before redirecting
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.", {
        duration: 3000
      });
    }
  };

  return (
    <>
      {/* Sonner Toaster Provider */}
      <Toaster position="top-right" richColors expand={false} />

      <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4 sm:px-6 z-30">
        {/* Left Section */}
        <div className="flex items-center">
          <button
            className="md:hidden text-gray-600 hover:text-blue-600 mr-3 focus:outline-none"
            onClick={toggleSidebar}
            aria-label="Open sidebar"
          >
            <Menu size={22} />
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-5">
          {/* Notification Bell */}
          <button className="relative text-gray-500 hover:text-blue-600 transition-colors duration-200 focus:outline-none">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none hover:cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <User size={18} />
              </div>
              <span className="text-sm font-medium hidden sm:block">Admin</span>
              <ChevronDown size={16} className="text-gray-500" />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
                <Link
                  to="/admin-dash/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  <ProfileIcon size={16} className="mr-2" />
                  Your Profile
                </Link>
                <div className="border-t border-gray-100"></div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center hover:cursor-pointer"
                >
                  <LogOut size={16} className="mr-2" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}