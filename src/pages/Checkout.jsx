import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
const { useParams } = require("react-router-dom");

const StepIndicator = ({ steps, currentStep, stepsLabel }) => {
  return (
    <div className="flex items-center justify-center space-x-4 sm:space-x-8">
      {steps.map((step, index) => (
        <div key={step} className="flex flex-col items-center">
          <div
            className={`flex items-center justify-center 
            h-8 w-8 sm:h-10 sm:w-10 
            border-2 rounded-full font-bold 
            ${index + 1 === currentStep
              ? "bg-orange-100 text-[#FF6F00] border-[#FF6F00]"
              : "border-gray-400 text-gray-600"}`}
          >
            {index + 1}
          </div>
          {stepsLabel && (
            <p className="text-xs sm:text-sm mt-1 sm:mt-2 text-gray-700">
              {stepsLabel[index]}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

const Checkout = () => {
  const steps = ["Cart", "Items", "Checkout"];
  const stepsLabel = ["Cart", "Items", "Checkout"];
  const currentStep = 3;
  const [paymentMethod, setPaymentMethod] = useState("");
  const [addressList, setAddressList] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("Add New Address");
  const [newAddress, setNewAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDeliveryAvailable, setIsDeliveryAvailable] = useState(true);
  const { user } = useContext(AuthContext);
  const API_URL =
    "https://ecomwebapi-gsbbgmgbfubhc8hk.canadacentral-01.azurewebsites.net";

  // Fetch user info and addresses
  useEffect(() => {
    const fetchUserInfoAndAddresses = async () => {
      const token = user?.token || localStorage.getItem("authToken");
      if (!token) {
        console.log("Unauthorized - No token found");
        return;
      }
      setLoading(true);
      try {
        // Fetch user data
        const userResponse = await fetch(`${API_URL}/api/user/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!userResponse.ok) throw new Error("Failed to fetch user info");
        const userData = await userResponse.json();

        // Fetch user addresses
        const addressResponse = await fetch(`${API_URL}/api/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!addressResponse.ok) throw new Error("Failed to fetch addresses");
        const addressData = await addressResponse.json();

        // Store the user ID and addresses
        const allAddresses = addressData.address.flat();
        setAddressList(allAddresses);

        // Check if delivery is available for specific areas
        const isDeliveryAvailable = allAddresses.some(
          (address) =>
            address.toLowerCase().includes("madrid") ||
            address.toLowerCase().includes("cantilan")
        );
        setIsDeliveryAvailable(isDeliveryAvailable);
      } catch (error) {
        console.error(error.message);
        setAddressList([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfoAndAddresses();
  }, [user]);

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleNewAddressChange = (e) => {
    setNewAddress(e.target.value);
  };

  const handleAddAddress = async (e) => {
    e.preventDefault(); // Prevent form submission on Add Address button click
    console.log("Add Address button clicked"); // Debugging log
  
    const token = user?.token || localStorage.getItem("authToken");
    if (!newAddress || !token || !user?.id) {
      console.log("Missing address or token or user ID");
      return;
    }
  
    try {
      console.log("Sending address:", newAddress); // Debugging log
      const response = await fetch(
        `${API_URL}/api/user/address/${user.id}/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ address: newAddress }),
        }
      );
  
      console.log("Response status:", response.status); // Debugging log
  
      if (response.ok) {
        const responseData = await response.json();
        console.log("Response data:", responseData); // Debugging log
        setAddressList((prevAddresses) => [...prevAddresses, newAddress]);
        setSelectedAddress(newAddress);
        setNewAddress("");
        alert("Address added successfully!");
      } else {
        const errorData = await response.json();
        console.error("Error response data:", errorData); // Log error response
        throw new Error("Failed to add address");
      }
    } catch (error) {
      console.error("Error adding address:", error.message); // Debugging log
      alert("Error adding address");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !paymentMethod ||
      !selectedAddress ||
      selectedAddress === "Add New Address"
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    alert(
      `Payment Method: ${paymentMethod}\nSelected Address: ${selectedAddress}`
    );
    // Submission logic
  };

  return (
    <div className="p-4 font-slick">
      {/* Step Indicator */}
      <div className="font-slick flex justify-between mb-8">
        <h1 className="font-bold text-xl sm:text-2xl mb-6">Checkout</h1>
        <div className="steps">
          <StepIndicator
            steps={steps}
            currentStep={currentStep}
            stepsLabel={stepsLabel}
          />
        </div>
      </div>

      {/* Checkout Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-800">Shipping Information</h2>
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-300"
            required
          />
          <input
            type="number"
            placeholder="Contact Number"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-300"
            required
          />
          <select
            value={selectedAddress}
            onChange={(e) => setSelectedAddress(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-300"
            required
            disabled={!isDeliveryAvailable}
          >
            <option value="Add New Address">Add New Address</option>
            {loading ? (
              <option disabled>Loading addresses...</option>
            ) : (
              addressList.map((address, index) => (
                <option key={index} value={address}>
                  {address}
                </option>
              ))
            )}
          </select>

          {selectedAddress === "Add New Address" && (
            <div className="mt-4">
              <input
                type="text"
                value={newAddress}
                onChange={handleNewAddressChange}
                placeholder="Enter new address"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-300"
              />
              <button
                type="button"
                onClick={handleAddAddress}
                className="w-full mt-2 bg-[#FF6F00] text-white py-3 rounded-md font-bold hover:bg-[#e65e00] transition"
                disabled={!newAddress.trim()}
              >
                Add Address
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-800">Payment Method</h2>
          <div className="flex flex-col space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="Cash on Delivery"
                checked={paymentMethod === "Cash on Delivery"}
                onChange={handlePaymentChange}
                className="mr-2"
              />
              Cash
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="GCash"
                checked={paymentMethod === "GCash"}
                onChange={handlePaymentChange}
                className="mr-2"
              />
              GCash
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="PayMaya"
                checked={paymentMethod === "PayMaya"}
                onChange={handlePaymentChange}
                className="mr-2"
              />
              PayMaya
            </label>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-[#FF6F00] text-white py-3 rounded-md font-bold hover:bg-[#e65e00] transition"
          >
            Confirm and Place Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;