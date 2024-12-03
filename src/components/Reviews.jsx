import React, { useState, useContext, useEffect, useCallback } from "react";
import { FaStar } from "react-icons/fa";
import AuthContext from "../context/AuthContext";

const Reviews = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState("");
    const [rating, setRating] = useState(0);
    const [reviewerName, setReviewerName] = useState("Loading...");

    const { user, loading } = useContext(AuthContext); // Access the auth context
    const API_URL = "https://ecomwebapi-gsbbgmgbfubhc8hk.canadacentral-01.azurewebsites.net"; // Use the same API URL

    // Memoize the fetchReviews function using useCallback to prevent unnecessary re-creations
    const fetchReviews = useCallback(() => {
        const token = user?.token || localStorage.getItem('authToken');
        if (!token) {
            console.log("Unauthorized - No token found");
            return;
        }

        fetch(`${API_URL}/api/products/${productId}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("Fetched Reviews Data:", data);
                if (data.error) {
                    console.error("Error fetching reviews:", data.error);
                } else {
                    setReviews(data.reviews || []); // Ensure reviews are in the "reviews" field
                }
            })
            .catch((error) => console.error("Error fetching reviews:", error));
    }, [productId, user]);

    const submitReview = () => {
        if (!newReview.trim() || rating === 0) {
            alert("Please provide both a review and a rating.");
            return;
        }

        const token = user?.token || localStorage.getItem('authToken');
        if (!token) {
            console.log("Unauthorized - No token found");
            return;
        }

        fetch(`${API_URL}/api/products/${productId}/reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ comment: newReview.trim(), rating }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to submit review.");
                }
                return res.json();
            })
            .then((data) => {
                // Directly add the new review to the current state
                setReviews((prevReviews) => [...prevReviews, {
                    reviewerName: user?.name || reviewerName,
                    rating,
                    comment: newReview.trim(),
                }]);
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
    }, [loading, user, fetchReviews]);

    return (
        <div className="reviews-section p-4 bg-white rounded-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Reviews</h2>
            <div className="reviews-list space-y-4 mb-6">
                {reviews.length > 0 ? (
                reviews.map((review, index) => (
                    review ? (  // Check if review is defined
                        <div key={index} className="review bg-gray-100 p-3 rounded-md shadow-sm">
                            <h1 className="text-gray-600 font-bold ">{review.reviewerName}</h1>
                            <div className="flex items-center space-x-1 mb-1">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar
                                        key={i}
                                        className={i < review.rating ? "text-yellow-500" : "text-gray-300"}
                                    />
                                ))}
                                <span className="text-gray-600 text-sm">{review.rating}/5</span>
                            </div>
                            <p className="text-gray-700 text-sm">{review.comment}</p>
                        </div>
                    ) : null // Skip rendering if review is undefined
                ))
            ) : (
                <p className="text-gray-500 text-sm">No reviews yet. Be the first to leave one!</p>
            )}

            </div>


            <h3 className="text-lg font-bold text-gray-900 mb-2">Add a Review</h3>
            <div className="add-review bg-white p-4 rounded-md shadow-sm">
                <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                        <FaStar
                            key={i}
                            className={`cursor-pointer ${i < rating ? "text-yellow-500 text-2xl mx-1" : "text-gray-300 text-2xl mx-1"}`}
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
        </div>
    );
};

export default Reviews;
