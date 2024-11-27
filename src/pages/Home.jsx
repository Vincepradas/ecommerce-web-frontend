import React, { useState } from "react";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ProductCard from "../components/ProductCard";
import useFetch from "../hooks/useFetch";
import config from "../config";

const Home = () => {
    const { data: products, loading } = useFetch(`${config.API_URL}/products`);
    const [filter, setFilter] = useState(null); // Category filter

    // Filtered and sorted products
    const filteredProducts = products?.filter((product) =>
        filter ? product.category === filter : true
    );

    // Unique categories for filter buttons
    const categories = [...new Set(products?.map((product) => product.category))];

    return (
        <div className="home bg-neutral-100 py-6">
            <div className="container mx-auto mt-10 px-4 md:px-8">
                <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 text-center mb-6">
                    Products
                </h2>
                {/* Category Filter Buttons */}
                <div className="mb-4 flex space-x-2 justify-center">
                    <button
                        className={`px-4 py-2 rounded-lg ${
                            !filter ? "bg-blue-500 text-white" : "bg-gray-200"
                        }`}
                        onClick={() => setFilter(null)}
                    >
                        All
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category}
                            className={`px-4 py-2 rounded-lg ${
                                filter === category ? "bg-blue-500 text-white" : "bg-gray-200"
                            }`}
                            onClick={() => setFilter(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>
                {/* Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {loading
                        ? Array(4)
                            .fill()
                            .map((_, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-neutral-200 p-4 rounded-lg shadow-lg border border-neutral-300"
                                >
                                    <Skeleton height={200} />
                                    <Skeleton height={20} className="mt-4" />
                                    <Skeleton height={15} width="80%" />
                                </motion.div>
                            ))
                        : filteredProducts &&
                        filteredProducts.length > 0 &&
                        filteredProducts.map((product, index) => (
                            <motion.div
                                key={product._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                </div>
                {/* No Products Found */}
                {!loading && filteredProducts?.length === 0 && (
                    <p className="text-center text-gray-500 mt-6">
                        No products found in this category.
                    </p>
                )}
            </div>
        </div>
    );
};

export default Home;
