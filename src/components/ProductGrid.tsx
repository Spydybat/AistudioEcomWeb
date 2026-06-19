import { useState, useMemo } from "react";
import { SlidersHorizontal, Grid3X3, ArrowUpDown, RefreshCw } from "lucide-react";
import { Product, ProductColor } from "../types";
import { CATEGORIES, PRODUCTS } from "../data/products";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  onAddToCart: (product: Product, selectedSize: string, selectedColor: ProductColor) => void;
  onOpenQuickView: (product: Product) => void;
  wishlist: Product[];
  onToggleWishlist: (product: Product) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (catId: string) => void;
}

type SortOption = "default" | "price-asc" | "price-desc" | "rating";

export default function ProductGrid({
  onAddToCart,
  onOpenQuickView,
  wishlist,
  onToggleWishlist,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
}: ProductGridProps) {
  const [sortOption, setSortOption] = useState<SortOption>("default");

  const categoryMap = useMemo(() => {
    return new Map(CATEGORIES.map(c => [c.id, c.name]));
  }, []);

  // Filter and sort the product static catalog list
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // 1. Category Filter
    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // 2. Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.details.some((detail) => detail.toLowerCase().includes(query))
      );
    }

    // 3. Sort logic
    if (sortOption === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [selectedCategory, searchQuery, sortOption]);

  const activeCategoryName = categoryMap.get(selectedCategory) || "All Collections";

  return (
    <section id="product-catalog" className="py-20 bg-neutral-50/50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <p className="text-[10px] font-mono tracking-[0.4em] uppercase text-neutral-400 mb-4">
            Aura Curation Studio
          </p>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-neutral-900 uppercase">
            {activeCategoryName}
          </h2>
          <div className="w-16 h-[2px] bg-neutral-900 mx-auto mt-6" />
        </div>

        {/* Filters Top Bar */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-neutral-200/60 p-2 mb-12 flex flex-col md:flex-row gap-5 items-stretch md:items-center justify-between shadow-sm">
          
          {/* Category Tabs */}
          <div className="flex items-center overflow-x-auto no-scrollbar gap-2 p-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-2.5 text-xs tracking-wider uppercase font-medium whitespace-nowrap transition-all rounded-xl cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-neutral-900 text-white shadow-md"
                    : "bg-transparent text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/50"
                }`}
                id={`cat-tab-${cat.id}`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Filtering Metrics & Dropdowns */}
          <div className="flex items-center justify-between md:justify-end gap-6 px-4 md:px-2 border-t border-neutral-100 pt-4 md:pt-0 md:border-0">
            <div className="flex items-center gap-2 text-xs text-neutral-500 uppercase tracking-widest font-medium">
              <Grid3X3 className="h-4 w-4" />
              <span>{filteredAndSortedProducts.length} Options</span>
            </div>

            {/* Sorting List dropdown */}
            <div className="relative flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-neutral-500" />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="bg-transparent text-xs uppercase tracking-wider font-medium text-neutral-900 focus:outline-none cursor-pointer hover:opacity-70 transition-opacity"
                title="Sort Collections"
                id="sort-selector"
              >
                <option value="default">Default Curation</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Rating: High Performance</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Searches Feedback line */}
        {(searchQuery || (selectedCategory && selectedCategory !== "all")) && (
          <div className="mb-6 flex items-center justify-between bg-neutral-100 px-4 py-3 text-xs text-neutral-600 rounded">
            <div className="flex flex-wrap items-center gap-2">
              <span>Filtering for:</span>
              {selectedCategory && selectedCategory !== "all" && (
                <span className="px-2 py-0.5 bg-white text-neutral-800 rounded border border-neutral-200 uppercase font-mono text-[10px]">
                  Category: {selectedCategory}
                </span>
              )}
              {searchQuery && (
                <span className="px-2 py-0.5 bg-white text-neutral-800 rounded border border-neutral-200">
                  Search: "{searchQuery}"
                </span>
              )}
            </div>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSortOption("default");
              }}
              className="text-neutral-900 border-b border-neutral-900 hover:text-neutral-500 hover:border-neutral-500 transition-colors py-0.5 cursor-pointer flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Reset filter</span>
            </button>
          </div>
        )}

        {/* Product Grid System */}
        {filteredAndSortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {filteredAndSortedProducts.map((product) => (
              <div 
                key={product.id} 
                className="opacity-0 translate-y-4 animate-slideIn"
                style={{ animationFillMode: "forwards" }}
              >
                <ProductCard
                  product={product}
                  onAddToCart={onAddToCart}
                  onOpenQuickView={onOpenQuickView}
                  isWishlisted={wishlist.some((item) => item.id === product.id)}
                  onToggleWishlist={onToggleWishlist}
                />
              </div>
            ))}
          </div>
        ) : (
          /* Empty / No items match fallback */
          <div className="text-center py-20 bg-white border border-neutral-100">
            <p className="text-sm font-sans text-neutral-400 mb-4">
              We did not find any garments in our collection matching your criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="px-6 py-3 bg-neutral-950 text-white hover:bg-neutral-800 text-xs tracking-widest uppercase transition-colors rounded-none"
            >
              Examine Complete Wardrobe
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
