import React, { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";

const Signup = () => {
  // Extract the signup function from context
  const { customerSignup } = useContext(AuthContext);

  // State to manage form inputs and messages
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Update form inputs on change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Call the signup function from context
      await customerSignup(form.name, form.email, form.password);
      setMessage("Signup successful! Please log in.");
      setForm({ name: "", email: "", password: "" }); // Reset the form
    } catch (error) {
      setMessage(error.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center font-poppins">
      <div className="bg-white p-8 w-full sm:w-[400px]">
        {/* Heading */}
        <Typography
          variant="h4"
          color="blue-gray"
          className="font-poppins py-2"
        >
          Customer Registration
        </Typography>
        <Typography className="text-gray-600 mb-6" variant="small">
          Fill in your details to create an account.
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
            <label htmlFor="name" className="text-gray-700 text-sm font-medium">
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
              className="rounded-lg w-full mt-1 px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

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
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="rounded-lg w-full mt-1 px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="rounded-lg w-full mt-1 px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-bold focus:ring-2 ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </form>

        {/* Login Redirect */}
        <p className="text-sm text-gray-600 text-center mt-4">
          Already have an account?{" "}
          <Link to={"/login"}>
            <p
              href="/login"
              className="text-blue-600 hover:underline font-semibold"
            >
              Log in
            </p>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
