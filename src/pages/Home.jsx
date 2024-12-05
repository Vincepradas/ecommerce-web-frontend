import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ProductCard from "../components/ProductCard";
import useFetch from "../hooks/useFetch";
import config from "../config";
import images from "../assets/images";

const Home = () => {
  const { banner, bannerDesktop } = images;
  const { data: products, loading } = useFetch(`${config.API_URL}/products`);
  const [filter, setFilter] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  const filteredProducts = products?.filter((product) =>
    filter ? product.category === filter : true
  );

  const categories = [...new Set(products?.map((product) => product.category))];

  return (
    <div className="home bg-white py-2">
      <div className="container mx-auto mt-1 px-4 md:px-8">
        {/* Banner Section */}
        <div className="mb-8">
          <div className="relative -mx-4 md:-mx-8">
            {/* Mobile Banner */}
            <img
              src={banner}
              alt="Mobile Banner"
              className="w-full h-full sm:h-64 md:hidden object-cover"
            />

            {/* Desktop Banner */}
            <img
              src={bannerDesktop}
              alt="Desktop Banner"
              className="hidden md:block w-full h-full sm:h-64 md:h-80 lg:h-[400px] object-cover"
            />
          </div>
        </div>

        {/* Welcome Section */}
        <h2 className="font-fuzzy font-black text-3xl md:text-4xl text-[#1F2232] text-center mb-6">
          Welcome to <span className="text-[#FF6F00]">Sandra's</span>
          <br />
          <span className="relative inline-block">
            <span className="font-normal text-sm text-gray-600 mt-2 block font-poppins">
              <span className="font-bold">Note:</span> Delivery is currently
              available only within
              <span className="font-bold"> Cantilan - Madrid</span>. Kindly
              check if your location is eligible for delivery during checkout.
            </span>
          </span>
        </h2>

        {/* Category Filter Buttons */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-4 justify-start items-center font-slick">
            <button
              className={`px-6 py-2 transition hover:border-b-2 hover:border-[#FF6F00] ${
                !filter
                  ? "border-b-2 border-[#FF6F00] text-gray-700 font-bold"
                  : " text-gray-700"
              }`}
              onClick={() => setFilter(null)}
            >
              Home
            </button>
            {categories.map((category) => (
              <button
                key={category}
                className={`px-6 py-2  transition hover:border-b-2 hover:border-[#FF6F00] ${
                  filter === category
                    ? "border-b-2 border-[#FF6F00] font-bold text-gray-700 "
                    : " text-gray-700"
                }`}
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
      <SimpleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

const SimpleModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-700 bg-opacity-50 backdrop-blur-sm font-slick">
      <div className="bg-white p-6 rounded-lg shadow-lg w-100 mx-2">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Welcome to <span className="font-fuzzy text-[#FF6F00]"> Sandra's!</span>
        </h2>
        <p className="text-center mb-4 text-gray-600">
          🎉 Enjoy an exclusive{" "}
          <span className="text-[#FF6F00] font-semibold">20% OFF</span> on your
          first purchase! Shop now and save more.
        </p>
        <div className="flex justify-center gap-4">
          <button
            className="bg-black text-white font-bold py-2 px-4 rounded-md hover:bg-[#FF6F00]"
            onClick={onClose}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
