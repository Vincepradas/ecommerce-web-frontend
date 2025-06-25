import React, { useState, useContext, useEffect, useCallback } from "react";
import { FaStar } from "react-icons/fa";
import AuthContext from "../context/AuthContext";
import Modal from "../components/LoginModal";

const Reviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [displayedReviews, setDisplayedReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewerName, setReviewerName] = useState("Loading...");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user, loading } = useContext(AuthContext);
  const isAuthenticated = !!localStorage.getItem("authToken");
  const API_URL = "https://ecom-sandras-g6abfyg2azbqekf8.southeastasia-01.azurewebsites.net/";

  const fetchReviews = useCallback(() => {
    fetch(`${API_URL}/api/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error("Error fetching reviews:", data.error);
        } else {
          setReviews(data.reviews || []);
          setDisplayedReviews((data.reviews || []).slice(0, 2));
        }
      })
      .catch((error) => console.error("Error fetching reviews:", error));
  }, [productId]);

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

    fetch(`${API_URL}/api/products/${productId}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ comment: newReview.trim(), rating }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to submit review.");
        }
        return res.json();
      })
      .then(() => {
        const newReviewObj = {
          reviewerName: user?.name || reviewerName,
          rating,
          comment: newReview.trim(),
        };
        setReviews(prevReviews => [newReviewObj, ...prevReviews]);
        setDisplayedReviews(prevDisplayed => {
          const newDisplayed = [newReviewObj, ...prevDisplayed];
          return newDisplayed.slice(0, 2);
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

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return (
    <div className="reviews-section bg-white rounded-lg">
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Reviews</h2>
      <div className="reviews-list space-y-4 mb-6">
        {displayedReviews.length > 0 ? (
          displayedReviews.map((review, index) => (
            review && (
              <div key={index} className="review bg-gray-100 p-3 rounded-md shadow-sm">
                <h1 className="text-gray-600 font-bold">{review.reviewerName}</h1>
                <div className="flex items-center space-x-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < review.rating ? "text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                  <span className="text-gray-600 text-sm">{review.rating}/5</span>
                </div>
                <p className="text-gray-700 text-sm">{review.comment}</p>
              </div>
            )
          ))
        ) : (
          <p className="text-gray-500 text-sm">No reviews yet. Be the first to leave one!</p>
        )}
      </div>

      {displayedReviews.length < reviews.length && (
        <div className="text-center mb-6">
          <button
            onClick={loadMoreReviews}
            className=" border border-black/50 text-gray-700 px-4 py-[3px] rounded-md hover:bg-gray-200 transition"
          >
            Load more
          </button>
        </div>
      )}

      {isAuthenticated ? (
        <div className="add-review bg-white p-4 rounded-md shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Add a Review</h3>
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`cursor-pointer ${
                  i < rating ? "text-yellow-300 text-2xl mx-1" : "text-gray-300 text-2xl mx-1"
                }`}
                onClick={() => setRating(i + 1)}
              />
            ))}
          </div>
          <textarea
            className="w-full p-2 border border-gray-300 rounded mb-4 resize-none"
            rows="3"
            placeholder="Write your review here..."
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
          />
          <button
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
            onClick={submitReview}
          >
            Submit Review
          </button>
        </div>
      ) : (
        <p className="text-gray-500 text-sm text-center">
          Please log in or sign up to submit a review   
        </p>
      )}
    </div>
  );
};

export default Reviews;