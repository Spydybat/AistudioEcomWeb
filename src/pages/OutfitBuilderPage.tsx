import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowRight,
  Heart,
  Plus,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";
import { useShop } from "../context/ShopContext";
import { PRODUCTS } from "../data/products";
import { Product } from "../types";

const outfitCategoryConfig = [
  {
    id: "tops",
    label: "Tops",
    blurb: "Layering pieces and elevated essentials.",
  },
  {
    id: "outerwear",
    label: "Outerwear",
    blurb: "Tailored coats and statement jackets.",
  },
  {
    id: "bottoms",
    label: "Bottoms",
    blurb: "Refined silhouettes for every mood.",
  },
  {
    id: "shoes",
    label: "Shoes",
    blurb: "Polished silhouettes to complete the look.",
  },
  {
    id: "accessories",
    label: "Accessories",
    blurb: "Details that define the final impression.",
  },
] as const;

const outfitSelections: Record<string, string[]> = {
  tops: ["cashmere-crewneck", "organic-cotton-shirt"],
  outerwear: ["merino-trench-coat", "shearling-jacket"],
  bottoms: ["tailored-wool-trouser", "cashmere-lounge-pant"],
  shoes: ["tuscan-leather-boot"],
  accessories: ["italian-linen-blazer", "cashmere-crewneck"],
};

