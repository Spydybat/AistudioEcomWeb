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
    <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-2xl space-y-4 shadow-sm">
      <h2 className="text-sm font-sans uppercase tracking-widest text-black font-bold">
        Order Summary
      </h2>

      <div className="space-y-3 text-sm font-medium">
        <div className="flex justify-between text-zinc-500">
          <span>Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
          <span className="text-black">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-zinc-500">
          <span>Shipping</span>
          <span className="text-black">{shippingCost === 0 ? "Complimentary" : formatPrice(shippingCost)}</span>
        </div>
        {subtotal < FREE_SHIPPING_THRESHOLD && subtotal > 0 && (
          <p className="text-xs text-zinc-500">
            Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping
          </p>
        )}
        <div className="border-t border-zinc-200 pt-4 flex justify-between items-baseline">
          <span className="text-xs font-bold uppercase tracking-widest text-black">Total</span>
          <span className="text-xl font-sans font-bold text-black">{formatPrice(total)}</span>
        </div>
      </div>

      {showCheckoutButton && (
        onCheckout ? (
          <button
            onClick={onCheckout}
            className="w-full block text-center bg-black text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 cursor-pointer mt-2"
          >
            {checkoutLabel}
          </button>
        ) : (
          <Link
            to="/checkout"
            className="w-full block text-center bg-black text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 mt-2"
          >
            {checkoutLabel}
          </Link>
        )
      )}
    </div>
  );
}
