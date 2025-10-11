import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  UserCircle,
  Envelope,
  Phone,
  MapPin,
  Calendar,
  ArrowLeft,
  Gear,
  CreditCard,
  ShoppingBag,
  Heart,
  SignOut
} from "phosphor-react";
import { motion } from "framer-motion";
import defaultAvatar from "../assets/images/avatar.png";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Authentication token not found. Please log in.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(response.data);
      } catch (error) {
        setError("Failed to fetch user profile. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <UserCircle size={48} weight="fill" className="mx-auto" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-lg transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-poppins">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-orange-500 to-amber-500 h-48 rounded-b-3xl shadow-md">
        <div className="absolute top-6 left-6">
          <button
            onClick={() => navigate(-1)}
            className="bg-white/20 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white/30 transition-all"
          >
            <ArrowLeft size={24} />
          </button>
        </div>

        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          <div className="relative">
            <img
              src={userData?.avatar || defaultAvatar}
              alt="User Avatar"
              className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
            />
            <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-all">
              <Gear size={20} className="text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="pt-20 px-6 pb-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">{userData?.name || "User"}</h1>
          <p className="text-gray-500">{userData?.email}</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full p-1 shadow-inner flex">
            {["profile", "orders", "wishlist", "payments"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === tab
                    ? "bg-orange-500 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-800"
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-sm p-6 mb-6"
        >
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 p-3 rounded-full">
                  <UserCircle size={24} className="text-orange-500" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Full Name</p>
                  <p className="font-medium">{userData?.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Envelope size={24} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Email</p>
                  <p className="font-medium">{userData?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Phone size={24} className="text-green-500" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Phone</p>
                  <p className="font-medium">{userData?.phone || "Not provided"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <MapPin size={24} className="text-purple-500" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Address</p>
                  <p className="font-medium">
                    {userData?.address?.[0] || "No address saved"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-amber-100 p-3 rounded-full">
                  <Calendar size={24} className="text-amber-500" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Date of Birth</p>
                  <p className="font-medium">{userData?.dob || "Not provided"}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="text-center py-8">
              <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">Your Orders</h3>
              <p className="text-gray-500 mb-4">
                You haven't placed any orders yet.
              </p>
              <button
                onClick={() => navigate("/products")}
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-lg transition-all"
              >
                Start Shopping
              </button>
            </div>
          )}

          {activeTab === "wishlist" && (
            <div className="text-center py-8">
              <Heart size={48} className="mx-auto text-gray-300 mb-4" weight="fill" />
              <h3 className="text-lg font-medium mb-2">Your Wishlist</h3>
              <p className="text-gray-500 mb-4">
                Items you save will appear here.
              </p>
              <button
                onClick={() => navigate("/products")}
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-lg transition-all"
              >
                Browse Products
              </button>
            </div>
          )}

          {activeTab === "payments" && (
            <div className="text-center py-8">
              <CreditCard size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">Payment Methods</h3>
              <p className="text-gray-500 mb-4">
                No payment methods saved yet.
              </p>
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-lg transition-all"
              >
                Add Payment Method
              </button>
            </div>
          )}
        </motion.div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-lg transition-all"
        >
          <SignOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;