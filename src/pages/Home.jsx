import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ProductCard from "../components/ProductCard";
import useFetch from "../hooks/useFetch";
import config from "../config";
import images from "../assets/images";

const ImageSlider = ({ images, interval = 4000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  const getSlideStyle = (index) => {
    const isActive = index === currentIndex;
    return {
      opacity: isActive ? 1 : 0,
      transition: 'opacity 500ms ease-in-out',
      position: index === currentIndex ? 'relative' : 'absolute',
      inset: 0,
    };
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Image Stack */}
      <div className="relative">
        {images.map((image, index) => (
          <div
            key={index}
            style={getSlideStyle(index)}
          >
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-[150px] sm:h-[300px] md:h-[400px] lg:h-[400px] object-cover"
            />
            {(index === 0) && (
              <div 
                className="font-fuzzy absolute inset-0 flex items-center justify-center text-white/90 text-[32px] sm:text-2xl md:text-3xl font-extrabold bg-black/25"
                style={{
                  opacity: getSlideStyle(index).opacity,
                  transition: 'opacity 500ms ease-in-out',
                }}
              >
                MERRY CHRISTMAS
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentIndex === index ? 'bg-white scale-125' : 'bg-white/50 scale-100'
            } hover:scale-125`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  const { banner, newyear, bannerDesktop, banner1 } = images;
  const { data: products, loading } = useFetch(`${config.API_URL}/products`);
  const [filter, setFilter] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const hasSeenModal = localStorage.getItem("hasSeenModal");
    if (!hasSeenModal) {
      setIsModalOpen(true);
      localStorage.setItem("hasSeenModal", "true");
    }
  }, []);

  const filteredProducts = products?.filter((product) =>
    filter ? product.category === filter : true
  );

  const categories = [...new Set(products?.map((product) => product.category))];

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts?.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="home bg-white pb-4">
      <div className="container mx-auto mt-1 px-4 md:px-8">
        {/* Banner Section */}
        <div className="mb-8">
          <div className="relative -mx-4 md:-mx-8 overflow-hidden">
            {/* Mobile Banner */}
            <div className="md:hidden">
              <ImageSlider 
                images={[banner, banner1, newyear]} 
                interval={5000}
              />
            </div>

            {/* Desktop Banner */}
            <div className="hidden md:block">
              <ImageSlider 
                images={[bannerDesktop, bannerDesktop, bannerDesktop]} 
                interval={3000}
              />
            </div>
          </div>
        </div>

        {/* Rest of the component remains the same */}
        <h2 className="font-[times-new-roman] font-extrabold text-5xl md:text-4xl text-[#1F2232] text-center mb-2">
          EXPLORE <span className="text-[#FF6F00]"> SANDRA'S</span>
        </h2>

        {/* Category Filter Buttons */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-4 justify-start items-center font-slick">
            <button
              className={`px-6 py-2 transition hover:border-b-2 hover:border-[#FF6F00] ${
                !filter
                  ? "border-b-2 border-[#FF6F00] text-[#FF6F00] font-bold"
                  : " text-gray-700"
              }`}
              onClick={() => setFilter(null)}
            >
              Home
            </button>
            {categories.map((category) => (
              <button
                key={category}
                className={`px-6 py-2 transition hover:border-b-2 hover:border-[#FF6F00] ${
                  filter === category
                    ? "border-b-2 transition border-[#FF6F00] font-bold text-[#FF6F00]"
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
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg shadow-lg border border-neutral-300"
                  >
                    <Skeleton height={150} />
                    <Skeleton height={20} className="mt-4" />
                    <Skeleton height={15} width="80%" />
                  </div>
                ))
            : currentProducts &&
              currentProducts.length > 0 &&
              currentProducts.map((product) => (
                <div key={product._id}>
                  <ProductCard product={product} />
                </div>
              ))}
        </div>

        {/* No Products Found */}
        {!loading && currentProducts?.length === 0 && (
          <p className="text-center text-gray-500 mt-8 text-lg">
            No products found in this category.
          </p>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-center gap-4 mt-8">
          {filteredProducts && filteredProducts.length > itemsPerPage && (
            <div className="flex gap-2">
              {Array.from(
                { length: Math.ceil(filteredProducts.length / itemsPerPage) },
                (_, index) => index + 1
              ).map((number) => (
                <button
                  key={number}
                  className={`px-4 py-2 rounded-md ${
                    number === currentPage
                      ? "bg-[#FF6F00] text-white"
                      : "bg-gray-300 text-black"
                  }`}
                  onClick={() => paginate(number)}
                >
                  {number}
                </button>
              ))}
            </div>
          )}
        </div>
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
          Welcome to{" "}
          <span className="font-fuzzy text-[#FF6F00]"> Sandra's!</span>
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