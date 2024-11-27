import React from "react";
import { Link } from "react-router-dom";

const CustomLinkButton = ({ to, children, className = "", ...rest }) => {
    return (
        <Link
            to={to}
            className={`inline-block text-center text-white bg-black hover:border hover:border-black hover:bg-white hover:text-black px-4 py-2 my-3 rounded-md transition-colors duration-300 ${className}`}
            {...rest}
        >
            {children}
        </Link>
    );
};

export default CustomLinkButton;