export default function OutfitBuilderPage() {
  const { wishlist, handleAddToCart, handleToggleWishlist, showToast } = useShop();
  const [activeCategory, setActiveCategory] = useState<(typeof outfitCategoryConfig)[number]["id"]>(
    "tops"
  );
  const [selectedItems, setSelectedItems] = useState<Record<string, Product>>({});

  const selectedProducts = useMemo(
    () => outfitCategoryConfig.map((category) => selectedItems[category.id]).filter(Boolean) as Product[],
    [selectedItems]
  );

  const totalOutfitPrice = selectedProducts.reduce((sum, item) => sum + item.price, 0);

  const currentProducts = useMemo(() => {
    const ids = outfitSelections[activeCategory] || [];
    return PRODUCTS.filter((product) => ids.includes(product.id));
  }, [activeCategory]);

  const currentSelected = selectedItems[activeCategory];

  const handleSelectProduct = (product: Product) => {
    setSelectedItems((prev) => ({
      ...prev,
      [activeCategory]: product,
    }));
  };

  const handleRemoveItem = (categoryId: string) => {
    setSelectedItems((prev) => {
      const updated = { ...prev };
      delete updated[categoryId];
      return updated;
    });
  };

  const handleAddOutfitToCart = () => {
    if (selectedProducts.length === 0) {
      showToast("Choose at least one piece to build your outfit.", "info");
      return;
    }

    selectedProducts.forEach((product) => {
      const defaultSize = product.sizes[0] || "M";
      const defaultColor = product.colors[0] || { name: "Default", hex: "#111111" };
      handleAddToCart(product, defaultSize, defaultColor);
    });

    showToast("Complete outfit added to your shopping bag.");
  };

  const handleSaveOutfitToWishlist = () => {
    if (selectedProducts.length === 0) {
      showToast("Add pieces to your outfit before saving.", "info");
      return;
    }

    selectedProducts.forEach((product) => {
      if (!wishlist.some((item) => item.id === product.id)) {
        handleToggleWishlist(product);
      }
    });

    showToast("Outfit saved to your wishlist.");
  };

  return (
    <div className="flex-1 bg-[radial-gradient(circle_at_top,_rgba(245,245,244,0.9),_rgba(255,255,255,1)_50%)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <nav className="flex text-[10px] uppercase tracking-widest text-neutral-400 mb-6 font-mono">
          <Link to="/" className="hover:text-neutral-900 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-neutral-900">Outfit Builder</span>
        </nav>

        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.45em] text-neutral-500">Stylist Assistant</p>
            <h1 className="mt-3 text-4xl sm:text-5xl font-serif font-semibold text-neutral-900">
              Outfit Builder
            </h1>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-neutral-200 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.3em] text-neutral-500">
            <Sparkles className="h-4 w-4 text-neutral-800" />
            Curated for modern luxury dressing
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.5fr_0.95fr]">
          <div className="space-y-6">
            <div className="glass rounded-3xl p-3 sm:p-4">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {outfitCategoryConfig.map((category) => {
                  const isActive = activeCategory === category.id;
                  const isFilled = Boolean(selectedItems[category.id]);

                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setActiveCategory(category.id)}
                      className={`relative min-w-max rounded-2xl px-4 py-3 text-left transition-all ${
                        isActive
                          ? "bg-neutral-900 text-white shadow-lg"
                          : "bg-white/60 text-neutral-600 hover:bg-white"
                      }`}
                    >
                      <div className="text-xs uppercase tracking-[0.3em]">{category.label}</div>
                      <div className={`mt-1 text-[10px] ${isActive ? "text-neutral-300" : "text-neutral-400"}`}>
                        {category.blurb}
                      </div>
                      {isFilled && (
                        <span
                          className={`absolute right-3 top-3 h-2.5 w-2.5 rounded-full ${
                            isActive ? "bg-emerald-400" : "bg-neutral-900"
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {currentProducts.map((product) => {
                const isSelected = currentSelected?.id === product.id;
                const isWishlisted = wishlist.some((item) => item.id === product.id);

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`group overflow-hidden rounded-3xl border text-left transition-all ${
                      isSelected
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-200 bg-white/80 hover:-translate-y-1 hover:border-neutral-400"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectProduct(product)}
                      className="w-full text-left"
                    >
                      <div className="relative aspect-[4/5] overflow-hidden">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {product.badge && (
                          <span className="absolute left-3 top-3 rounded-full bg-white/75 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-neutral-900 backdrop-blur-sm">
                            {product.badge}
                          </span>
                        )}
                      </div>
                      <div className="space-y-2 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-base font-medium">{product.name}</h3>
                          {isSelected && <CheckBadge />}
                        </div>
                        <p className={`text-sm ${isSelected ? "text-neutral-300" : "text-neutral-500"}`}>
                          {product.description.slice(0, 80)}...
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold">${product.price}</span>
                        </div>
                      </div>
                    </button>
                    <div className="px-4 pb-4">
                      <button
                        type="button"
                        onClick={() => handleToggleWishlist(product)}
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs uppercase tracking-[0.3em] ${
                          isWishlisted
                            ? "bg-red-50 text-red-500"
                            : isSelected
                              ? "bg-white/10 text-white"
                              : "bg-neutral-100 text-neutral-600"
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
                        {isWishlisted ? "Saved" : "Save"}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <aside className="xl:sticky xl:top-28 self-start">
            <div className="glass rounded-3xl p-6 sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-500">Outfit</p>
                  <h2 className="mt-2 text-2xl font-serif font-semibold text-neutral-900">Selected Look</h2>
                </div>
                <span className="rounded-full bg-neutral-900 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-white">
                  {selectedProducts.length}/5
                </span>
              </div>

              <div className="mt-6 space-y-3">
                {outfitCategoryConfig.map((category) => {
                  const item = selectedItems[category.id];

                  return (
                    <div key={category.id} className="rounded-2xl border border-neutral-200 bg-white/70 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">{category.label}</span>
                        {item ? (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(category.id)}
                            className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        ) : null}
                      </div>
                      {item ? (
                        <div className="mt-3 flex items-center gap-3">
                          <img src={item.images[0]} alt={item.name} className="h-16 w-16 rounded-xl object-cover" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-neutral-900">{item.name}</p>
                            <p className="text-xs text-neutral-500">${item.price}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-3 flex items-center justify-between rounded-xl bg-neutral-50 px-3 py-3 text-xs uppercase tracking-[0.25em] text-neutral-400">
                          <span>Select {category.label}</span>
                          <Plus className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 rounded-3xl bg-neutral-900 p-5 text-white">
                <div className="flex items-center justify-between text-sm text-neutral-300">
                  <span>Total Outfit</span>
                  <span className="text-2xl font-semibold text-white">${totalOutfitPrice.toFixed(2)}</span>
                </div>
                <div className="mt-4 flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={handleAddOutfitToCart}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-xs uppercase tracking-[0.3em] text-neutral-900 transition hover:bg-neutral-100"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Add Outfit to Bag
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveOutfitToWishlist}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-4 py-3 text-xs uppercase tracking-[0.3em] text-white transition hover:bg-white/5"
                  >
                    <Heart className="h-4 w-4" />
                    Save to Wishlist
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function CheckBadge() {
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
      <ArrowRight className="h-3.5 w-3.5" />
    </span>
  );
}
