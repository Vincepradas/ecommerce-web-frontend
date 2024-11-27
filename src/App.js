import React from "react";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";  // Import AuthProvider
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Header from "./components/Header";
import Footer from "./components/Footer";

const App = () => {
    return (
        <AuthProvider>  {/* Wrap your app with AuthProvider */}
            <div>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products/:id" element={<ProductDetails />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
                <Footer />
            </div>
        </AuthProvider>
    );
};

export default App;
