import { useState } from "react";
import { GitCompare, Heart, ShoppingBag, Eye, Star, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Product, ProductColor } from "../types";
import { motion } from "motion/react";
import { useCurrency } from "../context/CurrencyContext";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, selectedSize: string, selectedColor: ProductColor) => void;
  onOpenQuickView: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
  onOpenQuickView,
  isWishlisted,
  onToggleWishlist,
}: ProductCardProps) {
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product?.colors?.[0] ?? { name: "Default", hex: "#000" });
  const [selectedSize, setSelectedSize] = useState<string>(product?.sizes?.[1] ?? product?.sizes?.[0] ?? "Default");
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  const variantLabel = product.variants?.[0]?.label || (product.category === "fashion" ? "Size" : "Option");
  const categoryLabel = product.department || product.category;

  const handleQuickAdd = () => {
    setIsAdding(true);
    setTimeout(() => {
      onAddToCart(product, selectedSize, selectedColor);
      setIsAdding(false);
    }, 600);
  };

  return (
    <div
      className="group flex flex-col h-full bg-[#313338] rounded-2xl border border-white/5 p-3 sm:p-4 relative transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] hover:-translate-y-1 hover:border-white/10 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      {/* Visual Badge overlay */}
      {(product.badge || product.isFlashDeal) && (
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
          <span className="px-2.5 py-1 bg-indigo-500/90 text-white text-[10px] font-mono tracking-widest uppercase rounded inline-flex items-center gap-1">
            {product.isFlashDeal && <Zap className="h-3 w-3 fill-current" />}
            {product.badge || "Limited Deal"}
          </span>
          {discountPercent > 0 && (
            <span className="w-max px-2.5 py-1 bg-rose-500 text-white text-[10px] font-mono tracking-widest uppercase rounded">
              Save {discountPercent}%
            </span>
          )}
        </div>
      )}

      {/* Wishlist Heart Toggle */}
      <button
        onClick={() => onToggleWishlist(product)}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[#1E1F22]/85 hover:bg-[#1E1F22] text-zinc-400 hover:text-rose-400 shadow-sm transition-all hover:scale-105 cursor-pointer"
        title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          className={`h-4 w-4 ${
            isWishlisted ? "fill-rose-500 stroke-rose-500" : "stroke-current"
          }`}
        />
      </button>

      {/* Product Dual Image viewport with lazy Hover animation */}
      <div 
        onClick={() => navigate(`/product/${product.id}`)}
        className="relative aspect-[3/4] overflow-hidden bg-[#1E1F22] rounded-xl mb-5 cursor-pointer border border-white/5"
      >
        {/* Primary Image */}
        {(() => {
          const imageUrl = product?.images?.[0] ?? (product as any)?.image ?? null;
          return imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className={`w-full h-full object-cover object-center transition-all duration-700 ${
                isHovered && product?.images?.[1] ? "opacity-0 scale-102" : "opacity-100 scale-100"
              }`}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[#1E1F22] text-[10px] uppercase tracking-widest text-zinc-600 font-medium">
              No Image
            </div>
          );
        })()}

        {/* Hover/Detail Alternate Image */}
        {product?.images?.[1] && (
          <img
            src={product?.images?.[1]}
            alt={`${product.name} alternate view`}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ${
              isHovered ? "opacity-100 scale-100" : "opacity-0 scale-102"
            }`}
            referrerPolicy="no-referrer"
          />
        )}

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 backdrop-blur-[2px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenQuickView(product);
            }}
            className="px-6 py-2.5 glass-dark text-white hover:bg-indigo-500 font-medium tracking-widest text-xs uppercase transition-all duration-300 flex items-center gap-2 rounded-full shadow-[0_4px_12px_rgba(88,101,242,0.4)] hover:scale-105 cursor-pointer border-white/10"
            id={`quick-view-${product.id}`}
          >
            <Eye className="h-4 w-4" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Meta Core details */}
      <div className="flex-1 flex flex-col px-1">
        
        {/* Rating detail & Category */}
        <div className="flex items-center justify-between mb-1.5 text-xs uppercase font-mono tracking-widest text-zinc-400">
          <span>{categoryLabel}</span>
          <div className="flex items-center text-yellow-500/90 font-medium">
            <Star className="h-2.5 w-2.5 fill-current mr-0.5" />
            <span>{product.rating}</span>
          </div>
        </div>
        {product.brand && (
          <p className="text-xs uppercase tracking-widest text-zinc-300 mb-1">
            {product.brand}
          </p>
        )}

        {/* Product Title */}
        <h3 
          onClick={() => navigate(`/product/${product.id}`)}
          className="text-sm font-serif font-semibold text-zinc-100 hover:text-zinc-300 tracking-wide mb-1 select-text cursor-pointer line-clamp-1"
        >
          {product.name}
        </h3>

        {/* Price Tag with discount support */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-sans font-medium text-white">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs font-sans text-zinc-500 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-zinc-300">
          {product.shipping && <span className="rounded-full bg-white/5 px-2 py-1">{product.shipping}</span>}
          {typeof product.stock === "number" && product.stock <= 20 && (
            <span className="rounded-full bg-amber-500/10 px-2 py-1 text-amber-500">Only {product.stock} left</span>
          )}
        </div>

        {/* Swatch Color selection dots */}
        <div className="mb-3.5">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-1.5">
            Color: <span className="text-zinc-200 font-sans font-medium">{selectedColor.name}</span>
          </span>
          <div className="flex items-center gap-2">
            {product.colors.map((color) => {
              const isSelected = selectedColor.name === color.name;
              return (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color)}
                  className={`w-4 h-4 rounded-full border relative transition-transform hover:scale-110 flex items-center justify-center cursor-pointer`}
                  style={{ 
                    borderColor: isSelected ? "#FFFFFF" : "rgba(255,255,255,0.1)",
                    borderWidth: isSelected ? "1.5px" : "1px"
                  }}
                  title={color.name}
                >
                  <span 
                    className="w-2.5 h-2.5 rounded-full block border border-black/10" 
                    style={{ backgroundColor: color.hex }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Size Selection Grid */}
        <div className="mb-4">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-1.5">
            {variantLabel}: <span className="text-zinc-200 font-sans font-medium">{selectedSize}</span>
          </span>
          <div className="flex flex-wrap gap-1">
            {product.sizes.map((size) => {
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`text-[10px]/none font-sans font-medium border px-2.5 py-1.5 transition-all rounded-md select-none cursor-pointer ${
                    isSelected
                      ? "bg-indigo-500 text-white border-indigo-500 shadow-sm"
                      : "bg-transparent text-zinc-300 border-white/10 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Primary Action Button: Add to Bag */}
        <div className="mt-auto pt-4">
          <button
            onClick={handleQuickAdd}
            disabled={isAdding}
            className={`w-full py-3 text-xs font-semibold tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 rounded-xl cursor-pointer ${
              isAdding
                ? "bg-[#1E1F22] text-zinc-400 cursor-not-allowed"
                : "bg-indigo-500 text-white hover:bg-indigo-600 hover:shadow-[0_4px_12px_rgba(88,101,242,0.4)] hover:-translate-y-0.5"
            }`}
            id={`add-to-bag-${product.id}`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>{isAdding ? "Adding..." : "Add To Cart"}</span>
          </button>
          <button
            onClick={() => navigate(`/product/${product.id}`)}
            className="mt-2 w-full py-2.5 text-xs font-semibold tracking-widest uppercase flex items-center justify-center gap-2 rounded-xl border border-white/10 text-zinc-300 hover:border-white/30 hover:text-white transition-all cursor-pointer"
          >
            <GitCompare className="h-3.5 w-3.5" />
            Compare Details
          </button>
        </div>

      </div>
    </div>
  );
}
