import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CheckCircle, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useShop } from "./context/ShopContext";

// Global Layout Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import WishlistDrawer from "./components/WishlistDrawer";

// Pages
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import NotFoundPage from "./pages/NotFoundPage";

// A simple scroll-to-top component
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const {
    cart,
    wishlist,
    isCartOpen,
    setIsCartOpen,
    isWishlistOpen,
    setIsWishlistOpen,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    handleUpdateCartQty,
    handleRemoveCartItem,
    handleClearCart,
    handleToggleWishlist,
    handleAddToCartFromWishlist,
    toast,
    hideToast,
  } = useShop();

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-white font-sans text-neutral-800 antialiased flex flex-col justify-between selection:bg-neutral-900 selection:text-white relative">
        <div className="flex-1 flex flex-col">
          <Header
            cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
            wishlistCount={wishlist.length}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenWishlist={() => setIsWishlistOpen(true)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          <main className="flex-1 flex flex-col">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/product/:id" element={<ProductDetailsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>

        <Footer />

        {/* Global Drawers & Toasts */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cart}
          onUpdateQuantity={handleUpdateCartQty}
          onRemoveItem={handleRemoveCartItem}
          onClearCart={handleClearCart}
        />

        <WishlistDrawer
          isOpen={isWishlistOpen}
          onClose={() => setIsWishlistOpen(false)}
          wishlist={wishlist}
          onRemoveFromWishlist={handleToggleWishlist}
          onAddToCartFromWishlist={handleAddToCartFromWishlist}
          onOpenQuickView={() => {}} // Handle this better if needed inside Drawer
        />

        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="fixed bottom-6 left-6 z-50 p-4 max-w-sm bg-neutral-900 text-white shadow-2xl border border-neutral-800 flex items-start gap-3 rounded"
            >
              {toast.type === "success" ? (
                <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              ) : (
                <Info className="h-5 w-5 text-neutral-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="text-xs font-sans tracking-wide leading-relaxed font-normal">
                  {toast.text}
                </p>
              </div>
              <button
                onClick={hideToast}
                className="text-neutral-500 hover:text-white text-xs px-1 normal-case font-mono cursor-pointer"
              >
                dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BrowserRouter>
  );
}
