import React, { useState, useContext, useEffect, useCallback } from "react";
import { FaStar } from "react-icons/fa";
import AuthContext from "../context/AuthContext";
import Modal from "../components/LoginModal";

const Reviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [displayedReviews, setDisplayedReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const isAuthenticated = !!localStorage.getItem("authToken");
  const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

  const fetchReviews = useCallback(() => {
    fetch(`${REACT_APP_API_URL}/reviews/product/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error("Error fetching reviews:", data.error);
        } else {

          const reviewsArray = Array.isArray(data) ? data : (data.reviews || []);
          setReviews(reviewsArray);
          setDisplayedReviews(reviewsArray.slice(0, 2));
        }
      })
      .catch((error) => console.error("Error fetching reviews:", error));
  }, [productId, REACT_APP_API_URL]);

  const loadMoreReviews = () => {
    const currentLength = displayedReviews.length;
    const newReviews = reviews.slice(0, currentLength + 2);
    setDisplayedReviews(newReviews);
  };

  const submitReview = () => {
    if (!newReview.trim() || rating === 0) {
      alert("Please provide both a review and a rating.");
      return;
    }

    const token = user?.token || localStorage.getItem("authToken");
    if (!token) {
      console.log("Unauthorized - No token found");
      return;
    }

    fetch(`${REACT_APP_API_URL}/reviews/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId,
        comment: newReview.trim(),
        rating
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to submit review.");
        }
        return res.json();
      })
      .then((data) => {

        const userName = user?.name || localStorage.getItem("userName") || "Anonymous";
        const userId = user?.id || localStorage.getItem("userId");

        const newReviewObj = {
          _id: data._id || Date.now().toString(),
          productId: productId,
          userId: {
            _id: userId,
            name: userName
          },
          rating,
          comment: newReview.trim(),
          createdAt: new Date().toISOString()
        };


        setReviews(prevReviews => [newReviewObj, ...prevReviews]);
        setDisplayedReviews(prevDisplayed => {
          const newDisplayed = [newReviewObj, ...prevDisplayed];
          return newDisplayed.slice(0, Math.max(2, prevDisplayed.length));
        });

        setNewReview("");
        setRating(0);
        alert("Review submitted successfully!");
      })
      .catch((error) => {
        console.error("Error submitting review:", error);
        alert("Failed to submit review. Please try again later.");
      });
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';

      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return '';
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return (
    <div className="reviews-section bg-white rounded-lg">
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <h2 className="text-xl font-medium mb-4 text-[#1F2232] font-poppins">
        Customer Reviews ({reviews.length})
      </h2>

      <div className="reviews-list space-y-4 mb-6">
        {displayedReviews.length > 0 ? (
          displayedReviews.map((review, index) => (
            review && (
              <div key={review._id || index} className="review bg-gray-100 p-4 rounded-md shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-gray-800 font-medium">
                    {review.userId?.name || review.reviewerName || "Anonymous"}
                  </h3>
                  {review.createdAt && (
                    <span className="text-xs text-gray-500">
                      {formatDate(review.createdAt)}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < review.rating ? "text-yellow-400" : "text-gray-300"}
                      size={16}
                    />
                  ))}
                  <span className="text-gray-600 text-sm ml-1">{review.rating}/5</span>
                </div>

                <p className="text-gray-700 text-sm">{review.comment}</p>
              </div>
            )
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">
              No reviews yet. Be the first to leave one!
            </p>
          </div>
        )}
      </div>

      {displayedReviews.length < reviews.length && (
        <div className="text-center mb-6">
          <button
            onClick={loadMoreReviews}
            className="border border-black/50 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition"
          >
            Load more ({reviews.length - displayedReviews.length} remaining)
          </button>
        </div>
      )}

      {isAuthenticated ? (
        <div className="add-review bg-white p-4 rounded-md shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Add a Review</h3>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`cursor-pointer transition-colors ${i < rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  size={28}
                  onClick={() => setRating(i + 1)}
                  onMouseEnter={() => { }}
                />
              ))}
              {rating > 0 && (
                <span className="ml-3 text-sm text-gray-600">
                  {rating} out of 5 stars
                </span>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              rows="4"
              placeholder="Share your experience with this product..."
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              maxLength={500}
            />
            <div className="text-xs text-gray-500 text-right mt-1">
              {newReview.length}/500 characters
            </div>
          </div>

          <button
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={submitReview}
            disabled={!newReview.trim() || rating === 0}
          >
            Submit Review
          </button>
        </div>
      ) : (
        <div className="text-center p-6 bg-gray-50 rounded-md">
          <p className="text-gray-600 mb-3">
            Want to share your experience with this product?
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
          >
            Sign In to Review
          </button>
        </div>
      )}
    </div>
  );
};

export default Reviews;