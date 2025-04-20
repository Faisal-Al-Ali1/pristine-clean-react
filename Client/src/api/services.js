import api from './api';

// Fetch all services
export const getAllServices = async () => {
  try {
    const response = await api.get('/services');
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

// Fetch all services (Admin)
export const getAllServicesAdmin = async (body) => {
  try {
    const response = await api.get('/services/admin', body);
    return {
      data: response.data.data,
      pagination: response.data.pagination
    };
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

// Fetch a single service by ID
export const getServiceById = async (id) => {
  try {
    const response = await api.get(`/services/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching service:', error);
    throw error;
  }
};

// Create a new service
export const createService = async (formdata) => {
  try {
    const response = await api.post('/services', formdata, {
      headers: {
        'Content-Type': 'multipart/form-data' 
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
};

// Update a service
export const updateService = async (id, formdata) => {
  try {
    const response = await api.put(`/services/${id}`, formdata, {
      headers: {
        'Content-Type': 'multipart/form-data' 
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating service:', error);
    throw error;
  }
};

// Soft delete a service
export const deleteService = async (id) => {
  try {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
};

// Restore a soft-deleted service
export const restoreService = async (id) => {
  try {
    const response = await api.patch(`/services/${id}/restore`);
    return response.data;
  } catch (error) {
    console.error('Error restoring service:', error);
    throw error;
  }
};