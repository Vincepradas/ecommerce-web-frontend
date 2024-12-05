import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#e6e3d5] text-gray-800 py-8 font-slick border-t-2 border-gray-300">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4">About our Shop</h3>
            <p className="text-gray-700">
              This is an e-commerce platform for my moms small business. Our
              mission is to provide quality products with fast and reliable
              delivery.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="text-gray-700">
              <li>
                <a href="/" className="hover:text-gray-200">
                  Home
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-gray-200">
                  Products
                </a>
              </li>
              <li>
                <a href="/cart" className="hover:text-gray-200">
                  Cart
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-gray-200">
                  About
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-gray-200">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <ul className="text-gray-700">
              <li>
                Email:{" "}
                <a href="mailto:info@shop.com" className="hover:text-gray-200">
                  vincepradas.business@gmail.com
                </a>
              </li>
              <li>
                Phone:{" "}
                <a href="tel:+1234567890" className="hover:text-gray-200">
                  +639305971050
                </a>
              </li>
              <li>Address: P4, Union, Madrid, Surigao del Sur 8316</li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com/vince6910"
                className="text-gray-700 hover:text-gray-200"
              >
                <i className="fab fa-facebook-f">Facebook</i>
              </a>
              <a
                href="https://twitter.com"
                className="text-gray-700 hover:text-gray-200"
              >
                <i className="fab fa-twitter">Twitter</i>
              </a>
              <a
                href="https://instagram.com"
                className="text-gray-700 hover:text-gray-200"
              >
                <i className="fab fa-instagram">Instagram</i>
              </a>
              <a
                href="https://linkedin.com/in/vincepradas"
                className="text-gray-700 hover:text-gray-200"
              >
                <i className="fab fa-linkedin-in">LinkedIn</i>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 border-t border-gray-700 pt-4">
          <p className="text-center text-sm text-gray-700">
            © 2024 My E-commerce Website | All Rights Reserved | Vince Warren
            Pradas
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
