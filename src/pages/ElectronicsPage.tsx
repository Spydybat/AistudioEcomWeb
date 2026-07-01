import { useEffect, useMemo, useState } from "react";
import { ArrowUpDown, Grid3X3, RefreshCw, SlidersHorizontal, X, Zap, Cpu } from "lucide-react";
import { fetchCategories, fetchProducts } from "../data/products";
import { Product } from "../types";
import ProductCard from "../components/ProductCard";
import ProductSlider from "../components/ProductSlider";
import ProductQuickView from "../components/ProductQuickView";
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

export default function ElectronicsPage() {
  const [PRODUCTS, setPRODUCTS] = useState<any[]>([]);
  const [CATEGORIES, setCATEGORIES] = useState<any[]>([]);
  useEffect(() => { fetchProducts().then(setPRODUCTS); fetchCategories().then(setCATEGORIES); }, []);
  const {
    wishlist,
    handleAddToCart,
    handleToggleWishlist,
    searchQuery,
    setSearchQuery,
  } = useShop();

  const [activeQuickView, setActiveQuickView] = useState<Product | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [brandFilter, setBrandFilter] = useState("all");
  const [priceBand, setPriceBand] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Focus only on electronics
  const allElectronics = useMemo(() => PRODUCTS.filter(p => p.category === "electronics"), [PRODUCTS]);
  
  const electronicsCategory = CATEGORIES.find(c => c.id === "electronics");
  const brands = useMemo(() => Array.from(new Set(allElectronics.map(p => p.brand).filter(Boolean))) as string[], [allElectronics]);
  const activePriceBand = priceBands.find((band) => band.id === priceBand) || priceBands[0];

  const featured = useMemo(() => allElectronics.filter(p => p.rating >= 4.7).slice(0, 8), [allElectronics]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 450);
    return () => clearTimeout(timer);
  }, [sortOption, searchQuery, brandFilter, priceBand, minRating, inStockOnly, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, brandFilter, priceBand, minRating, inStockOnly, sortOption]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...allElectronics];

        if (brandFilter !== "all") {
      result = result.filter((product) => product.brand === brandFilter);
    }

    result = result.filter((product) => product.price >= activePriceBand.min && product.price <= activePriceBand.max);

    if (minRating > 0) {
      result = result.filter((product) => product.rating >= minRating);
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
  }, [allElectronics, brandFilter, inStockOnly, minRating, priceBand, searchQuery, sortOption]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE));
  const currentProducts = filteredAndSortedProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const resetFilters = () => {
    setSearchQuery("");
    setBrandFilter("all");
    setPriceBand("all");
    setMinRating(0);
    setInStockOnly(false);
    setSortOption("default");
  };

  return (
    <div className="flex-1 w-full flex flex-col">
      {/* Electronics Hero Section */}
      <div className="bg-[#111214] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img 
            src={electronicsCategory?.image || "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2000"} 
            alt="Electronics" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111214] via-[#111214]/80 to-transparent" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-widest uppercase mb-6 backdrop-blur-md">
              <Cpu className="h-4 w-4" />
              Technology & Audio
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight mb-4">
              Premium Electronics
            </h1>
            <p className="text-lg text-zinc-400 leading-relaxed max-w-xl">
              {electronicsCategory?.description || "Audio, smart devices, and connected home technology curated for the modern lifestyle."}
            </p>
          </div>
        </div>
      </div>

      {/* Full Catalog with Filters */}
      <div className="pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex-1 w-full" id="electronics-catalog">
        <div className="mb-10">
          <h2 className="text-3xl font-serif font-bold tracking-tight uppercase text-white">All Electronics</h2>
          <p className="text-zinc-400 mt-2">Browse our complete collection of technology products.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:sticky lg:top-28 h-max rounded-2xl border border-white/5 bg-[#1E1F22] p-5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-white">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </div>
              <button onClick={resetFilters} className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
                Reset
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Brand</label>
                <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)} className="w-full rounded-xl border border-white/5 bg-[#2B2D31] text-white px-3 py-3 text-xs uppercase tracking-wider outline-none focus:border-indigo-500 transition-colors">
                  <option value="all">All Brands</option>
                  {brands.map((brand) => <option key={brand} value={brand}>{brand}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">RAM</label>
                <select className="w-full rounded-xl border border-white/5 bg-[#2B2D31] text-white px-3 py-3 text-xs uppercase tracking-wider outline-none focus:border-indigo-500 transition-colors"><option>All RAM</option></select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Storage</label>
                <select className="w-full rounded-xl border border-white/5 bg-[#2B2D31] text-white px-3 py-3 text-xs uppercase tracking-wider outline-none focus:border-indigo-500 transition-colors"><option>All Storage</option></select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Processor</label>
                <select className="w-full rounded-xl border border-white/5 bg-[#2B2D31] text-white px-3 py-3 text-xs uppercase tracking-wider outline-none focus:border-indigo-500 transition-colors"><option>All Processors</option></select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Display</label>
                <select className="w-full rounded-xl border border-white/5 bg-[#2B2D31] text-white px-3 py-3 text-xs uppercase tracking-wider outline-none focus:border-indigo-500 transition-colors"><option>All Displays</option></select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Battery</label>
                <select className="w-full rounded-xl border border-white/5 bg-[#2B2D31] text-white px-3 py-3 text-xs uppercase tracking-wider outline-none focus:border-indigo-500 transition-colors"><option>All Batteries</option></select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Price</label>
                <div className="grid grid-cols-1 gap-2">
                  {priceBands.map((band) => (
                    <button
                      key={band.id}
                      onClick={() => setPriceBand(band.id)}
                      className={`rounded-xl border px-3 py-2.5 text-left text-xs transition-all ${
                        priceBand === band.id ? "border-indigo-500 bg-indigo-500 text-white shadow-md" : "border-white/5 bg-[#2B2D31] text-zinc-400 hover:border-white/30 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {band.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <section>
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center bg-[#1E1F22] p-4 rounded-2xl mb-8 gap-4 border border-white/5 shadow-sm">
              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 font-medium">
                <Grid3X3 className="h-4 w-4" />
                <span className="uppercase tracking-widest">{filteredAndSortedProducts.length} products</span>
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#2B2D31] border border-white/5 px-3 py-1.5 text-zinc-300">
                    Search: &quot;{searchQuery}&quot;
                    <button onClick={() => setSearchQuery("")} aria-label="Clear search" className="hover:text-red-500 transition-colors"><X className="h-3.5 w-3.5" /></button>
                  </span>
                )}
              </div>

              <div className="relative flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-zinc-500" />
                <select value={sortOption} onChange={(e) => setSortOption(e.target.value as SortOption)} className="rounded-xl border border-white/5 bg-[#2B2D31] text-white px-4 py-2.5 text-xs uppercase tracking-wider font-medium outline-none focus:border-indigo-500 transition-colors">
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
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse flex flex-col gap-4">
                    <div className="bg-[#2B2D31] rounded-2xl aspect-[4/5] w-full" />
                    <div className="h-4 bg-[#2B2D31] w-3/4 rounded" />
                    <div className="h-4 bg-[#2B2D31] w-1/4 rounded" />
                  </div>
                ))}
              </div>
            ) : currentProducts.length === 0 ? (
              <div className="text-center py-20 rounded-2xl border border-white/5 bg-[#1E1F22] flex flex-col items-center justify-center">
                <div className="bg-[#2B2D31] p-4 rounded-full shadow-sm mb-4">
                  <RefreshCw className="h-8 w-8 text-zinc-500" />
                </div>
                <h3 className="text-lg font-serif font-bold text-white mb-2">No products found</h3>
                <p className="text-zinc-400 mb-6 max-w-sm">We couldn't find any electronics matching your current search and filter selections.</p>
                <button onClick={resetFilters} className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white rounded-xl text-xs uppercase tracking-widest font-semibold hover:bg-indigo-600 transition-colors">
                  Clear all filters
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
                        onOpenQuickView={setActiveQuickView}
                        isWishlisted={wishlist.some((item) => item.id === product.id)}
                        onToggleWishlist={handleToggleWishlist}
                      />
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-16 pt-8 border-t border-white/5">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setCurrentPage(i + 1);
                          const catalog = document.getElementById("electronics-catalog");
                          if (catalog) {
                            const yOffset = -80;
                            const y = catalog.getBoundingClientRect().top + window.scrollY + yOffset;
                            window.scrollTo({ top: y, behavior: 'smooth' });
                          }
                        }}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold transition-all ${
                          currentPage === i + 1 ? "bg-indigo-500 text-white shadow-md scale-105" : "bg-[#2B2D31] border border-white/5 text-zinc-400 hover:border-white/30 hover:text-white hover:bg-white/5"
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

      {/* Local Modal for Quick View */}
      <ProductQuickView
        product={activeQuickView}
        onClose={() => setActiveQuickView(null)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}


