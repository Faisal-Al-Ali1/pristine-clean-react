import React, { useState } from 'react';
import { X, Image as ImageIcon, Clock, Banknote, FileText, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { createService } from '../../../api/services';

const CreateServiceModal = ({ visible, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    detailedDescription: '',
    basePrice: '',
    estimatedDuration: '',
    includedServices: [{ title: '', description: '' }],
  });
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleIncludedServiceChange = (index, field, value) => {
    const updatedServices = [...formData.includedServices];
    updatedServices[index][field] = value;
    setFormData(prev => ({ ...prev, includedServices: updatedServices }));
  };

  const addIncludedService = () => {
    setFormData(prev => ({
      ...prev,
      includedServices: [...prev.includedServices, { title: '', description: '' }],
    }));
  };

  const removeIncludedService = (index) => {
    const updatedServices = formData.includedServices.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, includedServices: updatedServices }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match('image.*')) {
        toast.error('Please upload an image file (JPEG, PNG)');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
  
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
  if (!formData.name || !formData.description || !formData.basePrice || !formData.estimatedDuration) {
    toast.error('Please fill all required fields');
    return;
  }
    
    if (!imageFile) {
      toast.error('Please upload a service image');
      return;
    }
  
    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Append all fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('detailedDescription', formData.detailedDescription);
      formDataToSend.append('basePrice', formData.basePrice);
      formDataToSend.append('estimatedDuration', formData.estimatedDuration);
      formDataToSend.append('includedServices', JSON.stringify(formData.includedServices));
      
      // Append the image file
      formDataToSend.append('image', imageFile); 

       // For debugging - log what's being sent
    for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }
  
      const response = await createService(formDataToSend);
      toast.success('Service created successfully!');
      onSuccess(response);
      onClose();
    } catch (error) {
      console.error('Error:', error);
      const errorMsg = error.response?.data?.message || 'Failed to create service';
      toast.error(errorMsg.includes('imageURL') ? 'Invalid image upload' : errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-gray-100 max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
          <h3 className="text-lg font-bold text-gray-800">Create New Service</h3>
          <button onClick={onClose} className="text-gray-500 hover:bg-gray-100 p-1 rounded-full">
            <X size={18} />
          </button>
        </div>

        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-2 text-sm font-medium ${activeTab === 'basic' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('basic')}
          >
            Basic Info
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium ${activeTab === 'details' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === 'basic' ? (
            <>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Name *</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Deep Cleaning"
                      required
                    />
                    <FileText size={16} className="absolute left-3 top-2.5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    rows="2"
                    placeholder="Brief description"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (JOD) *</label>
                    <div className="relative">
                      <input
                        type="number"
                        name="basePrice"
                        value={formData.basePrice}
                        onChange={handleChange}
                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                        step="0.01"
                        placeholder="25.00"
                        required
                      />
                      <Banknote size={16} className="absolute left-3 top-2.5 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (hrs) *</label>
                    <div className="relative">
                      <input
                        type="number"
                        name="estimatedDuration"
                        value={formData.estimatedDuration}
                        onChange={handleChange}
                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        min="0.5"
                        step="0.5"
                        placeholder="2.5"
                        required
                      />
                      <Clock size={16} className="absolute left-3 top-2.5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Image *</label>
                  <label className="block border-2 border-dashed border-gray-300 rounded-lg p-3 text-center cursor-pointer hover:border-blue-500 transition-colors">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="h-24 w-full object-contain mx-auto rounded"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center py-2">
                        <ImageIcon size={20} className="text-gray-400 mb-1" />
                        <p className="text-sm text-gray-500">Click to upload image</p>
                        <p className="text-xs text-gray-400">PNG, JPG (max. 5MB)</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      required
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('details')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Next: Details
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Description</label>
                  <textarea
                    name="detailedDescription"
                    value={formData.detailedDescription}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    placeholder="Detailed information about the service"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">Included Services</label>
                    <button
                      type="button"
                      onClick={addIncludedService}
                      className="text-blue-600 hover:text-blue-800 text-xs flex items-center"
                    >
                      <Plus size={12} className="mr-1" />
                      Add Item
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.includedServices.map((service, index) => (
                      <div key={index} className="flex gap-2 items-start">
                        <div className="flex-1 space-y-1">
                          <input
                            type="text"
                            placeholder="Title"
                            value={service.title}
                            onChange={(e) => handleIncludedServiceChange(index, 'title', e.target.value)}
                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                          />
                          <textarea
                            placeholder="Description"
                            value={service.description}
                            onChange={(e) => handleIncludedServiceChange(index, 'description', e.target.value)}
                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                            rows="1"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeIncludedService(index)}
                          className="mt-1.5 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('basic')}
                  className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 border border-gray-200 text-sm"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 text-sm flex items-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : 'Create Service'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateServiceModal;