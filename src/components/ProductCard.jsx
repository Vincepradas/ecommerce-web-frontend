import { Link } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useState, useEffect } from "react";

const ProductCard = ({ product }) => {
  const [reviews, setReviews] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchReviewCount = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/reviews/product/${product._id}`);
        if (!res.ok) throw new Error("Error fetching reviews");
        const data = await res.json();
        if (isMounted) setReviews(Array.isArray(data) ? data.length : 0);
      } catch (error) {
        console.error(error);
      }
    };

    fetchReviewCount();

    return () => {
      isMounted = false;
    };
  }, [product._id]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300" />);
      }
    }
    return stars;
  };

  const thumbnail = product.thumbnail?.url;
  const discount =
    product.discountPercentage > 0 && product.price
      ? product.price * (1 - product.discountPercentage / 100)
      : null;

  const cardImageHeight = "h-[160px] sm:h-[180px]";

  if (product.stock <= 0) {
    return (
      <div className="rounded border border-gray-300 overflow-hidden font-slick flex flex-col">
        <div className={`relative ${cardImageHeight} w-full`}>
          <img
            src={thumbnail || "/placeholder.jpg"}
            alt={`${product.name} Thumbnail`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white text-xl font-bold uppercase">Sold Out</span>
          </div>
        </div>
        <div className="p-3 flex flex-col gap-1 text-sm">
          <h3 className="font-bold line-clamp-2">{product.name}</h3>
          <p className="text-gray-600 line-clamp-2">{product.description}</p>
          <div className="flex items-center text-xs mt-1 gap-1">
            {renderStars(product.rating)}
            <span className="text-gray-500 ml-1">{product.rating.toFixed(1)}</span>
            <span className="text-gray-400 ml-1">({reviews})</span>
          </div>
          <div className="mt-2">
            {product.discountPercentage > 0 ? (
              <>
                <div className="text-xs text-gray-500 line-through">
                  ₱ {product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <div className="text-lg font-bold text-gray-700">
                  ₱ {discount.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                </div>
              </>
            ) : (
              <div className="text-lg font-bold text-gray-700">
                ₱ {product.price.toLocaleString(undefined, { minimumFractionDigits: 0 })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded border border-gray-300 overflow-hidden font-slick flex flex-col">
      <Link to={`/products/${product._id}`} className={`block ${cardImageHeight}`}>
        <img
          src={thumbnail || "/placeholder.jpg"}
          alt={`${product.name} Thumbnail`}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />
      </Link>
      <div className="p-3 flex flex-col gap-1 text-sm">
        <h3 className="font-bold line-clamp-2">{product.name}</h3>
        <p className="text-gray-600 line-clamp-1">{product.description}</p>
        <div className="flex items-center text-xs mt-1 gap-1">
          {renderStars(product.rating)}
          <span className="text-gray-500 ml-1">{product.rating.toFixed(1)}</span>
          <span className="text-gray-400 ml-1">({reviews})</span>
        </div>
        <div className="mt-2">
          {product.discountPercentage > 0 ? (
            <>
              <div className="text-xs text-gray-500 line-through">
                ₱ {product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <div className="text-lg font-bold text-gray-700">
                ₱ {discount.toLocaleString(undefined, { minimumFractionDigits: 0 })}
              </div>
            </>
          ) : (
            <div className="text-lg font-bold text-gray-700">
              ₱ {product.price.toLocaleString(undefined, { minimumFractionDigits: 0 })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
