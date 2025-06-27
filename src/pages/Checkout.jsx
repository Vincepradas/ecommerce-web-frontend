import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CreditCard,
  Truck,
  MapPin,
  User,
  Phone,
  CheckCircle,
  PlusCircle,
  CircleNotch
} from "phosphor-react";
import AuthContext from "../context/AuthContext";
import config from "../config";
import { motion, AnimatePresence } from "framer-motion";

const StepIndicator = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-between mb-12 px-5 font-poppins">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center">
            <div className={`flex items-center justify-center 
              h-10 w-10 rounded-full text-lg font-semibold 
              ${index + 1 <= currentStep
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-400"}`}>
              {index + 1}
            </div>
            <span className={`text-xs mt-2 ${index + 1 <= currentStep ? "text-orange-500" : "text-gray-400"}`}>
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={`flex-1 h-1 ${index + 1 < currentStep ? "bg-orange-500" : "bg-gray-200"}`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const Checkout = () => {
  const steps = ["Cart", "Details", "Payment"];
  const currentStep = 3;
  const [paymentMethod, setPaymentMethod] = useState("");
  const [addressList, setAddressList] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDeliveryAvailable, setIsDeliveryAvailable] = useState(true);
  const [orderSummary, setOrderSummary] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { isDirectCheckout, directItemData, cartItems } = location.state || {};

  useEffect(() => {
    if (isDirectCheckout && directItemData) {
      if (!directItemData.productName) {
        console.error("Invalid direct item data");
        navigate("/");
        return;
      }
      const summary = {
        quantity: directItemData.quantity || 1,
        price: directItemData.price || 0,
        discountPercentage: directItemData.discountPercentage || 0,
        totalPrice: directItemData.totalPrice || (directItemData.price || 0) * (directItemData.quantity || 1),
        productName: directItemData.productName
      };
      setOrderSummary(summary);
    } else if (cartItems) {
      const formattedItems = location.state.cartItems
        .filter(item => item.productName) // Filter out invalid items
        .map(item => ({
          quantity: item.quantity || 1,
          price: item.price || 0,
          discountPercentage: item.discountPercentage || 0,
          totalPrice: (item.price || 0) * (item.quantity || 1) * (1 - (item.discountPercentage || 0) / 100),
          productName: item.productName
        }));

      const summary = {
        items: formattedItems,
        totalPrice: location.state.totalAmount || formattedItems.reduce((sum, item) => sum + item.totalPrice, 0)
      };

      setOrderSummary(summary);
    } else {
      navigate("/cart");
    }
  }, [isDirectCheckout, directItemData, navigate, cartItems, location.state]);

  useEffect(() => {
    const fetchUserInfoAndAddresses = async () => {
      const token = user?.token || localStorage.getItem("authToken");
      if (!token) return;

      setLoading(true);
      try {
        const response = await fetch(`${config.API_URL}/user/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch user info");
        const data = await response.json();

        const allAddresses = data.address.flat();
        setAddressList(allAddresses);
        setSelectedAddress(allAddresses[0] || "");

        const isDeliveryAvailable = allAddresses.some(address =>
          address.toLowerCase().includes("madrid") ||
          address.toLowerCase().includes("cantilan")
        );
        setIsDeliveryAvailable(isDeliveryAvailable);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfoAndAddresses();
  }, [user]);

  const handlePaymentChange = (method) => {
    setPaymentMethod(method);
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    const token = user?.token || localStorage.getItem("authToken");
    const userID = user?.id || localStorage.getItem("userId");

    if (!newAddress || !token || !userID) return;

    setLoading(true);
    try {
      const response = await fetch(`${config.API_URL}/user/address/${userID}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ address: newAddress }),
      });

      if (response.ok) {
        const updatedAddresses = [...addressList, newAddress];
        setAddressList(updatedAddresses);
        setSelectedAddress(newAddress);
        setNewAddress("");
        setShowAddressForm(false);
      }
    } catch (error) {
      console.error("Error adding address:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!paymentMethod || !selectedAddress) {
      alert("Please fill in all required fields");
      return;
    }

    const token = user?.token || localStorage.getItem("authToken");
    if (!token) return;

    setLoading(true);
    try {
      let orderPayload;
      if (isDirectCheckout && directItemData) {
        orderPayload = {
          paymentMethod,
          address: selectedAddress,
          products: [{
            productId: directItemData.productId,
            productName: directItemData.productName,
            quantity: directItemData.quantity,
            price: directItemData.price,
            discountPercentage: directItemData.discountPercentage,
            totalPrice: directItemData.totalPrice,
          }],
          totalAmount: directItemData.totalPrice,
        };

        // For direct checkout, remove just this item from cart
        const removeResponse = await fetch(`${config.API_URL}/cart/remove`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: directItemData.productId }),
        });

        if (!removeResponse.ok) {
          console.warn("Failed to remove item from cart, but order was placed");
        }
      } else if (location.state?.cartItems) {
        orderPayload = {
          paymentMethod,
          address: selectedAddress,
          products: location.state.cartItems,
          totalAmount: location.state.totalAmount,
        };

        // For regular checkout, clear the entire cart
        const clearResponse = await fetch(`${config.API_URL}/cart/clear`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!clearResponse.ok) {
          console.warn("Failed to clear cart, but order was placed");
        }
      } else {
        alert("Invalid checkout data");
        return;
      }

      // Create the order
      const orderResponse = await fetch(`${config.API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      if (!orderResponse.ok) {
        throw new Error("Failed to create order");
      }

      navigate("/orders", { state: { orderSuccess: true } });
    } catch (error) {
      console.error("Error in checkout process:", error);
      alert("There was an error processing your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const OrderItem = ({ item }) => {
    // Add null checks for the item prop
    if (!item || !item.productName) return null;

    return (
      <div className="flex justify-between items-start py-4 border-b border-gray-100">
        <div className="flex items-start gap-4">
          <div>
            <h4 className="font-medium">{item.productName}</h4>
            <p className="text-sm text-gray-500">Qty: {item.quantity || 1}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-medium font-slick">₱{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
          {item.discountPercentage > 0 && (
            <p className="text-xs text-gray-400 line-through font-slick">
              ₱{((item.price || 0) * (item.quantity || 1) / (1 - (item.discountPercentage || 0) / 100)).toFixed(2)}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 font-poppins">
      <StepIndicator steps={steps} currentStep={currentStep} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-bold text-black mb-6">Order Summary</h2>

          {isDirectCheckout ? (
            orderSummary && orderSummary.productName ? (
              <OrderItem item={orderSummary} />
            ) : (
              <div className="text-center py-8 text-gray-500">
                Loading order details...
              </div>
            )
          ) : (
            <div className="space-y-4">
              {orderSummary?.items?.length > 0 ? (
                orderSummary.items.map((item, index) => (
                  <OrderItem key={index} item={item} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No items in cart
                </div>
              )}
              {orderSummary?.totalPrice && (
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between font-medium">
                    <span>Subtotal</span>
                    <span >PHP {orderSummary.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>Shipping</span>
                    <span className="text-green-500">Free</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Checkout Form */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Checkout Details</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shipping Info */}
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
                <Truck size={20} className="text-orange-500" />
                Shipping Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User size={20} className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="bg-transparent w-full focus:outline-none"
                    required
                  />
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone size={20} className="text-gray-400" />
                  <input
                    type="tel"
                    placeholder="Contact Number"
                    className="bg-transparent w-full focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-gray-700">
                      <MapPin size={20} className="text-orange-500" />
                      Delivery Address
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(!showAddressForm)}
                      className="flex items-center gap-1 text-orange-500 text-sm"
                    >
                      <PlusCircle size={16} />
                      {showAddressForm ? 'Cancel' : 'Add New'}
                    </button>
                  </div>

                  {showAddressForm ? (
                    <div className="space-y-3">
                      <textarea
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                        placeholder="Enter full address"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        rows="3"
                      />
                      <button
                        type="button"
                        onClick={handleAddAddress}
                        disabled={!newAddress.trim() || loading}
                        className="w-full py-2 bg-orange-500 text-white rounded-lg disabled:bg-orange-300 flex items-center justify-center gap-2"
                      >
                        {loading ? <CircleNotch size={18} className="animate-spin" /> : 'Save Address'}
                      </button>
                    </div>
                  ) : (
                    <select
                      value={selectedAddress}
                      onChange={(e) => setSelectedAddress(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                      disabled={!isDeliveryAvailable || loading}
                    >
                      {addressList.map((address, index) => (
                        <option key={index} value={address}>
                          {address}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
                <CreditCard size={20} className="text-orange-500" />
                Payment Method
              </h3>

              <div className="space-y-3">
                {['Cash on Delivery', 'GCash'].map((method) => (
                  <label
                    key={method}
                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${paymentMethod === method ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'}`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === method ? 'border-orange-500 bg-orange-500' : 'border-gray-300'}`}>
                      {paymentMethod === method && <CheckCircle size={12} weight="fill" className="text-white" />}
                    </div>
                    <span>{method}</span>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={() => handlePaymentChange(method)}
                      className="hidden"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Order Button */}
            <button
              type="submit"
              disabled={loading || !paymentMethod || !selectedAddress}
              className="w-full py-3 bg-orange-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <CircleNotch size={20} className="animate-spin" />
                  Processing...
                </>
              ) : (
                'Place Order'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;