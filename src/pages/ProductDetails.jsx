import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import Modal from "../components/LoginModal";
import { PrimaryButton, SecondaryButton } from "../components/Button";
import config from "../config";
import { FaStar } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Navigation, Pagination } from "swiper";

const ProductDetails = () => {
    const { id } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(true);
    const swiperRef = useRef(null);

    const isAuthenticated = !!localStorage.getItem("authToken"); // Check for authentication token

    useEffect(() => {
        fetch(`${config.API_URL}/products/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setProduct(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    const discountedPrice = useMemo(() => {
        if (product.discountPercentage) {
            return product.price * (1 - product.discountPercentage / 100);
        }
        return null;
    }, [product.price, product.discountPercentage]);

    const formatPrice = (price) => new Intl.NumberFormat("en-US", {
        style: "currency", currency: "PHP",
    }).format(price);

    const handleAction = (action) => {
        if (!isAuthenticated) {
            setIsModalOpen(true); // Show login modal if not authenticated
        } else {
            action(); // Proceed with the action (buy, add to cart, etc.)
        }
    };

    return (
        <div className="product-details container mx-auto px-6 py-12 ">
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center mb-12">
                {/* Image Section */}
                <div className="w-full md:w-1/2">
                    {product.media?.length > 0 ? (
                        <Swiper
                            spaceBetween={10}
                            slidesPerView={1}
                            navigation
                            pagination={{ clickable: true }}
                            modules={[Navigation, Pagination]}
                            ref={swiperRef}
                        >
                            {product.media.map((mediaItem, index) => (
                                <SwiperSlide key={index}>
                                    <img
                                        src={mediaItem.url}
                                        alt={`${product.name} ${index + 1}`}
                                        className="h-[400px] w-[400px] object-contain mx-auto border border-1px-black rounded-xl"
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <p>No media available for this product.</p>
                    )}
                </div>

                {/* Product Details */}
                <div className="w-full md:w-1/2">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {product.name}
                    </h1>
                    <p className="text-lg text-gray-600 mb-4">{product.description}</p>
                    <p className="text-lg text-gray-600 mb-4">
                        <span className="font-bold">Category:</span> {product.category}
                    </p>
                    <p className="text-lg text-gray-600 mb-4 flex items-center space-x-2">
                        <span className="font-bold">Tags:</span>
                        {product.tags?.map((tag, index) => (
                            <span
                                key={index}
                                className="border border-gray-300 px-2 py-1 rounded-full text-sm text-gray-700"
                            >
                                {tag}
                            </span>
                        ))}
                    </p>

                    <p className="text-lg text-gray-600 mb-4">
                        <span className="font-bold">Discount:</span> {product.discountPercentage}%
                    </p>

                    <div className="flex items-center space-x-2">
                        <span className="flex space-x-1">
                            {[...Array(5)].map((_, i) => (
                                <FaStar
                                    key={i}
                                    className={i < product.rating ? "text-yellow-500" : "text-gray-300"}
                                />
                            ))}
                        </span>
                        <span className="text-gray-500">{product.rating}/5</span>
                    </div>

                    {/* Price Section */}
                    <div className="mt-4">
                        {discountedPrice ? (
                            <>
                                <p className="text-xl text-gray-500 line-through">
                                    {formatPrice(product.price)}
                                </p>
                                <p className="text-2xl font-bold text-green-600">
                                    {formatPrice(discountedPrice)}
                                </p>
                            </>
                        ) : (
                            <p className="text-2xl font-bold text-[#1F2232]">
                                {formatPrice(product.price)}
                            </p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="mt-6 space-x-4">
                        <PrimaryButton onClick={() => handleAction(() => alert("Proceed to Buy"))}>
                            Buy Now
                        </PrimaryButton>
                        <SecondaryButton onClick={() => handleAction(() => alert("Added to Cart"))}>
                            Add to Cart
                        </SecondaryButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
