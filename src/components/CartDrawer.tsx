import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { X, Plus, Minus, Trash2, ShoppingBag, Percent, ShieldCheck, TicketCheck } from "lucide-react";
import { CartItem } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { useCurrency } from "../context/CurrencyContext";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const { formatPrice } = useCurrency();

  const FREE_SHIPPING_THRESHOLD = 200;
  const STANDARD_SHIPPING_COST = 15;

  // Calculators
  const subtotalBeforeDiscounts = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const discountValue = subtotalBeforeDiscounts * (discountPercent / 100);
  const subtotalAfterDiscounts = subtotalBeforeDiscounts - discountValue;

  const freeShippingLeft = FREE_SHIPPING_THRESHOLD - subtotalAfterDiscounts;
  const isFreeShipping = subtotalAfterDiscounts >= FREE_SHIPPING_THRESHOLD || subtotalAfterDiscounts === 0;
  const shippingCost = isFreeShipping ? 0 : STANDARD_SHIPPING_COST;

  const totalCost = subtotalAfterDiscounts + shippingCost;

  const handleApplyPromo = (e: FormEvent) => {
    e.preventDefault();
    setPromoError("");
    setPromoSuccess("");

    const term = promoCode.trim().toUpperCase();
    if (term === "ELEGANCE") {
      setDiscountPercent(15);
      setPromoSuccess("Code 'ELEGANCE' applied! 15% discount has been subtracted.");
    } else if (term === "SPRING") {
      setDiscountPercent(10);
      setPromoSuccess("Code 'SPRING' applied! 10% discount has been subtracted.");
    } else if (!term) {
      setPromoError("Please type a promo code.");
    } else {
      setPromoError("Invalid code. Try applying 'ELEGANCE' or 'SPRING'.");
    }
  };

  const handleTriggerCheckout = () => {
    setIsProcessingCheckout(true);
    // Simulate luxury fulfillment payment process
    setTimeout(() => {
      setIsProcessingCheckout(false);
      setIsCheckoutSuccess(true);
    }, 2000);
  };

  const handleResetSuccessState = () => {
    onClearCart();
    setIsCheckoutSuccess(false);
    setPromoCode("");
    setDiscountPercent(0);
    setPromoSuccess("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          
          {/* Dark overlay backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-950"
          />

          {/* Drawer content sliding container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
            className="relative w-full max-w-md bg-[#2B2D31] h-full shadow-[0_16px_40px_rgba(0,0,0,0.5)] z-10 flex flex-col justify-between"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-100">
                <ShoppingBag className="h-5 w-5" />
                <h2 className="font-serif font-semibold text-base uppercase tracking-wider">
                  Your Shopping Bag ({cartItems.length})
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 px-2 hover:bg-white/5 rounded text-zinc-400 hover:text-white cursor-pointer transition-colors"
                id="cart-drawer-close"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <Link
              to="/cart"
              onClick={onClose}
              className="px-6 pb-3 text-[10px] font-mono uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
            >
              View full bag page →
            </Link>

            {/* Inner Content Switch */}
            {isCheckoutSuccess ? (
              /* Success Checkout Simulator Panel */
              <div className="flex-1 p-8 text-center flex flex-col justify-center items-center">
                <div className="w-16 h-16 bg-[#313338] rounded-full flex items-center justify-center mb-6">
                  <TicketCheck className="h-8 w-8 text-emerald-500 stroke-[1.5]" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-white tracking-wide uppercase mb-3">
                  ORDER COMMITTED SUCCESSFULLY
                </h3>
                <p className="text-xs text-zinc-500 font-mono tracking-widest uppercase mb-6">
                  RESERVED ID: #AURA-{Math.floor(100000 + Math.random() * 900000)}
                </p>
                <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed max-w-xs mb-8">
                  Check out your luxury digital presentation wrap. Your parcel has been dispatched to our Milanese courier hub. A carbon-neutral tracking email is on its way.
                </p>
                <button
                  onClick={handleResetSuccessState}
                  className="w-full py-3.5 bg-indigo-500 text-white hover:bg-indigo-600 text-xs tracking-widest font-mono uppercase transition-colors rounded-xl shadow-[0_4px_12px_rgba(88,101,242,0.4)]"
                  id="order-success-acknowledgement"
                >
                  Return to Aura Boutique
                </button>
              </div>
            ) : cartItems.length === 0 ? (
              /* Empty Bag Panel */
              <div className="flex-1 p-8 text-center flex flex-col justify-center items-center">
                <div className="w-14 h-14 bg-[#313338] rounded-full flex items-center justify-center mb-6 text-zinc-500">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-medium text-white tracking-wider uppercase mb-2">
                  Your Bag is Empty
                </h3>
                <p className="text-xs text-zinc-400 font-light max-w-xs mb-8">
                  Adorning yourself with pristine organic fibers starts by discovering our tailored collections.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-3.5 bg-indigo-500 text-white hover:bg-indigo-600 text-xs tracking-widest font-mono uppercase transition-colors rounded-xl shadow-[0_4px_12px_rgba(88,101,242,0.4)] cursor-pointer"
                >
                  Explore Collections
                </button>
              </div>
            ) : (
              /* Active Shopping List Panel */
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
                  {/* Shipping Progress alert */}
                  <div className="bg-[#313338] border border-white/5 p-4 rounded-xl">
                    <p className="text-xs text-zinc-300 leading-relaxed font-light mb-2.5">
                      {isFreeShipping ? (
                        <span className="font-medium text-white flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                          <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                          Complimentary Carbon-Neutral Shipping Active
                        </span>
                      ) : (
                        <span>
                          You are only <strong className="font-medium text-white">{formatPrice(freeShippingLeft)}</strong> away from <strong>Complimentary Shipping & Gift Pack</strong>.
                        </span>
                      )}
                    </p>
                    <div className="w-full h-1.5 bg-[#1E1F22] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 transition-all duration-300"
                        style={{
                          width: `${Math.min((subtotalAfterDiscounts / FREE_SHIPPING_THRESHOLD) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Cart Item Cards list */}
                  <div className="space-y-4">
                    {cartItems.map((item, index) => (
                      <div
                        key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.name}`}
                        className="flex gap-4 py-3.5 border-b border-white/5 last:border-0"
                      >
                        {/* Thumbnail image */}
                        <div className="w-20 h-24 bg-[#1E1F22] overflow-hidden relative border border-white/5 shrink-0 rounded-lg">
                          <img
                            src={item?.product?.images?.[0] ?? ""}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Description Summary details */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="text-xs sm:text-sm font-serif font-medium text-white tracking-wide line-clamp-1">
                                {item.product.name}
                              </h4>
                              <button
                                onClick={() => onRemoveItem(index)}
                                className="text-zinc-500 hover:text-rose-400 p-1 rounded cursor-pointer transition-colors"
                                title="Delete item"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            {/* Color swatches and Size display */}
                            <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[10px] text-zinc-400 font-sans">
                              <span className="flex items-center gap-1 mr-1">
                                <span 
                                  className="w-2.5 h-2.5 rounded-full inline-block border border-white/10 shadow-sm" 
                                  style={{ backgroundColor: item.selectedColor.hex }}
                                />
                                <span>{item.selectedColor.name}</span>
                              </span>
                              <span>•</span>
                              <span>Size: {item.selectedSize}</span>
                            </div>
                          </div>

                          {/* Price details with quantity Adjusters */}
                          <div className="flex justify-between items-center mt-3">
                            <div className="flex items-center border border-white/10 bg-[#1E1F22] rounded-md overflow-hidden">
                              <button
                                onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                                className="p-1.5 hover:bg-white/5 text-zinc-400 disabled:opacity-30 transition-colors"
                                disabled={item.quantity <= 1}
                                title="Reduce quantity"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="px-2 text-xs font-mono font-medium text-zinc-100">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                                className="p-1.5 hover:bg-white/5 text-zinc-400 transition-colors"
                                title="Increase quantity"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <span className="text-xs sm:text-sm font-sans font-medium text-white">
                              {formatPrice(item.product.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Panel Drawer Checkout Controls */}
                <div className="p-6 bg-[#1E1F22] border-t border-white/5 space-y-4">
                  
                  {/* Promocode form panel */}
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Promo Code: (ELEGANCE)"
                        className="w-full bg-[#2B2D31] border border-white/5 text-zinc-100 text-xs px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 uppercase font-mono rounded-lg"
                        disabled={discountPercent > 0}
                      />
                      {discountPercent > 0 && (
                        <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-emerald-600" />
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={discountPercent > 0}
                      className="px-4 bg-indigo-500 border border-indigo-500 text-white hover:bg-indigo-600 font-mono text-[10px] tracking-widest uppercase transition-colors disabled:opacity-50 disabled:bg-[#313338] disabled:border-[#313338] disabled:text-zinc-500 cursor-pointer rounded-lg"
                    >
                      Apply
                    </button>
                  </form>

                  {/* Promo Message warnings/successes */}
                  {promoError && <p className="text-[10px]/none text-red-600 font-sans tracking-wide">{promoError}</p>}
                  {promoSuccess && <p className="text-[10px]/none text-emerald-600 font-sans tracking-wide">{promoSuccess}</p>}

                  {/* Summary Pricing Logs grid */}
                  <div className="text-xs space-y-2 border-b border-white/5 pb-3">
                    <div className="flex justify-between text-zinc-400 font-light">
                      <span>Garment Subtotal</span>
                      <span className="text-zinc-300">{formatPrice(subtotalBeforeDiscounts)}</span>
                    </div>

                    {discountPercent > 0 && (
                      <div className="flex justify-between text-emerald-500 font-medium">
                        <span>Campaign Discount ({discountPercent}%)</span>
                        <span>-{formatPrice(discountValue)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-zinc-400 font-light">
                      <span>Carbon-Neutral Delivery</span>
                      <span className="text-zinc-300">{shippingCost === 0 ? "Complimentary" : formatPrice(shippingCost)}</span>
                    </div>
                  </div>

                  {/* Grand final total billing statement */}
                  <div className="flex justify-between items-baseline mb-4 text-white font-sans">
                    <span className="text-sm font-medium uppercase tracking-wider">Estimated Total</span>
                    <span className="text-lg font-semibold">{formatPrice(totalCost)}</span>
                  </div>

                  {/* Checkout simulator CTA button */}
                  <button
                    onClick={handleTriggerCheckout}
                    disabled={isProcessingCheckout}
                    className="w-full py-4 bg-indigo-500 text-white hover:bg-indigo-600 text-xs tracking-widest uppercase font-mono font-semibold transition-all shadow-[0_4px_12px_rgba(88,101,242,0.4)] disabled:bg-[#313338] disabled:text-zinc-500 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded-xl"
                    id="cart-drawer-checkout"
                  >
                    <span>{isProcessingCheckout ? "AUTHORIZED CHANNELS..." : "PROCEED TO SECURE CHECKOUT"}</span>
                  </button>
                </div>
              </>
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
