const CartItem = ({ item, selected, toggleSelection, removeFromCart }) => {
  return (
    <div className="flex items-start space-x-4 p-4 border rounded-lg">
      <input
        type="checkbox"
        checked={selected}
        onChange={() => toggleSelection(item._id)}
        className="mt-1 h-5 w-5 text-black rounded"
      />
      <div className="flex-1">
        <div className="flex justify-between">
          <div>
            <h3 className="font-medium">{item.productId.name}</h3>
            <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
          </div>
          <div className="text-right">
            <p className="font-medium font-slick">PHP {(item.productId.price * item.quantity).toFixed(2)}</p>
            <button 
              onClick={() => removeFromCart(item.productId._id)}
              className="text-red-500 text-sm hover:text-red-700"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
