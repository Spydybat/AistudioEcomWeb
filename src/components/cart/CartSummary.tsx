import { Link } from "react-router-dom";
import { CartItem } from "../../types";

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
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const FREE_SHIPPING_THRESHOLD = 200;
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 15;
  const total = subtotal + shippingCost;

  return (
    <div className="bg-neutral-50 border border-neutral-100 p-6 rounded-xl space-y-4">
      <h2 className="text-sm font-mono uppercase tracking-widest text-neutral-900 font-semibold">
        Order Summary
      </h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-neutral-600">
          <span>Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-neutral-600">
          <span>Shipping</span>
          <span>{shippingCost === 0 ? "Complimentary" : `$${shippingCost.toFixed(2)}`}</span>
        </div>
        {subtotal < FREE_SHIPPING_THRESHOLD && subtotal > 0 && (
          <p className="text-xs text-neutral-500">
            Add ${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(0)} more for free shipping
          </p>
        )}
        <div className="border-t border-neutral-200 pt-3 flex justify-between items-baseline">
          <span className="font-semibold uppercase tracking-wider text-neutral-900">Total</span>
          <span className="text-2xl font-serif font-bold text-neutral-900">${total.toFixed(2)}</span>
        </div>
      </div>

      {showCheckoutButton && (
        onCheckout ? (
          <button
            onClick={onCheckout}
            className="w-full block text-center bg-black text-white px-8 py-4 rounded-full text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            {checkoutLabel}
          </button>
        ) : (
          <Link
            to="/checkout"
            className="w-full block text-center bg-black text-white px-8 py-4 rounded-full text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors"
          >
            {checkoutLabel}
          </Link>
        )
      )}
    </div>
  );
}
