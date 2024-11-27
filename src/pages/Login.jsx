import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios"; // Import axios for making HTTP requests

const Login = () => {
    const { login } = useAuth();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = form;

        try {
            // Send a POST request to your backend for authentication
            const response = await axios.post("/api/auth/login", {
                email,
                password,
            });

            // If authentication is successful, store the token and log the user in
            if (response.data.token) {
                // Store the token in localStorage
                localStorage.setItem("authToken", response.data.token);

                // Set the Authorization header for future requests
                axios.defaults.headers["Authorization"] = `Bearer ${response.data.token}`;

                // Call your login function with the user's email
                login({ email });

                // Optionally, redirect the user to another page after login
                window.location.href = "/dashboard";  // Redirect to dashboard or another page
            } else {
                setError("Invalid email or password.");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
            console.error(err);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-sm w-full">
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    Welcome Back
                </h1>
                <form onSubmit={handleLogin}>
                    {error && (
                        <div className="mb-4 text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="mt-1 p-3 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="mt-1 p-3 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-200"
                    >
                        Log In
                    </button>
                </form>
                <p className="text-sm text-gray-600 text-center mt-4">
                    Don't have an account?{" "}
                    <a href="/register" className="text-blue-600 hover:underline">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;
