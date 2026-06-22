import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Heart, Search, Menu, X, Globe, User } from "lucide-react";
import { motion, AnimatePresence, useScroll, useSpring } from "motion/react";

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

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const navigationItems = [
    { name: "New Arrivals", categoryId: "all" },
    { name: "Outerwear", categoryId: "outerwear" },
    { name: "Knitwear", categoryId: "knitwear" },
    { name: "Tailoring", categoryId: "tailoring" },
    { name: "Essentials", categoryId: "essentials" },
    { name: "Outfit Builder", route: "/outfit-builder" },
  ];

  const navigate = useNavigate();

  const handleNavClick = (catId: string) => {
    setSelectedCategory(catId);
    setIsMobileMenuOpen(false);
    navigate('/products');
  };

  const handleSearchClick = (tag: string) => {
    setSearchQuery(tag);
    setIsSearchOpen(false);
    navigate('/products');
  };

  return (
    <>

      <header className="sticky top-0 z-40 w-full glass transition-all duration-300">
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-900 origin-left z-50"
          style={{ scaleX }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-between">
          
          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1 px-2 text-neutral-700 hover:text-black hover:bg-neutral-50/50 rounded transition-colors"
              id="mobile-menu-toggle"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Left: Global Navigation (Desktop) */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-medium uppercase tracking-widest text-neutral-600">
            {navigationItems.map((item) => (
              item.route ? (
                <Link
                  key={item.name}
                  to={item.route}
                  className="hover:text-black transition-colors py-1 relative group cursor-pointer"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
              ) : (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.categoryId)}
                  className="hover:text-black transition-colors py-1 relative group cursor-pointer"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </button>
              )
            ))}
          </nav>

          {/* Center: Brand Identity Logo */}
          <div className="flex flex-col items-center select-none text-center">
            <Link
              to="/"
              className="text-xl sm:text-2xl font-serif font-semibold tracking-widest text-neutral-950 uppercase cursor-pointer hover:opacity-80 transition-opacity"
            >
              AURA STUDIO
            </Link>
            <span className="hidden md:inline text-[8px] tracking-[0.3em] font-light text-neutral-400 mt-1 uppercase">
              MILAN • TOKYO • NEW YORK
            </span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-3 sm:space-x-5 text-neutral-800">
            <div className="hidden lg:flex items-center text-xs text-neutral-500 tracking-wider gap-1 mr-2 bg-white/50 border border-neutral-200 px-3 py-1 rounded-full shadow-sm hover:bg-white transition-colors cursor-pointer">
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
              className="p-2 rounded-full hover:bg-neutral-100 text-neutral-600 hover:text-black transition-colors"
              title="Search styles"
              id="search-trigger"
            >
              {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </button>

            {/* Admin Button */}
<button
  onClick={() => navigate("/admin/login")}
  className="hidden sm:inline-block p-2 rounded-full hover:bg-neutral-100 text-neutral-600 hover:text-black transition-colors cursor-pointer"
  title="Admin Panel"
>
  <User className="h-5 w-5" />
</button>

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="p-2 rounded-full hover:bg-neutral-100 text-neutral-600 hover:text-red-500 transition-colors relative group"
              title="View Wishlist"
              id="wishlist-trigger"
            >
              <Heart className="h-5 w-5 group-hover:scale-110 transition-transform" />
              {wishlistCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0 -right-1 bg-red-500 text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center font-bold"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </Link>

            {/* Shopping Bag / Cart Icon */}
            <Link
              to="/cart"
              className="p-2 rounded-full hover:bg-neutral-100 text-neutral-600 hover:text-black transition-colors relative group"
              title="View Cart"
              id="cart-trigger"
            >
              <ShoppingBag className="h-5 w-5 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  key={cartCount}
                  className="absolute top-0 -right-1 bg-neutral-900 text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center font-bold"
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>
          </div>
        </div>

        {/* Real-time search overlay */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              className="absolute left-0 w-full glass border-b border-neutral-200/50 shadow-2xl z-30"
            >
              <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 h-6 w-6" />
                  <input
                    id="search-box-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search our luxury collection... (e.g., Trench, Cashmere, Linen)"
                    className="w-full bg-white/50 backdrop-blur-sm pl-14 pr-10 py-5 text-lg font-sans rounded-xl border border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:outline-none transition-all text-neutral-900 shadow-inner"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        navigate("/products");
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black bg-neutral-100 rounded-full p-1 transition-colors cursor-pointer"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>

                {searchQuery && (
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      navigate("/products");
                    }}
                    className="mt-4 w-full py-3 bg-neutral-900 text-white text-xs uppercase tracking-widest rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    View all results for &quot;{searchQuery}&quot;
                  </button>
                )}

                <div className="mt-6 flex flex-wrap gap-2 items-center text-xs text-neutral-500">
                  <span className="font-medium mr-2 uppercase tracking-wider text-neutral-400">Trending Searches:</span>
                  {["Trench", "Cashmere", "Blazer", "Wool", "Linen"].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleSearchClick(tag)}
                      className="px-4 py-1.5 bg-white/60 hover:bg-neutral-900 hover:text-white border border-neutral-200 text-neutral-600 transition-all uppercase tracking-wider rounded-full shadow-sm"
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
              className="md:hidden border-b border-neutral-200/50 glass"
            >
              <div className="px-4 pt-2 pb-6 space-y-3 flex flex-col items-stretch text-sm uppercase tracking-wider font-medium text-neutral-700">
                {navigationItems.map((item) => (
                  item.route ? (
                    <Link
                      key={item.name}
                      to={item.route}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-left py-3 hover:text-black hover:pl-2 transition-all border-b border-neutral-200/50 justify-start"
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <button
                      key={item.name}
                      onClick={() => handleNavClick(item.categoryId)}
                      className="text-left py-3 hover:text-black hover:pl-2 transition-all border-b border-neutral-200/50 justify-start"
                    >
                      {item.name}
                    </button>
                  )
                ))}
                <div className="pt-6 flex flex-col gap-3">
                  <span className="text-xs text-neutral-400 normal-case mb-2">Selected Region: US ($)</span>
                  <div className="flex gap-4">
                    <Link to="/wishlist" className="flex-1 py-3 text-center bg-white/80 border border-neutral-200 text-neutral-800 text-xs tracking-widest uppercase rounded-lg shadow-sm">
                      Wishlist
                    </Link>
                    <Link to="/cart" className="flex-1 py-3 text-center bg-neutral-950 text-white text-xs tracking-widest uppercase rounded-lg shadow-md hover:bg-neutral-800 transition-colors">
                      Cart
                    </Link>
                  </div>
                  <Link to="/admin/login" className="text-center text-[10px] text-neutral-400 uppercase tracking-widest hover:text-neutral-900 transition-colors">
                    Admin Panel
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
