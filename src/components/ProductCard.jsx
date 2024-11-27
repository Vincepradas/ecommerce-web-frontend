import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
    // Fetch the first image from the product's media array (assume it's the thumbnail)
    const thumbnail = product.media.length > 0 ? product.media[0].url : "/placeholder-thumbnail.jpg";

    return (
        <div className="product-card bg-white shadow-lg rounded-lg overflow-hidden border border-gray-300 hover:shadow-xl transition-shadow duration-300 h-[400px] flex flex-col">
            {/* Wrap the image in a clickable Link */}
            <Link to={`/products/${product._id}`} className="relative block h-[60%]">
                <img
                    src={thumbnail}
                    alt={`${product.name} Thumbnail`}
                    className="h-full w-full object-contain transition-transform duration-300 hover:scale-105"
                />
            </Link>
            <div className="p-4 flex flex-col justify-between h-[40%]">
                {/* Product name */}
                <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{product.name}</h3>
                {/* Short description */}
                <p className="text-gray-600 mt-2 line-clamp-2">{product.description}</p>
                {/* Price */}
                <p className="text-red-500 font-bold mt-2">
                    {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "PHP",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }).format(parseFloat(product.price))}
                </p>
            </div>
        </div>
    );
};

export default ProductCard;
