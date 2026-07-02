import { useRef } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Product, ProductColor } from "../types";
import ProductCard from "./ProductCard";

interface ProductSliderProps {
  title: string;
  subtitle?: string;
  products: Product[];
  onAddToCart: (product: Product, selectedSize: string, selectedColor: ProductColor) => void;
  onOpenQuickView: (product: Product) => void;
  wishlist: Product[];
  onToggleWishlist: (product: Product) => void;
  bgWhite?: boolean;
}

export default function ProductSlider({
  title,
  subtitle,
  products,
  onAddToCart,
  onOpenQuickView,
  wishlist,
  onToggleWishlist,
  bgWhite = false,
}: ProductSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const slide = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!products.length) return null;

  return (
    <section className={`py-24 overflow-hidden ${bgWhite ? "bg-white" : "bg-zinc-50"}`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {subtitle && (
              <p className="text-[10px] font-sans font-bold tracking-widest uppercase text-zinc-500 mb-3">
                {subtitle}
              </p>
            )}
            <h2 className="text-3xl sm:text-4xl font-sans font-bold tracking-tight text-black uppercase">
              {title}
            </h2>
          </motion.div>
          
          {/* Navigation Arrows */}
          <div className="hidden sm:flex items-center gap-3">
            <button 
              onClick={() => slide("left")}
              className="p-4 rounded-full border border-zinc-200 bg-white hover:border-black hover:bg-zinc-50 transition-colors text-zinc-600 hover:text-black shadow-sm cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button 
              onClick={() => slide("right")}
              className="p-4 rounded-full border border-zinc-200 bg-white hover:border-black hover:bg-zinc-50 transition-colors text-zinc-600 hover:text-black shadow-sm cursor-pointer"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Slider Container */}
        <div 
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth"
        >
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="snap-start shrink-0 w-[85vw] sm:w-[350px] lg:w-[300px]"
            >
              <ProductCard
                product={product}
                onAddToCart={onAddToCart}
                onOpenQuickView={onOpenQuickView}
                isWishlisted={wishlist.some((item) => item.id === product.id)}
                onToggleWishlist={onToggleWishlist}
              />
            </motion.div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
