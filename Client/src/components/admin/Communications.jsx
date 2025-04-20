import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Filter, 
  Search, 
  Mail,
  MailOpen,
  X, 
  ChevronDown,
  ChevronUp,
  Loader2,
  ChevronLeft,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { getContactSubmissions, updateContactStatus } from '../../api/contact';

function Communications() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    pages: 1
  });

  // State for filters
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  // Fetch contact submissions with filters and pagination
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const filters = {
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        subject: selectedType !== 'all' ? selectedType : undefined
      };
      
      const data = await getContactSubmissions(filters, pagination.page, pagination.limit);
      setContacts(data.data);
      setPagination({
        page: data.currentPage,
        limit: pagination.limit,
        total: data.total,
        pages: data.pages
      });
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error(error.message || 'Failed to load contact submissions');
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset to first page when filters change
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [selectedStatus, selectedType]);

  useEffect(() => {
    fetchContacts();
  }, [selectedStatus, selectedType, pagination.page]);

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Function to get status badge style - updated to match dashboard theme
  const getStatusStyle = (status) => {
    switch(status) {
      case "new":
        return "bg-blue-100 text-blue-600";
      case "read":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Function to get status icon
  const getStatusIcon = (status) => {
    switch(status) {
      case "new":
        return <Mail className="w-4 h-4" />;
      case "read":
        return <MailOpen className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // Filter contacts based on search term (frontend)
  const filteredContacts = contacts.filter(contact => {
    return contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           contact.message.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Function to handle viewing an inquiry (and mark as read)
  const handleViewInquiry = async (inquiry) => {
    // Mark as read if it's new
    if (inquiry.status === "new") {
      try {
        setUpdatingStatus(true);
        await updateContactStatus(inquiry._id, 'read');

        // Update local state
        const updatedContacts = contacts.map(contact => 
          contact._id === inquiry._id 
            ? {...contact, status: 'read', updatedAt: new Date().toISOString()} 
            : contact
        );
        setContacts(updatedContacts);
        inquiry = {...inquiry, status: 'read', updatedAt: new Date().toISOString()};
      } catch (error) {
        console.error('Error updating status:', error);
        toast.error(error.message || 'Failed to update status');
      } finally {
        setUpdatingStatus(false);
      }
    }
    setSelectedInquiry(inquiry);
  };

  // Function to close inquiry details
  const handleCloseInquiry = () => {
    setSelectedInquiry(null);
  };

  // Function to handle pagination
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  // Get subject icon based on type
  const getSubjectIcon = (subject) => {
    switch(subject) {
      case "General Inquiry":
        return "bg-indigo-100 text-indigo-600";
      case "Feedback":
        return "bg-amber-100 text-amber-600";
      case "Support":
        return "bg-green-100 text-green-600";
      default:
        return "bg-blue-100 text-blue-600";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Toaster position="top-right" richColors expand={false} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex items-center">
          <MessageSquare className="text-blue-600 mr-3" size={24} />
          <h1 className="text-2xl font-bold text-gray-800">Communications</h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-grow max-w-md">
            <input
              type="text"
              placeholder="Search inquiries..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
            />
            <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
            {loading && (
              <div className="absolute right-3 top-2.5">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchContacts}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50 hover:cursor-pointer shadow-sm transition-colors"
            disabled={loading}
          >
            <RefreshCw size={16} className={`${loading ? 'animate-spin' : ''}`} />
            Refresh
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
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              disabled={loading}
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="read">Read</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="relative">
            <select
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between min-w-40"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              disabled={loading}
            >
              <option value="all">All Types</option>
              <option value="General Inquiry">General Inquiry</option>
              <option value="Feedback">Feedback</option>
              <option value="Support">Support</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {loading && contacts.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading inquiries...</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
          {/* Inbox area */}
          <div className="flex overflow-hidden" style={{ minHeight: "500px" }}>
            {/* Contact List */}
            <div className={`${selectedInquiry ? 'hidden md:block md:w-2/5' : 'w-full'} border-r overflow-y-auto`}>
              {loading && contacts.length > 0 ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : filteredContacts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500 p-4">
                  <MessageSquare className="h-12 w-12 mb-2" />
                  <p>No inquiries found</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {filteredContacts.map((contact) => (
                    <li 
                      key={contact._id}
                      className={`hover:bg-blue-50 cursor-pointer transition-colors ${selectedInquiry && selectedInquiry._id === contact._id ? 'bg-blue-50' : ''} ${contact.status === 'new' ? 'bg-blue-50' : ''}`}
                      onClick={() => handleViewInquiry(contact)}
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-gray-900 flex items-center">
                            {contact.status === 'new' && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                            )}
                            {contact.name}
                          </h3>
                          <div className="flex items-center bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs">
                            <span>{formatDate(contact.createdAt).split(',')[0]}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full inline-flex items-center ${getStatusStyle(contact.status)}`}>
                            {getStatusIcon(contact.status)}
                            <span className="ml-1 capitalize">{contact.status}</span>
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getSubjectIcon(contact.subject)}`}>
                            {contact.subject}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-3 line-clamp-2">{contact.message}</p>
                        <div className="mt-2 text-sm text-gray-500 flex items-center">
                          <Mail size={14} className="mr-1" />
                          {contact.email}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Detail view */}
            {selectedInquiry ? (
              <div className="flex-1 flex flex-col overflow-hidden bg-white">
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                  <h2 className="font-medium flex items-center">
                    <Mail className="text-blue-500 mr-2" size={18} />
                    Inquiry Details
                  </h2>
                  <button 
                    className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                    onClick={handleCloseInquiry}
                    disabled={updatingStatus}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  {updatingStatus ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <div className="p-4">
                      <div className="mb-6">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-semibold text-gray-800">{selectedInquiry.name}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full inline-flex items-center ${getStatusStyle(selectedInquiry.status)}`}>
                            {getStatusIcon(selectedInquiry.status)}
                            <span className="ml-1 capitalize">{selectedInquiry.status}</span>
                          </span>
                        </div>
                        <p className="text-gray-600 flex items-center mt-1">
                          <Mail size={16} className="mr-2 text-gray-400" />
                          {selectedInquiry.email}
                        </p>
                        <div className="mt-2 text-gray-500 text-sm">
                          {formatDate(selectedInquiry.createdAt)}
                        </div>
                      </div>

                      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Subject</h4>
                        <div className="flex items-center">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full mr-2 ${getSubjectIcon(selectedInquiry.subject)}`}>
                            <MessageSquare size={16} />
                          </span>
                          <p className="text-gray-800 font-medium">{selectedInquiry.subject}</p>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Message</h4>
                        <div className="p-4 border rounded-lg border-gray-200 bg-white">
                          <p className="text-gray-800 whitespace-pre-wrap">{selectedInquiry.message}</p>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Timeline</h4>
                        <div className="p-4 border rounded-lg border-gray-200 bg-white space-y-3">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 h-4 w-4 rounded-full bg-blue-500 mt-1"></div>
                            <div className="ml-3">
                              <p className="text-sm font-medium">Received</p>
                              <p className="text-xs text-gray-500">{formatDate(selectedInquiry.createdAt)}</p>
                            </div>
                          </div>
                          {selectedInquiry.createdAt !== selectedInquiry.updatedAt && (
                            <div className="flex items-start">
                              <div className="flex-shrink-0 h-4 w-4 rounded-full bg-green-500 mt-1"></div>
                              <div className="ml-3">
                                <p className="text-sm font-medium">Read</p>
                                <p className="text-xs text-gray-500">{formatDate(selectedInquiry.updatedAt)}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50 text-gray-500 p-8">
                <div className="text-center max-w-md">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 text-blue-400" />
                  <h3 className="text-lg font-medium">Select an inquiry</h3>
                  <p className="mt-2 text-gray-600">Choose an inquiry from the list to view its details. You'll be able to see the full message and inquiry history.</p>
                </div>
              </div>
            )}
          </div>

          {/* Pagination controls */}
          {pagination.pages > 1 && (
            <div className="flex justify-center mt-8 mb-4">
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
        </div>
      )}
    </div>
  );
}

export default Communications;