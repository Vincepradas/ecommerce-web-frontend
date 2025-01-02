import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import config from "../config";

const StepIndicator = ({ steps, currentStep, stepsLabel }) => {
  return (
    <div className="flex items-center justify-between space-x-6 sm:space-x-12">
      {steps.map((step, index) => (
        <div key={step} className="flex flex-col items-center">
          <div
            className={`flex items-center justify-center 
            h-10 w-10 sm:h-12 sm:w-12 
            border-2 rounded-full text-lg font-semibold 
            ${
              index + 1 === currentStep
                ? "bg-[#FF6F00] text-white border-[#FF6F00]"
                : "border-gray-400 text-gray-600"
            }`}
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
  const [orderSummary, setOrderSummary] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { isDirectCheckout, directItemData, cartItems } = location.state || {};
console.log(orderSummary)
  useEffect(() => {
    
    if (isDirectCheckout && directItemData) {
      const summary = {
        quantity: directItemData.quantity,
        price: directItemData.price,
        discountPercentage: directItemData.discountPercentage,
        totalPrice: directItemData.totalPrice,
        productName: directItemData.productName,
      };
      setOrderSummary(summary);
    } else if (cartItems) {
      const formattedItems = location.state.cartItems.map(item => ({
        quantity: item.quantity, 
        price: item.price, 
        discountPercentage: item.discountPercentage || 0, 
        totalPrice: item.price * item.quantity * (1 - (item.discountPercentage || 0) / 100), 
        productName: item.productName
      }));
    
      const summary = {
        items: formattedItems, 
        totalPrice: location.state.totalAmount
      };
    
      setOrderSummary(summary);
    } else {
      
      navigate("/cart");
    }
  }, [isDirectCheckout, directItemData, navigate, cartItems, location.state]);

  useEffect(() => {
    const fetchUserInfoAndAddresses = async () => {
      const token = user?.token || localStorage.getItem("authToken");

      if (!token) {
        console.log("Unauthorized - No token found");
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(`${config.API_URL}/user/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok)
          throw new Error("Failed to fetch user info and addresses");
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
        `${config.API_URL}/user/address/${userID}/add`,
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

  
  const removeFromCart = (productId) => {
    const token = user?.token || localStorage.getItem("authToken");

    fetch(`${config.API_URL}/cart/remove`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId }),
    }).catch((err) => console.error("Error removing product from cart", err));
  };

  
  const handleSubmit = async (e) => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
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
      let orderPayload;

      if (isDirectCheckout && directItemData) {
        
        orderPayload = {
          paymentMethod,
          address: selectedAddress,
          products: [
            {
              productId: directItemData.productId,
              productName: directItemData.productName,
              quantity: directItemData.quantity,
              price: directItemData.price,
              discountPercentage: directItemData.discountPercentage,
              totalPrice: directItemData.totalPrice,
            },
          ],
          totalAmount: directItemData.totalPrice,
        };
      } else if (location.state?.cartItems) {
        
        orderPayload = {
          paymentMethod,
          address: selectedAddress,
          products: location.state.cartItems,
          totalAmount: location.state.totalAmount,
        };
      } else {
        alert("Invalid checkout data");
        return;
      }

      
      const orderResponse = await fetch(`${config.API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.message || "Failed to create order");
      }

      
      if (location.state?.cartItems) {
        for (const item of location.state.cartItems) {
          await removeFromCart(item.productId);
        }
        if (location.state?.cartItems) {
          for (const item of location.state.cartItems) {
            await removeFromCart(item.productId); 
            await delay(500); 
          }
        }
      }
      alert("Order placed successfully!");
      navigate("/orders");
    } catch (error) {
      console.error("Error placing order:", error);
      alert(error.message || "An error occurred while placing the order.");
    } finally {
      setLoading(false);
    }
  };

  const OrderSummary = () => {
  if (!orderSummary) return null;

  return (
    <div className="mb-8 p-6 rounded-lg border">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 tracking-wide font-poppins">
        Order Summary
      </h2>

      {!isDirectCheckout ? (
        
        <div className="space-y-6">
          {orderSummary.items.map((item, index) => (
            <div key={index} className="border-b pb-4 border-gray-200">
              <div className="flex justify-between items-center font-poppins">
                <span className="text-gray-600 text-base">Product:</span>
                <span className="font-medium text-gray-800">{item.productName}</span>
              </div>
              <div className="flex justify-between items-center font-poppins">
                <span className="text-gray-600 text-base">Quantity:</span>
                <span className="font-medium text-gray-800">{item.quantity}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-base font-poppins">Price per item:</span>
                <span className="font-medium text-gray-800 font-slick tracking-wider">
                  ₱{(item.price ?? 0).toFixed(2)}  {/* Using nullish coalescing for fallback */}
                </span>
              </div>
              <div className="flex justify-between items-center pt-4">
                <span className="text-gray-800 font-semibold text-base font-poppins">
                  Total Amount:
                </span>
                <span className="font-bold font-slick text-base text-green-600 tracking-wider">
                  ₱{(item.totalPrice ?? 0).toFixed(2)}  {/* Using nullish coalescing for fallback */}
                </span>
              </div>
            </div>
          ))}
          {/* Optionally, display the total amount of the cart here */}
          <div className="flex justify-between items-center pt-4 font-poppins">
            <span className="text-gray-800 font-semibold text-base">Cart Total:</span>
            <span className="font-bold font-slick text-base text-green-600 tracking-wider">
              ₱{(orderSummary.totalPrice ?? 0).toFixed(2)}  {/* Using nullish coalescing for fallback */}
            </span>
          </div>
        </div>
      ) : (
        
        <div className="space-y-6">
          <div className="border-b pb-4 border-gray-200">
            <div className="flex justify-between items-center font-poppins">
              <span className="text-gray-600 text-base">Product:</span>
              <span className="font-medium text-gray-800">
                {orderSummary.productName}
              </span>
            </div>
            <div className="flex justify-between items-center font-poppins">
              <span className="text-gray-600 text-base">Quantity:</span>
              <span className="font-medium text-gray-800">
                {orderSummary.quantity}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-base font-poppins">
                Discount:
              </span>
              <span className="font-medium text-gray-800 font-slick tracking-widest">
                {orderSummary.discountPercentage}%  {/* Using nullish coalescing for fallback */}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-base font-poppins">
                Price per item:
              </span>
              <span className="font-medium text-gray-800 font-slick tracking-wider">
                ₱{(orderSummary.price ?? 0).toFixed(2)}  {/* Using nullish coalescing for fallback */}
              </span>
            </div>
            <div className="flex justify-between items-center pt-4">
              <span className="text-gray-800 font-semibold text-base font-poppins">
                Total Amount:
              </span>
              <span className="font-bold font-slick text-base text-green-600 tracking-wider">
                ₱{(orderSummary.totalPrice ?? 0).toFixed(2)}  {/* Using nullish coalescing for fallback */}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


  return (
    <div className="p-6 sm:p-8 bg-white shadow-lg rounded-lg">
      <div className="mb-8 flex items-center justify-between">
        <h1 className=" font-poppins text-2xl text-gray-800">
          Checkout
        </h1>
        <StepIndicator
          steps={steps}
          currentStep={currentStep}
          stepsLabel={stepsLabel}
        />
      </div>

      {/* Order Summary */}
      {isDirectCheckout && <OrderSummary />}

      <form onSubmit={handleSubmit} className="space-y-8 font-poppins">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Shipping Information
          </h2>
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
                className="w-full py-3 rounded-lg bg-black text-white font-bold hover:bg-[#e65e00] transition"
                disabled={!newAddress.trim()}
              >
                Add Address
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6 font-poppins">
          <h2 className="text-xl font-semibold text-gray-800">
            Payment Method
          </h2>
          <div className="flex flex-col space-y-4">
            {["Cash on Delivery", "GCash"].map((method) => (
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
            className="w-full py-4 rounded-lg bg-black text-white font-bold hover:bg-[#e65e00] transition"
            disabled={loading}
          >
            {loading ? "Processing..." : "Confirm and Place Order"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
