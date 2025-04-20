import api from './api';

// Payment Statistics
export const getPaymentStats = async () => {
  try {
    const response = await api.get('/payments/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching payment stats:', error);
    throw error;
  }
};

// Transactions
export const getTransactions = async (params = {}) => {
  try {
    const response = await api.get('/payments/transactions', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

// Single Transaction
export const getTransaction = async (id) => {
  try {
    const response = await api.get(`/payments/transactions/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transaction:', error);
    throw error;
  }
};

// Recent Transactions
export const getRecentTransactions = async () => {
  try {
    const response = await api.get('/payments/transactions/recent');
    return response.data;
  } catch (error) {
    console.error('Error fetching recent transactions:', error);
    throw error;
  }
};

// Payment Methods Distribution
export const getPaymentMethodsDistribution = async () => {
  try {
    const response = await api.get('/payments/methods-distribution');
    return response.data;
  } catch (error) {
    console.error('Error fetching payment methods distribution:', error);
    throw error;
  }
};

// Revenue by Period
export const getRevenueByPeriod = async (period = 'month') => {
  try {
    const response = await api.get('/payments/revenue-by-period', { 
      params: { period } 
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching revenue by period:', error);
    throw error;
  }
};

// Verify Cash Payment
export const verifyCashPayment = async (id) => {
  try {
    const response = await api.put(`/payments/${id}/verify-cash`);
    return response.data;
  } catch (error) {
    console.error('Error verifying cash payment:', error);
    throw error;
  }
};

// Process Refund
export const processRefund = async (id) => {
  try {
    const response = await api.post(`/payments/${id}/refund`);
    return response.data;
  } catch (error) {
    console.error('Error processing refund:', error);
    throw error;
  }
};

// Export Transactions
export const exportTransactions = async (params = {}) => {
  try {
    const response = await api.get('/payments/transactions/export', { 
      params,
      responseType: 'blob' // For file download
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting transactions:', error);
    throw error;
  }
};

// Payment Dashboard Filters
export const getPaymentFilters = async () => {
  try {
    const response = await api.get('/payments/filters');
    return response.data;
  } catch (error) {
    console.error('Error fetching payment filters:', error);
    throw error;
  }
};