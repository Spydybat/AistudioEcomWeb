import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, Heart, Menu, Search, ShoppingBag, User, X, Sun, Moon, LogOut, Shield } from "lucide-react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { BRANDS, CATEGORIES, getSearchSuggestions, fetchCategories } from "../data/products";
import { useCurrency, REGIONS } from "../context/CurrencyContext";
import { useShop } from "../context/ShopContext";

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
  searchQuery,
  setSearchQuery,
  setSelectedCategory,
}: HeaderProps) {
  const { user, setIsAuthModalOpen, handleLogout } = useShop();
  const [categories, setCategories] = useState(CATEGORIES);
  
  useEffect(() => {
    fetchCategories().then((data) => {
      if (data && data.length > 0) {
        setCategories(data);
      }
    });
  }, []);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLightMode, setIsLightMode] = useState(() => {
    return localStorage.getItem("theme") === "light";
  });

  useEffect(() => {
    if (isLightMode) {
      document.documentElement.classList.add("theme-light");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.remove("theme-light");
      localStorage.setItem("theme", "dark");
    }
  }, [isLightMode]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { selectedRegionId, setSelectedRegionId, activeRegion } = useCurrency();
  const navigate = useNavigate();

  const handleRegionSelect = (regionId: string) => {
    setSelectedRegionId(regionId);
    setIsRegionOpen(false);
    setIsMobileMenuOpen(false);
  };

  const toggleRegion = () => {
    if (!isRegionOpen) {
      setIsSearchOpen(false);
      setIsMegaMenuOpen(false);
    }
    setIsRegionOpen((open) => !open);
  };

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const fallbackOrder = ["fashion", "electronics", "computers", "mobiles", "gaming"];
  
  const departments = categories
    .filter((category) => category.id !== "all")
    .sort((a, b) => {
      const indexA = fallbackOrder.indexOf(a.id);
      const indexB = fallbackOrder.indexOf(b.id);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return 0;
    });
  const featuredDepartments = departments.slice(0, 5);
  const searchSuggestions = getSearchSuggestions(searchQuery || "premium", 8);

  const handleNavClick = (catId: string) => {
    setIsMobileMenuOpen(false);
    setIsMegaMenuOpen(false);
    setIsSearchOpen(false);
    setIsRegionOpen(false);
    
    if (catId === "electronics") {
      navigate("/electronics");
    } else if (catId === "wishlist") {
      navigate("/wishlist");
    } else if (catId === "cart") {
      navigate("/cart");
    } else {
      setSelectedCategory(catId);
      navigate("/products");
    }
  };

  const handleSearchClick = (term: string) => {
    setSearchQuery(term);
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/products");
  };

  const renderRegionDropdown = () => (
    <AnimatePresence>
      {isRegionOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsRegionOpen(false)} />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full right-0 lg:right-2 mt-2 w-48 bg-[#2B2D31] border border-white/10 rounded-xl shadow-[0_16px_40px_rgba(0,0,0,0.5)] z-50 overflow-hidden"
          >
            <div className="py-2">
              {REGIONS.map((region) => (
                <button
                  key={region.id}
                  onClick={() => handleRegionSelect(region.id)}
                  className={`w-full text-left px-4 py-2.5 text-xs tracking-wide flex items-center gap-3 hover:bg-indigo-500 hover:text-white transition-colors ${
                    selectedRegionId === region.id ? "bg-indigo-500/10 text-indigo-400" : "text-zinc-300"
                  }`}
                >
                  <span className="text-sm">{region.flag}</span>
                  <span className="font-medium">{region.name}</span>
                  <span className="ml-auto opacity-60 font-mono">{region.currency}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <header className="sticky top-0 z-40 w-full glass transition-all duration-300">
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-500 origin-left z-50"
        style={{ scaleX }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-between">
        <div className="flex md:hidden">
          <button
            onClick={() => {
              setIsSearchOpen(false);
              setIsRegionOpen(false);
              setIsMobileMenuOpen((open) => !open);
            }}
            className="p-1 px-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded transition-colors"
            id="mobile-menu-toggle"
            aria-label="Open departments"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-xs font-medium uppercase tracking-widest text-zinc-400">


          {featuredDepartments.map((category) => (
            <button
              key={category.id}
              onClick={() => handleNavClick(category.id)}
              className="hover:text-white transition-colors py-1 relative group cursor-pointer"
            >
              {category.name}
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </button>
          ))}

          <Link to="/bundle-builder" onClick={() => { setIsSearchOpen(false); setIsRegionOpen(false); }} className="hover:text-white transition-colors py-1 relative group cursor-pointer">
            Bundle Builder
            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </Link>
        </nav>

        <div className="flex flex-col items-center select-none text-center">
          <Link
            to="/"
            className="text-xl sm:text-2xl font-serif font-semibold tracking-widest text-white uppercase cursor-pointer hover:opacity-80 transition-opacity"
          >
            AURA STUDIO
          </Link>
          <span className="hidden md:inline text-[8px] tracking-[0.3em] font-light text-zinc-500 mt-1 uppercase">
            Premium Marketplace
          </span>
        </div>

        <div className="flex items-center space-x-1.5 sm:space-x-5 text-zinc-300">
          <div className="relative">
            <button
              onClick={toggleRegion}
              className="hidden lg:flex items-center text-xs text-zinc-400 tracking-wider gap-1.5 mr-2 bg-[#1E1F22] border border-white/5 px-3 py-1.5 rounded-full shadow-sm hover:text-white hover:bg-[#313338] hover:border-white/10 transition-all cursor-pointer"
            >
              <span>{activeRegion.flag}</span>
              <span>{activeRegion.id} ({activeRegion.symbol})</span>
              <ChevronDown className="h-3 w-3 opacity-70" />
            </button>

            {!isMobileMenuOpen && renderRegionDropdown()}
          </div>

          <button
            onClick={() => setIsLightMode(!isLightMode)}
            className="p-2 rounded-full hover:bg-white/5 text-zinc-400 hover:text-white transition-colors theme-icon"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {isLightMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>

          <button
            onClick={() => {
              if (!isSearchOpen) {
                setIsMegaMenuOpen(false);
                setIsMobileMenuOpen(false);
                setIsRegionOpen(false);
                setIsProfileOpen(false);
              }
              setIsSearchOpen((open) => !open);
              if (!isSearchOpen) {
                setTimeout(() => document.getElementById("search-box-input")?.focus(), 150);
              }
            }}
            className="p-2 rounded-full hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
            title="Search products"
            id="search-trigger"
          >
            {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsMegaMenuOpen(false);
                  setIsRegionOpen(false);
                  setIsSearchOpen(false);
                }}
                className="p-2 rounded-full hover:bg-white/5 text-indigo-400 hover:text-indigo-300 transition-colors"
                title="Profile Menu"
              >
                <User className="h-5 w-5" />
              </button>
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-[#111214] border border-white/10 rounded-xl shadow-2xl py-2 z-50"
                  >
                    <Link
                      to="/my-orders"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors"
                    >
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="p-2 rounded-full hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
              title="Sign In"
            >
              <User className="h-5 w-5" />
            </button>
          )}

          <button
            onClick={() => navigate("/admin/login")}
            className="p-2 rounded-full hover:bg-white/5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Admin Panel"
          >
            <Shield className="h-5 w-5" />
          </button>

          <Link
            to="/wishlist"
            className="p-2 rounded-full hover:bg-white/5 text-zinc-400 hover:text-rose-400 transition-colors relative group"
            title="View Wishlist"
            id="wishlist-trigger"
          >
            <Heart className="h-5 w-5 group-hover:scale-110 transition-transform" />
            {wishlistCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-0 -right-1 bg-rose-500 text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center font-bold"
              >
                {wishlistCount}
              </motion.span>
            )}
          </Link>

          <Link
            to="/cart"
            className="p-2 rounded-full hover:bg-white/5 text-zinc-400 hover:text-white transition-colors relative group"
            title="View Cart"
            id="cart-trigger"
          >
            <ShoppingBag className="h-5 w-5 group-hover:scale-110 transition-transform" />
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                key={cartCount}
                className="absolute top-0 -right-1 bg-indigo-500 text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center font-bold"
              >
                {cartCount}
              </motion.span>
            )}
          </Link>
        </div>
      </div>



      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            className="absolute left-0 w-full glass-dark border-b border-white/5 shadow-[0_16px_40px_rgba(0,0,0,0.5)] z-30"
          >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 h-6 w-6" />
                <input
                  id="search-box-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, brands, and departments..."
                  className="w-full bg-[#1E1F22]/80 backdrop-blur-sm pl-14 pr-10 py-5 text-lg font-sans rounded-2xl border border-white/5 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 focus:outline-none transition-all text-white shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      navigate("/products");
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white bg-[#313338] rounded-full p-1 transition-colors cursor-pointer"
                    aria-label="Clear search"
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
                  className="mt-4 w-full py-3 bg-indigo-500 text-white text-xs uppercase tracking-widest rounded-lg hover:bg-indigo-600 transition-colors cursor-pointer"
                >
                  View all results for &quot;{searchQuery}&quot;
                </button>
              )}

              <div className="mt-6 flex flex-wrap gap-2 items-center text-xs text-zinc-500">
                <span className="font-medium mr-2 uppercase tracking-wider text-zinc-400">Suggestions:</span>
                {searchSuggestions.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleSearchClick(tag)}
                    className="px-4 py-1.5 bg-[#2B2D31] hover:bg-indigo-500 hover:text-white border border-white/5 text-zinc-300 transition-all uppercase tracking-wider rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-white/10 glass-dark"
          >
            <div className="px-4 pt-2 pb-6 space-y-3 flex flex-col items-stretch text-sm uppercase tracking-wider font-medium text-zinc-300">
              {departments.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleNavClick(category.id)}
                  className="text-left py-3 hover:text-white hover:pl-2 transition-all border-b border-white/5 justify-start"
                >
                  {category.name}
                </button>
              ))}
              <Link
                to="/bundle-builder"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-left py-3 hover:text-white hover:pl-2 transition-all border-b border-white/5 justify-start"
              >
                Bundle Builder
              </Link>
              <div className="pt-6 flex flex-col gap-4">
                <div className="relative w-full">
                  <button 
                    onClick={toggleRegion}
                    className="flex items-center w-full p-4 bg-[#1A1B1E] hover:bg-[#2B2D31] border border-white/5 rounded-xl transition-all group cursor-pointer"
                  >
                    <div className="flex flex-col items-start gap-1">
                      <div className="flex items-center gap-2.5">
                        <span className="text-base leading-none">{activeRegion.flag}</span>
                        <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors normal-case tracking-normal">Select Region</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest group-hover:text-zinc-400 transition-colors pl-7">
                        {activeRegion.name} ({activeRegion.symbol})
                      </span>
                    </div>
                  </button>
                  {isMobileMenuOpen && renderRegionDropdown()}
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => handleNavClick("wishlist")}
                    className="flex-1 py-3 text-center bg-[#2B2D31] border border-white/5 text-zinc-300 text-xs tracking-widest uppercase rounded-lg shadow-sm hover:text-white transition-colors"
                  >
                    Wishlist
                  </button>
                  <button 
                    onClick={() => handleNavClick("cart")}
                    className="flex-1 py-3 text-center bg-indigo-500 text-white text-xs tracking-widest uppercase rounded-lg shadow-[0_4px_12px_rgba(88,101,242,0.4)] hover:bg-indigo-600 transition-colors"
                  >
                    Cart
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
