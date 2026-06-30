import { useState, useEffect } from "react";
import { X, Star, ShoppingBag, ShieldAlert, BadgeCheck, RotateCcw } from "lucide-react";
import { Product, ProductColor } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { useCurrency } from "../context/CurrencyContext";

interface ProductQuickViewProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, selectedSize: string, selectedColor: ProductColor) => void;
}

export default function ProductQuickView({
  product,
  onClose,
  onAddToCart,
}: ProductQuickViewProps) {
  const { formatPrice } = useCurrency();
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  // Synchronize state with product changes
  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0]);
      setSelectedSize(product.sizes[1] || product.sizes[0]);
      setActiveImageIdx(0);
    }
  }, [product]);

  if (!product || !selectedColor) return null;

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      onAddToCart(product, selectedSize, selectedColor);
      setIsAdding(false);
      onClose();
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#111214]"
        />

        {/* Modal Window Sheet */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl bg-[#1E1F22] border border-white/5 overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh] rounded-none"
        >
          {/* Close trigger button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#2B2D31]/80 hover:bg-[#2B2D31] text-zinc-300 transition-colors shadow-sm cursor-pointer"
            id="modal-close"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Left panel: Image gallery viewer */}
          <div className="w-full md:w-1/2 p-4 sm:p-6 bg-[#111214] flex flex-col justify-between border-r border-white/5 overflow-y-auto">
            
            {/* Main Visual Display */}
            <div className="aspect-[3/4] bg-[#111214] overflow-hidden mb-4 relative shadow-sm border border-white/5">
              <img
                src={product.images[activeImageIdx]}
                alt={product.name}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Thumbnail Selectors */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-2 gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative aspect-[3/4] overflow-hidden border bg-[#111214] cursor-pointer transition-all ${
                      activeImageIdx === idx ? "border-indigo-500 border-2" : "border-transparent hover:border-white/30"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} preview thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right panel: Information Summary */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between">
            <div>
              {/* Product category & social trust alignment */}
              <div className="flex items-center justify-between mb-3 text-xs uppercase font-mono tracking-[0.2em] text-zinc-400">
                <span>{product.category} COLLECTION</span>
                <div className="flex items-center text-yellow-500 font-medium">
                  <Star className="h-3 w-3 fill-current mr-1" />
                  <span>{product.rating}</span>
                  <span className="text-zinc-500 ml-1">({product.reviews} reviews)</span>
                </div>
              </div>

              {/* Title Header */}
              <h2 className="text-xl sm:text-2xl font-serif font-semibold text-white uppercase tracking-wide leading-tight mb-2 selection:bg-indigo-500/30">
                {product.name}
              </h2>

              {/* Price Details */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-lg font-sans font-medium text-white">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-sm font-sans text-zinc-500 line-through">{formatPrice(product.originalPrice)}</span>
                )}
              </div>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Colors selection list */}
              <div className="mb-5">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest block mb-2">
                  Color Spec: <span className="text-zinc-200 font-sans font-medium">{selectedColor.name}</span>
                </span>
                <div className="flex items-center gap-2">
                  {product.colors.map((color) => {
                    const isSelected = selectedColor.name === color.name;
                    return (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        className={`w-5 h-5 rounded-full border relative transition-transform hover:scale-110 flex items-center justify-center cursor-pointer`}
                        style={{ 
                          borderColor: isSelected ? "#ffffff" : "rgba(255,255,255,0.1)",
                          borderWidth: isSelected ? "1.5px" : "1px"
                        }}
                        title={color.name}
                      >
                        <span 
                          className="w-3.5 h-3.5 rounded-full block border border-black/10" 
                          style={{ backgroundColor: color.hex }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sizes selection list */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
                    Select Size: <span className="text-zinc-200 font-sans font-medium">{selectedSize}</span>
                  </span>
                  <button className="text-xs text-zinc-400 uppercase font-mono tracking-widest border-b border-transparent hover:border-zinc-400">
                    Sizing Ledger
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`text-xs font-sans font-medium border px-3 py-2 transition-all cursor-pointer rounded-lg ${
                          isSelected
                            ? "bg-indigo-500 text-white border-indigo-500"
                            : "bg-[#2B2D31] text-zinc-400 border-white/5 hover:border-white/30 hover:text-white"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Technical features / bullet logs */}
              <div className="border-t border-white/5 py-5 space-y-3 bg-[#111214] px-4 mb-6 rounded-xl">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest block">
                  Garment Blueprint & Sourcing
                </span>
                <ul className="space-y-2">
                  {product.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start text-xs text-zinc-300 font-light leading-normal">
                      <BadgeCheck className="h-3.5 w-3.5 text-zinc-400 mr-2 shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Direct Add Actions Container */}
            <div className="border-t border-white/5 pt-5 mt-auto">
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className={`flex-1 py-4 text-xs font-mono tracking-widest uppercase flex items-center justify-center gap-2.5 transition-all duration-300 border cursor-pointer rounded-xl ${
                    isAdding
                      ? "bg-[#2B2D31] text-zinc-300 border-white/5 cursor-not-allowed"
                      : "bg-indigo-500 text-white border-indigo-500 hover:bg-indigo-600 hover:shadow-[0_4px_14px_rgba(88,101,242,0.4)]"
                  }`}
                  id="modal-add-to-cart"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>{isAdding ? "Dispatching To Bag..." : `Add To Bag Box • $${product.price}`}</span>
                </button>
              </div>

              {/* Reassurances footnotes */}
              <div className="flex justify-around items-center mt-4 text-xs text-zinc-400 uppercase tracking-wider font-mono">
                <div className="flex items-center gap-1.5">
                  <RotateCcw className="h-3.5 w-3.5 text-zinc-400" />
                  <span>30-Day Returns</span>
                </div>
                <span className="text-zinc-300">|</span>
                <span className="text-zinc-400">GOTS Ethical Cotton</span>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
