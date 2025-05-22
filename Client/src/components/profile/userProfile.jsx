import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { Tab } from '@headlessui/react';
import { getProfile } from '../../api/users';
import { getUserBookings, cancelBooking, updateBooking, submitReview } from '../../api/bookings';
import ProfileHeader from './ProfileHeader';
import PersonalInfoTab from './PersonalInfoTab';
import UpcomingBookingsTab from './UpcomingBookingsTab';
import BookingHistoryTab from './BookingHistoryTab';
import TabNavigation from './TabNavigation';
import EditBookingModal from './EditBookingModal';
import ReviewModal from './ReviewModal';

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    country: 'Jordan',
  });
  const [bookings, setBookings] = useState({
    upcoming: [],
    past: [],
    loading: false
  });
  const [editingBooking, setEditingBooking] = useState(null);
  const [reviewingBooking, setReviewingBooking] = useState(null);

  // Categorize bookings based on status only
  const categorizeBookings = (bookingsData) => {
    return bookingsData.reduce((acc, booking) => {
      if (booking.status === 'completed' || booking.status === 'canceled') {
        acc.past.push(booking);
      } else {
        // All other statuses (confirmed, pending, etc.) go to upcoming
        acc.upcoming.push(booking);
      }
      return acc;
    }, { upcoming: [], past: [] });
  };

  // Fetch user profile data
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile();

      if (data?.user) {
        setUser(data.user);
        setName(data.user.name);
        setEmail(data.user.email);
        setPhone(data.user.phoneNumber || '');
        setAddress({
          street: data.user.address?.street || '',
          city: data.user.address?.city || '',
          country: 'Jordan',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load your profile');
    } finally {
      setLoading(false);
    }
  };

  // Fetch and categorize user bookings
  const fetchBookings = async () => {
    try {
      setBookings(prev => ({...prev, loading: true}));
      const { data } = await getUserBookings();
      if (!Array.isArray(data)) {
        throw new Error('Invalid bookings data format');
      }
      
      const categorized = categorizeBookings(data);
      setBookings({
        ...categorized,
        loading: false
      });
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load your bookings');
      setBookings(prev => ({...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchBookings();
  }, []);

  // Handle booking cancellation
  const handleCancelBooking = async (bookingId) => {
    try {
      await cancelBooking(bookingId);
      toast.success('Booking cancelled successfully');
      fetchBookings(); // Refresh to re-categorize
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error(error.message || 'Failed to cancel booking');
    }
  };

  // Handle booking edit
  const handleEditBooking = (booking) => {
    setEditingBooking(booking);
  };

  // Handle booking update
  const handleUpdateBooking = async (updatedData) => {
    try {
      const { data: updatedBooking } = await updateBooking(editingBooking._id, updatedData);
      toast.success('Booking updated successfully');
      
      setBookings(prev => {
        // Create new arrays for both upcoming and past bookings
        const newUpcoming = [...prev.upcoming];
        const newPast = [...prev.past];
        
        // Find and remove the booking from whichever array it was in
        const upcomingIndex = newUpcoming.findIndex(b => b._id === updatedBooking._id);
        const pastIndex = newPast.findIndex(b => b._id === updatedBooking._id);
        
        if (upcomingIndex !== -1) {
          newUpcoming.splice(upcomingIndex, 1);
        }
        if (pastIndex !== -1) {
          newPast.splice(pastIndex, 1);
        }
        
        // Add the updated booking to the correct array based on status
        if (updatedBooking.status === 'completed' || updatedBooking.status === 'canceled') {
          newPast.push(updatedBooking);
        } else {
          newUpcoming.push(updatedBooking);
        }
        
        return {
          upcoming: newUpcoming,
          past: newPast,
          loading: false
        };
      });
      
      setEditingBooking(null);
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error(error.message || 'Failed to update booking');
    }
  };

  // Handle submitting a review
  const handleSubmitReview = async (bookingId, rating, comment) => {
    try {
      await submitReview(bookingId, rating, comment);
      toast.success('Review submitted successfully');
      setReviewingBooking(null);
      fetchBookings();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.message || 'Failed to submit review');
    }
  };

  // Handle profile image change
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const newUser = { ...user, profilePicture: URL.createObjectURL(file) };
      setUser(newUser);
      toast.success('Profile picture updated. Save to apply changes.');
    }
  };

  return (
    <section className="py-10 bg-gray-50 min-h-screen">
      <Toaster position="top-right" richColors />
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <ProfileHeader 
            user={user} 
            onProfileImageChange={handleProfileImageChange} 
          />

          <div className="pt-20 px-8 pb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">{name || 'User Profile'}</h1>
            
            <Tab.Group>
              <TabNavigation />
              <Tab.Panels className="mt-6">
                <Tab.Panel>
                  <PersonalInfoTab
                    name={name}
                    setName={setName}
                    email={email}
                    setEmail={setEmail}
                    phone={phone}
                    setPhone={setPhone}
                    address={address}
                    setAddress={setAddress}
                    profilePicture={profilePicture}
                    loading={loading}
                    fetchProfile={fetchProfile}
                  />
                </Tab.Panel>

                <Tab.Panel>
                  <UpcomingBookingsTab
                    bookings={bookings.upcoming}
                    loading={bookings.loading}
                    onCancel={handleCancelBooking}
                    onEdit={handleEditBooking}
                  />
                </Tab.Panel>

                <Tab.Panel>
                  <BookingHistoryTab
                    bookings={bookings.past}
                    loading={bookings.loading}
                    onReview={(booking) => setReviewingBooking(booking)}
                  />
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </div>

      {/* Edit Booking Modal */}
      {editingBooking && (
        <EditBookingModal
          booking={editingBooking}
          onClose={() => setEditingBooking(null)}
          onUpdate={handleUpdateBooking}
        />
      )}

      {/* Review Booking Modal */}
      {reviewingBooking && (
      <ReviewModal
        booking={reviewingBooking}
        onClose={() => setReviewingBooking(null)}
        onSubmit={handleSubmitReview}
      />
    )}
    </section>
  );
};

export default UserProfile;