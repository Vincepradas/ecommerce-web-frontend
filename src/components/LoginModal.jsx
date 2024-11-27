import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null; // Don't render the modal if it's not open

    const handleLoginClick = () => {
        navigate('/login');  // Redirect to the login page
        onClose(); // Close the modal after redirect
    };

    const handleSignupClick = () => {
        navigate('/signup');  // Redirect to the signup page
        onClose(); // Close the modal after redirect
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-700 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <h2 className="text-xl font-semibold mb-4 text-center">Please Login or Signup</h2>
                <div className="flex justify-around">
                    <button
                        onClick={handleLoginClick}
                        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                    >
                        Login
                    </button>
                    <button
                        onClick={handleSignupClick}
                        className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
                    >
                        Signup
                    </button>
                </div>
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    X
                </button>
            </div>
        </div>
    );
};

export default LoginModal;
