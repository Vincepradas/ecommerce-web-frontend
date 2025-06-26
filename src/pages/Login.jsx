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
 <div className="mt-10 bg-white flex items-center justify-center px-2 font-poppins">
  <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-sm">
    {/* Title */}
    <Typography
      variant="h4"
      className="text-orange-500 font-semibold text-left mb-2"
    >
      Sign In
    </Typography>
    <Typography
      variant="small"
      className="text-gray-600 text-left mb-6"
    >
      Enter your email and password to sign in.
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

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm text-gray-700 mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="••••••••"
        />
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="remember"
            className="w-4 h-4 text-orange-500 rounded focus:ring-orange-400 border-gray-300"
          />
          <label htmlFor="remember" className="text-sm text-gray-700 select-none">
            Save
          </label>
        </div>

        <a
          href="/forgot-password"
          className="text-orange-500 hover:underline"
        >
          Forgot Password?
        </a>
      </div>

      {/* Error */}
      {error && (
        <p className="text-center text-red-500 text-sm">{error}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-2 mt-2 bg-orange-500 text-white font-medium rounded-md text-sm hover:bg-orange-600 transition duration-200"
      >
        Sign In
      </button>
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
