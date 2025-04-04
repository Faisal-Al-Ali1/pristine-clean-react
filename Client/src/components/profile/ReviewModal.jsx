import React, { useState } from 'react';
import { Star, X, Send } from 'lucide-react';

const ReviewModal = ({ booking, onClose, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(booking._id, rating, comment);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center p-4 z-50 transition-all">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[95vh] flex flex-col transform transition-all duration-300">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white p-5 border-b flex justify-between items-center z-10 rounded-t-xl">
          <h1 className="text-xl font-bold text-gray-800">Leave a Review</h1>
          <button 
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto flex-1 p-6">
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              {booking.serviceName || 'Service'}
            </h2>
            <p className="text-gray-600 text-sm">
              {new Date(booking.date).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                How would you rate this service?
              </label>
              <div className="flex gap-2 justify-center bg-gray-50 p-4 rounded-lg">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none disabled:opacity-50 transform transition-transform hover:scale-110"
                    disabled={isSubmitting}
                  >
                    <Star
                      size={36}
                      className={
                        star <= rating 
                          ? 'fill-amber-400 text-amber-400' 
                          : 'text-gray-300'
                      }
                    />
                  </button>
                ))}
              </div>
              <p className="text-center mt-2 text-gray-600 text-sm">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </p>
            </div>

            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Share your experience
              </label>
              <textarea
                id="comment"
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 transition-colors"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you like about the service? How could we improve?"
                disabled={isSubmitting}
              ></textarea>
              <p className="mt-2 text-xs text-gray-500">
                Your feedback helps us improve our services and assists other customers.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Submitting...' : (
                  <>
                    Submit Review
                    <Send size={16} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;