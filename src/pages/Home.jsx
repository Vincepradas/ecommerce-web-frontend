import React from "react";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ProductCard from "../components/ProductCard";
import useFetch from "../hooks/useFetch";
import config from "../config";
const Home = () => {
    const { data: products, loading } = useFetch(`${config.API_URL}/products`);
    // Animation variants for product cards
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="home bg-neutral-100 py-6">
            {/* Hero Section */}
            <div
                className="hero-banner relative bg-cover bg-center h-20 md:h-20 w-full flex items-center justify-center"
                style={{ backgroundImage: `url('/hero-banner.jpg')`, filter: 'grayscale(100%)' }}
            >
                <h1 className="text-4xl md:text-6xl font-bold text-neutral-900">Vince Warren Pradas</h1>
            </div>

            {/* Featured Products Section */}
            <div className="container mx-auto mt-10 px-4 md:px-8">
                <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 text-center mb-6">
                    Featured Products
                </h2>
                <div className="product-grid grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {loading
                        ? Array(4)
                            .fill()
                            .map((_, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-neutral-200 p-4 rounded-lg shadow-lg border border-neutral-300"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Skeleton height={200} />
                                    <Skeleton height={20} className="mt-4" />
                                    <Skeleton height={15} width="80%" />
                                </motion.div>
                            ))
                        : products && products.length > 0 && products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
