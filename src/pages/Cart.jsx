import React, { useState, useEffect, useContext, useCallback } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Login from "./Login";
import CartItem from "../components/CartItem.jsx"


const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subtotal, setSubtotal] = useState(0);
  const [selectedSubtotal, setSelectedSubtotal] = useState(0);
  const { user } = useContext(AuthContext);
  const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  
  const clearCart = () => {
    const token = user?.token || localStorage.getItem("authToken");
    if (!token) {
      setError("Unauthorized - No token found");
      return;
    }

    fetch(`${REACT_APP_API_URL}/cart/clear`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Cart cleared successfully") {
          setCartItems([]);
          setSubtotal(0);
          setSelectedSubtotal(0);
          setSelectedItems({});
        } else {
          setError(data.message || "Failed to clear cart");
        }
      })
      .catch((err) => setError(err.message));
  };

  const fetchCart = useCallback(() => {
    const token = user?.token || localStorage.getItem("authToken");
    if (!token) {
      setError("Unauthorized - No token found");
      setLoading(false);
      return;
    }

    fetch(`${REACT_APP_API_URL}/cart`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) {
            setCartItems([]);
            setSubtotal(0);
            setSelectedSubtotal(0);
            setSelectedItems({});
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

        const calculatedSubtotal = items.reduce((acc, item) => {
          const price = Number(item.productId?.price) || 0;
          const quantity = Number(item.quantity) || 0;
          return acc + price * quantity;
        }, 0);
        setSubtotal(calculatedSubtotal);

        
        const initialSelection = items.reduce((acc, item) => {
          acc[item._id] = false;
          return acc;
        }, {});
        setSelectedItems(initialSelection);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user]);

  const removeFromCart = (productId) => {
    const token = user?.token || localStorage.getItem("authToken");
    if (!token) {
      setError("Unauthorized - No token found");
      return;
    }

    fetch(`${REACT_APP_API_URL}/cart/remove`, {
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
          const newSubtotal = data.cart.items.reduce((acc, item) => {
            const price = Number(item.productId?.price) || 0;
            const quantity = Number(item.quantity) || 0;
            return acc + price * quantity;
          }, 0);
          setSubtotal(newSubtotal);

          
          const updatedSelection = { ...selectedItems };
          delete updatedSelection[productId];
          setSelectedItems(updatedSelection);

          
          const newSelectedSubtotal = data.cart.items
            .filter(item => updatedSelection[item._id])
            .reduce((acc, item) => {
              const price = Number(item.productId?.price) || 0;
              const quantity = Number(item.quantity) || 0;
              return acc + price * quantity;
            }, 0);
          setSelectedSubtotal(newSelectedSubtotal);
        } else {
          setError(data.message || "Failed to remove item");
        }
      })
      .catch((err) => setError(err.message));
  };

  const handleCheckout = () => {
    const selectedCartItems = cartItems.filter((item) => selectedItems[item._id]);
    if (selectedCartItems.length === 0) {
      alert("Please select at least one item to checkout.");
      return;
    }

    navigate("/checkout", {
      state: {
        isDirectCheckout: false,
        cartItems: selectedCartItems.map(item => ({
          productId: item.productId._id,
          productName: item.productId.name,
          quantity: item.quantity,
          price: item.productId.price,
          discountPercentage: item.productId.discountPercentage || 0,
          totalPrice: item.productId.price * item.quantity
        })),
        totalAmount: selectedSubtotal
      }
    });
  };

  const toggleSelection = (id) => {
    setSelectedItems((prev) => {
      const newSelection = {
        ...prev,
        [id]: !prev[id],
      };

      
      const newSelectedSubtotal = cartItems
        .filter(item => newSelection[item._id])
        .reduce((acc, item) => {
          const price = Number(item.productId?.price) || 0;
          const quantity = Number(item.quantity) || 0;
          return acc + price * quantity;
        }, 0);

      setSelectedSubtotal(newSelectedSubtotal);
      return newSelection;
    });
  };

  const selectAllItems = () => {
    const allSelected = cartItems.reduce((acc, item) => {
      acc[item._id] = true;
      return acc;
    }, {});

    setSelectedItems(allSelected);
    setSelectedSubtotal(subtotal);
  };

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[200px]"><p>Loading cart...</p></div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-[200px]"><Login /></div>;
  }

  return (
    <div className="cart-section bg-white rounded-lg p-4 md:p-6 max-w-4xl mx-auto my-4 md:my-8 font-poppins">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-xl font-medium text-black">Shopping Cart</h2>
        <Link to='/orders' className="border rounded-lg px-4 py-2 bg-black text-white text-sm md:text-base">
          MY ORDERS
        </Link>
      </div>

      <div className="bg-blue-50 text-blue-800 p-3 rounded-lg mb-6 text-sm">
        <span className="font-semibold">MOBILE OPTIMIZED</span> Easy checkout on any device
      </div>

      <div className="cart-items-list space-y-4 mb-6">
        {cartItems.length > 0 ? (
          <>
            <div className="flex justify-between items-center">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={cartItems.every(item => selectedItems[item._id])}
                  onChange={selectAllItems}
                  className="h-5 w-5 text-black rounded"
                />
                <span className="text-sm font-medium">Select all</span>
              </label>
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Clear Cart
              </button>
            </div>

            {cartItems.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                selected={selectedItems[item._id] || false}
                toggleSelection={toggleSelection}
                removeFromCart={removeFromCart}
              />
            ))}
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Your cart is empty.</p>
            <Link
              to="/"
              className="inline-block bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium font-slick">PHP {selectedSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium text-green-600">Free</span>
            </div>
            <div className="border-t pt-3 flex justify-between">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-lg font-slick">PHP {selectedSubtotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg mb-6 text-sm text-gray-600">
            <span className="font-semibold">TRANSPARENCY</span> - No hidden fees
          </div>

          <button
            className="w-full py-3 rounded-lg bg-black text-white hover:bg-gray-800 font-medium"
            onClick={handleCheckout}
          >
            Check out
          </button>

          <div className="mt-4 text-center text-sm text-gray-500">
            <span className="font-semibold">MINIMUM FRICTION</span> - Quick and easy checkout
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;