import React, { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";

const Signup = () => {
  const { customerSignup } = useContext(AuthContext);

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await customerSignup(form.name, form.email, form.password);
      setMessage("Signup successful! Please log in.");
      setForm({ name: "", email: "", password: "" });
    } catch (error) {
      setMessage(error.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-white to-orange-50 font-poppins">
      <div className=" p-8 w-full sm:w-[400px] bg-gradient-to-t to-white from-orange-50 f">
        {/* Heading */}
        <Typography
          variant="h4"
          className="text-orange-500 font-bold mb-2 text-center font-poppins"
        >
          Create Account
        </Typography>
        <Typography
          className="text-gray-700 text-center mb-6"
          variant="small"
        >
          Enter your details to sign up.
        </Typography>

        {/* Form */}
        <form onSubmit={handleSignup}>
          {/* Display Success/Error Message */}
          {message && (
            <div
              className={`mb-4 text-sm text-center ${
                message.includes("successful")
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {message}
            </div>
          )}

          {/* Name Field */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="text-gray-700 text-sm font-medium"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="rounded-lg w-full mt-1 px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="text-gray-700 text-sm font-medium"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
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
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="rounded-lg w-full mt-1 px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`font-poppins w-full py-3 rounded-lg text-white font-bold shadow-md focus:ring-2 focus:ring-orange-400 transition duration-200 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-orange-500 to-yellow-500 hover:opacity-90"
            }`}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {/* Login Redirect */}
        <p className="text-sm text-gray-700 text-center mt-4">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-orange-500 hover:underline"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
