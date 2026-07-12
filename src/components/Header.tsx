import React, { useState, useEffect, useRef } from "react";
import PortalDropdown from "./ui/PortalDropdown";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();

  useEffect(() => {
    setIsProfileOpen(false);
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
    setIsRegionOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("#search-panel-container") && !target.closest("#search-trigger")) {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  const handleRegionSelect = (regionId: string) => {
    setSelectedRegionId(regionId);
    setIsRegionOpen(false);
    setIsMobileMenuOpen(false);
  };

  const regionTriggerRef = useRef<HTMLButtonElement>(null);
  const profileTriggerRef = useRef<HTMLButtonElement>(null);

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

  const renderRegionDropdown = (isMobile = false) => {
    const dropdownMenu = (
      <div className="py-2">
        {REGIONS.map((region) => (
          <button
            key={region.id}
            onClick={() => handleRegionSelect(region.id)}
            className="w-full text-left px-4 py-2 hover:bg-zinc-50 transition-colors flex items-center justify-between group"
          >
            <div>
              <p className="text-sm font-medium text-black">{region.name}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{region.flag} • {region.currency}</p>
            </div>
            {selectedRegionId === region.id && (
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
            )}
          </button>
        ))}
      </div>
    );

    return (
      <PortalDropdown
        isOpen={isRegionOpen}
        onClose={() => setIsRegionOpen(false)}
        triggerRef={regionTriggerRef}
        isMobile={isMobile}
      >
        {dropdownMenu}
      </PortalDropdown>
    );
  };

  const renderProfileDropdown = (isMobile = false) => {
    const dropdownMenu = (
      <div className="py-2">
        <div className="px-4 py-3 border-b border-zinc-100">
          <p className="text-xs font-bold text-black truncate">
            {user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Profile"}
          </p>
          <p className="text-[10px] text-zinc-500 truncate mt-0.5">{user?.email}</p>
        </div>
        <Link
          to="/profile"
          onClick={() => setIsProfileOpen(false)}
          className="block px-4 py-2 text-sm text-zinc-600 hover:text-black hover:bg-zinc-50 transition-colors"
        >
          Profile
        </Link>
        <Link
          to="/my-orders"
          onClick={() => setIsProfileOpen(false)}
          className="block px-4 py-2 text-sm text-zinc-600 hover:text-black hover:bg-zinc-50 transition-colors"
        >
          My Orders
        </Link>
        <button
          onClick={() => {
            setIsProfileOpen(false);
            handleLogout();
          }}
          className="w-full text-left px-4 py-2 text-sm text-red-500 hover:text-red-600 hover:bg-zinc-50 transition-colors"
        >
          Logout
        </button>
      </div>
    );

    return (
      <PortalDropdown
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        triggerRef={profileTriggerRef}
        isMobile={isMobile}
      >
        {dropdownMenu}
      </PortalDropdown>
    );
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-xl border-b border-zinc-100 transition-all duration-300">
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
            className="p-1 px-2 text-zinc-600 hover:text-black hover:bg-zinc-100 rounded-full transition-colors"
            id="mobile-menu-toggle"
            aria-label="Open departments"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-xs font-semibold uppercase tracking-widest text-zinc-500">


          {featuredDepartments.map((category) => (
            <button
              key={category.id}
              onClick={() => handleNavClick(category.id)}
              className="hover:text-black transition-colors py-1 relative group cursor-pointer"
            >
              {category.name}
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </button>
          ))}

          <Link to="/bundle-builder" onClick={() => { setIsSearchOpen(false); setIsRegionOpen(false); }} className="hover:text-black transition-colors py-1 relative group cursor-pointer">
            Bundle Builder
            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </Link>
        </nav>

        <div className="flex flex-col items-center select-none text-center">
          <Link
            to="/"
            className="text-xl sm:text-2xl font-sans font-bold tracking-tight text-black cursor-pointer hover:opacity-80 transition-opacity"
          >
            AURA STUDIO
          </Link>
          <span className="hidden md:inline text-[8px] tracking-[0.3em] font-light text-white mix-blend-difference mt-1 uppercase">
            Premium Marketplace
          </span>
        </div>

        <div className="flex items-center space-x-1.5 sm:space-x-5 text-zinc-500">
          <div className="relative">
            <button
              ref={regionTriggerRef}
              onClick={() => {
                if (!isRegionOpen) {
                  setIsSearchOpen(false);
                  setIsMegaMenuOpen(false);
                }
                setIsRegionOpen(!isRegionOpen);
              }}
              className="hidden lg:flex items-center text-xs text-zinc-600 font-medium gap-1.5 mr-2 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-full hover:text-black hover:bg-zinc-100 transition-all cursor-pointer"
            >
              <span>{activeRegion?.flag}</span>
              <span>{activeRegion?.id} ({activeRegion?.symbol})</span>
              <ChevronDown className="h-3 w-3 opacity-70" />
            </button>

            {!isMobileMenuOpen && renderRegionDropdown(false)}
          </div>

          <button
            onClick={() => setIsLightMode(!isLightMode)}
            className="p-2 rounded-full hover:bg-zinc-100 text-zinc-600 hover:text-black transition-colors theme-icon"
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
            className="p-2 rounded-full hover:bg-zinc-100 text-zinc-600 hover:text-black transition-colors"
            title="Search products"
            id="search-trigger"
          >
            {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </button>

          {user ? (
            <div className="relative" id="profile-menu-container">
              <button
                ref={profileTriggerRef}
                onClick={() => {
                  if (!isProfileOpen) {
                    setIsSearchOpen(false);
                    setIsMegaMenuOpen(false);
                    setIsRegionOpen(false);
                  }
                  setIsProfileOpen(!isProfileOpen);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-zinc-100 text-sky-500 hover:text-sky-600 transition-colors"
                title="Profile Menu"
              >
                <span className="text-sm font-medium truncate max-w-[150px] hidden sm:block">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Profile"}</span>
                <User className="h-5 w-5 sm:hidden" />
                <ChevronDown className="h-4 w-4 hidden sm:block" />
              </button>
              {!isMobileMenuOpen && renderProfileDropdown(false)}
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="p-2 rounded-full hover:bg-zinc-100 text-zinc-600 hover:text-black transition-colors"
              title="Sign In"
            >
              <User className="h-5 w-5" />
            </button>
          )}

          <button
            onClick={() => navigate("/admin/login")}
            className="p-2 rounded-full hover:bg-zinc-100 text-zinc-600 hover:text-black transition-colors cursor-pointer"
            title="Admin Panel"
          >
            <Shield className="h-5 w-5" />
          </button>

          <Link
            to="/wishlist"
            className="p-2 rounded-full hover:bg-zinc-100 text-zinc-600 hover:text-rose-500 transition-colors relative group"
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
            className="p-2 rounded-full hover:bg-zinc-100 text-zinc-600 hover:text-black transition-colors relative group"
            title="View Cart"
            id="cart-trigger"
          >
            <ShoppingBag className="h-5 w-5 group-hover:scale-110 transition-transform" />
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                key={cartCount}
                className="absolute top-0 -right-1 bg-sky-500 text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center font-bold"
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
            id="search-panel-container"
            initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            className="absolute left-0 w-full bg-white/90 backdrop-blur-xl border-b border-zinc-100 shadow-[0_16px_40px_rgba(0,0,0,0.1)] z-30"
          >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 h-6 w-6" />
                <input
                  id="search-box-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, brands, and departments..."
                  className="w-full bg-zinc-50 pl-14 pr-10 py-5 text-lg font-sans rounded-2xl border border-zinc-200 focus:border-zinc-300 focus:ring-1 focus:ring-zinc-300 focus:outline-none transition-all text-zinc-900 shadow-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      navigate("/products");
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-black bg-zinc-200 rounded-full p-1 transition-colors cursor-pointer"
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
                  className="mt-4 w-full py-3 bg-black text-white text-xs font-semibold uppercase tracking-widest rounded-full hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  View all results for &quot;{searchQuery}&quot;
                </button>
              )}

              <div className="mt-8 text-xs text-zinc-500 flex flex-wrap gap-2">
                <span className="font-bold mr-2 uppercase tracking-wider text-zinc-500">Suggestions:</span>
                {searchSuggestions.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleSearchClick(tag)}
                    className="px-4 py-1.5 bg-zinc-100 hover:bg-black hover:text-white border border-zinc-200 text-zinc-700 transition-all uppercase tracking-wider rounded-full shadow-sm font-medium"
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
            className="md:hidden border-b border-zinc-100 bg-white"
          >
            <div className="px-4 pt-2 pb-6 space-y-3 flex flex-col items-stretch text-sm uppercase tracking-wider font-semibold text-zinc-500">
              {departments.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleNavClick(category.id)}
                  className="text-left py-3 hover:text-black hover:pl-2 transition-all border-b border-zinc-100 justify-start"
                >
                  {category.name}
                </button>
              ))}
              <Link
                to="/bundle-builder"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-left py-3 hover:text-black hover:pl-2 transition-all border-b border-zinc-100 justify-start"
              >
                Bundle Builder
              </Link>
              <div className="pt-6 flex flex-col gap-4">
                <div className="relative w-full">
                  <button 
                    ref={regionTriggerRef}
                    onClick={() => {
                      if (!isRegionOpen) {
                        setIsSearchOpen(false);
                        setIsMegaMenuOpen(false);
                      }
                      setIsRegionOpen(!isRegionOpen);
                    }}
                    className="flex items-center w-full p-4 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-2xl transition-all group cursor-pointer"
                  >
                    <div className="flex flex-col items-start gap-1">
                      <div className="flex items-center gap-2.5">
                        <span className="text-base leading-none">{activeRegion.flag}</span>
                        <span className="text-sm font-semibold text-zinc-700 group-hover:text-black transition-colors normal-case tracking-normal">Select Region</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest transition-colors pl-7">
                        {activeRegion.name} ({activeRegion.symbol})
                      </span>
                    </div>
                  </button>
                  {isMobileMenuOpen && renderRegionDropdown(true)}
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => handleNavClick("wishlist")}
                    className="flex-1 py-3 text-center bg-zinc-100 border border-zinc-200 text-zinc-700 font-semibold text-xs tracking-widest uppercase rounded-full hover:bg-zinc-200 hover:text-black transition-colors"
                  >
                    Wishlist
                  </button>
                  <button 
                    onClick={() => handleNavClick("cart")}
                    className="flex-1 py-3 text-center bg-black text-white font-semibold text-xs tracking-widest uppercase rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:bg-zinc-800 transition-colors"
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
