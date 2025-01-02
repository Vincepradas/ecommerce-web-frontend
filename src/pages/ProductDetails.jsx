import React, { useState, useEffect, useRef, useMemo, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "../components/LoginModal";
import { PrimaryButton, SecondaryButton } from "../components/Button";
import config from "../config";
import { FaStar } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Navigation, Pagination } from "swiper";
import Reviews from "../components/Reviews";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion } from "framer-motion";
import "../style/ProductDetails.css";
import AuthContext from "../context/AuthContext";

const ProductDetails = () => {
  let [quantity, setQuantity] = useState(1);
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const swiperRef = useRef(null);
  const isAuthenticated = !!localStorage.getItem("authToken");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

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

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
    }).format(price);

  const handleAction = (action) => {
    if (!isAuthenticated) {
      setIsModalOpen(true);
    } else {
      action();
    }
  };

  const handleCheckout = () => {
    const originalPrice = product.price;
    const finalPrice = discountedPrice || originalPrice;
    const totalPrice = finalPrice * quantity;
    
    const checkoutItem = {
      productId: product._id,
      productName: product.name,
      quantity: quantity,
      price: originalPrice,
      discountPercentage: product.discountPercentage || 0,
      totalPrice: totalPrice
    };
    
    navigate('/checkout', { 
      state: { 
        isDirectCheckout: true,
        directItemData: checkoutItem
      } 
    });
  };

  const handleQuantity = (action) => {
    setQuantity((quantity) => {
      if (action === "increment") {
        return quantity + 1;
      } else if (action === "decrement") {
        return quantity > 1 ? quantity - 1 : 1;
      }
      return quantity;
    });
  };

  const addToCartAPI = async (productId, quantity) => {
    const token = user?.token || localStorage.getItem("authToken");
    if (!token) {
      console.log("Unauthorized - No token found");
      return;
    }

    const url = `${config.API_URL}/cart/add`;

    const payload = {
      productId,
      quantity,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to add to cart: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return (
    <div className="product-details container mx-auto px-4 py-6 md:px-6 md:py-12 font-slick">
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-8">
        <div className="w-full md:w-1/2">
          {loading ? (
            <Skeleton height={400} className="rounded-lg" />
          ) : product.media?.length > 0 ? (
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
                    className="w-full h-auto object-contain rounded-lg"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <p>No media available for this product.</p>
          )}
        </div>

        <div className="w-full md:w-1/2">
          {loading ? (
            <>
              <Skeleton height={30} width="80%" className="mb-2" />
              <Skeleton count={3} height={20} className="mb-4" />
              <Skeleton height={20} width="60%" className="mb-4" />
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-base md:text-lg text-gray-600 mb-4">
                {product.description}
              </p>
              <p className="text-base md:text-lg text-gray-600 mb-4">
                <span className="font-bold">Category:</span> {product.category}
              </p>
              <p className="text-base md:text-lg text-gray-600 mb-4 flex items-center space-x-2">
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
              {product.discountPercentage > 0 && (
                <p className="text-base md:text-lg text-gray-600 mb-4 font-bold">
                  Save {product.discountPercentage}% Off
                </p>
              )}
              <div className="flex items-center space-x-2">
                <span className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={
                        i < product.rating ? "text-yellow-500" : "text-gray-300"
                      }
                    />
                  ))}
                </span>
                <span className="text-gray-500">
                  {product.rating} ({product.reviews?.length || 0})
                </span>
              </div>

              <div className="mt-4 flex justify-between">
                <div>
                  {discountedPrice ? (
                    <>
                      <p className="text-lg md:text-xl text-gray-500 line-through">
                        {formatPrice(product.price)}
                      </p>
                      <p className="text-2xl md:text-2xl font-bold text-green-600">
                        {formatPrice(discountedPrice)}
                      </p>
                    </>
                  ) : (
                    <p className="text-2xl md:text-2xl font-bold text-[#1F2232]">
                      {formatPrice(product.price)}
                    </p>
                  )}
                </div>

                <div className="h-fit flex items-center justify-center col-auto space-x-2 md:text-lg text-md w-fit">
                  <button
                    className="px-3 rounded-lg font-poppins bg-black text-white hover:bg-[#FF6F00]"
                    onClick={() => handleQuantity("decrement")}
                  >
                    -
                  </button>
                  <div className="flex items-center justify-center">
                    <input
                      type="number"
                      disabled
                      value={quantity}
                      className="text-center w-10 rounded-lg bg-gray-200 border-2 border-black"
                    />
                  </div>
                  <button
                    className="px-3 rounded-lg font-poppins bg-black text-white hover:bg-[#FF6F00]"
                    onClick={() => handleQuantity("increment")}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="font-poppins mt-6 flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                <PrimaryButton
                  onClick={() => {
                    handleAction(() => {
                      handleCheckout();
                    });
                  }}
                >
                  Buy Now
                </PrimaryButton>
                <SecondaryButton
                  onClick={async () => {
                    try {
                      await handleAction(async () => {
                        await addToCartAPI(product._id, quantity);
                        alert(`${product.name} has been added to the cart!`);
                      });
                    } catch (error) {
                      alert("Failed to add product to cart. Please try again.");
                    }
                  }}
                >
                  Add to Cart
                </SecondaryButton>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <Reviews productId={id} />
    </div>
  );
};

export default ProductDetails;