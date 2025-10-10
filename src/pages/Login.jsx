import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import loginBanner from "../assets/images/loginBanner.png";
import { KeyRound, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation
  const validatePassword = (password) => {
    return password.length >= 6;
  };

  // Get field errors
  const getEmailError = () => {
    if (!touched.email) return "";
    if (!email) return "Email is required";
    if (!validateEmail(email)) return "Please enter a valid email";
    return "";
  };

  const getPasswordError = () => {
    if (!touched.password) return "";
    if (!password) return "Password is required";
    if (!validatePassword(password)) return "Password must be at least 6 characters";
    return "";
  };

  const emailError = getEmailError();
  const passwordError = getPasswordError();
  const isFormValid = email && password && !emailError && !passwordError;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Mark all fields as touched
    setTouched({ email: true, password: true });

    // Validate before submission
    if (!isFormValid) {
      setError("Please fix the errors before submitting");
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      
      // Save email if remember me is checked
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      window.location.href = "/home";
    } catch (error) {
      console.error("Login error:", error);
      
      // More specific error messages
      if (error.response?.status === 401) {
        setError("Invalid email or password. Please try again.");
      } else if (error.response?.status === 429) {
        setError("Too many login attempts. Please try again later.");
      } else if (error.message?.includes("Network")) {
        setError("Network error. Please check your connection.");
      } else {
        setError("Login failed. Please check your credentials and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = (e) => {
    e.preventDefault();
    // Implement Google OAuth login here
    alert("Google login integration coming soon!");
  };

  // Load remembered email on component mount
  useState(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="bg-white flex items-center justify-center px-2 font-poppins min-h-screen">
      <div className="w-full max-w-md py-6 px-4 bg-white rounded-xl shadow-sm">
        {/* Title */}
        <div className="flex justify-between items-center">
          <Typography
            variant="h4"
            className="text-orange-500 font-semibold text-left mb-2"
          >
            Sign In
          </Typography>
          <Link
            to="/page/admin"
            className="border-2 bg-orange-50 p-2 text-orange-500 rounded-full border-orange-500 hover:bg-orange-100 transition-colors"
            aria-label="Admin Login"
          >
            <KeyRound size={20} />
          </Link>
        </div>

        <Typography variant="small" className="text-gray-600 text-left mb-6">
          You can also sign in with your google account.
        </Typography>

        <img  
          src={loginBanner}
          alt="Login illustration"
          className="w-full h-auto mb-5"
        />

        <Typography variant="small" className="text-gray-600 text-left mb-2">
          Enter your email and password to continue.
        </Typography>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              onBlur={() => setTouched({ ...touched, email: true })}
              disabled={isLoading}
              className={`w-full px-4 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                emailError
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-orange-400"
              } disabled:bg-gray-100 disabled:cursor-not-allowed`}
              placeholder="you@example.com"
              autoComplete="email"
            />
            {emailError && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle size={12} />
                {emailError}
              </p>
            )}
          </div>

          {/* Password with show/hide toggle */}
          <div>
            <label htmlFor="password" className="block text-sm text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                onBlur={() => setTouched({ ...touched, password: true })}
                disabled={isLoading}
                className={`w-full px-4 py-2 pr-12 border text-sm rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  passwordError
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-orange-400"
                } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500 focus:outline-none disabled:opacity-50"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {passwordError && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle size={12} />
                {passwordError}
              </p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
                className="w-4 h-4 text-orange-500 rounded focus:ring-orange-400 border-gray-300 disabled:opacity-50"
              />
              <label
                htmlFor="remember"
                className="text-sm text-gray-700 select-none cursor-pointer"
              >
                Remember me
              </label>
            </div>

            <Link
              to="/forgot-password"
              className="text-orange-500 hover:underline focus:outline-none focus:ring-2 focus:ring-orange-400 rounded"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="flex flex-col gap-2 text-sm">
            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-orange-500 text-white font-medium rounded-md text-sm hover:bg-orange-600 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-3 text-orange-500 bg-white border border-orange-500 font-medium rounded-md text-sm hover:bg-orange-50 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Continue with Google
            </button>
          </div>
        </form>

        {/* Sign Up */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-orange-500 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-orange-400 rounded"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;