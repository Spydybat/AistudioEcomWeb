import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product, CartItem, ProductColor } from "../types";

interface Toast {
  id: number;
  text: string;
  type: "success" | "info";
}

interface ShopContextType {
  cart: CartItem[];
  wishlist: Product[];
  toast: Toast | null;
  isCartOpen: boolean;
  isWishlistOpen: boolean;
  searchQuery: string;
  selectedCategory: string;
  
  // Actions
  setIsCartOpen: (open: boolean) => void;
  setIsWishlistOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (catId: string) => void;
  showToast: (text: string, type?: "success" | "info") => void;
  hideToast: () => void;
  
  handleAddToCart: (product: Product, size: string, color: ProductColor) => void;
  handleUpdateCartQty: (index: number, newQty: number) => void;
  handleRemoveCartItem: (index: number) => void;
  handleClearCart: () => void;
  handleToggleWishlist: (product: Product) => void;
  handleAddToCartFromWishlist: (product: Product, size: string, color: ProductColor) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: ReactNode }) {
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

  // --- Toast/Alert notification state ---
  const [toast, setToast] = useState<Toast | null>(null);

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

  const hideToast = () => setToast(null);

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

  const value = {
    cart,
    wishlist,
    toast,
    isCartOpen,
    isWishlistOpen,
    searchQuery,
    selectedCategory,
    setIsCartOpen,
    setIsWishlistOpen,
    setSearchQuery,
    setSelectedCategory,
    showToast,
    hideToast,
    handleAddToCart,
    handleUpdateCartQty,
    handleRemoveCartItem,
    handleClearCart,
    handleToggleWishlist,
    handleAddToCartFromWishlist,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
}
