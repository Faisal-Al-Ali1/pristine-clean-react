import React, { useState, useEffect } from 'react';
import {
  Plus, Star, Clock, Trash2, Brush, Edit2, ChevronDown, ChevronUp,
  CheckCircle, XCircle, Search, RotateCw, Filter, ChevronLeft, ChevronRight
} from 'lucide-react';
import { toast, Toaster } from 'sonner';
import {
  getAllServicesAdmin,
  deleteService,
  restoreService
} from '../../api/services';
import CreateServiceModal from './services/CreateServiceModal';
import EditServiceModal from './services/EditServiceModal';


function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedService, setExpandedService] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
    pages: 1
  });
  const [filters, setFilters] = useState({
    status: 'all',
    minPrice: '',
    maxPrice: '',
  });

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPagination(prev => ({ ...prev, page: 1 })); 
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const body = {
          page: pagination.page,
          limit: pagination.limit,
          ...(filters.status !== 'all' && { status: filters.status }),
          ...(filters.minPrice && { minPrice: Number(filters.minPrice) }),
          ...(filters.maxPrice && { maxPrice: Number(filters.maxPrice) }),
          ...(debouncedSearchQuery && { search: debouncedSearchQuery }),
        };

        console.log('API Request Body:', body); // Debug log
        const response = await getAllServicesAdmin(body);
        console.log('API Response:', response); // Debug log

        setServices(response.data);
        setPagination({
          ...pagination,
          total: response.pagination.total,
          pages: response.pagination.pages
        });
      } catch (error) {
        const errorMsg = error.response?.data?.message || 'Failed to fetch services';
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [pagination.page, filters, debouncedSearchQuery]);

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [name]: value };
      // Reset min/max price if empty
      if (name === 'minPrice' && value === '') {
        newFilters.minPrice = '';
      }
      if (name === 'maxPrice' && value === '') {
        newFilters.maxPrice = '';
      }
      return newFilters;
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle page change
  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  // Toggle service details expansion
  const toggleServiceExpand = (serviceId) => {
    setExpandedService(prev => prev === serviceId ? null : serviceId);
  };

  // Handle service deletion
  const handleDeleteService = (serviceId) => {
    toast.custom((t) => (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-full max-w-md">
        <h3 className="font-medium text-gray-800 mb-2">Delete Service</h3>
        <p className="text-gray-600 mb-4">
          Are you sure you want to delete this service? You can restore it later.
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => toast.dismiss(t)}
            className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg hover:cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t);
              setProcessingId(serviceId);
              try {
                await deleteService(serviceId);
                setServices(services.map(s =>
                  s._id === serviceId ? { ...s, isDeleted: true } : s
                ));
                toast.success('Service deleted successfully');
              } catch (error) {
                const errorMsg = error.response?.data?.message || 'Failed to delete service';
                toast.error(errorMsg);
              } finally {
                setProcessingId(null);
              }
            }}
            className="px-3 py-1.5 bg-red-600 text-white hover:bg-red-700 rounded-lg hover:cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    ));
  };

  // Handle service restoration
  const handleRestoreService = (serviceId) => {
    toast.custom((t) => (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-full max-w-md">
        <h3 className="font-medium text-gray-800 mb-2">Restore Service</h3>
        <p className="text-gray-600 mb-4">
          Are you sure you want to restore this service?
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => toast.dismiss(t)}
            className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t);
              setProcessingId(serviceId);
              try {
                await restoreService(serviceId);
                setServices(services.map(s =>
                  s._id === serviceId ? { ...s, isDeleted: false } : s
                ));
                toast.success('Service restored successfully');
              } catch (error) {
                const errorMsg = error.response?.data?.message || 'Failed to restore service';
                toast.error(errorMsg);
              } finally {
                setProcessingId(null);
              }
            }}
            className="px-3 py-1.5 bg-green-600 text-white hover:bg-green-700 rounded-lg"
          >
            Restore
          </button>
        </div>
      </div>
    ));
  };

  if (loading && services.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Toaster position="top-right" richColors expand={false} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
       <div className="flex items-center">
          <Brush className="text-blue-600 mr-3" size={24} />
          <h1 className="text-2xl font-bold text-gray-800">Services Management</h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-grow max-w-md">
            <input
              type="text"
              placeholder="Search services..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={loading}
            />
            <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
            {loading && (
              <div className="absolute right-3 top-2.5">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>

          {/* Add Service Button */}
          <button
            onClick={() => setCreateModalVisible(true)}
            className="flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap hover:cursor-pointer"
            disabled={loading}
          >
            <Plus size={18} className="mr-2" />
            Add New Service
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="font-medium text-gray-700 flex items-center">
            <Filter size={16} className="mr-2 text-blue-500" />
            Filters:
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between min-w-40"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              disabled={loading}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="deleted">Deleted</option>
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min price"
              className="w-24 px-3 py-2 border border-gray-200 rounded-lg"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              min="0"
              step="0.01"
              disabled={loading}
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max price"
              className="w-24 px-3 py-2 border border-gray-200 rounded-lg"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              min="0"
              step="0.01"
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* Services Grid */}
      {loading && services.length > 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-500">
              {debouncedSearchQuery ? 'No services match your search' : 'No services available'}
            </div>
          ) : (
            services.map((service) => (
              <div
                key={service._id}
                className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow relative ${service.isDeleted ? 'opacity-80' : ''
                  }`}
              >
                {/* Status Badge */}
                <div className="absolute top-2 right-2 z-10">
                  <div className={`flex items-center px-2 py-1 rounded-full text-xs ${service.isDeleted
                      ? 'bg-red-100 text-red-600'
                      : 'bg-green-100 text-green-600'
                    }`}>
                    {service.isDeleted ? (
                      <>
                        <XCircle size={14} className="mr-1" />
                        <span>Deleted</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle size={14} className="mr-1" />
                        <span>Active</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Service Image */}
                <div className="h-48 bg-gray-100 overflow-hidden relative">
                  {service.imageUrl ? (
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image Available
                    </div>
                  )}
                </div>

                {/* Service Basic Info */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{service.name}</h3>
                    <div className="flex items-center bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs">
                      <span>{service.basePrice} JOD</span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-3">{service.description}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      <span>{service.estimatedDuration} hours</span>
                    </div>
                    <div className="flex items-center">
                      <Star size={14} className="mr-1 text-yellow-500 fill-yellow-500" />
                      <span>
                        {service.averageRating || 0} ({service.reviewCount || 0} reviews)
                      </span>
                    </div>
                  </div>

                  {/* Expand/Collapse Button */}
                  <button
                    onClick={() => toggleServiceExpand(service._id)}
                    className="w-full flex items-center justify-center py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium"
                    disabled={loading}
                  >
                    {expandedService === service._id ? (
                      <>
                        <span className='hover:cursor-pointer'>Show Less</span>
                        <ChevronUp size={16} className="ml-1" />
                      </>
                    ) : (
                      <>
                        <span className='hover:cursor-pointer'>Show Details</span>
                        <ChevronDown size={16} className="ml-1" />
                      </>
                    )}
                  </button>

                  {/* Expanded Details */}
                  {expandedService === service._id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="font-medium text-gray-700 mb-2">Detailed Description</h4>
                      <p className="text-gray-600 text-sm mb-4">{service.detailedDescription}</p>

                      <h4 className="font-medium text-gray-700 mb-2">Included Services</h4>
                      <ul className="space-y-3 mb-4">
                        {service.includedServices?.map((item, index) => (
                          <li key={index} className="pl-3 border-l-2 border-blue-200">
                            <h5 className="font-medium text-gray-800">{item.title}</h5>
                            <p className="text-gray-600 text-sm">{item.description}</p>
                          </li>
                        ))}
                      </ul>

                      <div className="text-gray-500 text-sm">
                        Created: {new Date(service.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-200">
                    {!service.isDeleted && (
                      <>
                        <button
                          onClick={() => {
                            setCurrentService(service);
                            setEditModalVisible(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                          title="Edit service"
                          disabled={loading}
                        >
                          <Edit2 size={16} className='hover:cursor-pointer'/>
                        </button>
                        <button
                          onClick={() => handleDeleteService(service._id)}
                          disabled={processingId === service._id || loading}
                          className={`p-2 text-red-600 hover:bg-red-50 rounded-full ${processingId === service._id || loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          title="Delete service"
                        >
                          {processingId === service._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          ) : (
                            <Trash2 size={16} className='hover:cursor-pointer'/>
                          )}
                        </button>
                      </>
                    )}
                    {service.isDeleted && (
                      <button
                        onClick={() => handleRestoreService(service._id)}
                        disabled={processingId === service._id || loading}
                        className={`p-2 text-green-600 hover:bg-green-50 rounded-full ${processingId === service._id || loading ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        title="Restore service"
                      >
                        {processingId === service._id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                        ) : (
                          <RotateCw size={16} />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1 || loading}
              className={`p-2 rounded-md ${pagination.page === 1 || loading ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
            >
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
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${pagination.page === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={loading}
                >
                  {pageNum}
                </button>
              );
            })}

            {pagination.pages > 5 && pagination.page < pagination.pages - 2 && (
              <span className="px-2">...</span>
            )}

            {pagination.pages > 5 && pagination.page < pagination.pages - 2 && (
              <button
                onClick={() => handlePageChange(pagination.pages)}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${pagination.page === pagination.pages
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {pagination.pages}
              </button>
            )}

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages || loading}
              className={`p-2 rounded-md ${pagination.page === pagination.pages || loading ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      <>
        <CreateServiceModal
          visible={createModalVisible}
          onClose={() => setCreateModalVisible(false)}
          onSuccess={(newService) => {
            setServices(prev => [newService, ...prev]);
            setCreateModalVisible(false);
          }}
        />
        <EditServiceModal
          visible={editModalVisible}
          service={currentService}
          onClose={() => setEditModalVisible(false)}
          onSuccess={(updatedService) => {
            setServices(prev =>
              prev.map(s => s._id === updatedService._id ? updatedService : s)
            );
            setEditModalVisible(false);
          }}
        />
      </>
    </div>
  );
}

export default Services;