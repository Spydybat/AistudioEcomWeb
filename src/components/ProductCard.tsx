import { useState } from "react";
import { Heart, ShoppingBag, Eye, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Product, ProductColor } from "../types";
import { motion } from "motion/react";

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
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[1] || product.sizes[0]);
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate();

  const handleQuickAdd = () => {
    setIsAdding(true);
    setTimeout(() => {
      onAddToCart(product, selectedSize, selectedColor);
      setIsAdding(false);
    }, 600);
  };

  return (
    <div
      className="group flex flex-col h-full bg-white rounded-2xl border border-neutral-100 p-3 sm:p-4 relative transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1 hover:border-neutral-200 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      {/* Visual Badge overlay */}
      {product.badge && (
        <span className="absolute top-4 left-4 z-10 px-2.5 py-1 bg-neutral-900/90 text-white text-[9px] font-mono tracking-widest uppercase rounded">
          {product.badge}
        </span>
      )}

      {/* Wishlist Heart Toggle */}
      <button
        onClick={() => onToggleWishlist(product)}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/85 hover:bg-white text-neutral-600 hover:text-red-500 shadow-sm transition-all hover:scale-105 cursor-pointer"
        title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          className={`h-4 w-4 ${
            isWishlisted ? "fill-red-500 stroke-red-500" : "stroke-current"
          }`}
        />
      </button>

      {/* Product Dual Image viewport with lazy Hover animation */}
      <div 
        onClick={() => navigate(`/product/${product.id}`)}
        className="relative aspect-[3/4] overflow-hidden bg-neutral-50 rounded-xl mb-5 cursor-pointer"
      >
        {/* Primary Image */}
        <img
          src={product.images[0]}
          alt={product.name}
          className={`w-full h-full object-cover object-center transition-all duration-700 ${
            isHovered && product.images[1] ? "opacity-0 scale-102" : "opacity-100 scale-100"
          }`}
          referrerPolicy="no-referrer"
        />

        {/* Hover/Detail Alternate Image */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${product.name} alternate view`}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ${
              isHovered ? "opacity-100 scale-100" : "opacity-0 scale-102"
            }`}
            referrerPolicy="no-referrer"
          />
        )}

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-neutral-950/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 backdrop-blur-[2px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenQuickView(product);
            }}
            className="px-6 py-2.5 glass-dark text-white hover:bg-white hover:text-black font-medium tracking-widest text-[10px] uppercase transition-all duration-300 flex items-center gap-2 rounded-full shadow-lg hover:scale-105 cursor-pointer"
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
        <div className="flex items-center justify-between mb-1.5 text-[10px] uppercase font-mono tracking-widest text-neutral-400">
          <span>{product.category}</span>
          <div className="flex items-center text-yellow-500/90 font-medium">
            <Star className="h-2.5 w-2.5 fill-current mr-0.5" />
            <span>{product.rating}</span>
          </div>
        </div>

        {/* Product Title */}
        <h3 
          onClick={() => navigate(`/product/${product.id}`)}
          className="text-sm font-serif font-semibold text-neutral-950 hover:text-neutral-700 tracking-wide mb-1 select-text cursor-pointer line-clamp-1"
        >
          {product.name}
        </h3>

        {/* Price Tag with discount support */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-sans font-medium text-neutral-900">
            ${product.price}.00
          </span>
          {product.originalPrice && (
            <span className="text-xs font-sans text-neutral-400 line-through">
              ${product.originalPrice}.00
            </span>
          )}
        </div>

        {/* Swatch Color selection dots */}
        <div className="mb-3.5">
          <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block mb-1.5">
            Color: <span className="text-neutral-700 font-sans font-medium">{selectedColor.name}</span>
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
                    borderColor: isSelected ? "#000000" : "#E5E5E5",
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
          <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block mb-1.5">
            Size: <span className="text-neutral-700 font-sans font-medium">{selectedSize}</span>
          </span>
          <div className="flex flex-wrap gap-1">
            {product.sizes.map((size) => {
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`text-[9.5px]/none font-sans font-medium border px-2.5 py-1.5 transition-all rounded-md select-none cursor-pointer ${
                    isSelected
                      ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
                      : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-900 hover:text-neutral-900"
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
            className={`w-full py-3 text-[10px] font-semibold tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 rounded-xl cursor-pointer ${
              isAdding
                ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                : "bg-neutral-900 text-white hover:bg-neutral-800 hover:shadow-lg hover:-translate-y-0.5"
            }`}
            id={`add-to-bag-${product.id}`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>{isAdding ? "Adding To Bag..." : "Add To Bag"}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
