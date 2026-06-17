import { X, Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { Product, ProductColor } from "../types";
import { motion, AnimatePresence } from "motion/react";

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
            className="absolute inset-0 bg-neutral-950"
          />

          {/* Slider Drawer Canvas */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
            className="relative w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col"
          >
            {/* Drawer Header */}
            <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-neutral-900">
                <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                <h2 className="font-serif font-semibold text-base uppercase tracking-wider">
                  Your Wishlist Closet ({wishlist.length})
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 px-2 hover:bg-neutral-50 rounded text-neutral-500 hover:text-black cursor-pointer"
                id="wishlist-drawer-close"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* List items core */}
            <div className="flex-grow overflow-y-auto px-6 py-4">
              {wishlist.length === 0 ? (
                /* Empty state warning */
                <div className="h-full flex flex-col justify-center items-center text-center p-8 space-y-5">
                  <div className="w-14 h-14 bg-neutral-50 rounded-full flex items-center justify-center text-neutral-300">
                    <Heart className="h-6 w-6" />
                  </div>
                  <h3 className="text-sm font-medium text-neutral-900 tracking-wider uppercase">
                    Your Closet is Empty
                  </h3>
                  <p className="text-xs text-neutral-400 font-light max-w-sm">
                    Tap the heart icon on any product in our winter and tailoring collections to save them here for later.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-3.5 bg-neutral-950 text-white text-xs font-mono tracking-widest uppercase transition-colors rounded-none"
                  >
                    Examine Collections
                  </button>
                </div>
              ) : (
                /* Active list */
                <div className="space-y-4">
                  {wishlist.map((product) => {
                    const defaultSize = product.sizes[1] || product.sizes[0];
                    const defaultColor = product.colors[0];

                    return (
                      <div
                        key={product.id}
                        className="flex gap-4 py-3.5 border-b border-neutral-100 last:border-0"
                      >
                        {/* Thumbnail */}
                        <div 
                          onClick={() => {
                            onOpenQuickView(product);
                            onClose();
                          }}
                          className="w-20 h-24 bg-neutral-50 overflow-hidden relative border border-neutral-100 shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                        >
                          <img
                            src={product.images[0]}
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
                                className="text-xs sm:text-sm font-serif font-medium text-neutral-950 tracking-wide line-clamp-1 cursor-pointer hover:text-neutral-600"
                              >
                                {product.name}
                              </h4>
                              <button
                                onClick={() => onRemoveFromWishlist(product)}
                                className="text-neutral-400 hover:text-red-500 p-1 rounded cursor-pointer"
                                title="Remove from wishlist"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                            <span className="text-xs text-neutral-900 font-sans font-medium block mt-1.5">
                              ${product.price}.00
                            </span>
                          </div>

                          {/* Quick Purchase block */}
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => {
                                onAddToCartFromWishlist(product, defaultSize, defaultColor);
                                onRemoveFromWishlist(product);
                              }}
                              className="flex-grow py-2 px-3 bg-neutral-950 hover:bg-neutral-800 text-white text-[9px] tracking-widest uppercase font-mono transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <ShoppingBag className="h-3 w-3" />
                              <span>Move To Bag</span>
                            </button>
                            <button
                              onClick={() => {
                                onOpenQuickView(product);
                                onClose();
                              }}
                              className="py-2 px-3 border border-neutral-200 hover:border-black text-[9px] tracking-widest uppercase font-mono transition-all text-neutral-600 hover:text-black cursor-pointer"
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
              <div className="p-6 bg-neutral-50 border-t border-neutral-100">
                <button
                  onClick={onClose}
                  className="w-full py-4 border border-neutral-950 text-neutral-950 font-mono text-[10px] tracking-widest uppercase transition-colors hover:bg-black hover:text-white flex items-center justify-center gap-2"
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
