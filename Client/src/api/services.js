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
export const createService = async (serviceData) => {
  try {
    const response = await api.post('/services', serviceData);
    return response.data;
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
};

// Update a service
export const updateService = async (id, serviceData) => {
  try {
    const response = await api.put(`/services/${id}`, serviceData);
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