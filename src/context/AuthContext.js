import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

  const decodeToken = (token) => {
    try {
      const decoded = token ? JSON.parse(atob(token.split(".")[1])) : null;
      return decoded ? decoded.userId : null;
    } catch (error) {
      console.error("Token decode error:", error);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");

    if (token && userId) {
      const decodedUserId = decodeToken(token);
      if (decodedUserId === userId) {
        setUser({ token, userId });
      } else {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${REACT_APP_API_URL}/auth/login`, {
        email,
        password,
      });

      console.log("Login response:", response.data);

      if (!response.data || !response.data.token) {
        throw new Error("No authentication token received from server");
      }

      const { token } = response.data;
      const userId = decodeToken(token);

      if (!userId) {
        throw new Error("Invalid authentication token");
      }

      localStorage.setItem("authToken", token);
      localStorage.setItem("userId", userId);

      setUser({ token, userId });

      return { success: true, token, userId };
    } catch (error) {
      console.error("Login failed:", error);

      localStorage.removeItem("authToken");
      localStorage.removeItem("userId");
      setUser(null);

      if (error.response) {
        throw new Error(
          error.response.data?.message ||
            error.response.data?.error ||
            "Invalid email or password"
        );
      } else if (error.request) {
        throw new Error("Network error. Please check your connection.");
      } else {
        throw error;
      }
    }
  };

  const customerSignup = async (name, email, password) => {
    try {
      const response = await axios.post(
        `${REACT_APP_API_URL}/auth/customer/register/`,
        { name, email, password }
      );
      return response.data;
    } catch (error) {
      console.error("Signup failed:", error);
      throw new Error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Signup failed. Try again."
      );
    }
  };

  const adminSignup = async (name, email, password) => {
    try {
      const response = await axios.post(
        `${REACT_APP_API_URL}/auth/admin/register/`,
        { name, email, password }
      );
      return response.data;
    } catch (error) {
      console.error("Signup failed:", error);
      throw new Error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Signup failed. Try again."
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem("authToken");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        customerSignup,
        adminSignup,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
