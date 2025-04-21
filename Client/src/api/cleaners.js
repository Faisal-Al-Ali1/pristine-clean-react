import api from "./api";

/**
 * Get bookings for the current cleaner with pagination
 * @param {string} status - Optional status filter
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<Object>} - Paginated bookings data
 */
export const getCleanerBookings = async (status, page = 1, limit = 5) => {
  try {
    const params = { page, limit };
    if (status) params.status = status;

    const response = await api.get("/cleaner/bookings/my-bookings", { params });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching cleaner bookings:",
      error.response?.data || error.message
    );
    throw {
      message: error.response?.data?.message || "Failed to fetch your bookings",
      status: error.response?.status,
    };
  }
};

/**
 * Mark a booking as completed
 * @param {string} bookingId - ID of the booking to complete
 * @returns {Promise<Object>} - Updated booking data
 */
export const completeBooking = async (bookingId) => {
  try {
    const response = await api.put(`/cleaner/bookings/${bookingId}/complete`);
    return response.data.data; // Access the data property
  } catch (error) {
    console.error(
      "Error completing booking:",
      error.response?.data || error.message
    );
    throw {
      message: error.response?.data?.message || "Failed to complete booking",
      status: error.response?.status,
    };
  }
};

/**
 * Get cleaner profile data
 * @returns {Promise<Object>} - Cleaner profile data
 */
export const getCleanerProfile = async () => {
  try {
    const response = await api.get("/cleaner/bookings/profile");
    return response.data.user;
  } catch (error) {
    console.error(
      "Error fetching cleaner profile:",
      error.response?.data || error.message
    );
    throw {
      message: error.response?.data?.message || "Failed to fetch profile data",
      status: error.response?.status,
    };
  }
};

/**
 * Update cleaner profile
 * @param {Object} profileData - Updated profile data
 * @returns {Promise<Object>} - Updated profile data
 */
export const updateCleanerProfile = async (formData) => {
  try {
    const response = await api.put("/cleaner/bookings/update-profile", formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data.user;
  } catch (error) {
    console.error(
      "Error updating cleaner profile:",
      error.response?.data || error.message
    );
    throw {
      message: error.response?.data?.message || "Failed to update profile",
      status: error.response?.status,
    };
  }
};
