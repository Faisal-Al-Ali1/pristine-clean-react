import api from './api';

// Create a new booking
export const createBooking = async (bookingData) => {
  try {
    const response = await api.post('/bookings/', bookingData);
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', error.response?.data || error.message);
    throw {
      message: error.response?.data?.message || 'Failed to create booking',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

// Fetch all bookings for a user
export const getUserBookings = async () => {
  try {
    const response = await api.get('/bookings/');
    return response.data;
  } catch (error) {
    console.error('Error fetching user bookings:', error.response?.data || error.message);
    throw {
      message: error.response?.data?.message || 'Failed to fetch bookings',
      status: error.response?.status
    };
  }
};

// Fetch a single booking by ID
export const getBookingById = async (bookingId) => {
  try {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching booking:', error.response?.data || error.message);
    throw {
      message: error.response?.data?.message || 'Failed to fetch booking',
      status: error.response?.status
    };
  }
};

// Update a booking
export const updateBooking = async (bookingId, updateData) => {
  try {
    const response = await api.put(`/bookings/${bookingId}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Error updating booking:', error.response?.data || error.message);
    throw {
      message: error.response?.data?.message || 'Failed to update booking',
      status: error.response?.status
    };
  }
};

// Cancel a booking
export const cancelBooking = async (bookingId) => {
  try {
    const response = await api.delete(`/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error('Error canceling booking:', error.response?.data || error.message);
    throw {
      message: error.response?.data?.message || 'Failed to cancel booking',
      status: error.response?.status
    };
  }
};

/**
 * Submit a review for a completed booking
 * @param {string} bookingId - ID of the booking to review
 * @param {object} reviewData - Review data {rating: number, comment: string}
 * @returns {Promise<object>} - Response data
 */
export const submitReview = async (bookingId, rating, comment = '') => {
  try {
    const response = await api.post(`/bookings/${bookingId}/reviews`, {
     rating,
     comment 
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting review:', error.response?.data || error.message);
    throw {
      message: error.response?.data?.message || 'Failed to submit review',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Get review for a specific booking
 * @param {string} bookingId - ID of the booking
 * @returns {Promise<object>} - Review data
 */
export const getBookingReview = async (bookingId) => {
  try {
    const response = await api.get(`/bookings/${bookingId}/reviews`);
    return response.data;
  } catch (error) {
    console.error('Error fetching booking review:', error.response?.data || error.message);
    throw {
      message: error.response?.data?.message || 'Failed to fetch booking review',
      status: error.response?.status
    };
  }
};