import React, {useState, useEffect, useRef} from "react";
import {useParams} from "react-router-dom";
import Modal from "../components/LoginModal"; // Import the Modal component
import {PrimaryButton, SecondaryButton} from "../components/Button";
import config from "../config";
import {FaStar} from "react-icons/fa";
import {Swiper, SwiperSlide} from "swiper/react"; // Import Swiper for image slider
import "swiper/swiper-bundle.css"; // Import Swiper styles for newer versions
import {Navigation} from "swiper"; // Import Navigation module from Swiper

const ProductDetails = () => {
    const {id} = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({rating: 0, review: ""});
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(true);
    const swiperRef = useRef(null); // Reference to Swiper instance

    // Fetch product details
    useEffect(() => {
        fetch(`${config.API_URL}/products/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setProduct(data);
                setReviews(data.reviews || []); // Set reviews if available
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    // Handle modal login/signup actions
    const handleLogin = () => {
        setIsModalOpen(false);
        // Redirect to login page or show login form
    };

    const handleSignup = () => {
        setIsModalOpen(false);
        // Redirect to signup page or show signup form
    };

    // Handle add to cart and buy now actions
    const handleAddToCart = () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            setIsModalOpen(true);
            return;
        }
        // Add to cart logic
    };

    const handleBuyNow = () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            setIsModalOpen(true);
            return;
        }
        // Buy now logic
    };

    // Handle adding a review
    const handleAddReview = () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            setIsModalOpen(true);
            return;
        }

        if (!newReview.rating || !newReview.review) {
            alert("Please fill out both rating and review fields.");
            return;
        }

        fetch(`${config.API_URL}/products/${id}/reviews`, {
            method: "POST", headers: {
                "Content-Type": "application/json", Authorization: `Bearer ${token}`,
            }, body: JSON.stringify(newReview),
        })
            .then((res) => res.json())
            .then((addedReview) => {
                setReviews((prev) => [addedReview, ...prev]);
                setNewReview({rating: 0, review: ""});
            })
            .catch((err) => console.error(err));
    };

    // Function to go to the next slide manually
    const handleNextImage = () => {
        if (swiperRef.current) {
            swiperRef.current.swiper.slideNext(); // Move to the next image
        }
    };

    return (<div className="product-details container mx-auto px-6 py-12">
            {/* Modal for Login/Signup */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onLogin={handleLogin}
                onSignup={handleSignup}
            />

            {/* Product Header Section */}
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center mb-12">
                {/* Image Section - Swiper for Image Slider */}
                <div className="w-full md:w-1/2 relative">
                    {product.media && product.media.length > 0 ? (<>
                            <Swiper
                                spaceBetween={10}
                                slidesPerView={1}
                                navigation
                                pagination={{clickable: true}}
                                modules={[Navigation]} // Import Swiper Navigation module
                                ref={swiperRef} // Set the reference to Swiper instance
                            >
                                {product.media.map((mediaItem, index) => (<SwiperSlide key={index}>
                                        <img
                                            src={mediaItem.url}
                                            alt={`${product.name} ${index + 1}`}
                                            className="h-full w-full object-contain"
                                        />
                                    </SwiperSlide>))}
                            </Swiper>
                            {/* Next Image Button */}
                            <button
                                onClick={handleNextImage}
                                className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-blue-500 text-white p-3 rounded-full shadow-lg"
                            >
                                Next
                            </button>
                        </>) : (<p>No media available for this product.</p>)}
                </div>

                {/* Product Details */}
                <div className="w-full md:w-1/2">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                    <p className="text-lg text-gray-600 mb-4">{product.description}</p>
                    <div className="flex items-center space-x-2">
                        <span className="flex space-x-1">
                            {[...Array(5)].map((_, i) => (<FaStar
                                    key={i}
                                    className={i < product.rating ? "text-yellow-500" : "text-gray-300"}
                                />))}
                        </span>
                        <span className="text-gray-500">{product.rating}/5</span>
                    </div>

                    {/* Price */}
                    <p className="text-2xl font-semibold text-blue-600 mt-4">
                        {new Intl.NumberFormat("en-US", {
                            style: "currency", currency: "PHP",
                        }).format(product.price)}
                    </p>

                    {/* Buttons */}
                    <div className="mt-6 space-x-4">
                        <PrimaryButton onClick={handleBuyNow}>Buy Now</PrimaryButton>
                        <SecondaryButton onClick={handleAddToCart}>Add to Cart</SecondaryButton>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="reviews mt-10">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Customer Reviews</h3>
                {reviews.length === 0 ? (<p className="text-gray-500">No reviews yet. Be the first to review this
                        product!</p>) : (reviews.map((review, index) => (
                        <div key={index} className="review bg-white p-4 rounded-lg shadow mb-4">
                            <div className="flex items-center space-x-2">
                    <span className="flex space-x-1">
                            {[...Array(5)].map((_, i) => (<FaStar
                                key={i}
                                className={i < review.rating ? "text-yellow-500" : "text-gray-300"}
                            />))}
                        </span>
                                <span className="text-gray-600">{review.rating}/5</span>
                            </div>
                            <p className="text-gray-700 mt-2">{review.comment}</p>
                            <p className="text-gray-500 text-sm">By {review.reviewerName}</p>
                        </div>)))}

                {/* Add Review Section */}
                <div className="add-review mt-8">
                    <h4 className="text-lg font-semibold text-gray-800">Add a Review</h4>
                    <div className="mt-4">
                        <div className="flex items-center space-x-4">
                            {[1, 2, 3, 4, 5].map((rating) => (<span
                                    key={rating}
                                    className={`cursor-pointer ${newReview.rating >= rating ? "text-yellow-500" : "text-gray-400"}`}
                                    onClick={() => setNewReview((prev) => ({...prev, rating}))}
                                >
                                    <FaStar/>
                                </span>))}
                        </div>
                        <textarea
                            value={newReview.review}
                            onChange={(e) => setNewReview((prev) => ({...prev, review: e.target.value}))}
                            placeholder="Write your review..."
                            className="mt-4 w-full p-3 border border-gray-300 rounded-lg"
                        ></textarea>
                        <button
                            onClick={handleAddReview}
                            className="mt-4 w-full bg-blue-500 text-white p-3 rounded-lg"
                        >
                            Submit Review
                        </button>
                    </div>
                </div>
            </div>
        </div>);
};

export default ProductDetails;
