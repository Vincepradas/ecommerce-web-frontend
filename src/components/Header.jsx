import React, { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                        <Link
                            to="/login"
                            className="text-gray-300 hover:text-white transition duration-300"
                        >
                            Login
                        </Link>
                    </li>
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
                        <Link
                            to="/login"
                            className="block text-gray-300 hover:text-white transition duration-300"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Login
                        </Link>
                    </li>
                </ul>
            )}
        </header>
    );
};

export default Header;
