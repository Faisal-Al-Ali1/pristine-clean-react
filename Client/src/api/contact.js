import api from './api';

/**
 * Submit contact form
 * @param {object} formData - Contact form data {name: string, email: string, message: string}
 * @returns {Promise<object>} - Response data
 */
export const submitContactForm = async (formData) => {
  try {
    const response = await api.post('/contact', formData);
    return response.data;
  } catch (error) {
    console.error('Error submitting contact form:', error.response?.data || error.message);
    throw {
      message: error.response?.data?.message || 'Failed to submit contact form',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Get all contact submissions (admin only)
 * @returns {Promise<Array>} - Array of contact submissions
 */
export const getContactSubmissions = async () => {
  try {
    const response = await api.get('/contact');
    return response.data;
  } catch (error) {
    console.error('Error fetching contact submissions:', error.response?.data || error.message);
    throw {
      message: error.response?.data?.message || 'Failed to fetch contact submissions',
      status: error.response?.status
    };
  }
};

/**
 * Update contact submission status (admin only)
 * @param {string} id - Contact submission ID
 * @param {string} status - New status
 * @returns {Promise<object>} - Updated contact submission
 */
export const updateContactStatus = async (id, status) => {
  try {
    const response = await api.put(`/contact/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating contact status:', error.response?.data || error.message);
    throw {
      message: error.response?.data?.message || 'Failed to update contact status',
      status: error.response?.status
    };
  }
};

