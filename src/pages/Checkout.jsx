import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";

const StepIndicator = ({ steps, currentStep, stepsLabel }) => {
  return (
    <div className="flex items-center justify-between space-x-6 sm:space-x-12">
      {steps.map((step, index) => (
        <div key={step} className="flex flex-col items-center">
          <div
            className={`flex items-center justify-center 
            h-10 w-10 sm:h-12 sm:w-12 
            border-2 rounded-full text-lg font-semibold 
            ${index + 1 === currentStep
              ? "bg-[#FF6F00] text-white border-[#FF6F00]"
              : "border-gray-400 text-gray-600"}`}
          >
            {index + 1}
          </div>
          {stepsLabel && (
            <p className="text-xs sm:text-sm mt-2 text-gray-700 text-center">
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

  useEffect(() => {
    const fetchUserInfoAndAddresses = async () => {
      const token = user?.token || localStorage.getItem("authToken");

      if (!token) {
        console.log("Unauthorized - No token found");
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/user/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch user info and addresses");
        const data = await response.json();

        const allAddresses = data.address.flat();
        setAddressList(allAddresses);

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
    e.preventDefault();
    const token = user?.token || localStorage.getItem("authToken");
    const userID = user?.id || localStorage.getItem("userId");

    if (!newAddress || !token || !userID) {
      alert("Missing address, token, or user ID");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/user/address/${userID}/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ address: newAddress }),
        }
      );

      if (response.ok) {
        setAddressList((prevAddresses) => [...prevAddresses, newAddress]);
        setSelectedAddress(newAddress);
        setNewAddress("");
        alert("Address added successfully!");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error adding address:", error.message);
      alert("An error occurred while adding the address.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !paymentMethod ||
      !selectedAddress ||
      selectedAddress === "Add New Address"
    ) {
      alert("Please fill in all required fields.");
      return;
    }
  
    const token = user?.token || localStorage.getItem("authToken");
  
    if (!token) {
      alert("Unauthorized - No token found");
      return;
    }
  
    setLoading(true);
  
    try {
      // Fetch products from the cart (replace this with your actual cart fetching logic)
      const cartResponse = await fetch(`${API_URL}/api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!cartResponse.ok) throw new Error("Failed to fetch cart items");
      const cartData = await cartResponse.json();
  
      const products = cartData.map(item => ({
        productId: item.productId._id,
        productName: item.productId.name, // Assuming productName is available in cartData
        quantity: item.quantity,
        price: item.productId.price, // Assuming price is available in cartData
        totalPrice: item.productId.price * item.quantity
      }));
  
      const totalAmount = products.reduce((total, product) => total + product.totalPrice, 0);
  
      const payload = {
        paymentMethod, // The selected payment method
        address: selectedAddress, // The selected address
        products, // List of products with details
        totalAmount, // Total amount calculated
      };
  
      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload), // Send the payload in the correct format
      });
  
      if (response.ok) {
        alert("Order placed successfully!");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error placing order:", error.message);
      alert("An error occurred while placing the order.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="p-6 sm:p-8 bg-white shadow-lg rounded-lg">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-semibold text-2xl sm:text-3xl text-gray-800">
          Checkout
        </h1>
        <StepIndicator
          steps={steps}
          currentStep={currentStep}
          stepsLabel={stepsLabel}
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Shipping Information</h2>
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6F00] transition"
            required
          />
          <input
            type="number"
            placeholder="Contact Number"
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6F00] transition"
            required
          />
          <select
            value={selectedAddress}
            onChange={(e) => setSelectedAddress(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6F00] transition"
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
            <div className="mt-4 space-y-4">
              <input
                type="text"
                value={newAddress}
                onChange={handleNewAddressChange}
                placeholder="Enter new address"
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6F00] transition"
              />
              <button
                type="button"
                onClick={handleAddAddress}
                className="w-full py-3 rounded-lg bg-[#FF6F00] text-white font-bold hover:bg-[#e65e00] transition"
                disabled={!newAddress.trim()}
              >
                Add Address
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Payment Method</h2>
          <div className="flex flex-col space-y-4">
            {["Cash on Delivery", "GCash", "PayMaya"].map((method) => (
              <label key={method} className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={handlePaymentChange}
                  className="text-[#FF6F00] focus:ring-[#FF6F00]"
                />
                <span className="text-gray-800">{method}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full py-4 rounded-lg bg-[#FF6F00] text-white font-bold hover:bg-[#e65e00] transition"
          >
            Confirm and Place Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;