const Booking = require('../models/Booking');
const User = require('../models/User');
const Service = require('../models/Service');
const Payment = require('../models/Payment');
const mongoose = require('mongoose');

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/admin/dashboard/stats
 * @access  Private/Admin
 */
exports.getDashboardStats = async (req, res) => {
  try {
    // Calculate date ranges for comparisons
    const today = new Date();
    const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
    
    // Get counts for current month
    const [
      currentCustomers,
      currentCleaners,
      currentServices,
      currentRevenue
    ] = await Promise.all([
      User.countDocuments({ 
        role: 'customer',
        createdAt: { $gte: currentMonthStart } 
      }),
      User.countDocuments({ 
        role: 'cleaner',
        createdAt: { $gte: currentMonthStart } 
      }),
      Service.countDocuments({ 
        createdAt: { $gte: currentMonthStart } 
      }),
      Payment.aggregate([
        { 
          $match: { 
            status: 'completed',
            createdAt: { $gte: currentMonthStart } 
          } 
        },
        { 
          $group: { 
            _id: null, 
            total: { $sum: '$amount' } 
          } 
        }
      ])
    ]);
    
    // Get counts for last month
    const [
      lastMonthCustomers,
      lastMonthCleaners,
      lastMonthServices,
      lastMonthRevenue
    ] = await Promise.all([
      User.countDocuments({ 
        role: 'customer',
        createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } 
      }),
      User.countDocuments({ 
        role: 'cleaner',
        createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } 
      }),
      Service.countDocuments({ 
        createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } 
      }),
      Payment.aggregate([
        { 
          $match: { 
            status: 'completed',
            createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } 
          } 
        },
        { 
          $group: { 
            _id: null, 
            total: { $sum: '$amount' } 
          } 
        }
      ])
    ]);
    
    // Get total counts (all time)
    const [
      totalCustomers,
      totalCleaners,
      totalServices,
      totalRevenue
    ] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      User.countDocuments({ role: 'cleaner' }),
      Service.countDocuments(),
      Payment.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);
    
    // Calculate percentage changes
    const calculateChange = (current, last) => {
      if (last === 0) return current > 0 ? 100 : 0;
      return ((current - last) / last) * 100;
    };
    
    const stats = {
      totalCustomers: totalCustomers,
      totalCleaners: totalCleaners,
      totalServices: totalServices,
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
      
      revenueChange: parseFloat(calculateChange(
        currentRevenue.length > 0 ? currentRevenue[0].total : 0,
        lastMonthRevenue.length > 0 ? lastMonthRevenue[0].total : 0
      ).toFixed(1)),
      
      customerChange: parseFloat(calculateChange(
        currentCustomers,
        lastMonthCustomers
      ).toFixed(1)),
      
      cleanerChange: parseFloat(calculateChange(
        currentCleaners,
        lastMonthCleaners
      ).toFixed(1)),
      
      serviceChange: parseFloat(calculateChange(
        currentServices,
        lastMonthServices
      ).toFixed(1))
    };
    
    res.json({
      success: true,
      data: stats
    });
    
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get dashboard statistics' 
    });
  }
};

/**
 * @desc    Get revenue data for charts
 * @route   GET /api/admin/dashboard/revenue
 * @access  Private/Admin
 */
exports.getRevenueData = async (req, res) => {
  try {
    // Get revenue data for the last 12 months
    const revenueData = await Payment.aggregate([
      { 
        $match: { 
          status: 'completed',
          createdAt: { 
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 12)) 
          } 
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          amount: { $sum: '$amount' }
        }
      },
      {
        $project: {
          _id: 0,
          month: {
            $let: {
              vars: {
                monthsInYear: [
                  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                ]
              },
              in: {
                $arrayElemAt: ['$$monthsInYear', { $subtract: ['$_id.month', 1] }]
              }
            }
          },
          amount: 1
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    // Fill in missing months with 0 revenue
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const last12Months = months.slice(currentMonth + 1).concat(months.slice(0, currentMonth + 1)).slice(-12);
    
    const completeRevenueData = last12Months.map(month => {
      const found = revenueData.find(item => item.month === month);
      return found || { month, amount: 0 };
    });
    
    res.json({
      success: true,
      data: completeRevenueData
    });
    
  } catch (error) {
    console.error('Error getting revenue data:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get revenue data' 
    });
  }
};

/**
 * @desc    Get recent bookings for dashboard
 * @route   GET /api/admin/dashboard/recent-bookings
 * @access  Private/Admin
 */
exports.getRecentBookings = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 4;
    
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate({
        path: 'user',
        select: 'name email'
      })
      .populate({
        path: 'service',
        select: 'name basePrice'
      });
    
    res.json({
      success: true,
      data: recentBookings
    });
    
  } catch (error) {
    console.error('Error getting recent bookings:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get recent bookings' 
    });
  }
};