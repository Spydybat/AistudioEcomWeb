import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CreditCard, ShieldCheck, ShoppingBag, Truck, Lock, ChevronLeft, HelpCircle } from "lucide-react";
import { useShop } from "../context/ShopContext";
import { useCurrency } from "../context/CurrencyContext";
import EmptyState from "../components/ui/EmptyState";

export default function CheckoutPage() {
  const { cart } = useShop();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<"credit-card" | "paypal" | "afterpay">("credit-card");

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shipping = subtotal > 200 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (cart.length === 0) {
    return (
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full flex flex-col justify-center">
        <EmptyState
          icon={<ShoppingBag className="h-7 w-7" />}
          title="Your bag is empty"
          description="You cannot proceed to checkout with an empty bag."
          actionLabel="Return to Shop"
          actionTo="/products"
        />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white w-full">
      {/* Checkout Header */}
      <header className="border-b border-zinc-200 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-black transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Bag
          </button>
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-widest">
            <Lock className="h-3.5 w-3.5" />
            Secure Checkout
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_480px] gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Forms */}
          <div className="space-y-12">
            
            {/* Customer Information */}
            <section>
              <h2 className="text-xl font-sans font-bold tracking-tight text-black mb-6 uppercase">1. Customer Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">Email Address</label>
                  <input type="email" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors" placeholder="Enter your email" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">First Name</label>
                  <input type="text" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors" placeholder="First Name" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">Last Name</label>
                  <input type="text" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors" placeholder="Last Name" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">Phone Number</label>
                  <input type="tel" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors" placeholder="Phone Number" />
                </div>
              </div>
            </section>

            {/* Shipping Address */}
            <section>
              <h2 className="text-xl font-sans font-bold tracking-tight text-black mb-6 uppercase">2. Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">Street Address</label>
                  <input type="text" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors" placeholder="Street Address" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">Apartment, suite, etc. (optional)</label>
                  <input type="text" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors" placeholder="Apartment, suite, etc." />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">City</label>
                  <input type="text" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors" placeholder="City" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">Country / Region</label>
                  <select className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors appearance-none cursor-pointer">
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                    <option>Australia</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">State / Province</label>
                  <input type="text" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors" placeholder="State / Province" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">ZIP / Postal Code</label>
                  <input type="text" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors" placeholder="ZIP / Postal Code" />
                </div>
              </div>
            </section>

            {/* Billing Address */}
            <section>
              <h2 className="text-xl font-sans font-bold tracking-tight text-black mb-6 uppercase">3. Billing Address</h2>
              <label className="flex items-center gap-3 p-4 border border-zinc-200 rounded-xl bg-zinc-50 cursor-pointer hover:border-black transition-colors mb-5">
                <input 
                  type="checkbox" 
                  checked={billingSameAsShipping}
                  onChange={(e) => setBillingSameAsShipping(e.target.checked)}
                  className="w-4 h-4 accent-black cursor-pointer" 
                />
                <span className="text-sm font-bold text-black">Same as shipping address</span>
              </label>

              {!billingSameAsShipping && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-slideIn">
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">Street Address</label>
                    <input type="text" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors" placeholder="Street Address" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">City</label>
                    <input type="text" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors" placeholder="City" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">ZIP / Postal Code</label>
                    <input type="text" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors" placeholder="ZIP / Postal Code" />
                  </div>
                </div>
              )}
            </section>

            {/* Payment Method */}
            <section>
              <h2 className="text-xl font-sans font-bold tracking-tight text-black mb-6 uppercase flex items-center justify-between">
                <span>4. Payment Method</span>
                <div className="flex items-center gap-1">
                  <Lock className="h-3 w-3 text-zinc-400" />
                  <span className="text-[10px] font-bold tracking-widest text-zinc-400">Encrypted</span>
                </div>
              </h2>
              
              <div className="space-y-3">
                {/* Credit Card Option */}
                <div className={`border rounded-2xl overflow-hidden transition-all ${paymentMethod === "credit-card" ? "border-black shadow-sm" : "border-zinc-200"}`}>
                  <label className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${paymentMethod === "credit-card" ? "bg-zinc-50" : "bg-white hover:bg-zinc-50/50"}`}>
                    <input 
                      type="radio" 
                      name="payment_method" 
                      checked={paymentMethod === "credit-card"}
                      onChange={() => setPaymentMethod("credit-card")}
                      className="w-4 h-4 accent-black cursor-pointer" 
                    />
                    <div className="flex-1 flex items-center justify-between">
                      <span className="text-sm font-bold text-black">Credit Card</span>
                      <CreditCard className="h-5 w-5 text-zinc-400" />
                    </div>
                  </label>
                  
                  {paymentMethod === "credit-card" && (
                    <div className="p-5 border-t border-zinc-200 bg-white space-y-5 animate-slideIn">
                      <div className="space-y-2">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">Card Number</label>
                        <div className="relative">
                          <input type="text" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 pl-11 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors font-mono" placeholder="0000 0000 0000 0000" />
                          <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">Expiration Date</label>
                          <input type="text" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors font-mono" placeholder="MM/YY" />
                        </div>
                        <div className="space-y-2">
                          <label className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                            Security Code
                            <HelpCircle className="h-3.5 w-3.5 cursor-pointer text-zinc-400 hover:text-black" />
                          </label>
                          <input type="text" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors font-mono" placeholder="CVC" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">Name on Card</label>
                        <input type="text" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors" placeholder="Full Name" />
                      </div>
                    </div>
                  )}
                </div>

                {/* PayPal Option */}
                <div className={`border rounded-2xl overflow-hidden transition-all ${paymentMethod === "paypal" ? "border-black shadow-sm" : "border-zinc-200"}`}>
                  <label className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${paymentMethod === "paypal" ? "bg-zinc-50" : "bg-white hover:bg-zinc-50/50"}`}>
                    <input 
                      type="radio" 
                      name="payment_method" 
                      checked={paymentMethod === "paypal"}
                      onChange={() => setPaymentMethod("paypal")}
                      className="w-4 h-4 accent-black cursor-pointer" 
                    />
                    <div className="flex-1 flex items-center justify-between">
                      <span className="text-sm font-bold text-black">PayPal</span>
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded tracking-widest uppercase">PayPal</span>
                    </div>
                  </label>
                  {paymentMethod === "paypal" && (
                    <div className="p-6 border-t border-zinc-200 text-center animate-slideIn">
                      <p className="text-sm text-zinc-500 font-medium">You will be redirected to PayPal to complete your purchase securely.</p>
                    </div>
                  )}
                </div>
              </div>
            </section>
            
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:sticky lg:top-24">
            <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-sans font-bold tracking-tight text-black mb-6 uppercase">Order Summary</h2>
              
              <div className="space-y-4 max-h-[40vh] overflow-y-auto no-scrollbar pr-2 mb-6">
                {cart.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-white border border-zinc-200 rounded-xl overflow-hidden">
                      <img src={item.product.images?.[0]} alt={item.product.name} className="w-full h-full object-cover" />
                      <div className="absolute -top-2 -right-2 bg-black text-white w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h4 className="text-sm font-bold text-black truncate">{item.product.name}</h4>
                      <p className="text-xs text-zinc-500 font-medium mt-0.5 uppercase tracking-widest">{item.selectedSize} / {item.selectedColor.name}</p>
                      <p className="text-sm font-bold text-black mt-1">{formatPrice(item.product.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Code UI only */}
              <div className="flex gap-2 mb-8 border-y border-zinc-200 py-6">
                <input 
                  type="text" 
                  placeholder="Discount code or gift card" 
                  className="flex-1 bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors uppercase tracking-widest placeholder:normal-case placeholder:tracking-normal"
                />
                <button className="px-6 bg-zinc-200 text-zinc-500 font-bold text-xs uppercase tracking-widest rounded-xl cursor-not-allowed">
                  Apply
                </button>
              </div>

              <div className="space-y-3 mb-6 text-sm font-medium">
                <div className="flex justify-between text-zinc-500">
                  <span>Subtotal</span>
                  <span className="text-black font-bold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Shipping</span>
                  <span className="text-black font-bold">{shipping === 0 ? "Complimentary" : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Estimated Tax</span>
                  <span className="text-black font-bold">{formatPrice(tax)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-zinc-200 mb-8">
                <span className="text-sm font-bold uppercase tracking-widest text-black">Total</span>
                <span className="text-2xl font-sans font-bold text-black">{formatPrice(total)}</span>
              </div>

              <button className="w-full flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 cursor-pointer">
                {paymentMethod === "paypal" ? "Continue to PayPal" : "Complete Order"}
              </button>

              <div className="mt-6 flex items-center justify-center gap-4 text-zinc-400">
                <ShieldCheck className="h-5 w-5" />
                <Truck className="h-5 w-5" />
                <Lock className="h-5 w-5" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
