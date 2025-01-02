import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Typography, Checkbox } from "@material-tailwind/react";
import { Link } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      window.location.href = "/home";
    } catch (error) {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className=" font-poppins min-h-screen flex justify-center items-center bg-gradient-to-b from-white to-orange-50">
      <div className=" p-8 sm:w-[400px]bg-gradient-to-t to-white from-orange-50">
        {/* Title */}
        <Typography
          variant="h4"
          className="text-orange-500 font-bold mb-2 text-center font-poppins"
        >
          Sign In
        </Typography>
        <Typography
          className="text-gray-700 text-center mb-6"
          variant="small"
        >
          Enter your email and password to sign in.
        </Typography>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="text-gray-700 text-sm font-medium"
            >
              Your Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="rounded-lg w-full mt-1 px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="text-gray-700 text-sm font-medium"
            >
              Your Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="rounded-lg w-full mt-1 px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between mb-4">
            <Checkbox
              label="Remember Me"
              containerProps={{ className: "text-sm text-gray-700" }}
            />
            <a
              href="/forgot-password"
              className="text-sm text-orange-500 hover:underline"
            >
              Forgot Password?
            </a>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold rounded-lg shadow-md hover:opacity-90 focus:ring-2 focus:ring-orange-400 transition duration-200"
          >
            Sign In
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="text-center text-sm mt-4 text-gray-700">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-orange-500 hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
