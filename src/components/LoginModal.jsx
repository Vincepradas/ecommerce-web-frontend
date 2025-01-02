import React from "react";
import { useNavigate } from "react-router-dom";
import images from "../assets/images";

const { Welcome } = images;

const LoginModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleLoginClick = () => {
        navigate("/login");
        onClose();
    };

    const handleSignupClick = () => {
        navigate("/signup");
        onClose();
    };

    return (
        <div className="fixed inset-0 px-4 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 font-poppins">
            <div className="relative bg-white p-6 rounded-2xl shadow-2xl w-[360px] min-h-[400px] flex flex-col items-center">
                {/* Decorative Background */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full opacity-30 blur-xl"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-r from-yellow-400 to-gold rounded-full opacity-30 blur-xl"></div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-black transition duration-150 text-4xl"
                >
                    &times;
                </button>

                {/* Title */}
                <h2 className="text-xl font-bold text-black mt-4 font-poppins">Welcome to Sandra's!</h2>
                <p className="text-md text-gray-600 text-center mt-2">
                    We're excited to have you here. Please log in or sign up to continue shopping and explore amazing features.
                </p>

                {/* Icons/Illustration */}
                <div className="flex justify-center my-4">
                    <img
                        src={Welcome}
                        alt="Welcome"
                        className="w-32 h-32 object-contain"
                    />
                </div>

                {/* Buttons */}
                <div className="flex gap-4 mt-auto w-full">
                    <button
                        onClick={handleLoginClick}
                        className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition duration-200"
                    >
                        Login
                    </button>
                    <button
                        onClick={handleSignupClick}
                        className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-orange-400 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition duration-200"
                    >
                        Sign Up
                    </button>
                </div>

                {/* Footer Note */}
                <p className="text-sm text-gray-500 mt-4 text-center">
                    By continuing, you agree to our{" "}
                    <a href="/terms" className="text-orange-500 underline">
                        Terms of Service
                    </a>.
                </p>
            </div>
        </div>
    );
};

export default LoginModal;
