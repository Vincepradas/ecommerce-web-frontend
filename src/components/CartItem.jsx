import React from 'react';

const CartItem = ({ item, selectedItems, toggleSelection, removeFromCart }) => {
  return (
    <div key={item._id} className="flex justify-between items-center border-b py-4">
      <div className="flex items-center space-x-4">
        <input
          type="checkbox"
          checked={selectedItems[item._id] || false}
          onChange={() => toggleSelection(item._id)}
          className="checkbox"
        />
        <div>
          <h3 className="text-lg font-medium text-black">{item.productId?.name || "Unnamed Product"}</h3>
          <p className="text-sm text-gray-600">PHP {Number(item.productId?.price).toFixed(2)} x {item.quantity}</p>
        </div>
      </div>
      <button
        className="text-sm text-red-600 hover:underline"
        onClick={() => removeFromCart(item.productId?._id)}
      >
        Remove
      </button>
    </div>
  );
};

export default CartItem;
