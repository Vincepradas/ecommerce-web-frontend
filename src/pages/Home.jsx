import React, { useState } from "react";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ProductCard from "../components/ProductCard";
import useFetch from "../hooks/useFetch";
import config from "../config";

const Home = () => {
    const { data: products, loading } = useFetch(`${config.API_URL}/products`);
    const [filter, setFilter] = useState(null);

    const filteredProducts = products?.filter((product) =>
        filter ? product.category === filter : true
    );

    const categories = [...new Set(products?.map((product) => product.category))];

    return (
        <div className="home bg-neutral-100 py-6">
            <div className="container mx-auto mt-10 px-4 md:px-8">
                <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 text-center mb-6">
                    Explore Our Products
                </h2>

                {/* Category Filter Buttons */}
                <div className="mb-6 flex justify-center overflow-x-auto">
                    <div className="flex">
                        <button
                            className={`px-4 rounded-md transition ${
                                !filter
                                    ? "bg-black text-white shadow-lg"
                                    : "bg-gray-100 text-gray-700 border"
                            } `}
                            onClick={() => setFilter(null)}
                        >
                            All
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category}
                                className={`px-4 py-2 rounded-md transition ${
                                    filter === category
                                        ? "bg-black text-white shadow-lg"
                                        : "bg-gray-100 text-gray-700 border"
                                } `}
                                onClick={() => setFilter(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {loading
                        ? Array(4)
                            .fill()
                            .map((_, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-white p-4 rounded-lg shadow-lg border border-neutral-300"
                                >
                                    <Skeleton height={150} />
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
                    <p className="text-center text-gray-500 mt-8 text-lg">
                        No products found in this category.
                    </p>
                )}
            </div>
        </div>
    );
};

export default Home;
