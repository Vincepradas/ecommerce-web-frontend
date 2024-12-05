import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Input, Typography, Checkbox } from "@material-tailwind/react";
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
    <div className="min-h-screen flex justify-center font-poppins">
      <div className="bg-white p-8 w-full sm:w-[400px]">
        <Typography
          variant="h4"
          color="blue-gray"
          className="font-poppins py-2"
        >
          Sign In
        </Typography>
        <Typography className=" text-gray-600 mb-6" variant="small">
          Enter your email and password to Sign In.
        </Typography>
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
              className="rounded-lg w-full mt-1 px-4 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="rounded-lg w-full mt-1 px-4 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Remember Me and Error */}
          <div className="flex items-center justify-between mb-4">
            {/* Checkbox */}
            <div className="flex items-center">
              <Checkbox label="Remember Me" className="text-sm" />
            </div>

            {/* Forgot Password */}
            <a
              href="/forgot-password"
              className="text-sm text-blue-500 hover:underline"
            >
              Forgot Password?
            </a>
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-gray-800 rounded-lg text-white font-bold  hover:bg-gray-700 focus:ring-2 focus:ring-gray-500"
          >
            Sign In
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="text-center text-sm mt-4 text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-blue-600 hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
