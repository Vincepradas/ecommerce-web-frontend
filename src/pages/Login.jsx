import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Typography, Checkbox } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import loginBanner from "../assets/images/loginBanner.png";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // show/hide state

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
    <div className="bg-white flex items-center justify-center px-2 font-poppins">
      <div className="w-full max-w-md py-6 px-4 bg-white rounded-xl shadow-sm">


        {/* Title */}
        <Typography
          variant="h4"
          className="text-orange-500 font-semibold text-left mb-2"
        >
          Sign In
        </Typography>
        <Typography variant="small" className="text-gray-600 text-left mb-6">
          You can also sign in with your google account.
        </Typography>
        <img
          src={loginBanner}
          alt="asdsadasd"
          className="w-full h-auto mb-5"
        />
        <Typography variant="small" className="text-gray-600 text-left mb-2">
          Enter your email and password to continue.
        </Typography>
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="you@example.com"
            />
          </div>

          {/* Password with show/hide toggle */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-sm text-orange-500 hover:underline focus:outline-none"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 text-orange-500 rounded focus:ring-orange-400 border-gray-300"
              />
              <label
                htmlFor="remember"
                className="text-sm text-gray-700 select-none"
              >
                Save
              </label>
            </div>

            <a href="/forgot-password" className="text-orange-500 hover:underline">
              Forgot Password?
            </a>
          </div>

          {/* Error */}
          {error && (
            <p className="text-center text-red-500 text-sm">{error}</p>
          )}

<div className="flex flex-col gap-1 text-sm">
          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 mt-2 bg-orange-500 text-white font-medium rounded-md text-sm hover:bg-orange-600 transition duration-200"
          >
            Sign In
          </button>
                    <button
            type="submit"
            className="w-full py-3 mt-2 text-orange-500 border border-orange-500 font-medium rounded-md text-sm hover:bg-orange-600 transition duration-200"
          >
            Continue with Google
          </button>
          </div>
        </form>

        {/* Sign Up */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-orange-500 font-medium hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
