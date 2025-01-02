import React from "react";
import { Link } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const ProductCard = ({ product }) => {
  // Function to render stars for the rating
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

  // If stock is 0, label the product as sold out
  if (product.stock <= 0) {
    return (
      <div className="product-card  rounded-sm overflow-hidden border border-gray-300 transition-shadow duration-300 h-[500px] flex flex-col relative font-slick">
        {/* Product Image with Sold Out Overlay */}
        <div className="relative h-[50%] flex items-center justify-center">
          <img
            src={thumbnail || '/placeholder.jpg'} // Placeholder image if no thumbnail
            alt={`${product.name} Thumbnail`}
            className="h-full w-full object-cover transition-transform duration-300 "
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <span className="text-white text-4xl font-semibold uppercase tracking-wider">Sold Out</span>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-4 flex flex-col justify-between h-[50%]">
          <h3 className="text-2xl font-bold text-gray-800 line-clamp-2">{product.name}</h3>
          <p className="text-gray-600 text-lg line-clamp-2 mt-2">{product.description}</p>

          {/* Rating */}
          <div className="flex items-center space-x-2 text-[.80rem]">
            {renderStars(product.rating)}
            <span className="text-gray-500 text-sm ml-2">{product.rating.toFixed(1)}</span>

            {/* Reviews Count */}
            <div className="text-gray-500 text-sm ml-2 font-slick">
              {product.reviews.length > 0 ? (
                <span>({product.reviews.length})</span>
              ) : (
                <span>No Reviews</span>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="flex flex-col">
            {product.discountPercentage > 0 ? (
              <>
                <div className="font-slick flex-1">
                  <span className="text-gray-500 line-through text-md">
                    ₱{" "}
                    {product.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>{" "}
                  <span className="font-slick text-md text-gray-700">
                    {product.discountPercentage}% Off
                  </span>
                </div>
                <span className="font-slick text-[1.5rem] font-bold text-gray-700">
                  ₱{" "}
                  {(
                    product.price -
                    product.price * (product.discountPercentage / 100)
                  ).toLocaleString(undefined, { minimumFractionDigits: 0 })}
                </span>
              </>
            ) : (
              <span className="text-gray-700 font-slick text-[1.5rem] font-bold">
                ₱{" "}
                {product.price.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                })}
              </span>
            )}
          </div>

          {/* Disabled View Button */}
          <div className="flex justify-end font-poppins w-full">
            <button
              disabled
              className="rounded-full bg-gray-400 text-white cursor-not-allowed font-semibold w-[140px] h-[40px] flex items-center justify-center mx-1"
            >
              View
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate the discounted price if a discount exists
  const discount =
    product.discountPercentage > 0 && product.price
      ? product.price * (1 - product.discountPercentage / 100)
      : null;

  return (
    <div className="product-card bg-white rounded-sm overflow-hidden border border-gray-300 transition-shadow duration-300 h-[500px] flex flex-col relative font-slick">
      {/* Product Thumbnail */}
      <Link to={`/products/${product._id}`} className="relative block h-[60%]">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={`${product.name} Thumbnail`}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No Image Available</span>
          </div>
        )}
      </Link>

      {/* Product Details */}
      <div className="p-4 flex flex-col justify-between h-[40%]">
        <div className="">
          <h3 className="text-xl font-slick text-gray-800 line-clamp-2 font-bold">
            {product.name}
          </h3>
          <p className="text-gray-600 text-lg line-clamp-1">{product.description}</p>
        </div>
        {/* Rating */}
        <div className="flex items-center space-x-2 text-[.80rem]">
          {renderStars(product.rating)}
          <span className="text-gray-500 text-sm ml-2">{product.rating.toFixed(1)}</span>

          {/* Reviews Count */}
          <div className="text-gray-500 text-sm ml-2 font-slick">
            {product.reviews.length > 0 ? (
              <span>({product.reviews.length})</span>
            ) : (
              <span>No Reviews</span>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div className="flex flex-col">
          {discount ? (
            <>
              <div className="font-slick flex-1">
                <span className="text-gray-500 line-through text-md">
                  ₱{" "}
                  {product.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>{" "}
                <span className="font-slick text-md text-gray-700">
                  {product.discountPercentage}% Off
                </span>
              </div>
              <span className="font-slick text-[1.5rem] font-bold text-gray-700">
                ₱{" "}
                {(
                  product.price -
                  product.price * (product.discountPercentage / 100)
                ).toLocaleString(undefined, { minimumFractionDigits: 0 })}
              </span>
            </>
          ) : (
            <span className="text-gray-700 font-slick text-[1.5rem] font-bold">
              ₱{" "}
              {product.price.toLocaleString(undefined, {
                minimumFractionDigits: 0,
              })}
            </span>
          )}
        </div>
        <div className="flex justify-end font-poppins w-full">
          <CustomButton
            title="View"
            css="transition hover:border-[1px] hover:border-gray-400 bg-[#FF6F00] text-white hover:bg-white hover:text-[#FF6F00]"
            link={`/products/${product._id}`}
          />
        </div>
      </div>
    </div>
  );
};

const CustomButton = ({ title, css, link }) => {
  return (
    <Link to={link}>
      <button
        className={`rounded-full ${css} font-semibold w-[140px] h-[40px] flex items-center justify-center mx-1`}
      >
        {title}
      </button>
    </Link>
  );
};

export default ProductCard;
