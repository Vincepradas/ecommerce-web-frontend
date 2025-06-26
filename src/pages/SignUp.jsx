import React, { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import signupBanner2 from "../assets/images/signup-banner.png"
const Signup = () => {
  const { customerSignup } = useContext(AuthContext);

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); 

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
    <div className="mt-5 bg-white flex items-center justify-center font-poppins">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm">
        {/* Image Banner */}


        <div className="px-6 pb-6">
          {/* Title */}
          <Typography
            variant="h4"
            className="text-orange-500 font-semibold text-left mb-2"
          >
            Create Account
          </Typography>
          <Typography
            variant="small"
            className="text-gray-600 text-left mb-6"
          >
            Enter your details or sign up with your google account.
          </Typography>
        <img
          src={signupBanner2}
          alt="asdsadasd"
          className="w-full h-auto"
        />
          {/* Message */}
          {message && (
            <p
              className={`mb-4 text-sm text-center ${message.includes("successful")
                ? "text-green-500"
                : "text-red-500"
                }`}
            >
              {message}
            </p>
          )}

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-5">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
              />
            </div>

            {/* Password */}
            {/* Password */}
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full px-4 py-2 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-sm text-orange-500 hover:underline focus:outline-none"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>


            <div className="flex flex-col items-center gap-3 text-sm">
              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 mt-2 text-white font-medium rounded-md text-sm transition duration-200 ${loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600"
                  }`}
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>
              <button className="border-orange-500 border text-orange-500 py-3 w-full rounded-md">Sign Up with Google</button>
            </div>

          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-orange-500 font-medium hover:underline"
            >
              Log In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Signup;