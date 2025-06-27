import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Clock,
  Check,
  Package,
  Truck,
  X,
  ChevronDown,
  ChevronUp,
  Info,
  CreditCard,
  Home,
  Calendar,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const OrderStatus = ({ status }) => {
  const statusConfig = {
    completed: {
      bg: "bg-orange-100",
      text: "text-orange-500",
      border: "border-orange-300",
      icon: <Check size={16} className="text-orange-500" />
    },
    pending: {
      bg: "bg-amber-100",
      text: "text-amber-800",
      border: "border-amber-300",
      icon: <Clock size={16} className="text-amber-500" />
    },
    cancelled: {
      bg: "bg-red-100",
      text: "text-red-800",
      border: "border-red-300",
      icon: <X size={16} className="text-red-500" />
    },
    shipped: {
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-300",
      icon: <Truck size={16} className="text-green-500" />
    }
  };

  return (
    <div className={`${statusConfig[status].bg} ${statusConfig[status].border} border rounded-full px-3 py-1 flex items-center gap-2`}>
      {statusConfig[status].icon}
      <span className={`${statusConfig[status].text} text-sm font-medium`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </div>
  );
};

const OrderTimeline = ({ order }) => {
  const steps = [
    {
      title: "Order Placed",
      date: order.createdAt,
      icon: <Clock size={18} />,
      completed: true
    },
    {
      title: "Payment Confirmed",
      date: order.paymentConfirmedAt,
      icon: <CreditCard size={18} />,
      completed: order.status !== 'pending'
    },
    {
      title: "Processing",
      date: order.processingAt,
      icon: <Package size={18} />,
      completed: ['shipped', 'completed'].includes(order.status)
    },
    {
      title: "Shipped",
      date: order.shippedAt,
      icon: <Truck size={18} />,
      completed: ['shipped', 'completed'].includes(order.status)
    },
    {
      title: "Delivered",
      date: order.deliveredAt,
      icon: <Home size={18} />,
      completed: order.status === 'completed'
    }
  ];

  return (
    <div className="space-y-6 mt-6 font-poppins">
      {steps.map((step, index) => (
        <div key={index} className="flex items-start gap-4 relative">
          {/* Vertical line */}
          {index < steps.length - 1 && (
            <div className={`absolute left-[18px] top-[28px] w-0.5 h-10 ${step.completed ? 'bg-orange-500' : 'bg-gray-200'}`}></div>
          )}

          {/* Icon */}
          <div className={`rounded-full p-2 ${step.completed ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
            {step.icon}
          </div>

          {/* Content */}
          <div className="flex-1">
            <p className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
              {step.title}
            </p>
            {step.date && (
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                <Calendar size={14} />
                <span>{new Date(step.date).toLocaleString()}</span>
              </div>
            )}
            {index === 0 && (
              <div className="mt-2 text-sm text-gray-500">
                Order #: {order._id?.slice(-8).toUpperCase() ?? "N/A"}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const OrderCard = ({ order, onClick }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div
        className="p-4 cursor-pointer font-poppins"
        onClick={() => expanded ? setExpanded(false) : onClick()}
      >
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-400" />
              <span className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h3 className="font-medium mt-1">
              {order.products[0].name}
              {order.products.length > 1 && ` +${order.products.length - 1} more`}
            </h3>
          </div>
          <OrderStatus status={order.status} />
        </div>

        <div className="flex justify-between mt-4">
          <div className="text-sm text-gray-500">
            Total: <span className="font-medium text-gray-900">PHP {order.totalAmount.toFixed(2)}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="text-orange-500 hover:text-orange-800 text-sm font-medium flex items-center gap-1"
          >
            {expanded ? 'Less details' : 'More details'}
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard size={16} className="text-gray-400" />
                  <span className="text-gray-600">{order.paymentMethod}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Truck size={16} className="text-gray-400" />
                  <span className="text-gray-600">
                    {order.status === 'shipped' ? 'In transit' : order.status}
                  </span>
                </div>
              </div>

              <div className="mt-3">
                {order.products.slice(0, 2).map((product, index) => (
                  <div key={index} className="flex justify-between py-2 text-sm">
                    <span className="text-gray-600">
                      {product.name} × {product.quantity}
                    </span>
                    <span className="font-medium">
                      PHP {(product.price * product.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                {order.products.length > 2 && (
                  <div className="text-sm text-gray-500 mt-1">
                    +{order.products.length - 2} more items
                  </div>
                )}
              </div>

              <button
                onClick={() => onClick()}
                className="w-full mt-3 py-2 bg-orange-50 text-orange-500 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                View full order details
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const API_URL = "https://ecom-sandras-g6abfyg2azbqekf8.southeastasia-01.azurewebsites.net/api/orders";

  const fetchOrders = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Unauthorized - No token found");
      setLoading(false);
      return;
    }

    setRefreshing(true);

    fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch orders");
        return res.json();
      })
      .then((data) => {
        setOrders(data);
        applyFilter(activeTab, data);
      })
      .catch((err) => setError(err.message))
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  const applyFilter = (tab, ordersList = orders) => {
    if (tab === "all") {
      setFilteredOrders(ordersList);
    } else {
      setFilteredOrders(ordersList.filter((order) => order.status === tab));
    }
  };

  const handleRefresh = () => {
    fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    applyFilter(activeTab);
  }, [activeTab, orders]);

  const getStatusCount = (status) => {
    return orders.filter((order) => status === "all" ? true : order.status === status).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen p-6">
        <div className="text-center max-w-md">
          <Info size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error loading orders</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-poppins">
      {selectedOrder ? (
        <div className="max-w-md mx-auto px-4 pt-6">
          <button
            onClick={() => setSelectedOrder(null)}
            className="flex items-center text-orange-500 mb-6 hover:text-orange-800 transition-colors"
          >
            <ChevronLeft size={20} />
            <span className="ml-1">Back to orders</span>
          </button>

          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Order Details</h2>
              <OrderStatus status={selectedOrder.status} />
            </div>

            <OrderTimeline order={selectedOrder} />
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h3 className="font-semibold mb-4">Products</h3>
            <div className="space-y-4">
              {selectedOrder.products.map((product) => (

                <div key={product.productId?._id || product.productId} className="flex gap-4">

                  {product.thumbnail ? (
                    <img
                      src={product.thumbnail}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />


                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Package size={20} className="text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-gray-500">Qty: {product.quantity}</p>
                    <p className="text-sm font-medium mt-1">
                      PHP {(product.price * product.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold mb-4">Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>PHP {selectedOrder.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-semibold">
                <span>Total</span>
                <span>PHP {selectedOrder.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
            <h3 className="font-semibold mb-4">Delivery Information</h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <Home size={20} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium">Delivery Address</p>
                  <p className="text-gray-600">{selectedOrder.address}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CreditCard size={20} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium">Payment Method</p>
                  <p className="text-gray-600 capitalize">{selectedOrder.paymentMethod}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto px-4 pt-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">My Orders</h1>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="text-orange-500 hover:text-orange-800 flex items-center gap-1"
            >
              <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
              <span className="text-sm">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>

          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {["all", "pending", "shipped", "completed", "cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setActiveTab(status)}
                className={`${activeTab === status
                  ? "bg-orange-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
                  } px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors flex items-center gap-1`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                {getStatusCount(status) > 0 && (
                  <span className={`${activeTab === status ? "bg-orange-600" : "bg-gray-200"
                    } rounded-full px-2 py-0.5 text-xs`}>
                    {getStatusCount(status)}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onClick={() => setSelectedOrder(order)}
                />
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <Package size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-2">No orders found</h3>
                <p className="text-gray-500 mb-4">
                  {activeTab === "all"
                    ? "You haven't placed any orders yet."
                    : `You don't have any ${activeTab} orders.`}
                </p>
                <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Start Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;