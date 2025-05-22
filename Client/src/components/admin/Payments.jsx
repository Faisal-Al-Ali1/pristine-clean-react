import React, { useState, useEffect, useCallback } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  Filter, 
  RefreshCw, 
  Search, 
  TrendingUp, 
  Users,
  ChevronLeft,
  ChevronRight,
  Wallet,
  User,
  X,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  getPaymentStats,
  getTransactions,
  verifyCashPayment,
  processRefund,
  exportTransactions
} from '../../api/payment';

const Payment = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [displayedTransactions, setDisplayedTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    pages: 1
  });
  const [loading, setLoading] = useState({
    stats: true,
    transactions: true
  });

  // Fetch payment stats
  const fetchStats = async () => {
    try {
      setLoading(prev => ({ ...prev, stats: true }));
      const { data } = await getPaymentStats();
      
      setStats([
        { 
          title: 'Total Revenue', 
          value: `${data.summary.totalRevenue.toFixed(2)} JOD`, 
          change: data.summary.revenueChange + '%', 
          icon: <DollarSign size={20} />, 
          trend: data.summary.revenueChange >= 0 ? 'up' : 'down' 
        },
        { 
          title: 'Transactions', 
          value: data.summary.totalTransactions, 
          change: data.summary.transactionChange + '%', 
          icon: <CreditCard size={20} />, 
          trend: data.summary.transactionChange >= 0 ? 'up' : 'down' 
        },
        { 
          title: 'Avg. Order Value', 
          value: `${data.summary.avgOrderValue.toFixed(2)} JOD`, 
          change: '+3.2%', 
          icon: <TrendingUp size={20} />, 
          trend: 'up' 
        },
        { 
          title: 'Refunds', 
          value: data.summary.refunds, 
          change: '-1.2%', 
          icon: <Users size={20} />, 
          trend: 'down' 
        }
      ]);
    } catch (error) {
      toast.error('Failed to load payment statistics');
      console.error(error);
    } finally {
      setLoading(prev => ({ ...prev, stats: false }));
    }
  };

  // Fetch transactions from backend
  const fetchTransactions = async () => {
    try {
      setLoading(prev => ({ ...prev, transactions: true }));
      const { data, pagination: paginationData } = await getTransactions({
        page: pagination.page,
        limit: pagination.limit,
        status: activeFilter === 'all' ? undefined : activeFilter
      });
      
      setAllTransactions(data || []);
      setDisplayedTransactions(data || []);
      setPagination(paginationData);
    } catch (error) {
      toast.error('Failed to load transactions');
      console.error(error);
    } finally {
      setLoading(prev => ({ ...prev, transactions: false }));
    }
  };

  // Handle search filtering on frontend
  const handleSearch = useCallback(() => {
    if (!searchQuery) {
      setDisplayedTransactions(allTransactions);
      return;
    }

    const searchLower = searchQuery.toLowerCase();
    const filtered = allTransactions.filter(transaction => {
      const transactionId = transaction.transactionId?.toLowerCase() || '';
      const userName = transaction.user?.name?.toLowerCase() || '';
      const serviceName = transaction.booking?.service?.name?.toLowerCase() || '';
      const amount = transaction.amount?.toString() || '';
      const paymentMethod = transaction.paymentMethod?.toLowerCase() || '';
      const status = transaction.status?.toLowerCase() || '';

      return (
        transactionId.includes(searchLower) ||
        userName.includes(searchLower) || 
        serviceName.includes(searchLower) ||
        amount.includes(searchQuery) ||
        paymentMethod.includes(searchLower) ||
        status.includes(searchLower)
      );
    });

    setDisplayedTransactions(filtered);
  }, [searchQuery, allTransactions]);

  // Handle page change
  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchStats();
    fetchTransactions();
    setSearchQuery('');
  };

  // Handle export
  const handleExport = async () => {
    try {
      toast.loading('Preparing export...');
      const response = await exportTransactions({
        status: activeFilter === 'all' ? undefined : activeFilter,
        search: searchQuery || undefined
      });
      
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Export downloaded successfully');
    } catch (error) {
      toast.error('Failed to export transactions');
      console.error(error);
    }
  };

  // Handle cash payment verification
  const handleVerifyCash = async (paymentId) => {
    try {
      await verifyCashPayment(paymentId);
      toast.success('Cash payment verified');
      fetchTransactions();
    } catch (error) {
      toast.error('Failed to verify cash payment');
      console.error(error);
    }
  };

  // Handle refund
  const handleRefund = async (paymentId) => {
    try {
      await processRefund(paymentId);
      toast.success('Refund processed successfully');
      fetchTransactions();
    } catch (error) {
      toast.error('Failed to process refund');
      console.error(error);
    }
  };

  // Status badge helpers
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} />;
      case 'pending':
        return <Clock size={16} />;
      case 'failed':
        return <AlertCircle size={16} />;
      case 'refunded':
        return <X size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-600';
      case 'pending':
        return 'bg-amber-100 text-amber-600';
      case 'failed':
        return 'bg-red-100 text-red-600';
      case 'refunded':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  // Format date (without time)
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Initial data fetch
  useEffect(() => {
    fetchStats();
    fetchTransactions();
  }, []);

  // Refresh transactions when filters or pagination changes
  useEffect(() => {
    fetchTransactions();
  }, [activeFilter, pagination.page]);

  // Handle search when searchQuery changes
  useEffect(() => {
    handleSearch();
  }, [searchQuery, handleSearch]);

  const paymentMethodIcon = (method) => {
    const icons = {
      credit_card: <CreditCard size={16} className="text-blue-500" />,
      paypal: <span className="text-blue-700 font-bold text-xs">PP</span>,
      cash: <span className="text-green-600 font-bold text-xs">CASH</span>,
      bank_transfer: <span className="text-green-600 font-bold text-xs">BANK</span>
    };
    return (
      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
        {icons[method] || <span className="text-gray-600 text-xs">OTH</span>}
      </div>
    );
  };

  const renderActionButtons = (transaction) => {
    if (transaction.status === 'pending' && transaction.paymentMethod === 'cash') {
      return (
        <button 
          onClick={() => handleVerifyCash(transaction._id)}
          className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors hover:cursor-pointer"
        >
          Verify
        </button>
      );
    }
    
    if (transaction.status === 'completed') {
      return (
        <button 
          onClick={() => handleRefund(transaction._id)}
          className="px-3 py-1.5 bg-red-50 text-red-600 text-sm rounded hover:bg-red-100 transition-colors hover:cursor-pointer"
        >
          Refund
        </button>
      );
    }
    
    return null;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Wallet className="text-blue-600 mr-3" size={24} />
          <h1 className="text-2xl font-bold text-gray-800">Payments Management</h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleRefresh}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50 hover:cursor-pointer"
            disabled={loading.stats || loading.transactions}
          >
            <RefreshCw size={16} className={loading.stats || loading.transactions ? 'animate-spin' : ''} />
            Refresh
          </button>
          {/* <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 hover:cursor-pointer"
          >
            Export
          </button> */}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-xl font-semibold mt-1">
                  {loading.stats ? '...' : stat.value}
                </p>
              </div>
              <div className={`p-2 rounded-lg ${stat.trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {stat.icon}
              </div>
            </div>
            {!loading.stats && (
              <p className={`text-xs mt-2 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change} from last month
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-grow">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={loading.transactions}
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            <button
              onClick={() => setActiveFilter('all')}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-sm ${activeFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} hover:cursor-pointer`}
              disabled={loading.transactions}
            >
              All Transactions
            </button>
            <button
              onClick={() => setActiveFilter('completed')}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-sm ${activeFilter === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} hover:cursor-pointer`}
              disabled={loading.transactions}
            >
              Completed
            </button>
            <button
              onClick={() => setActiveFilter('pending')}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-sm ${activeFilter === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} hover:cursor-pointer`}
              disabled={loading.transactions}
            >
              Pending
            </button>
            <button
              onClick={() => setActiveFilter('failed')}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-sm ${activeFilter === 'failed' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} hover:cursor-pointer`}
              disabled={loading.transactions}
            >
              Failed
            </button>
            <button
              onClick={() => setActiveFilter('refunded')}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-sm ${activeFilter === 'refunded' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} hover:cursor-pointer `}
              disabled={loading.transactions}
            >
              Refunded
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading.transactions ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left">Transaction ID</th>
                    <th className="px-6 py-3 text-left">Customer</th>
                    <th className="px-6 py-3 text-left">Service</th>
                    <th className="px-6 py-3 text-left">Date</th>
                    <th className="px-6 py-3 text-left">Method</th>
                    <th className="px-6 py-3 text-left">Amount</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {displayedTransactions.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                        No transactions found
                      </td>
                    </tr>
                  ) : (
                    displayedTransactions.map((transaction) => (
                      <tr key={transaction._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium">
                          #{transaction.transactionId?.slice(-6).toUpperCase() || 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                              <User size={16} />
                            </div>
                            <div>
                              <div className="font-medium text-gray-800">{transaction.user?.name || 'N/A'}</div>
                              <div className="text-xs text-gray-500">{transaction.user?.email || ''}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium">{transaction.booking?.service?.name || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatDate(transaction.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {paymentMethodIcon(transaction.paymentMethod)}
                            {transaction.paymentMethod?.split('_').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ') || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          {transaction.amount?.toFixed(2)} JOD
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(transaction.status)}`}>
                            {getStatusIcon(transaction.status)}
                            <span className="ml-1 capitalize">{transaction.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {renderActionButtons(transaction)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Original Pagination - Only show if not searching */}
            {!searchQuery && (
              <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button 
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1 || loading.transactions}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 hover:cursor-pointer"
                  >
                    Previous
                  </button>
                  <button 
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages || loading.transactions}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 hover:cursor-pointer"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(pagination.page * pagination.limit, pagination.total)}
                      </span> of{' '}
                      <span className="font-medium">{pagination.total}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1 || loading.transactions}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeft size={20} />
                      </button>
                      {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                        let pageNum;
                        if (pagination.pages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.page <= 3) {
                          pageNum = i + 1;
                        } else if (pagination.page >= pagination.pages - 2) {
                          pageNum = pagination.pages - 4 + i;
                        } else {
                          pageNum = pagination.page - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              pagination.page === pageNum
                                ? 'bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            } ${loading.transactions ? 'opacity-50' : ''} hover:cursor-pointer`}
                            disabled={loading.transactions}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      {pagination.pages > 5 && pagination.page < pagination.pages - 2 && (
                        <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                          ...
                        </span>
                      )}
                      {pagination.pages > 5 && pagination.page < pagination.pages - 2 && (
                        <button
                          onClick={() => handlePageChange(pagination.pages)}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          {pagination.pages}
                        </button>
                      )}
                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.pages || loading.transactions}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRight size={20} />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Payment;