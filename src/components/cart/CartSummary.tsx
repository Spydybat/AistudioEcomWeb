import { Link } from "react-router-dom";
import { CartItem } from "../../types";
import { useCurrency } from "../../context/CurrencyContext";

interface CartSummaryProps {
  cartItems: CartItem[];
  showCheckoutButton?: boolean;
  checkoutLabel?: string;
  onCheckout?: () => void;
}

export default function CartSummary({
  cartItems,
  showCheckoutButton = true,
  checkoutLabel = "Proceed to Checkout",
  onCheckout,
}: CartSummaryProps) {
  const { formatPrice } = useCurrency();
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const FREE_SHIPPING_THRESHOLD = 200;
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 15;
  const total = subtotal + shippingCost;

  return (
    <div className="bg-[#111214] border border-white/5 p-6 rounded-xl space-y-4">
      <h2 className="text-sm font-mono uppercase tracking-widest text-white font-semibold">
        Order Summary
      </h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-zinc-400">
          <span>Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-zinc-400">
          <span>Shipping</span>
          <span>{shippingCost === 0 ? "Complimentary" : formatPrice(shippingCost)}</span>
        </div>
        {subtotal < FREE_SHIPPING_THRESHOLD && subtotal > 0 && (
          <p className="text-xs text-zinc-500">
            Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping
          </p>
        )}
        <div className="border-t border-white/10 pt-3 flex justify-between items-baseline">
          <span className="font-semibold uppercase tracking-wider text-white">Total</span>
          <span className="text-2xl font-serif font-bold text-white">{formatPrice(total)}</span>
        </div>
      </div>

      {showCheckoutButton && (
        onCheckout ? (
          <button
            onClick={onCheckout}
            className="w-full block text-center bg-indigo-500 text-white px-8 py-4 rounded-full text-xs uppercase tracking-widest hover:bg-indigo-600 transition-colors cursor-pointer"
          >
            {checkoutLabel}
          </button>
        ) : (
          <Link
            to="/checkout"
            className="w-full block text-center bg-indigo-500 text-white px-8 py-4 rounded-full text-xs uppercase tracking-widest hover:bg-indigo-600 transition-colors"
          >
            {checkoutLabel}
          </Link>
        )
      )}
    </div>
  );
}
