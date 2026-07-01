import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, Outlet } from "react-router-dom";
import { CheckCircle, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useShop } from "./context/ShopContext";
import { supabase } from "./supabaseClient";

// Global Layout Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import WishlistDrawer from "./components/WishlistDrawer";
import AuthModal from "./components/AuthModal";

// Store Pages
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import BrandPage from "./pages/BrandPage";
import ElectronicsPage from "./pages/ElectronicsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import CheckoutPage from "./pages/CheckoutPage";
import BundleBuilderPage from "./pages/BundleBuilderPage";
import NotFoundPage from "./pages/NotFoundPage";

// Admin Pages
import AdminLayout from "./pages/admin/AdminLayout";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminCustomersPage from "./pages/admin/AdminCustomersPage";
import AdminReviewsPage from "./pages/admin/AdminReviewsPage";
import ProtectedAdminRoute from "./routes/ProtectedAdminRoute";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function StoreLayout() {
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
    <div className="min-h-screen bg-[#1E1F22] font-sans text-[#DBDEE1] antialiased flex flex-col justify-between selection:bg-indigo-500/90 selection:text-white relative">
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
          <Outlet />
        </main>
      </div>

      <Footer />

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
        onOpenQuickView={() => {}}
      />

      <AuthModal />

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 left-6 z-50 p-4 max-w-sm bg-[#313338] text-[#DBDEE1] shadow-[0_8px_24px_rgba(0,0,0,0.5)] border border-white/5 flex items-start gap-3 rounded-xl"
          >
            {toast.type === "success" ? (
              <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
            ) : (
              <Info className="h-5 w-5 text-zinc-500 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="text-xs font-sans tracking-wide leading-relaxed font-normal">
                {toast.text}
              </p>
            </div>
            <button
              onClick={hideToast}
              className="text-zinc-400 hover:text-zinc-200 text-xs px-1 normal-case font-mono cursor-pointer"
            >
              dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        console.error('Error fetching products:', error);
      } else {
        console.log('Fetched products:', data);
      }
    }
    
    fetchProducts();
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Admin routes (no store header/footer) */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="customers" element={<AdminCustomersPage />} />
          <Route path="reviews" element={<AdminReviewsPage />} />
        </Route>

        {/* Store routes */}
        <Route element={<StoreLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/electronics" element={<ElectronicsPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/brand/:brandId" element={<BrandPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/bundle-builder" element={<BundleBuilderPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
