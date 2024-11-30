import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

const Reviews = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState("");
    const [rating, setRating] = useState(0);

    const fetchReviews = () => {
        fetch(`/api/products/${productId}/reviews`)
            .then((res) => res.json())
            .then((data) => setReviews(data))
            .catch((error) => console.error("Error fetching reviews:", error));
    };

    const submitReview = () => {
        if (!newReview || rating === 0) return;

        fetch(`/api/products/${productId}/reviews`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ review: newReview, rating }),
        })
            .then((res) => res.json())
            .then((data) => {
                setReviews([...reviews, data]);
                setNewReview("");
                setRating(0);
            })
            .catch((error) => console.error("Error submitting review:", error));
    };

    React.useEffect(() => {
        fetchReviews();
    }, []);

    return (
        <div className="reviews-section p-4 bg-white rounded-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Reviews</h2>
            <div className="reviews-list space-y-4 mb-6">
                {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                        <div key={index} className="review bg-gray-100 p-3 rounded-md shadow-sm">
                            <div className="flex items-center space-x-1 mb-1">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar
                                        key={i}
                                        className={i < review.rating ? "text-yellow-500" : "text-gray-300 "}
                                    />
                                ))}
                                <span className="text-gray-600 text-sm">{review.rating}/5</span>
                            </div>
                            <p className="text-gray-700 text-sm">{review.review}</p>
                        </div>
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