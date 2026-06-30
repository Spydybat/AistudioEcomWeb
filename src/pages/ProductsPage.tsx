import { useEffect, useMemo, useState } from "react";
import { ArrowUpDown, Grid3X3, RefreshCw, SlidersHorizontal, X, Zap } from "lucide-react";
import { CATEGORIES, PRODUCTS, getCategoryName } from "../data/products";
import ProductCard from "../components/ProductCard";
import { useShop } from "../context/ShopContext";

type SortOption = "default" | "price-asc" | "price-desc" | "rating" | "reviews" | "newest";

const ITEMS_PER_PAGE = 12;
const priceBands = [
  { id: "all", label: "All Prices", min: 0, max: Number.POSITIVE_INFINITY },
  { id: "under-100", label: "Under $100", min: 0, max: 100 },
  { id: "100-300", label: "$100 - $300", min: 100, max: 300 },
  { id: "300-800", label: "$300 - $800", min: 300, max: 800 },
  { id: "800-plus", label: "$800+", min: 800, max: Number.POSITIVE_INFINITY },
];

export default function ProductsPage() {
  const {
    wishlist,
    handleAddToCart,
    handleToggleWishlist,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
  } = useShop();

  const [sortOption, setSortOption] = useState<SortOption>("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [brandFilter, setBrandFilter] = useState("all");
  const [priceBand, setPriceBand] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [dealsOnly, setDealsOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);

  const brands = useMemo(() => Array.from(new Set(PRODUCTS.map((product) => product.brand).filter(Boolean))) as string[], []);
  const activeCategory = CATEGORIES.find((category) => category.id === selectedCategory);
  const activePriceBand = priceBands.find((band) => band.id === priceBand) || priceBands[0];

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 450);
    return () => clearTimeout(timer);
  }, [selectedCategory, sortOption, searchQuery, brandFilter, priceBand, minRating, dealsOnly, inStockOnly, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, brandFilter, priceBand, minRating, dealsOnly, inStockOnly, sortOption]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...PRODUCTS];

    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter((product) => product.category === selectedCategory);
    }

    if (brandFilter !== "all") {
      result = result.filter((product) => product.brand === brandFilter);
    }

    result = result.filter((product) => product.price >= activePriceBand.min && product.price <= activePriceBand.max);

    if (minRating > 0) {
      result = result.filter((product) => product.rating >= minRating);
    }

    if (dealsOnly) {
      result = result.filter((product) => product.isFlashDeal || product.originalPrice);
    }

    if (inStockOnly) {
      result = result.filter((product) => (product.stock ?? 1) > 0);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((product) => {
        const searchable = [
          product.name,
          product.description,
          product.category,
          product.department,
          product.brand,
          ...(product.tags || []),
          ...product.details,
        ].join(" ").toLowerCase();
        return searchable.includes(query);
      });
    }

    if (sortOption === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sortOption === "price-desc") result.sort((a, b) => b.price - a.price);
    if (sortOption === "rating") result.sort((a, b) => b.rating - a.rating);
    if (sortOption === "reviews") result.sort((a, b) => b.reviews - a.reviews);
    if (sortOption === "newest") result.sort((a, b) => Number(Boolean(b.badge === "New Arrival")) - Number(Boolean(a.badge === "New Arrival")));

    return result;
  }, [activePriceBand.max, activePriceBand.min, brandFilter, dealsOnly, inStockOnly, minRating, priceBand, searchQuery, selectedCategory, sortOption]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE));
  const currentProducts = filteredAndSortedProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setBrandFilter("all");
    setPriceBand("all");
    setMinRating(0);
    setDealsOnly(false);
    setInStockOnly(false);
    setSortOption("default");
  };

  return (
    <div className="pt-8 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex-1 w-full">
      <div className="mb-10 rounded-3xl bg-[#111214] text-white overflow-hidden">
        <div className="grid lg:grid-cols-[1fr_0.7fr]">
          <div className="p-8 sm:p-10 lg:p-12">
            <p className="text-[10px] font-mono tracking-[0.4em] uppercase text-white/50 mb-4">Marketplace Catalog</p>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight uppercase">
              {activeCategory?.name || "All Departments"}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65">
              {activeCategory?.description || "Browse fashion, electronics, home, grocery, sports, accessories, and more with professional filters and curated marketplace merchandising."}
            </p>
          </div>
          <div className="relative min-h-56 hidden lg:block">
            <img
              src={activeCategory?.image || CATEGORIES[0].image}
              alt={activeCategory?.name || "All departments"}
              className="absolute inset-0 h-full w-full object-cover opacity-80"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#111214] to-transparent" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        <aside className="lg:sticky lg:top-28 h-max rounded-2xl border border-white/5 bg-[#2B2D31] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-zinc-100">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </div>
            <button onClick={resetFilters} className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
              Reset
            </button>
          </div>

          <div className="space-y-6">


            {(selectedCategory === "all" || selectedCategory === "gaming" || selectedCategory === "electronics" || selectedCategory === "fashion" || selectedCategory === "beauty" || selectedCategory === "home-and-kitchen" || selectedCategory === "computers" || selectedCategory === "mobiles") && (
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Brand</label>
                <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)} className="w-full rounded-xl border border-white/5 bg-[#1E1F22] text-zinc-300 px-3 py-3 text-xs uppercase tracking-wider focus:outline-none focus:border-indigo-500">
                  <option value="all">All Brands</option>
                  {brands.map((brand) => <option key={brand} value={brand}>{brand}</option>)}
                </select>
              </div>
            )}

                        {selectedCategory === "gaming" && (
              <>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Platform</label>
                  <select className="w-full rounded-xl border border-white/5 bg-[#1E1F22] text-zinc-300 px-3 py-3 text-xs uppercase tracking-wider focus:outline-none focus:border-indigo-500"><option>All Platforms</option></select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Genre</label>
                  <select className="w-full rounded-xl border border-white/5 bg-[#1E1F22] text-zinc-300 px-3 py-3 text-xs uppercase tracking-wider focus:outline-none focus:border-indigo-500"><option>All Genres</option></select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Age Rating</label>
                  <select className="w-full rounded-xl border border-white/5 bg-[#1E1F22] text-zinc-300 px-3 py-3 text-xs uppercase tracking-wider focus:outline-none focus:border-indigo-500"><option>Any Age Rating</option></select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Multiplayer</label>
                  <select className="w-full rounded-xl border border-white/5 bg-[#1E1F22] text-zinc-300 px-3 py-3 text-xs uppercase tracking-wider focus:outline-none focus:border-indigo-500"><option>Any Multiplayer</option></select>
                </div>
              </>
            )}

                        {selectedCategory === "fashion" && (
              <>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Size</label>
                  <select className="w-full rounded-xl border border-white/5 bg-[#1E1F22] text-zinc-300 px-3 py-3 text-xs uppercase tracking-wider focus:outline-none focus:border-indigo-500"><option>All Sizes</option></select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Color</label>
                  <select className="w-full rounded-xl border border-white/5 bg-[#1E1F22] text-zinc-300 px-3 py-3 text-xs uppercase tracking-wider focus:outline-none focus:border-indigo-500"><option>All Colors</option></select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Material</label>
                  <select className="w-full rounded-xl border border-white/5 bg-[#1E1F22] text-zinc-300 px-3 py-3 text-xs uppercase tracking-wider focus:outline-none focus:border-indigo-500"><option>All Materials</option></select>
                </div>
              </>
            )}
            {selectedCategory === "electronics" && (
              <>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-2">RAM</label>
                  <select className="w-full rounded-xl border border-white/5 bg-[#1E1F22] text-zinc-300 px-3 py-3 text-xs uppercase tracking-wider focus:outline-none focus:border-indigo-500"><option>All RAM</option></select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Storage</label>
                  <select className="w-full rounded-xl border border-white/5 bg-[#1E1F22] text-zinc-300 px-3 py-3 text-xs uppercase tracking-wider focus:outline-none focus:border-indigo-500"><option>All Storage</option></select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Processor</label>
                  <select className="w-full rounded-xl border border-white/5 bg-[#1E1F22] text-zinc-300 px-3 py-3 text-xs uppercase tracking-wider focus:outline-none focus:border-indigo-500"><option>All Processors</option></select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Display</label>
                  <select className="w-full rounded-xl border border-white/5 bg-[#1E1F22] text-zinc-300 px-3 py-3 text-xs uppercase tracking-wider focus:outline-none focus:border-indigo-500"><option>All Displays</option></select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Battery</label>
                  <select className="w-full rounded-xl border border-white/5 bg-[#1E1F22] text-zinc-300 px-3 py-3 text-xs uppercase tracking-wider focus:outline-none focus:border-indigo-500"><option>All Batteries</option></select>
                </div>
              </>
            )}
            {selectedCategory === "computers" && (
              <>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Processor</label>
                  <select className="w-full rounded-xl border border-white/5 bg-[#1E1F22] text-zinc-300 px-3 py-3 text-xs uppercase tracking-wider focus:outline-none focus:border-indigo-500"><option>All Processors</option></select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-2">RAM</label>
                  <select className="w-full rounded-xl border border-white/5 bg-[#1E1F22] text-zinc-300 px-3 py-3 text-xs uppercase tracking-wider focus:outline-none focus:border-indigo-500"><option>All RAM</option></select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Storage</label>
                  <select className="w-full rounded-xl border border-white/5 bg-[#1E1F22] text-zinc-300 px-3 py-3 text-xs uppercase tracking-wider focus:outline-none focus:border-indigo-500"><option>All Storage</option></select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Graphics</label>
                  <select className="w-full rounded-xl border border-white/5 bg-[#1E1F22] text-zinc-300 px-3 py-3 text-xs uppercase tracking-wider focus:outline-none focus:border-indigo-500"><option>All Graphics</option></select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Display Size</label>
                  <select className="w-full rounded-xl border border-white/5 bg-[#1E1F22] text-zinc-300 px-3 py-3 text-xs uppercase tracking-wider focus:outline-none focus:border-indigo-500"><option>All Display Sizes</option></select>
                </div>
              </>
            )}
            {selectedCategory === "mobiles" && (
              <>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-2">RAM</label>
                  <select className="w-full rounded-xl border border-white/5 bg-[#1E1F22] text-zinc-300 px-3 py-3 text-xs uppercase tracking-wider focus:outline-none focus:border-indigo-500"><option>All RAM</option></select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Storage</label>
                  <select className="w-full rounded-xl border border-white/5 bg-[#1E1F22] text-zinc-300 px-3 py-3 text-xs uppercase tracking-wider focus:outline-none focus:border-indigo-500"><option>All Storage</option></select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Camera</label>
                  <select className="w-full rounded-xl border border-white/5 bg-[#1E1F22] text-zinc-300 px-3 py-3 text-xs uppercase tracking-wider focus:outline-none focus:border-indigo-500"><option>All Cameras</option></select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Battery</label>
                  <select className="w-full rounded-xl border border-white/5 bg-[#1E1F22] text-zinc-300 px-3 py-3 text-xs uppercase tracking-wider focus:outline-none focus:border-indigo-500"><option>All Batteries</option></select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Display</label>
                  <select className="w-full rounded-xl border border-white/5 bg-[#1E1F22] text-zinc-300 px-3 py-3 text-xs uppercase tracking-wider focus:outline-none focus:border-indigo-500"><option>All Displays</option></select>
                </div>
              </>
            )}

            {selectedCategory === "beauty" && (
              <>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Skin Type</label>
                  <select className="w-full rounded-xl border border-white/5 bg-[#1E1F22] text-zinc-300 px-3 py-3 text-xs uppercase tracking-wider focus:outline-none focus:border-indigo-500"><option>All Skin Types</option></select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Product Type</label>
                  <select className="w-full rounded-xl border border-white/5 bg-[#1E1F22] text-zinc-300 px-3 py-3 text-xs uppercase tracking-wider focus:outline-none focus:border-indigo-500"><option>All Product Types</option></select>
                </div>
              </>
            )}

            {selectedCategory === "home-and-kitchen" && (
              <>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Material</label>
                  <select className="w-full rounded-xl border border-white/5 bg-[#1E1F22] text-zinc-300 px-3 py-3 text-xs uppercase tracking-wider focus:outline-none focus:border-indigo-500"><option>All Materials</option></select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Color</label>
                  <select className="w-full rounded-xl border border-white/5 bg-[#1E1F22] text-zinc-300 px-3 py-3 text-xs uppercase tracking-wider focus:outline-none focus:border-indigo-500"><option>All Colors</option></select>
                </div>
              </>
            )}

            {selectedCategory === "books" && (
              <>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Genre</label>
                  <select className="w-full rounded-xl border border-white/5 bg-[#1E1F22] text-zinc-300 px-3 py-3 text-xs uppercase tracking-wider focus:outline-none focus:border-indigo-500"><option>All Genres</option></select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Author</label>
                  <select className="w-full rounded-xl border border-white/5 bg-[#1E1F22] text-zinc-300 px-3 py-3 text-xs uppercase tracking-wider focus:outline-none focus:border-indigo-500"><option>All Authors</option></select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Language</label>
                  <select className="w-full rounded-xl border border-white/5 bg-[#1E1F22] text-zinc-300 px-3 py-3 text-xs uppercase tracking-wider focus:outline-none focus:border-indigo-500"><option>All Languages</option></select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Publisher</label>
                  <select className="w-full rounded-xl border border-white/5 bg-[#1E1F22] text-zinc-300 px-3 py-3 text-xs uppercase tracking-wider focus:outline-none focus:border-indigo-500"><option>All Publishers</option></select>
                </div>
              </>
            )}

            {(selectedCategory === "all" || selectedCategory === "gaming" || selectedCategory === "electronics" || selectedCategory === "fashion" || selectedCategory === "beauty" || selectedCategory === "home-and-kitchen" || selectedCategory === "computers" || selectedCategory === "mobiles") && (
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Price</label>
                <div className="grid grid-cols-1 gap-2">
                  {priceBands.map((band) => (
                    <button
                      key={band.id}
                      onClick={() => setPriceBand(band.id)}
                      className={`rounded-xl border px-3 py-2.5 text-left text-xs transition-colors ${
                        priceBand === band.id ? "border-indigo-500 bg-indigo-500/10 text-indigo-400" : "border-white/5 bg-[#1E1F22] text-zinc-400 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {band.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(selectedCategory === "all" || selectedCategory === "gaming" || selectedCategory === "computers" || selectedCategory === "mobiles" || selectedCategory === "fashion" || selectedCategory === "electronics") && (
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Rating</label>
                <input type="range" min="0" max="5" step="0.5" value={minRating} onChange={(e) => setMinRating(Number(e.target.value))} className="w-full accent-indigo-500" />
                <div className="mt-1 text-xs text-zinc-500">{minRating > 0 ? `${minRating}+ stars` : "Any rating"}</div>
              </div>
            )}

            {(selectedCategory === "all" || selectedCategory === "gaming" || selectedCategory === "computers" || selectedCategory === "mobiles" || selectedCategory === "fashion" || selectedCategory === "electronics") && (
              <label className="flex items-center justify-between gap-3 rounded-xl border border-white/5 px-3 py-3 text-xs text-zinc-300">
                <span>{(selectedCategory === "gaming" || selectedCategory === "computers" || selectedCategory === "mobiles") ? "Availability" : "In stock only"}</span>
                <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="accent-indigo-500" />
              </label>
            )}

            {selectedCategory === "all" && (
              <label className="flex items-center justify-between gap-3 rounded-xl border border-white/5 px-3 py-3 text-xs text-zinc-300">
                <span className="flex items-center gap-2"><Zap className="h-4 w-4 text-emerald-500" /> Flash deals</span>
                <input type="checkbox" checked={dealsOnly} onChange={(e) => setDealsOnly(e.target.checked)} className="accent-indigo-500" />
              </label>
            )}
          </div>
        </aside>

        <section>
          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center bg-[#1E1F22] p-4 rounded-2xl mb-8 gap-4 border border-white/5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
              <Grid3X3 className="h-4 w-4" />
              <span className="uppercase tracking-widest">{filteredAndSortedProducts.length} products</span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#2B2D31] border border-white/5 px-3 py-1.5 text-zinc-100">
                  Search: &quot;{searchQuery}&quot;
                  <button onClick={() => setSearchQuery("")} aria-label="Clear search" className="hover:text-white"><X className="h-3.5 w-3.5" /></button>
                </span>
              )}
              {selectedCategory !== "all" && (
                <span className="rounded-full bg-[#2B2D31] border border-white/5 px-3 py-1.5 text-zinc-100">{getCategoryName(selectedCategory)}</span>
              )}
            </div>

            <div className="relative flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-zinc-500" />
              <select value={sortOption} onChange={(e) => setSortOption(e.target.value as SortOption)} className="rounded-xl border border-white/5 bg-[#2B2D31] text-zinc-300 px-4 py-3 text-xs uppercase tracking-wider focus:outline-none focus:border-indigo-500">
                <option value="default">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="reviews">Most Reviewed</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="animate-pulse flex flex-col gap-4">
                  <div className="bg-[#1E1F22] rounded-2xl aspect-[3/4] w-full" />
                  <div className="h-4 bg-[#1E1F22] w-3/4 rounded" />
                  <div className="h-4 bg-[#1E1F22] w-1/4 rounded" />
                </div>
              ))}
            </div>
          ) : currentProducts.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-white/5 bg-[#1E1F22]">
              <p className="text-zinc-400 mb-4">No products match your search or filters.</p>
              <button onClick={resetFilters} className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-100 underline hover:text-white hover:no-underline cursor-pointer">
                <RefreshCw className="h-3.5 w-3.5" />
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {currentProducts.map((product) => (
                  <div key={product.id} className="animate-slideIn" style={{ animationFillMode: "forwards" }}>
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                      onOpenQuickView={() => {}}
                      isWishlisted={wishlist.some((item) => item.id === product.id)}
                      onToggleWishlist={handleToggleWishlist}
                    />
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-16">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setCurrentPage(i + 1);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        currentPage === i + 1 ? "bg-indigo-500 text-white" : "bg-[#1E1F22] text-zinc-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

