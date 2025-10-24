'use client';

import { useCart } from '../CartContext';

export default function CartPage() {
  const { cart, removeFromCart, total } = useCart();

  if (cart.length === 0) return <p>Your cart is empty.</p>;

  return (
    <div>
      {cart.map((item) => (
        <div key={item.id} className="flex justify-between p-2 bg-white mb-2 rounded items-center">
          <img src={item.image} alt={item.title} className="h-12 w-12 object-contain" />
          <span>{item.title}</span>
          <span>${item.price}</span>
          <button
            onClick={() => removeFromCart(item.id)}
            className="px-2 py-1 bg-red-500 text-white rounded"
          >
            Remove
          </button>
        </div>
      ))}
      <p className="mt-4 font-bold">Total: ${total}</p>
    </div>
  );
}
