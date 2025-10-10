import React from "react";
import { ThemeProvider } from "@material-tailwind/react";
import { AuthProvider } from "./context/AuthContext";
import { ProductProvider } from "./context/ProductContext";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Admin from "./pages/Admin.jsx";

import { Route, Routes } from "react-router-dom";
const App = () => {
  return (
    <AuthProvider>
      <ProductProvider>
        <ThemeProvider>
          <div>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/page/admin" element={<Admin />} />
            </Routes>
            <Footer />
          </div>
        </ThemeProvider>
      </ProductProvider>
    </AuthProvider>
  );
};

export default App;