import React from "react";
import { Link } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const ProductCard = ({ product }) => {
    const thumbnail = product.thumbnail?.url;

    // Calculate the discounted price if a discount exists
    const discountedPrice =
        product.discount && product.price
            ? product.price - product.price * (product.discount / 100)
            : null;

    // Generate stars for the rating
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) {
                stars.push(<FaStar key={i} className="text-yellow-500" />);
            } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
                stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
            } else {
                stars.push(<FaRegStar key={i} className="text-gray-300" />);
            }
        }
        return stars;
    };

    return (
        <div className="product-card bg-white shadow-lg rounded-lg overflow-hidden border border-gray-300 hover:shadow-xl transition-shadow duration-300 h-[420px] flex flex-col relative">
            {/* Discount Badge */}
            {product.discount && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-md border border-red-700">
                    {product.discount}% OFF
                </div>
            )}

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
                <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                    {product.name}
                </h3>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{product.description}</p>

                {/* Rating */}
                <div className="flex items-center space-x-1 mt-2">
                    {renderStars(product.rating)}
                    <span className="text-gray-500 text-sm ml-2">
                        {product.rating.toFixed(1)}/5
                    </span>
                </div>

                {/* Pricing */}
                <div className="flex items-center space-x-2 mt-2">
                    {discountedPrice ? (
                        <>
                            <span className="text-gray-500 line-through text-sm">
                                PHP {product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                            <span className="text-red-500 font-bold">
                                PHP {discountedPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                        </>
                    ) : (
                        <span className="text-[#1F2232] font-semibold">
                            PHP {product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
