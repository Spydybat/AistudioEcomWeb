import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CreditCard, ShieldCheck, ShoppingBag, Truck, Lock, ChevronLeft, HelpCircle } from "lucide-react";
import { useShop } from "../context/ShopContext";
import { useCurrency } from "../context/CurrencyContext";
import EmptyState from "../components/ui/EmptyState";
import { supabase } from "../supabaseClient";

const loadRazorpaySDK = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutPage() {
  const { cart, user, handleClearCart, showToast } = useShop();
  const { formatPrice, convertPrice, formatConvertedPrice, activeRegion, selectedRegionId, setSelectedRegionId } = useCurrency();
  const navigate = useNavigate();

  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [emailTouched, setEmailTouched] = useState(false);
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  
  const [firstNameTouched, setFirstNameTouched] = useState(false);
  const [lastNameTouched, setLastNameTouched] = useState(false);
  const [addressTouched, setAddressTouched] = useState(false);
  const [cityTouched, setCityTouched] = useState(false);
  const [stateTouched, setStateTouched] = useState(false);
  
  const [zipCode, setZipCode] = useState("");
  const [billingZipCode, setBillingZipCode] = useState("");
  const [zipTouched, setZipTouched] = useState(false);
  const [billingZipTouched, setBillingZipTouched] = useState(false);

  const getZipValidationRules = (countryCode: string) => {
    switch (countryCode) {
      case "IN": return { type: "numeric", exact: 6, max: 6, format: /^\d{6}$/ };
      case "US": return { type: "numeric", exact: 5, max: 5, format: /^\d{5}$/ };
      case "EU": return { type: "numeric", max: 10, format: /^\d{1,10}$/ };
      case "GB": return { type: "alphanumeric", max: 8, format: /^[A-Za-z0-9\s]{1,8}$/ };
      case "JP": return { type: "numeric", exact: 7, max: 7, format: /^\d{7}$/ };
      case "CA": return { type: "alphanumeric", max: 7, format: /^[A-Za-z0-9\s]{1,7}$/ };
      case "AU": return { type: "numeric", exact: 4, max: 4, format: /^\d{4}$/ };
      default: return { type: "numeric", max: 10, format: /^\d+$/ };
    }
  };

  const getZipErrorMessage = (countryCode: string) => {
    switch (countryCode) {
      case "IN": return "Must be exactly 6 digits";
      case "US": return "Must be exactly 5 digits";
      case "EU": return "Maximum 10 digits";
      case "GB": return "Maximum 8 characters";
      case "JP": return "Must be exactly 7 digits";
      case "CA": return "Maximum 7 characters";
      case "AU": return "Must be exactly 4 digits";
      default: return "Invalid ZIP / Postal Code";
    }
  };

  const isValidZip = (code: string, countryCode: string) => {
    const rules = getZipValidationRules(countryCode);
    const val = rules.type === "numeric" ? code.replace(/\s/g, "") : code.trim();
    if (!val) return false;
    if (rules.exact && val.length !== rules.exact) return false;
    return rules.format.test(val);
  };

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>, isBilling: boolean) => {
    let value = e.target.value;
    const rules = getZipValidationRules(selectedRegionId);
    
    if (rules.type === "numeric") {
      value = value.replace(/\D/g, "");
    } else {
      value = value.replace(/[^A-Za-z0-9\s]/g, "");
    }

    if (value.length > rules.max) {
      value = value.slice(0, rules.max);
    }

    if (isBilling) {
      setBillingZipCode(value);
    } else {
      setZipCode(value);
    }
  };

  const [phoneTouched, setPhoneTouched] = useState(false);

  const getPhoneValidationRules = (countryCode: string) => {
    switch (countryCode) {
      case "IN": return { exact: 10, max: 10, msg: "Must be exactly 10 digits" };
      case "US": return { exact: 10, max: 10, msg: "Must be exactly 10 digits" };
      case "CA": return { exact: 10, max: 10, msg: "Must be exactly 10 digits" };
      case "AU": return { exact: 9, max: 9, msg: "Must be exactly 9 digits" };
      case "JP": return { min: 10, max: 11, msg: "Must be 10-11 digits" };
      case "GB": return { min: 1, max: 10, msg: "Must be up to 10 digits" };
      case "EU": return { min: 1, max: 12, msg: "Must be up to 12 digits" };
      default: return { min: 1, max: 15, msg: "Invalid phone number" };
    }
  };

  const isValidPhone = (number: string, countryCode: string) => {
    const rules = getPhoneValidationRules(countryCode);
    if (!number) return false;
    if (rules.exact && number.length !== rules.exact) return false;
    if (rules.min && number.length < rules.min) return false;
    if (rules.max && number.length > rules.max) return false;
    return true;
  };

  const isValidEmail = (emailVal: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal.trim());
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    const maxDigits = getPhoneValidationRules(selectedRegionId).max;
    if (value.length > maxDigits) {
      value = value.slice(0, maxDigits);
    }
    setPhoneNumber(value);
  };

  const COUNTRY_OPTIONS = [
    { id: "IN", label: "🇮🇳 India (INR ₹)" },
    { id: "US", label: "🇺🇸 United States (USD $)" },
    { id: "EU", label: "🇪🇺 Europe (EUR €)" },
    { id: "GB", label: "🇬🇧 United Kingdom (GBP £)" },
    { id: "JP", label: "🇯🇵 Japan (JPY ¥)" },
    { id: "CA", label: "🇨🇦 Canada (CAD $)" },
    { id: "AU", label: "🇦🇺 Australia (AUD $)" }
  ];

  const location = useLocation();
  const buyNowItem = location.state?.buyNowItem;
  
  const checkoutItems = buyNowItem ? [buyNowItem] : cart;

  const subtotal = checkoutItems.reduce((acc: any, item: any) => acc + item.product.price * item.quantity, 0);
  const shipping = subtotal > 200 ? 0 : 15;
  const tax = subtotal * 0.08;
  const discount = 0; // Assuming no discount implemented yet
  
  const convertedSubtotal = convertPrice(subtotal);
  const convertedShipping = convertPrice(shipping);
  const convertedTax = convertPrice(tax);
  const convertedDiscount = convertPrice(discount);
  
  // Calculate the base total and convert it to the final payable amount in the active currency
  const finalCheckoutTotal = convertedSubtotal + convertedShipping + convertedTax - convertedDiscount;

  const handleTriggerCheckout = async () => {
    setIsProcessingCheckout(true);
    setCheckoutError(null);
    
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        throw new Error("Please sign in to complete your purchase.");
      }

      const trimmedEmail = email.trim();
      const trimmedFirstName = firstName.trim();
      const trimmedLastName = lastName.trim();
      const trimmedAddress = address.trim();
      const trimmedCity = city.trim();
      const trimmedState = state.trim();

      if (!trimmedFirstName || !trimmedLastName || !trimmedAddress || !trimmedCity || !trimmedState) {
        setFirstNameTouched(true);
        setLastNameTouched(true);
        setAddressTouched(true);
        setCityTouched(true);
        setStateTouched(true);
        throw new Error("Please fill in all required fields.");
      }

      if (!isValidEmail(trimmedEmail)) {
        setEmailTouched(true);
        throw new Error("Email Address: Invalid email address");
      }

      if (!isValidPhone(phoneNumber, selectedRegionId)) {
        setPhoneTouched(true);
        throw new Error(`Phone Number: ${getPhoneValidationRules(selectedRegionId).msg}`);
      }

      if (!isValidZip(zipCode, selectedRegionId)) {
         setZipTouched(true);
         throw new Error(`Shipping ZIP / Postal Code: ${getZipErrorMessage(selectedRegionId)}.`);
      }
      if (!billingSameAsShipping && !isValidZip(billingZipCode, selectedRegionId)) {
         setBillingZipTouched(true);
         throw new Error(`Billing ZIP / Postal Code: ${getZipErrorMessage(selectedRegionId)}.`);
      }
      // Step 1: Create Order via Razorpay (Backend)
      const { paymentService } = await import('../services/paymentService');
      
      const currency = activeRegion.currency;
      
      const rpOrder = await paymentService.createOrder(finalCheckoutTotal, currency);
      
      if (!rpOrder.success) {
         throw new Error(rpOrder.message || "Failed to create payment order");
      }

      // Step 2: Open Razorpay Checkout Modal
      await loadRazorpaySDK();
      
      if (!(window as any).Razorpay) {
        throw new Error("Razorpay SDK failed to load.");
      }

      const options = {
        key: rpOrder.key_id,
        amount: rpOrder.amount,
        currency: rpOrder.currency,
        name: "Premium Clothing",
        description: "Purchase Checkout",
        order_id: rpOrder.order_id,
        handler: async function (response: any) {
           try {
             setIsProcessingCheckout(true);
             // Step 3: Verify Payment on Backend
             const verifyRes = await paymentService.verifyPayment({
               razorpay_order_id: response.razorpay_order_id,
               razorpay_payment_id: response.razorpay_payment_id,
               razorpay_signature: response.razorpay_signature
             });

             if (!verifyRes.success) {
                setCheckoutError("Payment verification failed!");
                setIsProcessingCheckout(false);
                return;
             }

             // Step 4: Existing Order Creation Logic (Only after successful payment)
             const { data: { user: finalAuthUser } } = await supabase.auth.getUser();
             if (!finalAuthUser) {
               throw new Error("Authentication lost. Payment verified, but order creation failed. Please contact support.");
             }

             const verifiedCheckoutTotal = finalCheckoutTotal;
             const paidAmount = verifiedCheckoutTotal;

             console.log("Checkout Total:", finalCheckoutTotal);
             console.log("Razorpay Amount:", finalCheckoutTotal);
             console.log("Supabase Total Being Inserted:", paidAmount);

             const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
             const { data: orderData, error: orderError } = await supabase
               .from('orders')
               .insert([{
                 profile_id: finalAuthUser.id,
                 order_number: orderNumber,
                 total: paidAmount,
                 subtotal: convertedSubtotal,
                 shipping: convertedShipping,
                 tax: convertedTax,
                 discount: convertedDiscount,
                 status: 'pending',
                 payment_status: 'paid', // Update to paid since razorpay verified
                 payment_method: JSON.stringify({
                   method: 'razorpay',
                   order_id: response.razorpay_order_id,
                   payment_id: response.razorpay_payment_id,
                   signature: response.razorpay_signature
                 }),
                 customer_name: `${trimmedFirstName} ${trimmedLastName}`.trim(),
                 email: trimmedEmail,
                 phone: phoneNumber,
                 address: trimmedAddress,
                 city: trimmedCity,
                 state: trimmedState,
                 postal_code: zipCode,
                 country: selectedRegionId,
                 currency_code: activeRegion.currency
               }])
               .select()
               .single();

             if (orderError) throw new Error(orderError.message);

             const orderId = orderData.id;

             const orderItemsToInsert = checkoutItems.map((item: any) => ({
               order_id: orderId,
               product_id: item.product.id,
               quantity: item.quantity,
               price: convertPrice(item.product.price),
               currency_code: activeRegion.currency
             }));

             const { error: itemsError } = await supabase
               .from('order_items')
               .insert(orderItemsToInsert);

             if (itemsError) {
               // Rollback the order if order_items fail to insert
               await supabase.from('orders').delete().eq('id', orderId);
               throw new Error(itemsError.message);
             }

             if (!buyNowItem) {
               handleClearCart();
             }
             showToast("Order Placed Successfully!");
             navigate('/my-orders'); // Or to a success page
           } catch (err: any) {
             console.error("Order completion error:", err);
             setCheckoutError(err.message || "Failed to complete order after payment.");
           } finally {
             setIsProcessingCheckout(false);
           }
        },
        prefill: {
          name: user?.user_metadata?.full_name || "",
          email: email.trim(),
        },
        theme: {
          color: "#000000"
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setCheckoutError(response.error.description || "Payment failed");
        setIsProcessingCheckout(false);
      });
      rzp.open();
      
    } catch (error: any) {
      console.error('Checkout error:', error);
      setCheckoutError(error.message || "An unexpected error occurred.");
      setIsProcessingCheckout(false);
    }
  };

  if (checkoutItems.length === 0) {
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
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setEmailTouched(true)}
                    className={`w-full bg-zinc-50 border rounded-xl px-4 py-3.5 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors ${emailTouched && !isValidEmail(email) ? 'border-red-500' : 'border-zinc-200'}`} 
                    placeholder="Enter your email" 
                  />
                  {emailTouched && !isValidEmail(email) && (
                    <p className="text-xs text-red-500 mt-1">Invalid email address</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">First Name</label>
                  <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} onBlur={() => setFirstNameTouched(true)} className={`w-full bg-zinc-50 border rounded-xl px-4 py-3.5 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors ${firstNameTouched && !firstName.trim() ? 'border-red-500' : 'border-zinc-200'}`} placeholder="First Name" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">Last Name</label>
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} onBlur={() => setLastNameTouched(true)} className={`w-full bg-zinc-50 border rounded-xl px-4 py-3.5 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors ${lastNameTouched && !lastName.trim() ? 'border-red-500' : 'border-zinc-200'}`} placeholder="Last Name" />
                </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">Phone Number</label>
                    <div className={`flex bg-zinc-50 border rounded-xl overflow-hidden transition-colors ${phoneTouched && !isValidPhone(phoneNumber, selectedRegionId) ? 'border-red-500' : 'border-zinc-200 focus-within:border-black'}`}>
                      <div className="relative">
                        <select 
                          value={selectedRegionId} 
                          onChange={(e) => setSelectedRegionId(e.target.value)}
                          className="h-full bg-zinc-100 border-r border-zinc-200 pl-4 pr-8 py-3.5 text-sm font-medium text-black focus:outline-none cursor-pointer appearance-none"
                        >
                          <option value="IN">+91</option>
                          <option value="US">+1</option>
                          <option value="EU">+33</option>
                          <option value="GB">+44</option>
                          <option value="JP">+81</option>
                          <option value="CA">+1</option>
                          <option value="AU">+61</option>
                        </select>
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                          <svg className="h-3 w-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      <input 
                        type="tel" 
                        inputMode="numeric" 
                        value={phoneNumber} 
                        onChange={handlePhoneNumberChange} 
                        onBlur={() => setPhoneTouched(true)}
                        className="flex-1 bg-transparent px-4 py-3.5 text-sm font-medium text-black focus:outline-none" 
                        placeholder="Phone Number" 
                      />
                    </div>
                    {phoneTouched && !isValidPhone(phoneNumber, selectedRegionId) && (
                      <p className="text-xs text-red-500 mt-1">{getPhoneValidationRules(selectedRegionId).msg}</p>
                    )}
                  </div>
              </div>
            </section>

            {/* Shipping Address */}
            <section>
              <h2 className="text-xl font-sans font-bold tracking-tight text-black mb-6 uppercase">2. Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">Street Address</label>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} onBlur={() => setAddressTouched(true)} className={`w-full bg-zinc-50 border rounded-xl px-4 py-3.5 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors ${addressTouched && !address.trim() ? 'border-red-500' : 'border-zinc-200'}`} placeholder="Street Address" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">Apartment, suite, etc. (optional)</label>
                  <input type="text" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors" placeholder="Apartment, suite, etc." />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">City</label>
                  <input type="text" value={city} onChange={(e) => setCity(e.target.value)} onBlur={() => setCityTouched(true)} className={`w-full bg-zinc-50 border rounded-xl px-4 py-3.5 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors ${cityTouched && !city.trim() ? 'border-red-500' : 'border-zinc-200'}`} placeholder="City" />
                </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">Country / Region</label>
                    <select 
                      value={selectedRegionId} 
                      onChange={(e) => setSelectedRegionId(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors appearance-none cursor-pointer"
                    >
                      {COUNTRY_OPTIONS.map(opt => (
                        <option key={opt.id} value={opt.id}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">State / Province</label>
                  <input type="text" value={state} onChange={(e) => setState(e.target.value)} onBlur={() => setStateTouched(true)} className={`w-full bg-zinc-50 border rounded-xl px-4 py-3.5 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors ${stateTouched && !state.trim() ? 'border-red-500' : 'border-zinc-200'}`} placeholder="State / Province" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">ZIP / Postal Code</label>
                  <input 
                    type="text" 
                    value={zipCode}
                    onChange={(e) => handleZipChange(e, false)}
                    onBlur={() => setZipTouched(true)}
                    className={`w-full bg-zinc-50 border rounded-xl px-4 py-3.5 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors ${zipTouched && !isValidZip(zipCode, selectedRegionId) ? 'border-red-500' : 'border-zinc-200'}`} 
                    placeholder="ZIP / Postal Code" 
                  />
                  {zipTouched && !isValidZip(zipCode, selectedRegionId) && (
                    <p className="text-xs text-red-500 mt-1">{getZipErrorMessage(selectedRegionId)}</p>
                  )}
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
                    <input 
                      type="text" 
                      value={billingZipCode}
                      onChange={(e) => handleZipChange(e, true)}
                      onBlur={() => setBillingZipTouched(true)}
                      className={`w-full bg-zinc-50 border rounded-xl px-4 py-3.5 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors ${billingZipTouched && !isValidZip(billingZipCode, selectedRegionId) ? 'border-red-500' : 'border-zinc-200'}`} 
                      placeholder="ZIP / Postal Code" 
                    />
                    {billingZipTouched && !isValidZip(billingZipCode, selectedRegionId) && (
                      <p className="text-xs text-red-500 mt-1">{getZipErrorMessage(selectedRegionId)}</p>
                    )}
                  </div>
                </div>
              )}
            </section>

            {/* Payment Method */}
            <section>
              <h2 className="text-xl font-sans font-bold tracking-tight text-black mb-6 uppercase flex items-center justify-between">
                <span>4. Secure Payment</span>
                <div className="flex items-center gap-1">
                  <Lock className="h-3 w-3 text-emerald-600" />
                  <span className="text-[10px] font-bold tracking-widest text-emerald-600">Encrypted</span>
                </div>
              </h2>
              
              <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 sm:p-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Lock className="h-8 w-8 text-black mb-2" />
                  <h3 className="text-lg font-bold text-black">Your payment will be processed securely through Razorpay.</h3>
                  
                  <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-medium text-zinc-600 mt-4 mb-6">
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" /> Credit Cards
                    </span>
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" /> Debit Cards
                    </span>
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" /> UPI
                    </span>
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" /> Net Banking
                    </span>
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" /> Wallets
                    </span>
                  </div>

                  <button 
                    onClick={handleTriggerCheckout}
                    disabled={isProcessingCheckout}
                    className="mt-6 w-full max-w-sm flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessingCheckout ? "Processing..." : "Pay Securely with Razorpay"}
                  </button>
                </div>
              </div>
            </section>
            
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:sticky lg:top-24">
            <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-sans font-bold tracking-tight text-black mb-6 uppercase">Order Summary</h2>
              
              <div className="space-y-4 max-h-[40vh] overflow-y-auto no-scrollbar pr-2 mb-6">
                {checkoutItems.map((item: any, index: number) => (
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
                <span className="text-2xl font-sans font-bold text-black">{formatConvertedPrice(finalCheckoutTotal)}</span>
              </div>

              <button 
                onClick={handleTriggerCheckout}
                disabled={isProcessingCheckout}
                className="w-full flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                {isProcessingCheckout ? "Processing..." : "Pay Securely with Razorpay"}
              </button>

              {checkoutError && (
                <div className="mt-4 p-3 bg-red-50 text-red-500 text-xs text-center border border-red-100 rounded-xl">
                  {checkoutError}
                </div>
              )}

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
