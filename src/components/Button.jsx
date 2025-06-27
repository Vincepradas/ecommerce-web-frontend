import React from "react";

export const PrimaryButton = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="bg-black text-white px-6 py-2 rounded-lg hover:bg-[#596475] transition-all"
  >
    {children}
  </button>
);

export const SecondaryButton = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className=" text-black border-black border px-6 py-2 rounded-lg  hover:bg-gray-200 transition-all"
  >
    {children}
  </button>
);
