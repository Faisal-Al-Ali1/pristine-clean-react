import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Package,
  DollarSign,
  Home,
  User,
  Clock,
  PieChart,
  ArrowRight,
  Search,
  RefreshCw,
  BarChart2,
  CreditCard,
  Droplet,
  Building2,
  Sparkles,
  Truck,
  Hammer,
  Car
} from "lucide-react";
import { toast } from 'sonner';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getAllServicesAdmin } from "../../api/services";

// Set axios defaults
axios.defaults.withCredentials = true;

export default function DashboardHome() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalRevenue: 0,
    totalCleaners: 0,
    totalServices: 0,
    revenueChange: 0,
    customerChange: 0,
    cleanerChange: 0,
    serviceChange: 0
  });
  const [popularServices, setPopularServices] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [paymentMethodsData, setPaymentMethodsData] = useState([]);
  const [loading, setLoading] = useState({
    stats: true,
    services: true,
    bookings: true,
    paymentMethods: true
  });

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading({ stats: true, services: true, bookings: true, paymentMethods: true });

      // Fetch stats
      const statsResponse = await axios.get('http://localhost:8000/api/admin/dashboard/stats');
      setStats(statsResponse.data.data);

      // Fetch popular services
      const servicesResponse = await getAllServicesAdmin();
      const sortedServices = servicesResponse.data
        .sort((a, b) => b.bookingsCount - a.bookingsCount)
        .slice(0, 4);
      setPopularServices(sortedServices);

      // Fetch recent bookings
      const bookingsResponse = await axios.get('http://localhost:8000/api/admin/dashboard/recent-bookings?limit=4');
      setRecentBookings(bookingsResponse.data.data);

      // Fetch revenue data
      const revenueResponse = await axios.get('http://localhost:8000/api/admin/dashboard/revenue');
      setRevenueData(revenueResponse.data.data);

      // Fetch payment methods data
      const paymentMethodsResponse = await axios.get('http://localhost:8000/api/payments/methods-distribution');
      setPaymentMethodsData(paymentMethodsResponse.data.data);

    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setLoading({ stats: false, services: false, bookings: false, paymentMethods: false });
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'JOD'
    }).format(amount);
  };

  // Function to get status badge style
  const getStatusStyle = (status) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-600";
      case "in_progress":
        return "bg-amber-100 text-amber-600";
      case "canceled":
        return "bg-red-100 text-red-600";
      case "scheduled":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Format status for display
  const formatStatus = (status) => {
    return status.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Format time
  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get service icon based on name
  const getServiceIcon = (serviceName) => {
    const name = serviceName ? serviceName.toLowerCase() : '';
    
    if (name.includes('residential')) {
      return <Home className="text-blue-500" size={20} />;
    } else if (name.includes('office')) {
      return <Building2 className="text-indigo-500" size={20} />;
    } else if (name.includes('deep')) {
      return <Sparkles className="text-emerald-500" size={20} />;
    } else if (name.includes('move in') || name.includes('move out')) {
      return <Truck className="text-orange-500" size={20} />;
    } else if (name.includes('renovation')) {
      return <Hammer className="text-purple-500" size={20} />;
    } else if (name.includes('car')) {
      return <Car className="text-cyan-500" size={20} />;
    } else {
      return <Droplet className="text-blue-500" size={20} />;
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Chart colors
  const chartColors = {
    credit_card: '#4f46e5',
    paypal: '#0ea5e9',
    cash: '#8b5cf6',
    bank_transfer: '#10b981'
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center">
          <Home className="text-blue-600 mr-3" size={24} />
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        </div>
        <button
          onClick={fetchDashboardData}
          className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50 hover:cursor-pointer shadow-sm transition-colors"
          disabled={loading.stats || loading.services || loading.bookings}
        >
          <RefreshCw size={16} className={
            loading.stats || loading.services || loading.bookings ? 'animate-spin' : ''
          } />
          Refresh
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        {/* Total Customers */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total customers</p>
              <h3 className="text-xl md:text-2xl font-bold mt-1">
                {loading.stats ? '...' : stats.totalCustomers}
              </h3>
              <div className={`flex items-center mt-2 text-xs md:text-sm ${stats.customerChange >= 0 ? 'text-emerald-500' : 'text-red-500'
                }`}>
                {stats.customerChange >= 0 ? (
                  <TrendingUp size={16} className="mr-1" />
                ) : (
                  <TrendingDown size={16} className="mr-1" />
                )}
                <span>{Math.abs(stats.customerChange)}% {
                  stats.customerChange >= 0 ? 'Up' : 'Down'
                } from last month</span>
              </div>
            </div>
            <div className="bg-indigo-100 p-3 rounded-lg">
              <Users className="text-indigo-500" size={24} />
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total revenue</p>
              <h3 className="text-xl md:text-2xl font-bold mt-1">
                {loading.stats ? '...' : formatCurrency(stats.totalRevenue)}
              </h3>
              <div className={`flex items-center mt-2 text-xs md:text-sm ${stats.revenueChange >= 0 ? 'text-emerald-500' : 'text-red-500'
                }`}>
                {stats.revenueChange >= 0 ? (
                  <TrendingUp size={16} className="mr-1" />
                ) : (
                  <TrendingDown size={16} className="mr-1" />
                )}
                <span>{Math.abs(stats.revenueChange)}% {
                  stats.revenueChange >= 0 ? 'Up' : 'Down'
                } from last month</span>
              </div>
            </div>
            <div className="bg-amber-100 p-3 rounded-lg">
              <DollarSign className="text-amber-500" size={24} />
            </div>
          </div>
        </div>

        {/* Total Cleaners */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total cleaners</p>
              <h3 className="text-xl md:text-2xl font-bold mt-1">
                {loading.stats ? '...' : stats.totalCleaners}
              </h3>
              <div className={`flex items-center mt-2 text-xs md:text-sm ${stats.cleanerChange >= 0 ? 'text-emerald-500' : 'text-red-500'
                }`}>
                {stats.cleanerChange >= 0 ? (
                  <TrendingUp size={16} className="mr-1" />
                ) : (
                  <TrendingDown size={16} className="mr-1" />
                )}
                <span>{Math.abs(stats.cleanerChange)}% {
                  stats.cleanerChange >= 0 ? 'Up' : 'Down'
                } from last month</span>
              </div>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Users className="text-green-500" size={24} />
            </div>
          </div>
        </div>

        {/* Total Services */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Services</p>
              <h3 className="text-xl md:text-2xl font-bold mt-1">
                {loading.stats ? '...' : stats.totalServices}
              </h3>
              <div className={`flex items-center mt-2 text-xs md:text-sm ${stats.serviceChange >= 0 ? 'text-emerald-500' : 'text-red-500'
                }`}>
                {stats.serviceChange >= 0 ? (
                  <TrendingUp size={16} className="mr-1" />
                ) : (
                  <TrendingDown size={16} className="mr-1" />
                )}
                <span>{Math.abs(stats.serviceChange)}% {
                  stats.serviceChange >= 0 ? 'Up' : 'Down'
                } from last month</span>
              </div>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <Clock className="text-red-500" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart - Enhanced Version */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <BarChart2 size={20} className="text-blue-500" />
              <h2 className="text-lg font-bold text-gray-800">Monthly Revenue</h2>
            </div>
          </div>

          {loading.stats ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="relative h-64">
              {/* Gradient Background */}
              <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-blue-50 to-transparent opacity-30 rounded-md"></div>
              
              {/* Chart Bars */}
              <div className="absolute inset-0 flex items-end space-x-2 px-4 pb-8">
                {revenueData.map((item, index) => {
                  const maxAmount = Math.max(...revenueData.map(i => i.amount));
                  const heightPercentage = (item.amount / maxAmount) * 100;
                  
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
                      <div
                        className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-md transition-all duration-300 hover:from-blue-600 hover:to-blue-500 cursor-pointer group relative"
                        style={{
                          height: `${heightPercentage}%`,
                          minHeight: "4px",
                          maxHeight: "90%"
                        }}
                      >
                        {/* Tooltip */}
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap transition-opacity duration-200">
                          {formatCurrency(item.amount)}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 mt-2">{item.month}</span>
                    </div>
                  );
                })}
              </div>

              {/* Grid lines - Simplified */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none px-4">
                {[0, 1, 2].map((_, i) => (
                  <div key={i} className="relative h-px bg-gray-100">
                    <span className="absolute right-0 text-xs text-gray-400 -mt-2">
                      {i === 0 ? '0' : i === 1 ? 'Mid' : 'Max'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Payment Methods Chart - Fixed Pie Chart */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <PieChart size={20} className="text-purple-500" />
              <h2 className="text-lg font-bold text-gray-800">Payment Methods</h2>
            </div>
          </div>

          {loading.paymentMethods ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="relative h-64 flex items-center justify-center">
              {/* SVG Pie Chart */}
              <svg width="200" height="200" viewBox="0 0 100 100" className="transform -rotate-90">
                {(() => {
                  // Calculate total for percentage calculation
                  const total = paymentMethodsData.reduce((sum, method) => sum + method.count, 0);
                  
                  // Track previous angle for slice positioning
                  let prevAngle = 0;
                  
                  // Create pie slices
                  return paymentMethodsData.map((method, index) => {
                    // Calculate percentage and angle
                    const percentage = (method.count / total) * 100;
                    const angle = (percentage / 100) * 360;
                    
                    // Calculate the slice
                    const startAngle = prevAngle;
                    const endAngle = prevAngle + angle;
                    
                    // Calculate the points on the circle
                    const startX = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
                    const startY = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
                    const endX = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
                    const endY = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);
                    
                    // Large arc flag is 1 if angle > 180 degrees
                    const largeArcFlag = angle > 180 ? 1 : 0;
                    
                    const pathData = [
                      `M 50,50`,
                      `L ${startX},${startY}`,
                      `A 40,40 0 ${largeArcFlag},1 ${endX},${endY}`,
                      `Z`
                    ].join(' ');
                    
                    const color = chartColors[method.method] || `hsl(${index * 70}, 70%, 50%)`;
                    
                    // Update the previous angle for the next slice
                    prevAngle = endAngle;
                    
                    // Return the slice
                    return (
                      <path
                        key={index}
                        d={pathData}
                        fill={color}
                        stroke="#fff"
                        strokeWidth="1"
                        className="hover:opacity-80 cursor-pointer transition-opacity"
                      >
                        <title>{`${method.method.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}: ${percentage.toFixed(1)}%`}</title>
                      </path>
                    );
                  });
                })()}
              </svg>
              
              {/* Legend */}
              <div className="absolute top-0 right-0 px-3 py-2 bg-white rounded-lg text-sm">
                {paymentMethodsData.map((method, index) => {
                  const color = chartColors[method.method] || `hsl(${index * 70}, 70%, 50%)`;
                  const total = paymentMethodsData.reduce((sum, m) => sum + m.count, 0);
                  const percentage = ((method.count / total) * 100).toFixed(1);
                  
                  return (
                    <div key={index} className="flex items-center mb-1 last:mb-0">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: color }}
                      ></div>
                      <span className="text-xs text-gray-700">{method.method.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                      <span className="text-xs font-medium ml-auto">{percentage}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 mb-6 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Package size={20} className="text-blue-500" />
            <h2 className="text-lg font-bold text-gray-800">Popular Services</h2>
          </div>
          <Link 
            to="/admin-dash/services" 
            className="text-blue-500 text-sm flex items-center px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
          >
            View All <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        {loading.services ? (
          <div className="h-48 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularServices.map((service) => (
              <div 
                key={service._id} 
                className="flex flex-col p-4 hover:bg-blue-50 rounded-lg transition duration-200 border border-gray-100 hover:border-blue-200"
              >
                <div className="flex items-center mb-3">
                  <div className="bg-blue-100 p-3 rounded-lg mr-3">
                    {getServiceIcon(service.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 truncate">{service.name}</h3>
                  </div>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-600">{formatCurrency(service.basePrice)}</span>
                  {/* <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {service.bookingsCount || 0} bookings
                  </span> */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Bookings Section */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-green-500" />
            <h2 className="text-lg font-bold text-gray-800">Recent Bookings</h2>
          </div>
          <Link 
            to="/admin-dash/bookings" 
            className="text-blue-500 text-sm flex items-center px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
          >
            View All <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        {loading.bookings ? (
          <div className="h-48 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 rounded-lg">
                <tr>
                  <th className="px-3 md:px-4 py-3 text-left">Customer</th>
                  <th className="px-3 md:px-4 py-3 text-left">Service</th>
                  <th className="px-3 md:px-4 py-3 text-left">Date</th>
                  <th className="px-3 md:px-4 py-3 text-left">Price</th>
                  <th className="px-3 md:px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-3 md:px-4 py-4 text-sm">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-2 md:mr-3 flex-shrink-0">
                          <User size={16} />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium truncate">{booking.user?.name || 'N/A'}</div>
                          <div className="text-xs text-gray-500 truncate">{booking.user?.email || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 md:px-4 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {booking.service?.name || 'N/A'}
                    </td>
                    <td className="px-3 md:px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                      <div>{formatDate(booking.date)}</div>
                      <div className="text-xs">{formatTime(booking.date)}</div>
                    </td>
                    <td className="px-3 md:px-4 py-4 text-sm font-medium whitespace-nowrap">
                      {formatCurrency(booking.service?.basePrice)}
                    </td>
                    <td className="px-3 md:px-4 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusStyle(booking.status)}`}>
                        {formatStatus(booking.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}