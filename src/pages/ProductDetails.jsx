import React, { useState, useEffect, useRef, useMemo, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "../components/LoginModal";
import { PrimaryButton, SecondaryButton } from "../components/Button";
import config from "../config";
import { FaStar } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Navigation } from "swiper";
import Reviews from "../components/Reviews";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion } from "framer-motion";
import "../style/ProductDetails.css";
import AuthContext from "../context/AuthContext";
import { useProductContext } from "../context/ProductContext";
import ProductCard from "../components/ProductCard";
import { ChevronLeft } from "lucide-react";

const ProductDetails = () => {
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const swiperRef = useRef(null);
  const isAuthenticated = !!localStorage.getItem("authToken");
  const { user } = useContext(AuthContext);
  const { fetchProductById, getProduct, isProductLoading } = useProductContext();
  const navigate = useNavigate();
  
  const product = getProduct(id) || {};
  const loading = isProductLoading(id);

  useEffect(() => {
    if (id && !getProduct(id)) {
      fetchProductById(id).catch((error) => {
        console.error('Error fetching product:', error);
      });
    }
  }, [id, fetchProductById, getProduct]);

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
    if (!product._id || !product.price) {
      alert("Product information is not available. Please try again.");
      return;
    }

    const originalPrice = product.price;
    const finalPrice = discountedPrice || originalPrice;
    const totalPrice = finalPrice * quantity;

    const checkoutItem = {
      productId: product._id,
      productName: product.name || "Unknown Product",
      quantity: quantity,
      price: originalPrice,
      discountPercentage: product.discountPercentage || 0,
      totalPrice: totalPrice,
    };

    navigate("/checkout", {
      state: {
        isDirectCheckout: true,
        directItemData: checkoutItem,
      },
    });
  };

  const handleQuantity = (action) => {
    setQuantity((quantity) => {
      if (action === "increment") return quantity + 1;
      if (action === "decrement") return quantity > 1 ? quantity - 1 : 1;
      return quantity;
    });
  };

  const addToCartAPI = async (productId, quantity) => {
    const token = user?.token || localStorage.getItem("authToken");
    if (!token) return;

    const url = `${config.REACT_APP_API_URL}/cart/add`;
    const payload = { productId, quantity };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Add to cart failed`);

      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return (
    <div className="product-details container mx-auto px-4 py-6 md:px-6 md:py-12 font-poppins">
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div className="flex items-center mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-lg text-black/75 font-poppins"
        >
          <ChevronLeft size={20} />
          Back
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start md:items-start mb-8">
        <div className="w-full md:w-1/2">
          {loading ? (
            <Skeleton height={400} className="rounded-lg" />
          ) : product.media?.length > 0 ? (
            <>
              <div className="border rounded-lg overflow-hidden">
                <Swiper
                  spaceBetween={10}
                  slidesPerView={1}
                  navigation
                  modules={[Navigation]}
                  ref={swiperRef}
                >
                  {product.media.map((mediaItem, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={mediaItem.url}
                        alt={`${product.name || 'Product'} ${index + 1}`}
                        className="w-[350px] h-auto object-cover mx-auto"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
              <div className="flex mt-4 space-x-2 justify-start">
                {product.media.map((mediaItem, index) => (
                  <img
                    key={index}
                    src={mediaItem.url}
                    alt={`Thumb ${index + 1}`}
                    className="w-16 h-16 object-cover rounded border cursor-pointer"
                    onClick={() => swiperRef.current.swiper.slideTo(index)}
                  />
                ))}
              </div>
            </>
          ) : (
            <p>No media available for this product.</p>
          )}
        </div>

        <div className="w-full md:w-1/2">
          {loading ? (
            <Skeleton count={5} />
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
                {product.name || "Loading..."}
              </h1>
              <p className="text-base md:text-lg text-gray-600 mb-2">
                {product.description ? (
                  <>
                    {showFullDesc || product.description.length < 150
                      ? product.description
                      : `${product.description.slice(0, 150)}...`}
                    {product.description.length > 150 && (
                      <span
                        onClick={() => setShowFullDesc(!showFullDesc)}
                        className="text-blue-500 ml-1 cursor-pointer text-sm"
                      >
                        {showFullDesc ? "See less" : "See more"}
                      </span>
                    )}
                  </>
                ) : (
                  "Loading description..."
                )}
              </p>
              <p className="text-base md:text-lg text-gray-600 mb-4">
                <span className="font-bold">Item: </span> {product.category || "Unknown"}
              </p>
              <p className="text-base md:text-lg text-gray-600 mb-4 font-bold">
                <span className="font-bold"></span> {product.stock || 0} Left
              </p>
              {(product.discountPercentage || 0) > 0 && (
                <p className="text-base text-green-600 font-bold mb-4 font-slick">
                  Save {product.discountPercentage}% Off
                </p>
              )}
              <div className="flex items-center space-x-2 mb-2 font-slick">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < (product.rating || 0) ? "text-yellow-500" : "text-gray-300"}
                  />
                ))}
                <span className="text-gray-500">{product.rating || 0} ( {product.reviews?.length || 0} Reviews )</span>
              </div>

              <div className="mt-4 flex justify-between">
                <div>
                  {discountedPrice && product.price ? (
                    <>
                      <p className="text-lg text-gray-500 line-through font-slick">
                        {formatPrice(product.price)}
                      </p>
                      <p className="text-2xl font-bold text-green-600 font-slick">
                        {formatPrice(discountedPrice)}
                      </p>
                    </>
                  ) : product.price ? (
                    <p className="text-2xl font-bold text-[#1F2232] font-slick">
                      {formatPrice(product.price)}
                    </p>
                  ) : (
                    <p className="text-lg text-gray-500 font-slick">
                      Price not available
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button onClick={() => handleQuantity("decrement")} className="px-3 py-1 bg-black text-white rounded hover:bg-[#FF6F00]">-</button>
                  <input type="number" disabled value={quantity} className="w-10 text-center border rounded bg-gray-100" />
                  <button onClick={() => handleQuantity("increment")} className="px-3 py-1 bg-black text-white rounded hover:bg-[#FF6F00]">+</button>
                </div>
              </div>

              <div className="mt-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <PrimaryButton 
                  onClick={() => handleAction(() => handleCheckout())}
                  disabled={!product._id || loading}
                >
                  Buy Now
                </PrimaryButton>
                <SecondaryButton 
                  onClick={async () => {
                    try {
                      await handleAction(async () => {
                        if (product._id) {
                          await addToCartAPI(product._id, quantity);
                          alert(`${product.name || 'Product'} has been added to the cart!`);
                        }
                      });
                    } catch {
                      alert("Failed to add product to cart. Please try again.");
                    }
                  }}
                  disabled={!product._id || loading}
                >
                  Add to Cart
                </SecondaryButton>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <Reviews productId={id} />

      {!loading && product._id && (
        <div className="mt-12">
          <h2 className="text-xl font-medium mb-4 text-[#1F2232] font-poppins">
            You Might Also Like
          </h2>
          <RecommendedProducts currentProductId={product._id} />
        </div>
      )}
    </div>
  );
};

const RecommendedProducts = ({ currentProductId }) => {
  const { allProducts, allProductsLoading, fetchAllProducts } = useProductContext();

  React.useEffect(() => {
    if (!allProducts) {
      fetchAllProducts().catch((error) => {
        console.error('Error fetching all products:', error);
      });
    }
  }, [allProducts, fetchAllProducts]);

  const getRandomProducts = (products, excludeId, count = 4) => {
    const filtered = products.filter((p) => p._id !== excludeId);
    for (let i = filtered.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
    }
    return filtered.slice(0, count);
  };

  const recommended = allProducts ? getRandomProducts(allProducts, currentProductId) : [];
  const loading = allProductsLoading;

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array(4)
          .fill()
          .map((_, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow border border-neutral-300"
            >
              <Skeleton height={150} />
              <Skeleton height={20} className="mt-4" />
              <Skeleton height={15} width="80%" />
            </div>
          ))}
      </div>
    );
  }

  if (recommended.length === 0) {
    return <p className="text-gray-500 text-sm">No recommended products found.</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {recommended.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};



export default ProductDetails;
