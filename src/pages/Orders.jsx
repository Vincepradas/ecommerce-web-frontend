import React, { useState, useEffect } from "react";
import { ChevronLeft, Clock, Check, Package } from "lucide-react";

const OrderStatus = ({ status }) => {
  const getStatusColor = (status) => {
    const colors = {
      completed: "bg-blue-200 border border-blue-500 text-blue-600",
      pending: "bg-yellow-200 border border-yellow-500 text-yellow-600",
      cancelled: "bg-red-200 border text-red-600 border-red-600",
      shipped: "bg-green-200 border border-green-500 text-green-600",
    };
    return colors[status] || "bg-gray-500";
  };

  return (
    <span className={`${getStatusColor(status)} text-sm px-3 py-1 rounded-full`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const OrderTimeline = ({ order }) => {
  const steps = [
    { title: "Order Placed", date: order.createdAt, icon: Clock },
    { title: "Order Accepted", date: order.acceptedAt, icon: Check },
    { title: "Processing Order", date: order.processingAt, icon: Package },
    { title: "Completed", date: order.completedAt, icon: Check },
  ];

  return (
    <div className="space-y-4 mt-4 font-poppins">
      {steps.map((step, index) => (
        <div key={index} className="flex items-start gap-3">
          <div className={`rounded-full p-2 ${step.date ? "bg-blue-500" : "bg-gray-200"}`}>
            {React.createElement(step.icon, {
              size: 16,
              className: step.date ? "text-white" : "text-gray-400",
            })}
          </div>
          <div>
            <p className="text-sm font-medium">{step.title}</p>
            {step.date && <p className="text-xs text-gray-500">{step.date}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "https://ecom-sandras-g6abfyg2azbqekf8.southeastasia-01.azurewebsites.net//api/orders";

  const fetchOrders = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Unauthorized - No token found");
      setLoading(false);
      return;
    }

    fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Login Session Expired, Please login again.");
        return res.json();
      })
      .then((data) => {
        setOrders(data);
        setFilteredOrders(data.filter((order) => order.status === activeTab));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    setFilteredOrders(orders.filter((order) => order.status === activeTab));
  }, [activeTab, orders]);

  const getStatusCount = (status) => {
    return orders.filter((order) => order.status === status).length;
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading orders...</div>;
  if (error) return <div className="flex items-center justify-center h-screen">Error: {error}</div>;

  return (
    <div className="bg-gray-50 min-h-screen font-poppins">
      {selectedOrder ? (
        <div className="max-w-lg mx-auto p-6">
          <button onClick={() => setSelectedOrder(null)} className="flex items-center text-gray-600 mb-6">
            <ChevronLeft size={20} />
            <span className="ml-1">Back</span>
          </button>

          <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
          <OrderTimeline order={selectedOrder} />

          <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-medium mb-4">Order Details</h3>
            <div className="space-y-3">
              <p className="text-sm">Customer: {selectedOrder.user.name}</p>
              <p className="text-sm">Email: {selectedOrder.user.email}</p>
              <div className="border-t pt-3">
                <p className="text-sm font-medium mb-2">Products:</p>
                {selectedOrder.products.map((product) => (
                  <div key={product.productId} className="flex justify-between text-sm">
                    <span>{product.name} x {product.quantity}</span>
                    <span>PHP {product.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between font-medium">
                  <span>Total Amount:</span>
                  <span>PHP {selectedOrder.totalAmount.toLocaleString()}</span>
                </div>
              </div>
              <div className="border-t pt-3">
                <p className="text-sm">Payment Method: {selectedOrder.paymentMethod}</p>
                <p className="text-sm mt-2">Delivery Address:</p>
                <p className="text-sm text-gray-600">{selectedOrder.address}</p>
              </div>

              <button
                onClick={() => {
                  alert("Seller Notified, Contact seller to complete this action.");
                }}
                className="bg-red-200 text-red-600 border border-red-600 px-4 py-2 rounded-md text-sm"
              >
                Delete Order
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-lg mx-auto p-6 font-poppins">
          <h1 className="text-xl font-semibold mb-6 z-[-1]">My Orders</h1>

          <div className="flex gap-2 mb-6 overflow-x-auto pt-2">
            {["pending", "shipped", "completed", "cancelled"].map((status) => (
              <div key={status} className="relative">
                <button
                  onClick={() => setActiveTab(status)}
                  className={`${
                    activeTab === status
                      ? "text-gray-600 text-base border-b-[3px] border-blue-500"
                      : "text-gray-600"
                  } px-4 py-2 text-sm whitespace-nowrap`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
                <div className="z-[99]">
                {getStatusCount(status) > 0 && (
                  <span className="absolute -top-0 -right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center z-[1000]">
                  {getStatusCount(status)}
                </span>
                )}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="bg-white p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium">
                        {order.products.length > 1
                          ? `${order.products[0].name} +${order.products.length - 1} more`
                          : order.products[0].name}
                      </h3>
                      <p className="text-sm text-gray-500">Recepient: {order.user.name}</p>
                    </div>
                    <OrderStatus status={order.status} />
                  </div>

                  <div className="flex justify-between text-sm text-gray-500">
                    <p>Order ID: #{order.id}</p>
                    <p>PHP {order.totalAmount.toLocaleString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">No {activeTab} orders found.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;