import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
    // Safely get the thumbnail URL, if it exists
    const thumbnail = product.thumbnail?.url;
    // Calculate the discounted price if a discount exists
    const discountedPrice =
        product.discount && product.price
            ? product.price - product.price * (product.discount / 100)
            : null;

    return (
        <div className="product-card bg-white shadow-lg rounded-lg overflow-hidden border border-gray-300 hover:shadow-xl transition-shadow duration-300 h-[400px] flex flex-col relative">
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
                        className="h-full w-full object-contain transition-transform duration-300 hover:scale-105"
                    />
                ) : (
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">No Image Available</span>
                    </div>
                )}
            </Link>

            <div className="p-4 flex flex-col justify-between h-[40%]">
                <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                    {product.name}
                </h3>
                <p className="text-gray-600 mt-2 line-clamp-2">{product.description}</p>
                <div className="flex items-center space-x-2 mt-2">
                    {/* Original Price */}
                    {discountedPrice ? (
                        <>
                            <span className="text-gray-500 line-through text-sm">
                                PHP {product.price.toFixed(2)}
                            </span>
                            <span className="text-red-500 font-bold">
                                PHP {discountedPrice.toFixed(2)}
                            </span>
                        </>
                    ) : (
                        <span className="text-red-500 font-bold">
                            PHP {product.price.toFixed(2)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
