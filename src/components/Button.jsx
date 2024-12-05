import React from "react";

export const PrimaryButton = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="bg-[#1F2232] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#596475] transition-all"
  >
    {children}
  </button>
);

export const SecondaryButton = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="bg-gray-100 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-all"
  >
    {children}
  </button>
);
