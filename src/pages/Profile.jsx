import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import images from "../assets/images";

const ProfilePage = () => {
  const { avatar } = images;
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [, setIsLoggedIn] = useState(localStorage.getItem("authToken") !== null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Authentication token not found. Please log in.");
        return;
      }

      try {
        const response = await axios.get(
          "https://ecom-sandras-g6abfyg2azbqekf8.southeastasia-01.azurewebsites.net//api/user",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(response.data);
      } catch (error) {
        setError("Failed to fetch user profile. Please try again.");
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    navigate("/");
  };

  if (error) {
    return (
      <div className="font-poppins min-h-screen flex justify-center items-center bg-gradient-to-b from-white to-orange-50">
        <Typography variant="h5" color="red" className="text-center max-w-md p-4">
          {error}
        </Typography>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-poppins">
      {userData ? (
        <>
          {/* Header Section */}
          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white p-8 text-center">
            <img
              src={avatar}
              alt="User Avatar"
              className="w-24 h-24 rounded-full mx-auto border-4 border-white shadow-md"
            />
            <Typography variant="h5" className="font-bold py-2">
              @{userData.name || "user"}
            </Typography>
            <Typography variant="subtitle1" className="m-4">
              {userData.email}
            </Typography>
            <Link to="/" className="m-2 border-2 border-white rounded-lg px-6 py-2">
              Back to Home
            </Link>
            <button
              className="border-2 border-white px-6 py-2 rounded-lg"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>

          {/* Account Info Section */}
          <div className="mt-6 px-8 space-y-6">
            <Typography variant="h6" className="text-gray-800 text-lg font-bold">
              Account Info
            </Typography>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Typography className="text-gray-800">
                  <strong>Name:</strong> {userData.name}
                </Typography>
              </div>
              <div className="flex items-center space-x-4">
                <Typography className="text-gray-800">
                  <strong>Mobile:</strong> {userData.phone || "Not available"}
                </Typography>
              </div>
              <div className="flex items-center space-x-4">
                <Typography className="text-gray-800">
                  <strong>Email:</strong> {userData.email}
                </Typography>
              </div>
              <div className="flex items-center space-x-4">
                <Typography className="text-gray-800">
                  <strong>Address:</strong> {userData.address[0] || "No address"}
                </Typography>
              </div>
              <div className="flex items-center space-x-4">
                <Typography className="text-gray-800">
                  <strong>D.O.B:</strong> {userData.dob || "Not provided"}
                </Typography>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center">
          <Typography variant="h5" className="text-gray-600">
            Loading profile...
          </Typography>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
