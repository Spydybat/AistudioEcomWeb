import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { SlidersHorizontal, Grid3X3, ArrowUpDown, RefreshCw, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useShop } from "../context/ShopContext";
import { CATEGORIES, PRODUCTS } from "../data/products";
import ProductCard from "../components/ProductCard";

export default function ProductsPage() {
  const { 
    wishlist, 
    handleAddToCart, 
    handleToggleWishlist,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory
  } = useShop();

  const [sortOption, setSortOption] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const ITEMS_PER_PAGE = 8;

  // Simulate loading skeleton
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [selectedCategory, sortOption, searchQuery, currentPage]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...PRODUCTS];
    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
      );
    }
    if (sortOption === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sortOption === "price-desc") result.sort((a, b) => b.price - a.price);
    if (sortOption === "rating") result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [selectedCategory, searchQuery, sortOption]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);
  const currentProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="pt-8 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex-1 w-full">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-neutral-900 uppercase">
          The Collection
        </h1>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-neutral-50 p-4 rounded-xl mb-8 gap-4">
        {searchQuery && (
          <div className="w-full md:w-auto flex items-center gap-2 px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs">
            <span className="text-neutral-500">Search:</span>
            <span className="font-medium text-neutral-900">&quot;{searchQuery}&quot;</span>
            <button
              onClick={() => setSearchQuery("")}
              className="text-neutral-400 hover:text-neutral-900 cursor-pointer"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.id); setCurrentPage(1); }}
              className={`px-4 py-2 text-xs tracking-wider uppercase whitespace-nowrap rounded-lg ${
                selectedCategory === cat.id ? "bg-black text-white" : "bg-white text-neutral-600 border border-neutral-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="px-4 py-2 text-xs uppercase bg-white border border-neutral-200 rounded-lg w-full md:w-auto"
          >
            <option value="default">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse flex flex-col gap-4">
              <div className="bg-neutral-200 rounded-2xl aspect-[3/4] w-full" />
              <div className="h-4 bg-neutral-200 w-3/4 rounded" />
              <div className="h-4 bg-neutral-200 w-1/4 rounded" />
            </div>
          ))}
        </div>
      ) : currentProducts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-neutral-500 mb-4">No products match your search or filter.</p>
          <button
            onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
            className="text-xs uppercase tracking-widest text-neutral-900 underline hover:no-underline cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-16">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrentPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    currentPage === i + 1 ? "bg-black text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
