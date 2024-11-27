import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import `useNavigate`
import PropTypes from 'prop-types';
import { confirmable } from 'react-confirm';
import { confirmWrapper, confirm } from './createConfirmation'

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate(); // Initialize `useNavigate`

    // Check if the user is logged in by checking the presence of the token
    const checkIfLoggedIn = () => {
        const token = localStorage.getItem("authToken"); // Get token from localStorage
        return token !== null; // If token exists, return true (logged in)
    };

    const [isLoggedIn, setIsLoggedIn] = useState(checkIfLoggedIn); // Initialize isLoggedIn state based on token

    // Handle login or profile navigation
    const handleLoginClick = () => {
        if (isLoggedIn) {
            // If logged in, navigate to the profile page
            navigate("/profile");
        } else {
            // If not logged in, navigate to the login page
            navigate("/login");
        }
    };

    // Optionally, handle logout to remove token
    const handleLogout = ()=> {
            localStorage.removeItem("authToken");
            setIsLoggedIn(false);
            navigate("/");

    };

    // This will update the login status whenever the component mounts or the token changes
    useEffect(() => {
        setIsLoggedIn(checkIfLoggedIn());
    }, []); // Empty dependency array means this runs only once on component mount

    return (
        <header className="bg-black text-white shadow-md sticky top-0 z-50">
            <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
                {/* Logo */}
                <div className="text-2xl font-bold">
                    <Link to="/" className="hover:text-blue-400 transition duration-300">
                        MyShop
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <ul className="hidden md:flex space-x-6">
                    <li>
                        <Link
                            to="/"
                            className="text-gray-300 hover:text-white transition duration-300"
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/cart"
                            className="text-gray-300 hover:text-white transition duration-300"
                        >
                            Cart
                        </Link>
                    </li>
                    <li>
                        <button
                            onClick={handleLoginClick} // Trigger the login or profile redirection
                            className="text-gray-300 hover:text-white transition duration-300"
                        >
                            {isLoggedIn ? "Profile" : "Login"} {/* Conditionally render text */}
                        </button>
                    </li>
                    {isLoggedIn && (
                        <li>
                            <button
                                onClick={handleLogout}
                                className="text-gray-300 hover:text-white transition duration-300"
                            >
                                Logout
                            </button>
                        </li>
                    )}
                </ul>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                        aria-label="Toggle menu"
                    >
                        ☰
                    </button>
                </div>
            </nav>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <ul className="md:hidden bg-black px-4 pb-4 space-y-3">
                    <li>
                        <Link
                            to="/"
                            className="block text-gray-300 hover:text-white transition duration-300"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/cart"
                            className="block text-gray-300 hover:text-white transition duration-300"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Cart
                        </Link>
                    </li>
                    <li>
                        <button
                            onClick={() => {
                                setIsMenuOpen(false);
                                handleLoginClick(); // Close menu and navigate
                            }}
                            className="block text-gray-300 hover:text-white transition duration-300"
                        >
                            {isLoggedIn ? "Profile" : "Login"} {/* Conditionally render text */}
                        </button>
                    </li>
                    {isLoggedIn && (
                        <li>
                            <button
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    handleLogout();
                                }}
                                className="block text-gray-300 hover:text-white transition duration-300"
                            >
                                Logout
                            </button>
                        </li>
                    )}
                </ul>
            )}
        </header>
    );
};

export default Header;
