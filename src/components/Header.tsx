import { useState } from "react";
import { ShoppingBag, Heart, Search, Menu, X, Globe, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (catId: string) => void;
}

export default function Header({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  searchQuery,
  setSearchQuery,
  setSelectedCategory,
}: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { name: "New Arrivals", categoryId: "all" },
    { name: "Outerwear", categoryId: "outerwear" },
    { name: "Knitwear", categoryId: "knitwear" },
    { name: "Tailoring", categoryId: "tailoring" },
    { name: "Essentials", categoryId: "essentials" },
  ];

  const handleNavClick = (catId: string) => {
    setSelectedCategory(catId);
    setIsMobileMenuOpen(false);
    // Smooth scroll to product catalog
    const catalogElement = document.getElementById("product-catalog");
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Top Banner */}
      <div className="w-full bg-neutral-900 overflow-hidden text-neutral-300 py-2 border-b border-neutral-800 text-xs tracking-widest uppercase flex justify-center items-center gap-2">
        <span>Complementary carbon-neutral courier delivery above $200</span>
        <span className="hidden md:inline text-neutral-500">•</span>
        <span className="hidden md:inline">Complimentary presentation wrap and seasonal lookbook</span>
      </div>

      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-neutral-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-between">
          
          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1 px-2 text-neutral-700 hover:text-black hover:bg-neutral-50 rounded"
              id="mobile-menu-toggle"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Left: Global Navigation (Desktop) */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-medium uppercase tracking-widest text-neutral-600">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.categoryId)}
                className="hover:text-black transition-colors py-1 relative group cursor-pointer"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </button>
            ))}
          </nav>

          {/* Center: Brand Identity Logo */}
          <div className="flex flex-col items-center select-none text-center">
            <button
              onClick={() => handleNavClick("all")}
              className="text-xl sm:text-2xl font-serif font-semibold tracking-widest text-neutral-950 uppercase cursor-pointer"
            >
              AURA STUDIO
            </button>
            <span className="hidden md:inline text-[8px] tracking-[0.3em] font-light text-neutral-400 mt-1 uppercase">
              MILAN • TOKYO • NEW YORK
            </span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-3 sm:space-x-5 text-neutral-800">
            <div className="hidden lg:flex items-center text-xs text-neutral-400 tracking-wider gap-1 mr-2 bg-neutral-50 border border-neutral-100 px-3 py-1 rounded">
              <Globe className="h-3 w-3" />
              <span>US ($)</span>
            </div>

            {/* Slide and Search Trigger */}
            <button
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
                if (!isSearchOpen) {
                  setTimeout(() => document.getElementById("search-box-input")?.focus(), 150);
                }
              }}
              className="p-1.5 sm:p-2 rounded-full hover:bg-neutral-50 text-neutral-700 hover:text-black transition-colors"
              title="Search styles"
              id="search-trigger"
            >
              {isSearchOpen ? <X className="h-4 sm:h-5 w-4 sm:h-5" /> : <Search className="h-4 sm:h-5 w-4 sm:h-5" />}
            </button>

            {/* Profile Placeholder (Non-functional aesthetic, but sleek) */}
            <button className="hidden sm:inline-block p-2 rounded-full hover:bg-neutral-50 text-neutral-700 hover:text-black transition-colors">
              <User className="h-5 w-5" />
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={onOpenWishlist}
              className="p-1.5 sm:p-2 rounded-full hover:bg-neutral-50 text-neutral-700 hover:text-red-500 transition-colors relative"
              title="View Wishlist"
              id="wishlist-trigger"
            >
              <Heart className="h-4 sm:h-5 w-4 sm:h-5" />
              {wishlistCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center font-bold"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </button>

            {/* Shopping Bag / Cart Icon */}
            <button
              onClick={onOpenCart}
              className="p-1.5 sm:p-2 rounded-full hover:bg-neutral-50 text-neutral-700 hover:text-black transition-colors relative"
              title="View Cart"
              id="cart-trigger"
            >
              <ShoppingBag className="h-4 sm:h-5 w-4 sm:h-5" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  key={cartCount}
                  className="absolute -top-1 -right-1 bg-neutral-900 text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center font-bold"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>

        {/* Real-time search overlay */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute left-0 w-full bg-white border-b border-neutral-100 shadow-xl z-30"
            >
              <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 h-5 w-5" />
                  <input
                    id="search-box-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search our luxury collection... (e.g., Trench, Cashmere, Linen)"
                    className="w-full bg-neutral-50 pl-12 pr-10 py-4 text-sm font-sans rounded-none border-b-2 border-neutral-300 focus:border-neutral-900 focus:outline-none focus:bg-neutral-50/50 transition-all text-neutral-900"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-2 items-center text-xs text-neutral-500">
                  <span className="font-medium mr-2">Suggested tags:</span>
                  {["Trench", "Cashmere", "Blazer", "Wool", "Linen"].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        setSearchQuery(tag);
                        const catalogElement = document.getElementById("product-catalog");
                        if (catalogElement) {
                          catalogElement.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors uppercase tracking-wider rounded"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile menu overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-b border-neutral-200 bg-white"
            >
              <div className="px-4 pt-2 pb-6 space-y-3 flex flex-col items-stretch text-sm uppercase tracking-wider font-regular text-neutral-700">
                {navigationItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.categoryId)}
                    className="text-left py-2 hover:text-black border-b border-neutral-50 justify-start"
                  >
                    {item.name}
                  </button>
                ))}
                <div className="pt-4 border-t border-neutral-100 flex flex-col gap-3">
                  <span className="text-xs text-neutral-400 normal-case">Selected Region: US ($)</span>
                  <div className="flex gap-4">
                    <button className="flex-1 py-2 text-center bg-neutral-100 text-neutral-800 text-xs tracking-widest uppercase">
                      My Account
                    </button>
                    <button className="flex-1 py-2 text-center bg-neutral-950 text-white text-xs tracking-widest uppercase">
                      Support
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
