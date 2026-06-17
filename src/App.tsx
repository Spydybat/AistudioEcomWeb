import { useState, useEffect } from "react";
import { Sparkles, ShoppingBag, Heart, CheckCircle, Info } from "lucide-react";
import { Product, CartItem, ProductColor } from "./types";
import Header from "./components/Header";
import Hero from "./components/Hero";
import BrandEthos from "./components/BrandEthos";
import Lookbook from "./components/Lookbook";
import ProductGrid from "./components/ProductGrid";
import ProductQuickView from "./components/ProductQuickView";
import CartDrawer from "./components/CartDrawer";
import WishlistDrawer from "./components/WishlistDrawer";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // --- Persistent State hooks ---
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("aura_cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem("aura_wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  // --- Search and Catalog category filter state ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // --- Layout Toggle state ---
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [activeQuickView, setActiveQuickView] = useState<Product | null>(null);

  // --- Toast/Alert notification state ---
  const [toast, setToast] = useState<{ id: number; text: string; type: "success" | "info" } | null>(null);

  // Sync state with localStorage
  useEffect(() => {
    localStorage.setItem("aura_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("aura_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const showToast = (text: string, type: "success" | "info" = "success") => {
    const id = Date.now();
    setToast({ id, text, type });
    setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 4000);
  };

  // --- Cart operations ---
  const handleAddToCart = (product: Product, size: string, color: ProductColor) => {
    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor.name === color.name
      );

      if (existingIdx > -1) {
        const updated = [...prevCart];
        updated[existingIdx].quantity += 1;
        return updated;
      }

      return [...prevCart, { product, quantity: 1, selectedSize: size, selectedColor: color }];
    });

    showToast(`Added ${product.name} (${size}, ${color.name}) to your shopping bag.`);
  };

  const handleUpdateCartQty = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(index);
      return;
    }
    setCart((prevCart) => {
      const updated = [...prevCart];
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    const item = cart[index];
    setCart((prevCart) => prevCart.filter((_, idx) => idx !== index));
    showToast(`Removed "${item.product.name}" from your shopping bag.`, "info");
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // --- Wishlist operations ---
  const handleToggleWishlist = (product: Product) => {
    const exists = wishlist.some((item) => item.id === product.id);

    if (exists) {
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
      showToast(`Removed "${product.name}" from your wishlist.`, "info");
    } else {
      setWishlist((prev) => [...prev, product]);
      showToast(`Added "${product.name}" to your wishlist.`, "success");
    }
  };

  const handleAddToCartFromWishlist = (product: Product, size: string, color: ProductColor) => {
    handleAddToCart(product, size, color);
  };

  const handleScrollToSection = () => {
    const catalogElement = document.getElementById("product-catalog");
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-800 antialiased flex flex-col justify-between selection:bg-neutral-900 selection:text-white relative">
      <div>
        {/* Header Section */}
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

        {/* Hero Section */}
        <Hero 
          onExploreClick={handleScrollToSection} 
          onFilterCategory={setSelectedCategory} 
        />

        {/* Core Brand Ethos Section */}
        <BrandEthos />

        {/* Curation Studio Filters & Interactive Product Grid */}
        <ProductGrid
          onAddToCart={handleAddToCart}
          onOpenQuickView={setActiveQuickView}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* Editorial Fashion Lookbook Section */}
        <Lookbook onExploreClick={handleScrollToSection} />

        {/* Newsletter Section */}
        <Newsletter />
      </div>

      {/* Footer Details */}
      <Footer />

      {/* --- Overlay Intermediaries --- */}

      {/* Slideout right: Shopping Bag Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />

      {/* Slideout right: Wishlist Storage Closet Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={handleToggleWishlist}
        onAddToCartFromWishlist={handleAddToCartFromWishlist}
        onOpenQuickView={setActiveQuickView}
      />

      {/* Overlay Modal: Product Quick View Details Sheet */}
      <ProductQuickView
        product={activeQuickView}
        onClose={() => setActiveQuickView(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Gorgeous Floating Toast alert notifications feedback */}
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
              onClick={() => setToast(null)}
              className="text-neutral-500 hover:text-white text-xs px-1 normal-case font-mono"
            >
              dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
