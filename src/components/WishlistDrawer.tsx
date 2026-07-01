import { Link } from "react-router-dom";
import { X, Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { Product, ProductColor } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { useCurrency } from "../context/CurrencyContext";

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onAddToCartFromWishlist: (product: Product, size: string, color: ProductColor) => void;
  onOpenQuickView: (product: Product) => void;
}

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onAddToCartFromWishlist,
  onOpenQuickView
}: WishlistDrawerProps) {
  const { formatPrice } = useCurrency();
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black"
          />

          {/* Slider Drawer Canvas */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
            className="relative w-full max-w-md bg-[#2B2D31] h-full shadow-[0_16px_40px_rgba(0,0,0,0.5)] z-10 flex flex-col"
          >
            {/* Drawer Header */}
            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-100">
                <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                <h2 className="font-serif font-semibold text-base uppercase tracking-wider">
                  Your Wishlist Closet ({wishlist.length})
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 px-2 hover:bg-white/5 rounded text-zinc-400 hover:text-white cursor-pointer transition-colors"
                id="wishlist-drawer-close"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <Link
              to="/wishlist"
              onClick={onClose}
              className="px-6 pb-3 text-[10px] font-mono uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
            >
              View full wishlist page →
            </Link>

            {/* List items core */}
            <div className="flex-grow overflow-y-auto px-6 py-4">
              {wishlist.length === 0 ? (
                /* Empty state warning */
                <div className="h-full flex flex-col justify-center items-center text-center p-8 space-y-5">
                  <div className="w-14 h-14 bg-[#313338] rounded-full flex items-center justify-center text-zinc-500">
                    <Heart className="h-6 w-6" />
                  </div>
                  <h3 className="text-sm font-medium text-white tracking-wider uppercase">
                    Your Closet is Empty
                  </h3>
                  <p className="text-xs text-zinc-400 font-light max-w-sm">
                    Tap the heart icon on any product in our winter and tailoring collections to save them here for later.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-3.5 bg-indigo-500 text-white hover:bg-indigo-600 text-xs font-mono tracking-widest uppercase transition-colors rounded-xl shadow-[0_4px_12px_rgba(88,101,242,0.4)]"
                  >
                    Examine Collections
                  </button>
                </div>
              ) : (
                /* Active list */
                <div className="space-y-4">
                  {wishlist.map((product) => {
                    const defaultSize = product?.sizes?.[1] ?? product?.sizes?.[0] ?? "Default";
                    const defaultColor = product?.colors?.[0] ?? { name: "Default", hex: "#000" };

                    return (
                      <div
                        key={product.id}
                        className="flex gap-4 py-3.5 border-b border-white/5 last:border-0"
                      >
                        {/* Thumbnail */}
                        <div 
                          onClick={() => {
                            onOpenQuickView(product);
                            onClose();
                          }}
                          className="w-20 h-24 bg-[#1E1F22] overflow-hidden relative border border-white/5 shrink-0 cursor-pointer hover:opacity-90 transition-opacity rounded-lg"
                        >
                          <img
                            src={product?.images?.[0] ?? ""}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Summary Content details */}
                        <div className="flex-grow flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <h4 
                                onClick={() => {
                                  onOpenQuickView(product);
                                  onClose();
                                }}
                                className="text-xs sm:text-sm font-serif font-medium text-white tracking-wide line-clamp-1 cursor-pointer hover:text-zinc-300"
                              >
                                {product.name}
                              </h4>
                              <button
                                onClick={() => onRemoveFromWishlist(product)}
                                className="text-zinc-500 hover:text-rose-400 p-1 rounded cursor-pointer transition-colors"
                                title="Remove from wishlist"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                            <span className="text-xs text-white font-sans font-medium block mt-1.5">
                              {formatPrice(product.price)}
                            </span>
                          </div>

                          {/* Quick Purchase block */}
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => {
                                onAddToCartFromWishlist(product, defaultSize, defaultColor);
                                onRemoveFromWishlist(product);
                              }}
                              className="flex-grow py-2 px-3 bg-indigo-500 hover:bg-indigo-600 text-white text-[9px] tracking-widest uppercase font-mono transition-colors flex items-center justify-center gap-1.5 cursor-pointer rounded-lg shadow-sm"
                            >
                              <ShoppingBag className="h-3 w-3" />
                              <span>Move To Bag</span>
                            </button>
                            <button
                              onClick={() => {
                                onOpenQuickView(product);
                                onClose();
                              }}
                              className="py-2 px-3 border border-white/10 hover:border-white/30 text-[9px] tracking-widest uppercase font-mono transition-all text-zinc-400 hover:text-white cursor-pointer rounded-lg bg-[#313338]"
                            >
                              Specs
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Close action bottom bar */}
            {wishlist.length > 0 && (
              <div className="p-6 bg-[#1E1F22] border-t border-white/5">
                <button
                  onClick={onClose}
                  className="w-full py-4 border border-white/10 text-white font-mono text-[10px] tracking-widest uppercase transition-colors hover:bg-white/5 hover:text-white flex items-center justify-center gap-2 rounded-xl"
                >
                  <span>Continue Exploring</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
