import React from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import { motion } from "framer-motion";
import useFetch from "../hooks/useFetch";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import config from "../config"

const ProductDetails = () => {
    const { id } = useParams();
    const { data: product, loading, error } = useFetch(`${config.API_URL}/products/${id}`);

    if (loading)
        return (
            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Skeleton for Image Slider */}
                    <Skeleton height={400} className="w-full" />

                    {/* Skeleton for Product Details */}
                    <div>
                        <Skeleton height={30} width={200} className="mb-4" />
                        <Skeleton count={4} height={20} className="mb-2" />
                        <Skeleton height={40} width={150} className="mt-6" />
                    </div>
                </div>
            </div>
        );

    if (error)
        return (
            <motion.div
                className="text-center text-red-500 mt-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                Error loading product details
            </motion.div>
        );

    return (
        <motion.div
            className="product-details container mx-auto px-4 py-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image Slider Section */}
                <motion.div
                    className="relative"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <Swiper
                        modules={[Pagination, Navigation]}
                        pagination={{ clickable: true }}
                        navigation
                        className="h-96 w-full"
                    >
                        {product.media.map((mediaItem, index) => (
                            <SwiperSlide key={index}>
                                <img
                                    src={mediaItem.url}
                                    alt={`${product.name} ${index}+1`}
                                    className="h-full w-full object-contain"
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </motion.div>

                {/* Product Details Section */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                >
                    <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
                    <p className="mt-4 text-gray-600">{product.description}</p>
                    <h4 className="mt-4 text-gray-600 font-semibold">
                        Category: <span className="font-normal">{product.category}</span>
                    </h4>
                    <h4 className="mt-4 text-gray-600 font-semibold">
                        Tags: <span className="font-normal">{product.tags.join(", ")}</span>
                    </h4>
                    <h4 className="mt-4 text-gray-600 font-semibold">
                        Weight: <span className="font-normal">{product.weight}</span>
                    </h4>
                    <h4 className="mt-4 text-gray-600 font-semibold">
                        Rating: <span className="font-normal">{product.rating}</span>
                    </h4>
                    <p className="mt-4 text-blue-600 font-bold text-2xl">
                        {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "PHP",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }).format(parseFloat(product.price))}
                    </p>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default ProductDetails;
