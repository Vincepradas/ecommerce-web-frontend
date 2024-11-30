import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const checkIfLoggedIn = () => localStorage.getItem("authToken") !== null;
    const [isLoggedIn, setIsLoggedIn] = useState(checkIfLoggedIn);

    useEffect(() => {
        const checkLoggedIn = () => localStorage.getItem("authToken") !== null;
        setIsLoggedIn(checkLoggedIn());
    }, [localStorage.getItem("authToken")]);

    const handleLoginClick = () => {
        if (isLoggedIn) {
            navigate("/profile");
        } else {
            navigate("/login");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        setIsLoggedIn(false);
        navigate("/");
    };

    return (
        <header className="bg-white font-fuzzy sticky top-0 z-50">
            <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
                {/* Logo */}
                <div className="text-2xl font-bold">
                    <Link to="/" className="text-[#FF6F00] hover:text-[#451F55] transition duration-300">
                        Sandra's
                    </Link>
                </div>

                {/* Navigation Links */}
                <ul className="hidden md:flex space-x-6 font-semibold">
                    <li>
                        <Link to="/" className="text-[#5C415D] hover:text-[#FF6F00] transition duration-300">
                            <img width="25" height="25" src="https://img.icons8.com/puffy-filled/32/exterior.png"
                                 alt="exterior"/>
                        </Link>
                    </li>
                    <li>
                        <Link to="/cart" className="text-[#5C415D] hover:text-[#FF6F00] transition duration-300">
                            <img width="25" height="25" src="https://img.icons8.com/ios-glyphs/30/shopping-bag.png"
                                 alt="shopping-bag"/>
                        </Link>
                    </li>
                    <li>
                        <button
                            onClick={handleLoginClick}
                            className="text-[#5C415D] hover:text-[#FF6F00] transition duration-300"
                        >
                            <img width="25" height="25" src="https://img.icons8.com/ios-glyphs/30/user--v1.png"
                                 alt="user--v1"/>
                        </button>
                    </li>
                    {isLoggedIn && (
                        <li>
                        <button
                                onClick={handleLogout}
                                className="text-[#5C415D] hover:text-[#FF6F00] transition duration-300"
                            >
                                Logout
                            </button>
                        </li>
                    )}
                </ul>

                {/* Burger + Icons */}
                <div className="md:hidden flex items-center space-x-4">
                    <Link to="/" className="text-[#5C415D] hover:text-[#FF6F00] transition duration-300">
                        <img width="25" height="25" src="https://img.icons8.com/puffy-filled/32/exterior.png"
                             alt="exterior"/>
                    </Link>
                    <Link to="/cart" className="text-[#5C415D] hover:text-[#FF6F00] transition duration-300">
                        <img width="24" height="24" src="https://img.icons8.com/ios-glyphs/30/shopping-bag.png"
                             alt="shopping-bag"/>
                    </Link>
                    <button
                        onClick={handleLoginClick}
                        className="text-[#5C415D] hover:text-[#FF6F00] transition duration-300"
                    >
                        <img width="24" height="24" src="https://img.icons8.com/fluency-systems-filled/50/user.png"
                             alt="user"/>
                    </button>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-[#5C415D] hover:text-[#5C415D] focus:outline-none"
                        aria-label="Toggle menu"
                    >
                        ☰
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <ul className="md:hidden bg-white px-4 pb-4 space-y-3 font-semibold">
                    <li>
                        <Link
                            to="/"
                            className="block text-[#5C415D] hover:text-[#FF6F00] transition duration-300"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/cart"
                            className="block text-[#5C415D] hover:text-[#FF6F00] transition duration-300"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Cart
                        </Link>
                    </li>
                    <li>
                        <button
                            onClick={() => {
                                setIsMenuOpen(false);
                                handleLoginClick();
                            }}
                            className="block text-[#5C415D] hover:text-[#FF6F00] transition duration-300"
                        >
                            {isLoggedIn ? "Profile" : "Login"}
                        </button>
                    </li>
                    {isLoggedIn && (
                        <li>
                            <button
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    handleLogout();
                                }}
                                className="block text-[#5C415D] hover:text-[#FF6F00] transition duration-300"
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
