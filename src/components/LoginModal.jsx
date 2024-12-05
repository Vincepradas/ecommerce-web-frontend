import React from "react";
import { useNavigate } from "react-router-dom";

const LoginModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null; // Don't render the modal if it's not open

    const handleLoginClick = () => {
        navigate("/login"); // Redirect to the login page
        onClose(); // Close the modal after redirect
    };

    const handleSignupClick = () => {
        navigate("/signup"); // Redirect to the signup page
        onClose(); // Close the modal after redirect
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded-lg shadow-lg w-[320px] relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-black transition duration-150"
                >
                    &times;
                </button>

                {/* Title */}
                <h2 className="text-lg font-semibold text-center text-black mb-6">
                    Welcome
                </h2>
                <p className="text-sm text-gray-500 text-center mb-4">
                    Please Login or Sign up to continue.
                </p>

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={handleLoginClick}
                        className="flex-1 py-2 text-white bg-black rounded-md hover:bg-gray-900 transition duration-150"
                    >
                        Login
                    </button>
                    <button
                        onClick={handleSignupClick}
                        className="flex-1 py-2 text-black bg-gray-200 rounded-md hover:bg-gray-300 transition duration-150"
                    >
                        Sign up
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
