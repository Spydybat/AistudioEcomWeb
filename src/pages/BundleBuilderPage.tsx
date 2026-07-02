import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Reorder, AnimatePresence, motion } from "motion/react";
import {
  Download,
  GripVertical,
  Heart,
  Link as LinkIcon,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Trash2,
  X,
  Edit2,
  Check,
  AlertCircle
} from "lucide-react";
import { useShop } from "../context/ShopContext";
import { useCurrency } from "../context/CurrencyContext";
import { fetchProducts, fetchCategories } from "../data/products";
import { Product, ProductColor } from "../types";
import ProductCard from "../components/ProductCard";
import ProductQuickView from "../components/ProductQuickView";
import ProductSlider from "../components/ProductSlider";

interface BundleItem {
  id: string; // unique id for Reorder and multiple instances
  product: Product;
  size: string;
  color: ProductColor;
  quantity: number;
}

interface Bundle {
  id: string;
  name: string;
  items: BundleItem[];
}

export default function BundleBuilderPage() {
  const { wishlist, handleAddToCart, handleToggleWishlist, showToast } = useShop();
  const { formatPrice } = useCurrency();
  const [searchParams, setSearchParams] = useSearchParams();

  const [PRODUCTS, setPRODUCTS] = useState<any[]>([]);
  const [CATEGORIES, setCATEGORIES] = useState<any[]>([]);
  useEffect(() => {
    fetchProducts().then(setPRODUCTS);
    fetchCategories().then(setCATEGORIES);
  }, []);

  // Multi-bundle state
  const [bundles, setBundles] = useState<Bundle[]>(() => {
    try {
      const saved = localStorage.getItem("aura_bundles");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Error loading bundles", e);
    }
    return [{ id: crypto.randomUUID(), name: "My First Bundle", items: [] }];
  });

  const [activeBundleId, setActiveBundleId] = useState<string>(bundles[0].id);
  const activeBundle = bundles.find((b) => b.id === activeBundleId) || bundles[0];

  // UI State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [activeQuickView, setActiveQuickView] = useState<Product | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("");

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem("aura_bundles", JSON.stringify(bundles));
  }, [bundles]);

  // Handle Shared URL
  useEffect(() => {
    const shared = searchParams.get("share");
    if (shared) {
      try {
        const decoded = JSON.parse(atob(shared));
        if (Array.isArray(decoded)) {
          const newItems: BundleItem[] = [];
          decoded.forEach((item: any) => {
            const product = PRODUCTS.find((p) => p.id === item.p);
            if (product) {
              newItems.push({
                id: crypto.randomUUID(),
                product,
                quantity: item.q || 1,
                size: product?.sizes?.[0] ?? "Default",
                color: product?.colors?.[0] ?? { name: "Default", hex: "#000" }
              });
            }
          });
          const newBundle = {
            id: crypto.randomUUID(),
            name: "Shared Bundle",
            items: newItems
          };
          setBundles((prev) => [...prev, newBundle]);
          setActiveBundleId(newBundle.id);
          showToast("Shared bundle imported successfully!", "success");
        }
      } catch (e) {
        showToast("Invalid shared bundle link.", "info");
      }
      // Remove share query param
      searchParams.delete("share");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, showToast]);

  // Derived state
  const { subtotal, originalTotal, savings, itemCount, allInStock } = useMemo(() => {
    let sub = 0;
    let orig = 0;
    let count = 0;
    let inStock = true;

    activeBundle.items.forEach((item) => {
      sub += item.product.price * item.quantity;
      orig += (item.product.originalPrice || item.product.price) * item.quantity;
      count += item.quantity;
      if (item.product.stock !== undefined && item.quantity > item.product.stock) {
        inStock = false;
      }
    });

    return {
      subtotal: sub,
      originalTotal: orig,
      savings: orig - sub,
      itemCount: count,
      allInStock: inStock
    };
  }, [activeBundle.items]);

  const frequentlyBoughtProductIds = useMemo(() => {
    const ids = new Set<string>();
    activeBundle.items.forEach((item) => {
      item.product.frequentlyBoughtTogether?.forEach((id) => ids.add(id));
      item.product.relatedProductIds?.forEach((id) => ids.add(id));
    });
    activeBundle.items.forEach((item) => ids.delete(item.product.id));
    return Array.from(ids);
  }, [activeBundle.items]);

  const fbtProducts = useMemo(() => PRODUCTS.filter((p) => frequentlyBoughtProductIds.includes(p.id)), [frequentlyBoughtProductIds, PRODUCTS]);

  const filteredProducts = useMemo(() => {
    let result = PRODUCTS;
        const isValid = (val: string | null | undefined) => {
      return val && val !== "all" && val !== "null" && val !== "undefined" && val.trim() !== "";
    };

    if (isValid(selectedCategory)) {
      result = result.filter((p) => p.category === selectedCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [selectedCategory, searchQuery, PRODUCTS]);

  // Actions
  const updateActiveBundle = (updater: (bundle: Bundle) => Bundle) => {
    setBundles((prev) => prev.map((b) => (b.id === activeBundleId ? updater(b) : b)));
  };

  const handleCreateBundle = () => {
    const newBundle = { id: crypto.randomUUID(), name: `Bundle ${bundles.length + 1}`, items: [] };
    setBundles((prev) => [...prev, newBundle]);
    setActiveBundleId(newBundle.id);
  };

  const handleDeleteBundle = (id: string) => {
    if (bundles.length === 1) {
      showToast("You must have at least one bundle.", "info");
      return;
    }
    setBundles((prev) => prev.filter((b) => b.id !== id));
    if (activeBundleId === id) {
      setActiveBundleId(bundles.find((b) => b.id !== id)!.id);
    }
  };

  const handleRenameSubmit = () => {
    if (tempName.trim()) {
      updateActiveBundle((b) => ({ ...b, name: tempName.trim() }));
    }
    setIsEditingName(false);
  };

  const handleAddToBundle = (product: Product, size: string, color: ProductColor) => {
    // Stock validation check
    if (product.stock === 0) {
      showToast("This item is currently out of stock.", "info");
      return;
    }

    updateActiveBundle((bundle) => {
      // Allow duplicate products, but if identical (same product, size, color), just increment quantity
      const existingItem = bundle.items.find(
        (i) => i.product.id === product.id && i.size === size && i.color.name === color.name
      );

      if (existingItem) {
        if (product.stock !== undefined && existingItem.quantity >= product.stock) {
          showToast(`Cannot add more. Only ${product.stock} in stock.`, "info");
          return bundle;
        }
        return {
          ...bundle,
          items: bundle.items.map((i) =>
            i.id === existingItem.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }

      return {
        ...bundle,
        items: [
          ...bundle.items,
          {
            id: crypto.randomUUID(),
            product,
            size,
            color,
            quantity: 1,
          },
        ],
      };
    });
    showToast(`${product.name} added to your bundle.`);
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateActiveBundle((bundle) => {
      const item = bundle.items.find((i) => i.id === itemId);
      if (item && item.product.stock !== undefined && newQuantity > item.product.stock) {
        showToast(`Cannot add more. Only ${item.product.stock} in stock.`, "info");
        return bundle;
      }
      return {
        ...bundle,
        items: bundle.items.map((i) => (i.id === itemId ? { ...i, quantity: newQuantity } : i)),
      };
    });
  };

  const handleRemoveItem = (itemId: string) => {
    updateActiveBundle((b) => ({ ...b, items: b.items.filter((i) => i.id !== itemId) }));
  };

  const handleClearBundle = () => {
    updateActiveBundle((b) => ({ ...b, items: [] }));
    showToast("Bundle cleared.");
  };

  const handleAddAllToCart = () => {
    if (activeBundle.items.length === 0) return;
    if (!allInStock) {
      showToast("Please remove out of stock items or reduce quantities before adding to cart.", "info");
      return;
    }
    activeBundle.items.forEach((item) => {
      // We manually loop and call the global handleAddToCart multiple times
      // Alternatively, assuming ShopContext handles it well.
      for (let i = 0; i < item.quantity; i++) {
        handleAddToCart(item.product, item.size, item.color);
      }
    });
    showToast("All items added to cart successfully!", "success");
  };

  const handleMoveToWishlist = (item: BundleItem) => {
    if (!wishlist.some((w) => w.id === item.product.id)) {
      handleToggleWishlist(item.product);
    }
    handleRemoveItem(item.id);
    showToast("Item moved to wishlist.");
  };

  const handleShareBundle = () => {
    const simplified = activeBundle.items.map((i) => ({ p: i.product.id, q: i.quantity }));
    const encoded = btoa(JSON.stringify(simplified));
    const url = `${window.location.origin}/bundle-builder?share=${encoded}`;
    navigator.clipboard.writeText(url);
    showToast("Shareable link copied to clipboard!", "success");
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeBundle, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${activeBundle.name.replace(/\s+/g, "_")}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // Shipping logic
  const estimatedShipping = subtotal > 150 ? "Free Shipping" : `${formatPrice(15)} Standard Shipping`;
  const deliveryEstimate = "Arrives in 3-5 business days";

  return (
    <div className="flex-1 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Breadcrumbs & Title */}
        <nav className="flex text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-6">
          <Link to="/" className="hover:text-black cursor-pointer transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-black">Bundle Builder</span>
        </nav>

        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Universal Configuration</p>
            <h1 className="mt-3 text-4xl sm:text-5xl font-sans font-bold tracking-tight uppercase text-black">
              Bundle Builder
            </h1>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-zinc-200 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 shadow-sm backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-black" />
            Curate collections across all categories
          </div>
        </div>

        {/* Multi-Bundle Tabs */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {bundles.map((bundle) => (
            <div key={bundle.id} className={`flex items-center rounded-t-2xl border transition-colors ${activeBundleId === bundle.id ? "bg-zinc-50 border-zinc-200 text-black shadow-sm" : "bg-white border-transparent text-zinc-500 hover:bg-zinc-50 hover:border-zinc-200"}`}>
              <button
                onClick={() => setActiveBundleId(bundle.id)}
                className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest cursor-pointer"
              >
                {bundle.name}
              </button>
              {bundles.length > 1 && (
                <button
                  onClick={() => handleDeleteBundle(bundle.id)}
                  className="pr-4 pl-1 text-zinc-400 hover:text-red-500 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={handleCreateBundle}
            className="flex items-center gap-2 px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-black transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" /> New Bundle
          </button>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1fr_400px]">
          {/* Main Catalog View */}
          <div className="space-y-6 min-w-0">
            {/* Search & Filter */}
            <div className="bg-zinc-50 rounded-3xl border border-zinc-200 p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-center z-10 relative">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search products to add..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white text-black font-medium placeholder-zinc-400 pl-12 pr-4 py-3.5 text-sm rounded-2xl border border-zinc-200 focus:outline-none focus:border-black transition-all shadow-sm"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-auto bg-white text-black py-3.5 px-4 text-[10px] font-bold uppercase tracking-widest rounded-2xl border border-zinc-200 focus:outline-none focus:border-black transition-all shadow-sm cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-24 bg-zinc-50 rounded-3xl border border-zinc-200 border-dashed">
                <p className="text-zinc-500 font-medium">No products found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="relative group">
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToBundle}
                      onOpenQuickView={setActiveQuickView}
                      isWishlisted={wishlist.some((w) => w.id === product.id)}
                      onToggleWishlist={handleToggleWishlist}
                    />
                    {/* Visual overlay indicating this goes to bundle */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                      <span className="bg-black text-white text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-widest shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                        Add to Bundle
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sticky Sidebar: The Bundle */}
          <aside className="xl:sticky xl:top-28 self-start">
            <div className="rounded-3xl p-6 sm:p-7 shadow-sm border border-zinc-200 bg-zinc-50">
              
              {/* Bundle Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Your Bundle</p>
                  {isEditingName ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        autoFocus
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleRenameSubmit()}
                        className="text-xl font-sans font-bold tracking-tight text-black uppercase bg-transparent border-b border-black focus:outline-none w-full"
                      />
                      <button onClick={handleRenameSubmit} className="p-1.5 rounded-full bg-black text-white hover:bg-zinc-800 transition-colors cursor-pointer"><Check className="h-4 w-4" /></button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 group cursor-pointer" onClick={() => { setTempName(activeBundle.name); setIsEditingName(true); }}>
                      <h2 className="text-xl font-sans font-bold tracking-tight text-black uppercase group-hover:text-zinc-600 transition-colors">{activeBundle.name}</h2>
                      <Edit2 className="h-3 w-3 text-zinc-400 group-hover:text-black transition-colors" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2 ml-4">
                  <span className="rounded-full bg-black px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white whitespace-nowrap shadow-sm">
                    {itemCount} Items
                  </span>
                  <div className="flex items-center gap-1 mt-1">
                    <button onClick={handleShareBundle} className="p-1.5 text-zinc-400 hover:bg-white hover:text-black hover:shadow-sm rounded-full transition-all cursor-pointer" title="Share Bundle"><LinkIcon className="h-4 w-4" /></button>
                    <button onClick={handleExportJSON} className="p-1.5 text-zinc-400 hover:bg-white hover:text-black hover:shadow-sm rounded-full transition-all cursor-pointer" title="Export as JSON"><Download className="h-4 w-4" /></button>
                    <button onClick={handleClearBundle} className="p-1.5 text-zinc-400 hover:bg-rose-50 hover:text-rose-600 hover:shadow-sm rounded-full transition-all cursor-pointer" title="Clear Bundle"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>

              {/* Bundle Items List (Drag and Drop) */}
              <div className="min-h-[200px] max-h-[50vh] overflow-y-auto pr-2 no-scrollbar">
                {activeBundle.items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4 border-2 border-dashed border-zinc-200 rounded-2xl bg-white">
                    <div className="h-12 w-12 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center shadow-sm mb-3">
                      <ShoppingBag className="h-5 w-5 text-zinc-400" />
                    </div>
                    <p className="text-sm text-black font-bold">Your bundle is empty</p>
                    <p className="text-xs text-zinc-500 font-medium mt-1 max-w-[200px]">Search and add products from the catalog to build your custom collection.</p>
                  </div>
                ) : (
                  <Reorder.Group 
                    axis="y" 
                    values={activeBundle.items} 
                    onReorder={(newItems) => updateActiveBundle((b) => ({ ...b, items: newItems }))}
                    className="space-y-3"
                  >
                    <AnimatePresence mode="popLayout">
                      {activeBundle.items.map((item) => {
                        const isOutOfStock = item.product.stock !== undefined && item.quantity > item.product.stock;

                        return (
                          <Reorder.Item 
                            key={item.id} 
                            value={item}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95, height: 0 }}
                            className={`rounded-2xl border bg-white p-3 shadow-sm relative group cursor-grab active:cursor-grabbing ${isOutOfStock ? "border-rose-200 bg-rose-50" : "border-zinc-200"}`}
                          >
                            <div className="flex gap-3">
                              {/* Drag Handle */}
                              <div className="flex items-center text-zinc-400 cursor-grab active:cursor-grabbing hover:text-black">
                                <GripVertical className="h-4 w-4" />
                              </div>
                              
                              {/* Thumbnail */}
                              <img src={item?.product?.images?.[0] ?? ""} alt={item.product.name} className="h-16 w-16 rounded-xl object-cover border border-zinc-200 bg-zinc-50" />
                              
                              {/* Details */}
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-2">
                                  <h4 className="text-sm font-bold text-black truncate leading-tight">{item.product.name}</h4>
                                  <button onClick={() => handleRemoveItem(item.id)} className="text-zinc-400 hover:text-rose-600 p-1 rounded-full hover:bg-rose-50 transition-colors shrink-0 cursor-pointer">
                                    <X className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full border border-black/10" style={{ backgroundColor: item.color.hex }} /> {item.color.name}</span>
                                  <span>&bull;</span>
                                  <span>{item.size}</span>
                                </div>
                                
                                <div className="flex items-center justify-between mt-3">
                                  {/* Qty Controls */}
                                  <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1">
                                    <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} className="text-zinc-500 hover:text-black disabled:opacity-30 cursor-pointer" disabled={item.quantity <= 1}><Minus className="h-3 w-3" /></button>
                                    <span className="text-black text-xs font-bold min-w-[12px] text-center">{item.quantity}</span>
                                    <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className="text-zinc-500 hover:text-black disabled:opacity-30 cursor-pointer"><Plus className="h-3 w-3" /></button>
                                  </div>

                                  <div className="flex flex-col items-end">
                                    <span className="text-sm font-bold text-black">{formatPrice(item.product.price * item.quantity)}</span>
                                    {item.product.originalPrice && (
                                      <span className="text-[10px] text-zinc-500 line-through">{formatPrice(item.product.originalPrice * item.quantity)}</span>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Stock Warning */}
                                {isOutOfStock && (
                                  <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-rose-600 flex items-center gap-1 bg-rose-50 border border-rose-200 p-1.5 rounded-md">
                                    <AlertCircle className="h-3 w-3" />
                                    Only {item.product.stock} in stock
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Hover Actions */}
                            <div className="absolute top-full left-0 right-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex justify-end">
                              <button onClick={() => handleMoveToWishlist(item)} className="bg-white border border-zinc-200 shadow-md rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 hover:border-black hover:text-black text-zinc-500 transition-colors cursor-pointer">
                                <Heart className="h-3.5 w-3.5" /> Move to Wishlist
                              </button>
                            </div>
                          </Reorder.Item>
                        );
                      })}
                    </AnimatePresence>
                  </Reorder.Group>
                )}
              </div>

              {/* Financials & Checkout */}
              <div className="mt-6 pt-6 border-t border-zinc-200">
                <div className="space-y-3 mb-6 text-sm font-medium">
                  <div className="flex items-center justify-between text-zinc-500">
                    <span>Original Value</span>
                    <span className="text-black font-bold">{formatPrice(originalTotal)}</span>
                  </div>
                  {savings > 0 && (
                    <div className="flex items-center justify-between text-emerald-600 font-bold">
                      <span>Bundle Savings</span>
                      <span>-{formatPrice(savings)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-zinc-500">
                    <span>Estimated Shipping</span>
                    <span className="text-black font-bold">{estimatedShipping}</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-200">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-black">Subtotal</span>
                    <span className="text-2xl font-sans font-bold text-black">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-right mt-1">{deliveryEstimate}</div>
                </div>

                <button
                  onClick={handleAddAllToCart}
                  disabled={activeBundle.items.length === 0}
                  className={`w-full inline-flex items-center justify-center gap-2 rounded-full py-4 text-[10px] sm:text-xs uppercase tracking-widest font-bold transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.1)] cursor-pointer hover:-translate-y-0.5 ${
                    activeBundle.items.length === 0
                      ? "bg-zinc-200 text-zinc-400 cursor-not-allowed hover:translate-y-0"
                      : !allInStock 
                        ? "bg-rose-50 text-rose-600 border border-rose-200"
                        : "bg-black text-white hover:bg-zinc-800"
                  }`}
                >
                  <ShoppingBag className="h-4 w-4" />
                  {!allInStock ? "Fix Stock Issues" : "Add Bundle to Cart"}
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* Frequently Bought Together Section */}
        {fbtProducts.length > 0 && (
          <div className="mt-20 pt-16 border-t border-zinc-200">
            <div className="mb-8">
              <h3 className="text-2xl font-sans font-bold tracking-tight uppercase text-black">Frequently Bought Together</h3>
              <p className="text-sm font-medium text-zinc-500 mt-2">Customers who created similar bundles also added these items.</p>
            </div>
            <ProductSlider 
              title="" 
              subtitle="" 
              products={fbtProducts.slice(0, 8)} 
              onAddToCart={handleAddToBundle}
              onOpenQuickView={setActiveQuickView}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              bgWhite={false}
            />
          </div>
        )}
      </div>

      <ProductQuickView
        product={activeQuickView}
        onClose={() => setActiveQuickView(null)}
        onAddToCart={handleAddToBundle}
      />
    </div>
  );
}



