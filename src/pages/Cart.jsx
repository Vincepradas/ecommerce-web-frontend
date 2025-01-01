import React, { useState, useEffect, useContext, useCallback } from "react";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import Login from "./Login";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const { user } = useContext(AuthContext);
  const API_URL = "https://ecomwebapi-gsbbgmgbfubhc8hk.canadacentral-01.azurewebsites.net";

  // Fetch Cart
  const fetchCart = useCallback(() => {
    const token = user?.token || localStorage.getItem("authToken");
    if (!token) {
      setError("Unauthorized - No token found");
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/api/cart`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) {
            setCartItems([]);
            setTotal(0);
            return;
          }
          throw new Error("Failed to fetch cart items.");
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        const items = Array.isArray(data.items) ? data.items : [];
        setCartItems(items);

        const totalAmount = items.reduce((acc, item) => {
          const price = Number(item.productId?.price) || 0;
          const quantity = Number(item.quantity) || 0;
          return acc + price * quantity;
        }, 0);
        setTotal(totalAmount);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user]);

  // Remove Item from Cart
  const removeFromCart = (productId) => {
    const token = user?.token || localStorage.getItem("authToken");
    if (!token) {
      setError("Unauthorized - No token found");
      return;
    }

    fetch(`${API_URL}/api/cart/remove`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.cart) {
          setCartItems(data.cart.items);
          setTotal(data.cart.totalAmount);
        } else {
          setError(data.message || "Failed to remove item");
        }
      })
      .catch((err) => setError(err.message));
  };

  // Clear Cart
  const clearCart = () => {
    const token = user?.token || localStorage.getItem("authToken");
    if (!token) {
      setError("Unauthorized - No token found");
      return;
    }

    fetch(`${API_URL}/api/cart/clear`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Cart cleared successfully") {
          setCartItems([]);
          setTotal(0);
        } else {
          setError(data.message || "Failed to clear cart");
        }
      })
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[200px]"><p>Loading cart...</p></div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-[200px]"><Login/></div>;
  }

  return (
    <div className="cart-section bg-white rounded-lg p-6 max-w-4xl mx-auto my-8 font-poppins">
      <h2 className="text-2xl font-semibold text-black mb-6 border-b pb-2">Shopping Cart</h2>
      
      <div className="cart-items-list space-y-4 mb-6">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item._id} className="flex justify-between items-center border-b py-4">
              <div>
                <h3 className="text-lg font-medium text-black">{item.productId?.name || "Unnamed Product"}</h3>
                <p className="text-sm text-gray-600">PHP {Number(item.productId?.price).toFixed(2)} x {item.quantity}</p>
              </div>
              <button
                className="text-sm text-red-600 hover:underline"
                onClick={() => removeFromCart(item.productId?._id)}
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        )}
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-semibold">Total:</p>
          <p className="text-lg font-bold">PHP {total.toFixed(2)}</p>
        </div>
        <div className="flex space-x-4">
          <button 
            className="w-1/2 py-2 rounded bg-black text-white hover:bg-gray-800"
            onClick={clearCart}
          >
            Clear Cart
          </button>
          <Link
            to="/checkout"
            className="w-1/2 py-2 rounded bg-black text-white text-center hover:bg-gray-800"
            >
          Checkout
          </Link>
          
        </div>
      </div>
    </div>
  );
};

export default Cart;
