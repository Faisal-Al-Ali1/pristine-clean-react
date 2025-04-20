import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Calendar, 
  Users, 
  Brush, 
  Wallet, 
  MessageSquare, 
  X, 
  ChevronRight
} from "lucide-react";

export default function Sidebar({ isSidebarOpen, toggleSidebar }) {
  const location = useLocation();
  
  const menuItems = [
    { 
      icon: <Home size={20} />, 
      label: "Dashboard", 
      path: "/" 
    },
    { 
      icon: <Calendar size={20} />, 
      label: "Bookings", 
      path: "/bookings" 
    },
    // { 
    //   icon: <Users size={20} />, 
    //   label: "Customers", 
    //   path: "/customers" 
    // },
    { 
      icon: <Brush size={20} />, 
      label: "Services", 
      path: "/services" 
    },
    { 
      icon: <Users size={20} />, 
      label: "Cleaners", 
      path: "/cleaners" 
    },
    { 
      icon: <Wallet size={20} />, 
      label: "Payments", 
      path: "/payments" 
    },
    { 
      icon: <MessageSquare size={20} />, 
      label: "Communications", 
      path: "/communications" 
    }
  ];

  const isActive = (path) => {
    return location.pathname === `/admin-dash${path}` || 
           (path === "/" && location.pathname === "/admin-dash");
  };

  return (
    <>
    
      <aside
        className={`
          fixed md:sticky top-0 left-0
          w-72 h-screen
          bg-white text-gray-800 shadow-xl z-40
          transform transition-all duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Logo with blue accent border */}
        <div className="p-6 border-b border-blue-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="../images/Logo.png" alt="Pristine Clean Logo" className="h-10" />
          </div>
          <button
            className="text-gray-500 hover:text-blue-600 md:hidden focus:outline-none"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const active = isActive(item.path);
              return (
                <li key={item.label}>
                  <Link
                    to={`/admin-dash${item.path}`}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200
                      ${active 
                        ? "bg-blue-50 shadow-sm font-medium text-blue-600 border-l-4 border-blue-500" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                      }`}
                    onClick={toggleSidebar}
                  >
                    <div className="flex items-center">
                      <span className={`mr-3 ${active ? "text-blue-600" : "text-gray-500"}`}>
                        {item.icon}
                      </span>
                      <span className="font-medium">
                        {item.label}
                      </span>
                    </div>
                    {active && <ChevronRight size={16} className="text-blue-400" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* Footer with blue accent */}
        <div className="p-4 border-t border-blue-100 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} <span className="text-blue-600">Pristine Clean</span>
        </div>
      </aside>
      
      {/* Backdrop overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
} 