import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product, CartItem, ProductColor } from "../types";
import { supabase } from "../supabaseClient";
import { User } from "@supabase/supabase-js";

const isUUID = (str: string) => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
};

interface Toast {
  id: number;
  text: string;
  type: "success" | "info";
}

interface ShopContextType {
  user: User | null;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  handleLogout: () => void;

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
  handleMoveAllWishlistToCart: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // Db ids
  const [cartId, setCartId] = useState<string | null>(null);
  const [wishlistId, setWishlistId] = useState<string | null>(null);

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

  const showToast = (text: string, type: "success" | "info" = "success") => {
    const id = Date.now();
    setToast({ id, text, type });
    setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 4000);
  };

  const hideToast = () => setToast(null);

  // --- Sync state with localStorage for anonymous users ---
  useEffect(() => {
    if (!user) {
      localStorage.setItem("aura_cart", JSON.stringify(cart));
    }
  }, [cart, user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem("aura_wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, user]);

  // --- Auth listener ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCart([]);
    setWishlist([]);
    setCartId(null);
    setWishlistId(null);
    localStorage.removeItem("aura_cart");
    localStorage.removeItem("aura_wishlist");
    showToast("Successfully logged out", "info");
  };

  // --- Supabase Data Sync ---
  useEffect(() => {
    if (user) {
      syncWithSupabase();
    }
  }, [user]);

  const syncWithSupabase = async () => {
    if (!user) return;
    
    // 0. Confirm profile exists before proceeding
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return; // Stop initialization
    }

    if (!profile) {
      // Create profile if it somehow doesn't exist
      const { error: insertProfileError } = await supabase
        .from("profiles")
        .insert([{ id: user.id }]);
      
      if (insertProfileError) {
        console.error("Error inserting profile:", insertProfileError);
        return; // Stop initialization
      }
    }

    // 1. Get or create Cart
    let cId = null;
    const { data: cart, error: cartError } = await supabase
      .from("carts")
      .select("id")
      .eq("profile_id", user.id)
      .maybeSingle();

    if (cartError) {
      console.error("Error fetching cart:", cartError);
      return; // Stop initialization
    }

    if (cart) {
      cId = cart.id;
    } else {
      const { data: newCart, error: insertCartError } = await supabase
        .from("carts")
        .insert([{ profile_id: user.id }])
        .select()
        .maybeSingle();
        
      if (insertCartError) {
         console.error("Error inserting cart:", insertCartError);
         return; // Stop initialization
      }
      if (newCart) cId = newCart.id;
    }
    setCartId(cId);

    // 2. Get or create Wishlist
    let wId = null;
    const { data: wishlist, error: wishlistError } = await supabase
      .from("wishlists")
      .select("id")
      .eq("profile_id", user.id)
      .maybeSingle();

    if (wishlistError) {
      console.error("Error fetching wishlist:", wishlistError);
      return; // Stop initialization
    }

    if (wishlist) {
      wId = wishlist.id;
    } else {
      const { data: newWishlist, error: insertWishlistError } = await supabase
        .from("wishlists")
        .insert([{ profile_id: user.id }])
        .select()
        .maybeSingle();
        
      if (insertWishlistError) {
         console.error("Error inserting wishlist:", insertWishlistError);
         return; // Stop initialization
      }
      if (newWishlist) wId = newWishlist.id;
    }
    setWishlistId(wId);

    // Abort if we couldn't resolve IDs to prevent state wipe
    if (!cId || !wId) return;

    // 3. Fetch remote cart items
    let remoteCart: CartItem[] = [];
    const { data: cartItems } = await supabase.from('cart_items').select('*, products(*)').eq('cart_id', cId);
    if (cartItems) {
      remoteCart = cartItems.map((item: any) => ({
        product: item.products,
        quantity: item.quantity,
        selectedSize: item.selected_size,
        selectedColor: { name: item.selected_color, hex: item.products?.colors?.find((c:any)=>c.name===item.selected_color)?.hex || '#000' }
      }));
    }

    // 4. Merge Local Cart with Remote Cart
    const localCartStr = localStorage.getItem("aura_cart");
    const localCart: CartItem[] = localCartStr ? JSON.parse(localCartStr) : [];
    
    if (localCart.length > 0) {
      const merged = [...remoteCart];
      
      for (const localItem of localCart) {
        const existingIdx = merged.findIndex(
          m => m.product?.id === localItem.product?.id && m.selectedSize === localItem.selectedSize && m.selectedColor?.name === localItem.selectedColor?.name
        );
        
        if (existingIdx > -1) {
          // Keep max quantity
          if (localItem.quantity > merged[existingIdx].quantity) {
             merged[existingIdx].quantity = localItem.quantity;
             if (isUUID(localItem.product.id)) {
               await supabase.from('cart_items').update({ quantity: localItem.quantity }).match({
                  cart_id: cId, product_id: localItem.product.id, selected_size: localItem.selectedSize, selected_color: localItem.selectedColor.name
               });
             }
          }
        } else {
          merged.push(localItem);
          if (isUUID(localItem.product.id)) {
            const { data: existingCartItem } = await supabase.from('cart_items')
              .select('quantity')
              .match({ cart_id: cId, product_id: localItem.product.id, selected_size: localItem.selectedSize, selected_color: localItem.selectedColor.name })
              .maybeSingle();
              
            if (existingCartItem) {
               if (localItem.quantity > existingCartItem.quantity) {
                  await supabase.from('cart_items').update({ quantity: localItem.quantity }).match({
                     cart_id: cId, product_id: localItem.product.id, selected_size: localItem.selectedSize, selected_color: localItem.selectedColor.name
                  });
               }
            } else {
               await supabase.from('cart_items').insert([{
                 cart_id: cId,
                 product_id: localItem.product.id,
                 quantity: localItem.quantity,
                 selected_size: localItem.selectedSize,
                 selected_color: localItem.selectedColor.name
               }]);
            }
          }
        }
      }
      
      setCart(merged);
      localStorage.removeItem("aura_cart");
    } else {
      setCart(remoteCart);
    }

    // 5. Fetch remote wishlist items
    let remoteWishlist: Product[] = [];
    const { data: wItems } = await supabase.from('wishlist_items').select('*, products(*)').eq('wishlist_id', wId);
    if (wItems) {
      remoteWishlist = wItems.map((item: any) => item.products);
    }

    // 6. Merge Local Wishlist with Remote Wishlist
    const localWishlistStr = localStorage.getItem("aura_wishlist");
    const localWishlist: Product[] = localWishlistStr ? JSON.parse(localWishlistStr) : [];
    
    if (localWishlist.length > 0) {
       const mergedW = [...remoteWishlist];
       for (const localW of localWishlist) {
          if (!mergedW.some(m => m?.id === localW?.id)) {
             mergedW.push(localW);
             if (isUUID(localW.id)) {
               const { data: existingWishlistItem } = await supabase.from('wishlist_items')
                 .select('wishlist_id')
                 .match({ wishlist_id: wId, product_id: localW.id })
                 .maybeSingle();
               if (!existingWishlistItem) {
                 await supabase.from('wishlist_items').insert([{ wishlist_id: wId, product_id: localW.id }]);
               }
             }
          }
       }
       setWishlist(mergedW);
       localStorage.removeItem("aura_wishlist");
    } else {
       setWishlist(remoteWishlist);
    }
  };

  // --- Cart operations ---
  const handleAddToCart = async (product: Product, size: string, color: ProductColor) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    if (user && cartId && isUUID(product.id)) {
      const { data: existingItem } = await supabase.from('cart_items')
        .select('quantity')
        .match({ cart_id: cartId, product_id: product.id, selected_size: size, selected_color: color.name })
        .maybeSingle();

      if (existingItem) {
        supabase.from('cart_items').update({ quantity: existingItem.quantity + 1 }).match({
           cart_id: cartId, product_id: product.id, selected_size: size, selected_color: color.name
        }).then();
      } else {
        supabase.from('cart_items').insert([{
           cart_id: cartId, product_id: product.id, quantity: 1, selected_size: size, selected_color: color.name
        }]).then();
      }
    }

    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex(
        (item) =>
          item.product?.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor?.name === color.name
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

  const handleUpdateCartQty = async (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(index);
      return;
    }
    
    const item = cart[index];
    if (user && cartId && isUUID(item.product.id)) {
      supabase.from('cart_items').update({ quantity: newQty }).match({
         cart_id: cartId, product_id: item.product.id, selected_size: item.selectedSize, selected_color: item.selectedColor.name
      }).then();
    }

    setCart((prevCart) => {
      const updated = [...prevCart];
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const handleRemoveCartItem = async (index: number) => {
    const item = cart[index];
    
    if (user && cartId && isUUID(item.product.id)) {
      supabase.from('cart_items').delete().match({
         cart_id: cartId, product_id: item.product.id, selected_size: item.selectedSize, selected_color: item.selectedColor.name
      }).then();
    }

    setCart((prevCart) => prevCart.filter((_, idx) => idx !== index));
    showToast(`Removed "${item.product.name}" from your shopping bag.`, "info");
  };

  const handleClearCart = async () => {
    if (user && cartId) {
      supabase.from('cart_items').delete().eq('cart_id', cartId).then();
    }
    setCart([]);
  };

  // --- Wishlist operations ---
  const handleToggleWishlist = async (product: Product) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    const exists = wishlist.some((item) => item?.id === product.id);

    if (exists) {
      if (user && wishlistId && isUUID(product.id)) {
         supabase.from('wishlist_items').delete().match({
            wishlist_id: wishlistId, product_id: product.id
         }).then();
      }
      setWishlist((prev) => prev.filter((item) => item?.id !== product.id));
      showToast(`Removed "${product.name}" from your wishlist.`, "info");
    } else {
      if (user && wishlistId && isUUID(product.id)) {
         const { data: existingWItem } = await supabase.from('wishlist_items')
           .select('wishlist_id')
           .match({ wishlist_id: wishlistId, product_id: product.id })
           .maybeSingle();
           
         if (!existingWItem) {
           supabase.from('wishlist_items').insert([{
              wishlist_id: wishlistId, product_id: product.id
           }]).then();
         }
      }
      setWishlist((prev) => [...prev, product]);
      showToast(`Added "${product.name}" to your wishlist.`, "success");
    }
  };

  const handleAddToCartFromWishlist = (product: Product, size: string, color: ProductColor) => {
    handleAddToCart(product, size, color);
  };

  const handleMoveAllWishlistToCart = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    
    if (wishlist.length === 0) return;
    
    if (user && cartId) {
      for (const product of wishlist) {
        if (!product || !isUUID(product.id)) continue;
        const size = product.sizes?.[1] || product.sizes?.[0] || '';
        const color = product.colors?.[0] || { name: '', hex: '#000' };
        
        const { data: existingCartItem } = await supabase.from('cart_items')
          .select('quantity')
          .match({ cart_id: cartId, product_id: product.id, selected_size: size, selected_color: color.name })
          .maybeSingle();
          
        if (existingCartItem) {
          await supabase.from('cart_items').update({ quantity: existingCartItem.quantity + 1 }).match({
             cart_id: cartId, product_id: product.id, selected_size: size, selected_color: color.name
          });
        } else {
          await supabase.from('cart_items').insert([{
             cart_id: cartId, product_id: product.id, quantity: 1, selected_size: size, selected_color: color.name
          }]);
        }
      }
      
      if (wishlistId) {
        await supabase.from('wishlist_items').delete().eq('wishlist_id', wishlistId);
      }
    }
    
    setCart((prevCart) => {
      const updated = [...prevCart];
      wishlist.forEach((product) => {
        if (!product) return;
        const size = product.sizes?.[1] || product.sizes?.[0] || '';
        const color = product.colors?.[0] || { name: '', hex: '#000' };
        const existingIdx = updated.findIndex(
          (item) =>
            item.product?.id === product.id &&
            item.selectedSize === size &&
            item.selectedColor?.name === color.name
        );
        if (existingIdx > -1) {
          updated[existingIdx].quantity += 1;
        } else {
          updated.push({ product, quantity: 1, selectedSize: size, selectedColor: color });
        }
      });
      return updated;
    });

    setWishlist([]);
    showToast("All wishlist items moved to your bag.");
  };

  const value = {
    user,
    isAuthModalOpen,
    setIsAuthModalOpen,
    handleLogout,
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
    handleMoveAllWishlistToCart,
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
