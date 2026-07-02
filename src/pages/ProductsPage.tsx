import { useEffect, useMemo, useState } from "react";
import { ArrowUpDown, Grid3X3, RefreshCw, SlidersHorizontal, X, Zap } from "lucide-react";
import { fetchCategories, fetchProducts, getCategoryName } from "../data/products";
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

  const [PRODUCTS, setPRODUCTS] = useState<any[]>([]);
  const [CATEGORIES, setCATEGORIES] = useState<any[]>([]);
  
  useEffect(() => {
    fetchProducts().then(setPRODUCTS);
    fetchCategories().then(setCATEGORIES);
  }, []);

  const [sortOption, setSortOption] = useState<SortOption>("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [brandFilter, setBrandFilter] = useState("all");
  const [priceBand, setPriceBand] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [dealsOnly, setDealsOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);

  const brands = useMemo(() => Array.from(new Set(PRODUCTS.map((product) => product.brand).filter(Boolean))) as string[], [PRODUCTS]);
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
  }, [PRODUCTS, activePriceBand.max, activePriceBand.min, brandFilter, dealsOnly, inStockOnly, minRating, priceBand, searchQuery, selectedCategory, sortOption]);

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
      <div className="mb-10 rounded-3xl bg-zinc-50 text-black border border-zinc-200 overflow-hidden shadow-sm">
        <div className="grid lg:grid-cols-[1fr_0.7fr]">
          <div className="p-8 sm:p-10 lg:p-12">
            <p className="text-[10px] font-sans font-bold tracking-[0.4em] uppercase text-zinc-500 mb-4">Marketplace Catalog</p>
            <h1 className="text-4xl sm:text-5xl font-sans font-bold tracking-tight uppercase">
              {activeCategory?.name || "All Departments"}
            </h1>
            <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-zinc-600">
              {activeCategory?.description || "Browse fashion, electronics, home, grocery, sports, accessories, and more with professional filters and curated marketplace merchandising."}
            </p>
          </div>
          <div className="relative min-h-56 hidden lg:block">
            <img
              src={activeCategory?.image || CATEGORIES[0]?.image || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2000'}
              alt={activeCategory?.name || "All departments"}
              className="absolute inset-0 h-full w-full object-cover opacity-90"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-50 to-transparent" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        <aside className="lg:sticky lg:top-28 h-max rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-black">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </div>
            <button onClick={resetFilters} className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-black transition-colors cursor-pointer">
              Reset
            </button>
          </div>

          <div className="space-y-6">


            {(selectedCategory === "all" || selectedCategory === "gaming" || selectedCategory === "electronics" || selectedCategory === "fashion" || selectedCategory === "beauty" || selectedCategory === "home-and-kitchen" || selectedCategory === "computers" || selectedCategory === "mobiles") && (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Brand</label>
                <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 text-black px-4 py-3 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-black shadow-sm cursor-pointer hover:bg-zinc-100 transition-colors">
                  <option value="all">All Brands</option>
                  {brands.map((brand) => <option key={brand} value={brand}>{brand}</option>)}
                </select>
              </div>
            )}

                        {selectedCategory === "gaming" && (
              <>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Platform</label>
                  <select className="w-full rounded-xl border border-zinc-200 bg-zinc-50 text-black px-4 py-3 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-black shadow-sm cursor-pointer hover:bg-zinc-100 transition-colors"><option>All Platforms</option></select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Genre</label>
                  <select className="w-full rounded-xl border border-zinc-200 bg-zinc-50 text-black px-4 py-3 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-black shadow-sm cursor-pointer hover:bg-zinc-100 transition-colors"><option>All Genres</option></select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Age Rating</label>
                  <select className="w-full rounded-xl border border-zinc-200 bg-zinc-50 text-black px-4 py-3 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-black shadow-sm cursor-pointer hover:bg-zinc-100 transition-colors"><option>Any Age Rating</option></select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Multiplayer</label>
                  <select className="w-full rounded-xl border border-zinc-200 bg-zinc-50 text-black px-4 py-3 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-black shadow-sm cursor-pointer hover:bg-zinc-100 transition-colors"><option>Any Multiplayer</option></select>
                </div>
              </>
            )}

                        {selectedCategory === "fashion" && (
              <>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Size</label>
                  <select className="w-full rounded-xl border border-zinc-200 bg-zinc-50 text-black px-4 py-3 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-black shadow-sm cursor-pointer hover:bg-zinc-100 transition-colors"><option>All Sizes</option></select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Color</label>
                  <select className="w-full rounded-xl border border-zinc-200 bg-zinc-50 text-black px-4 py-3 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-black shadow-sm cursor-pointer hover:bg-zinc-100 transition-colors"><option>All Colors</option></select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Material</label>
                  <select className="w-full rounded-xl border border-zinc-200 bg-zinc-50 text-black px-4 py-3 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-black shadow-sm cursor-pointer hover:bg-zinc-100 transition-colors"><option>All Materials</option></select>
                </div>
              </>
            )}
            {selectedCategory === "electronics" && (
              <>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">RAM</label>
                  <select className="w-full rounded-xl border border-zinc-200 bg-zinc-50 text-black px-4 py-3 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-black shadow-sm cursor-pointer hover:bg-zinc-100 transition-colors"><option>All RAM</option></select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Storage</label>
                  <select className="w-full rounded-xl border border-zinc-200 bg-zinc-50 text-black px-4 py-3 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-black shadow-sm cursor-pointer hover:bg-zinc-100 transition-colors"><option>All Storage</option></select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Processor</label>
                  <select className="w-full rounded-xl border border-zinc-200 bg-zinc-50 text-black px-4 py-3 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-black shadow-sm cursor-pointer hover:bg-zinc-100 transition-colors"><option>All Processors</option></select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Display</label>
                  <select className="w-full rounded-xl border border-zinc-200 bg-zinc-50 text-black px-4 py-3 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-black shadow-sm cursor-pointer hover:bg-zinc-100 transition-colors"><option>All Displays</option></select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Battery</label>
                  <select className="w-full rounded-xl border border-zinc-200 bg-zinc-50 text-black px-4 py-3 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-black shadow-sm cursor-pointer hover:bg-zinc-100 transition-colors"><option>All Batteries</option></select>
                </div>
              </>
            )}
            {selectedCategory === "computers" && (
              <>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Processor</label>
                  <select className="w-full rounded-xl border border-zinc-200 bg-zinc-50 text-black px-4 py-3 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-black shadow-sm cursor-pointer hover:bg-zinc-100 transition-colors"><option>All Processors</option></select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">RAM</label>
                  <select className="w-full rounded-xl border border-zinc-200 bg-zinc-50 text-black px-4 py-3 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-black shadow-sm cursor-pointer hover:bg-zinc-100 transition-colors"><option>All RAM</option></select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Storage</label>
                  <select className="w-full rounded-xl border border-zinc-200 bg-zinc-50 text-black px-4 py-3 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-black shadow-sm cursor-pointer hover:bg-zinc-100 transition-colors"><option>All Storage</option></select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Graphics</label>
                  <select className="w-full rounded-xl border border-zinc-200 bg-zinc-50 text-black px-4 py-3 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-black shadow-sm cursor-pointer hover:bg-zinc-100 transition-colors"><option>All Graphics</option></select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Display Size</label>
                  <select className="w-full rounded-xl border border-zinc-200 bg-zinc-50 text-black px-4 py-3 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-black shadow-sm cursor-pointer hover:bg-zinc-100 transition-colors"><option>All Display Sizes</option></select>
                </div>
              </>
            )}
            {selectedCategory === "mobiles" && (
              <>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">RAM</label>
                  <select className="w-full rounded-xl border border-zinc-200 bg-zinc-50 text-black px-4 py-3 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-black shadow-sm cursor-pointer hover:bg-zinc-100 transition-colors"><option>All RAM</option></select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Storage</label>
                  <select className="w-full rounded-xl border border-zinc-200 bg-zinc-50 text-black px-4 py-3 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-black shadow-sm cursor-pointer hover:bg-zinc-100 transition-colors"><option>All Storage</option></select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Camera</label>
                  <select className="w-full rounded-xl border border-zinc-200 bg-zinc-50 text-black px-4 py-3 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-black shadow-sm cursor-pointer hover:bg-zinc-100 transition-colors"><option>All Cameras</option></select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Battery</label>
                  <select className="w-full rounded-xl border border-zinc-200 bg-zinc-50 text-black px-4 py-3 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-black shadow-sm cursor-pointer hover:bg-zinc-100 transition-colors"><option>All Batteries</option></select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Display</label>
                  <select className="w-full rounded-xl border border-zinc-200 bg-zinc-50 text-black px-4 py-3 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-black shadow-sm cursor-pointer hover:bg-zinc-100 transition-colors"><option>All Displays</option></select>
                </div>
              </>
            )}

            {selectedCategory === "beauty" && (
              <>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Skin Type</label>
                  <select className="w-full rounded-xl border border-zinc-200 bg-zinc-50 text-black px-4 py-3 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-black shadow-sm cursor-pointer hover:bg-zinc-100 transition-colors"><option>All Skin Types</option></select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Product Type</label>
                  <select className="w-full rounded-xl border border-zinc-200 bg-zinc-50 text-black px-4 py-3 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-black shadow-sm cursor-pointer hover:bg-zinc-100 transition-colors"><option>All Product Types</option></select>
                </div>
              </>
            )}

            {selectedCategory === "home-and-kitchen" && (
              <>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Material</label>
                  <select className="w-full rounded-xl border border-zinc-200 bg-zinc-50 text-black px-4 py-3 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-black shadow-sm cursor-pointer hover:bg-zinc-100 transition-colors"><option>All Materials</option></select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Color</label>
                  <select className="w-full rounded-xl border border-zinc-200 bg-zinc-50 text-black px-4 py-3 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-black shadow-sm cursor-pointer hover:bg-zinc-100 transition-colors"><option>All Colors</option></select>
                </div>
              </>
            )}

            {selectedCategory === "books" && (
              <>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Genre</label>
                  <select className="w-full rounded-xl border border-zinc-200 bg-zinc-50 text-black px-4 py-3 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-black shadow-sm cursor-pointer hover:bg-zinc-100 transition-colors"><option>All Genres</option></select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Author</label>
                  <select className="w-full rounded-xl border border-zinc-200 bg-zinc-50 text-black px-4 py-3 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-black shadow-sm cursor-pointer hover:bg-zinc-100 transition-colors"><option>All Authors</option></select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Language</label>
                  <select className="w-full rounded-xl border border-zinc-200 bg-zinc-50 text-black px-4 py-3 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-black shadow-sm cursor-pointer hover:bg-zinc-100 transition-colors"><option>All Languages</option></select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Publisher</label>
                  <select className="w-full rounded-xl border border-zinc-200 bg-zinc-50 text-black px-4 py-3 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-black shadow-sm cursor-pointer hover:bg-zinc-100 transition-colors"><option>All Publishers</option></select>
                </div>
              </>
            )}

            {(selectedCategory === "all" || selectedCategory === "gaming" || selectedCategory === "electronics" || selectedCategory === "fashion" || selectedCategory === "beauty" || selectedCategory === "home-and-kitchen" || selectedCategory === "computers" || selectedCategory === "mobiles") && (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Price</label>
                <div className="grid grid-cols-1 gap-2">
                  {priceBands.map((band) => (
                    <button
                      key={band.id}
                      onClick={() => setPriceBand(band.id)}
                      className={`rounded-xl border px-4 py-3 text-left text-xs font-bold transition-all shadow-sm cursor-pointer ${
                        priceBand === band.id ? "border-black bg-black text-white" : "border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-zinc-400 hover:text-black"
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
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Rating</label>
                <input type="range" min="0" max="5" step="0.5" value={minRating} onChange={(e) => setMinRating(Number(e.target.value))} className="w-full accent-black cursor-pointer" />
                <div className="mt-1 text-[10px] font-bold tracking-widest uppercase text-zinc-500">{minRating > 0 ? `${minRating}+ stars` : "Any rating"}</div>
              </div>
            )}

            {(selectedCategory === "all" || selectedCategory === "gaming" || selectedCategory === "computers" || selectedCategory === "mobiles" || selectedCategory === "fashion" || selectedCategory === "electronics") && (
              <label className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-xs font-bold uppercase tracking-widest text-black shadow-sm cursor-pointer hover:bg-zinc-100 transition-colors">
                <span>{(selectedCategory === "gaming" || selectedCategory === "computers" || selectedCategory === "mobiles") ? "Availability" : "In stock only"}</span>
                <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="accent-black w-4 h-4 cursor-pointer" />
              </label>
            )}

            {selectedCategory === "all" && (
              <label className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-xs font-bold uppercase tracking-widest text-black shadow-sm cursor-pointer hover:bg-zinc-100 transition-colors">
                <span className="flex items-center gap-2"><Zap className="h-4 w-4 text-emerald-500" /> Flash deals</span>
                <input type="checkbox" checked={dealsOnly} onChange={(e) => setDealsOnly(e.target.checked)} className="accent-black w-4 h-4 cursor-pointer" />
              </label>
            )}
          </div>
        </aside>

        <section>
          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center bg-white p-4 rounded-3xl mb-8 gap-4 border border-zinc-200 shadow-sm">
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-zinc-600 pl-2">
              <Grid3X3 className="h-4 w-4" />
              <span className="uppercase tracking-widest">{filteredAndSortedProducts.length} products</span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 border border-zinc-200 px-3 py-1.5 text-black">
                  Search: &quot;{searchQuery}&quot;
                  <button onClick={() => setSearchQuery("")} aria-label="Clear search" className="hover:text-rose-500 transition-colors cursor-pointer"><X className="h-3.5 w-3.5" /></button>
                </span>
              )}
              {selectedCategory !== "all" && (
                <span className="rounded-full bg-zinc-100 border border-zinc-200 px-3 py-1.5 text-black uppercase tracking-widest">{getCategoryName(selectedCategory)}</span>
              )}
            </div>

            <div className="relative flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-zinc-400 absolute left-4 z-10 pointer-events-none" />
              <select value={sortOption} onChange={(e) => setSortOption(e.target.value as SortOption)} className="rounded-full border border-zinc-200 bg-zinc-50 text-black pl-10 pr-4 py-3 text-[10px] font-bold uppercase tracking-wider focus:outline-none focus:border-black cursor-pointer hover:bg-zinc-100 transition-colors appearance-none">
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
                  <div className="bg-zinc-100 rounded-3xl aspect-[3/4] w-full" />
                  <div className="h-4 bg-zinc-100 w-3/4 rounded-full" />
                  <div className="h-4 bg-zinc-100 w-1/4 rounded-full" />
                </div>
              ))}
            </div>
          ) : currentProducts.length === 0 ? (
            <div className="text-center py-16 rounded-3xl border border-zinc-200 bg-white shadow-sm">
              <p className="text-zinc-500 font-bold mb-4">No products match your search or filters.</p>
              <button onClick={resetFilters} className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black underline hover:text-zinc-600 hover:no-underline cursor-pointer">
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
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors cursor-pointer shadow-sm ${
                        currentPage === i + 1 ? "bg-black text-white" : "bg-white text-zinc-500 border border-zinc-200 hover:border-black hover:text-black"
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



