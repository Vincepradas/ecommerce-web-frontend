    import React from "react";
    import { Link } from "react-router-dom";
    import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

    const ProductCard = ({ product }) => {
        const thumbnail = product.thumbnail?.url;

        // Calculate the discounted price if a discount exists
        const discount =
            product.discountPercentage > 0 && product.price
                ? product.price * (1 - product.discountPercentage / 100)
                : null;


        // Generate stars for the rating
        const renderStars = (rating) => {
            const stars = [];
            for (let i = 1; i <= 5; i++) {
                if (i <= Math.floor(rating)) {
                    stars.push(<FaStar key={i} className="text-yellow-400 " />);
                } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
                    stars.push(<FaStarHalfAlt key={i} className="text-yellow-400 " />);
                } else {
                    stars.push(<FaRegStar key={i} className="text-gray-300" />);
                }
            }
            return stars;
        };

        return (
            <div className="product-card bg-white rounded-2xl overflow-hidden border border-gray-300 transition-shadow duration-300 h-[620px] flex flex-col relative font-slick">
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
                    <h3 className="text-lg font-slick text-gray-800 line-clamp-1 font-bold">
                        {product.name}
                    </h3>
                    <p className="text-gray-600 text-md mt-1 line-clamp-2">{product.description}</p>

                    {/* Rating */}
                    <div className="flex items-center space-x-2 mt-2 text-[.80rem]">
                        {renderStars(product.rating)}
                        <span className="text-gray-500 text-sm ml-2">
        {product.rating.toFixed(1)}
    </span>

                        {/* Reviews Count */}
                        <div className="text-gray-500 text-sm ml-2 font-slick">
                            {product.reviews.length > 0 ? (
                                <span>({product.reviews.length}){product.reviews.length > 1 ? '' : ''}</span>
                            ) : (
                                <span>No Reviews</span>
                            )}
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="flex flex-col mt-1">
                        {discount ? (
                            <>
                                <div className="font-slick flex-1">
                                <span className="text-gray-500 line-through text-md">
                                    ₱ {product.price.toLocaleString(undefined, {minimumFractionDigits: 2})}
                                </span>
                                    {" "}
                                    <span className="font-slick text-md text-gray-700">
                                    {product.discountPercentage}% Off
                                </span>
                                </div>
                                <span className="font-slick text-[1.5rem] font-bold text-gray-700">
                                    ₱ {(product.price - product.price * (product.discountPercentage / 100)).toLocaleString(undefined, {minimumFractionDigits: 0})}
                                </span>

                            </>
                        ) : (

                            <span className="text-gray-700 font-slick text-[1.5rem] font-bold">
                                ₱ {product.price.toLocaleString(undefined, {minimumFractionDigits: 0})}
                            </span>
                        )}
                    </div>
                    <div className="flex justify-between font-poppins my-1">
                        <Link to={`/products/${product._id}`}>
                        <CustomButton
                            title="Details"
                            css="border-1 border-gray-400 text-gray-700 hover:bg-[#FF6F00] hover:text-white hover:border-0"
                        />
                        </Link>
                        <CustomButton
                            title="Buy"
                            css="bg-[#FF6F00] text-white hover:border-1 hover:border-gray-400 hover:text-[#FF6F00] hover:bg-white"
                        />
                    </div>
                </div>
            </div>
        );
    };

    const CustomButton = ({title, css}) => {
        return (
            <button
                className={`border rounded-full ${css} font-semibold md:w-[150px] md:h-[35px] w-[170px] h-[40px] flex items-center justify-center`}>
                {title}
            </button>
        );
    };

    export default ProductCard;
