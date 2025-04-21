import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { Calendar, User } from 'lucide-react';
import CleanerHeader from './CleanerHeader';
import BookingsTab from './BookingTab';
import ProfileTab from './ProfileTab';
import { getCleanerBookings, completeBooking, getCleanerProfile } from '../../api/cleaners';

export default function CleanerPage() {
    const [activeTab, setActiveTab] = useState('bookings');
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [cleaner, setCleaner] = useState(null);
    const [bookingFilter, setBookingFilter] = useState('confirmed');
    const [pagination, setPagination] = useState({
      page: 1,
      limit: 5,
      total: 0,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false
    });
  
    useEffect(() => {
      const fetchBookings = async () => {
        if (activeTab === 'bookings') {
          try {
            setLoading(true);
            const response = await getCleanerBookings(
              bookingFilter, 
              pagination.page, 
              pagination.limit
            );
            setBookings(response.data || []);
            setPagination({
              page: response.currentPage,
              limit: pagination.limit,
              total: response.total,
              totalPages: response.totalPages,
              hasNextPage: response.hasNextPage,
              hasPreviousPage: response.hasPreviousPage
            });
          } catch (error) {
            toast.error(error.message || 'Failed to load bookings');
            setBookings([]);
          } finally {
            setLoading(false);
          }
        }
      };
  
      fetchBookings();
    }, [activeTab, bookingFilter, pagination.page]);
  
    useEffect(() => {
      const fetchProfile = async () => {
        if (activeTab === 'profile') {
          try {
            setLoading(true);
            const profile = await getCleanerProfile();
            setCleaner(profile || null);
          } catch (error) {
            toast.error(error.message || 'Failed to load profile');
            setCleaner(null);
          } finally {
            setLoading(false);
          }
        }
      };
  
      fetchProfile();
    }, [activeTab]);
  
    const handleCompleteBooking = async (bookingId) => {
      try {
        setUpdatingStatus(true);
        await completeBooking(bookingId);
        toast.success('Booking marked as completed!');
        
        // Refresh bookings after completion
        const response = await getCleanerBookings(
          bookingFilter, 
          pagination.page, 
          pagination.limit
        );
        setBookings(response.data || []);
        setPagination({
          page: response.currentPage,
          limit: pagination.limit,
          total: response.total,
          totalPages: response.totalPages,
          hasNextPage: response.hasNextPage,
          hasPreviousPage: response.hasPreviousPage
        });
      } catch (error) {
        toast.error(error.message || 'Failed to complete booking');
      } finally {
        setUpdatingStatus(false);
      }
    };
  
    const handleFilterChange = (filter) => {
      setBookingFilter(filter);
      setPagination(prev => ({ ...prev, page: 1 })); 
    };
  
    const handlePageChange = (newPage) => {
      setPagination(prev => ({ ...prev, page: newPage }));
    };
  
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <CleanerHeader cleanerName={cleaner?.name || "Cleaner"} />
  
        <main className="container mx-auto flex-grow p-4">
          <div className="flex border-b mb-6">
            <button 
              className={`flex items-center px-4 py-2 font-medium ${activeTab === 'bookings' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-500'} hover:cursor-pointer`}
              onClick={() => setActiveTab('bookings')}
            >
              <Calendar size={18} className="mr-2" />
              My Bookings
            </button>
            <button 
              className={`flex items-center px-4 py-2 font-medium ${activeTab === 'profile' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-500'} hover:cursor-pointer`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={18} className="mr-2" />
              Profile
            </button>
          </div>
  
          <div className="bg-white p-6 rounded-lg shadow-sm">
            {activeTab === 'bookings' ? (
              <BookingsTab
                bookings={bookings}
                loading={loading}
                bookingFilter={bookingFilter}
                handleFilterChange={handleFilterChange}
                handleCompleteBooking={handleCompleteBooking}
                updatingStatus={updatingStatus}
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            ) : (
                <ProfileTab 
                cleaner={cleaner}
                loading={loading}
                onProfileUpdate={(updatedProfile) => {
                  setCleaner(updatedProfile);
                }}
              />
            )}
          </div>
        </main>
  
        <footer className="bg-gray-100 border-t p-4 mt-8">
          <div className="container mx-auto text-center text-gray-600 text-sm">
            <p>© 2025 Pristine Clean. All rights reserved.</p>
          </div>
        </footer>
  
        <Toaster position="top-right" richColors />
      </div>
    );
  }