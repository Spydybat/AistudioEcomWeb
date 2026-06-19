import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";

export default function CartPage() {
  const { cart } = useShop();

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
      <h1 className="text-4xl font-serif font-bold mb-8">Your Shopping Bag</h1>
      {cart.length === 0 ? (
        <div className="py-16 border-t border-neutral-200 text-center">
          <p className="text-neutral-500 mb-6">Your bag is currently empty.</p>
          <Link to="/products" className="bg-black text-white px-8 py-3 rounded-full text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            {/* Cart Items List */}
          </div>
          <div>
            {/* Summary */}
            <Link to="/checkout" className="w-full block text-center bg-black text-white px-8 py-4 rounded-full text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
