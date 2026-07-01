import { X, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { Product, ProductColor } from "../../types";
import { useCurrency } from "../../context/CurrencyContext";

interface WishlistItemRowProps {
  product: Product;
  onRemove: (product: Product) => void;
  onMoveToCart: (product: Product, size: string, color: ProductColor) => void;
  compact?: boolean;
}

export default function WishlistItemRow({
  product,
  onRemove,
  onMoveToCart,
  compact = false,
}: WishlistItemRowProps) {
  const { formatPrice } = useCurrency();
  const defaultSize = product?.sizes?.[1] ?? product?.sizes?.[0] ?? "Default";
  const defaultColor = product?.colors?.[0] ?? { name: "Default", hex: "#000" };
  const imageSize = compact ? "w-16 h-20" : "w-24 h-28";

  return (
    <div className="flex gap-4 py-4 border-b border-white/5 last:border-0">
      <Link
        to={`/product/${product.id}`}
        className={`${imageSize} bg-[#111214] overflow-hidden border border-white/5 shrink-0 hover:opacity-90 transition-opacity rounded-md flex items-center justify-center`}
      >
        {(() => {
          const imageUrl = product?.images?.[0] ?? (product as any)?.image ?? null;
          return imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="text-[10px] text-zinc-600 font-medium">No Image</span>
          );
        })()}
      </Link>

      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex justify-between items-start gap-2">
            <Link
              to={`/product/${product.id}`}
              className={`font-serif font-medium text-white tracking-wide line-clamp-2 hover:text-zinc-300 transition-colors ${compact ? "text-xs sm:text-sm" : "text-sm sm:text-base"}`}
            >
              {product.name}
            </Link>
            <button
              onClick={() => onRemove(product)}
              className="text-zinc-400 hover:text-rose-500 p-1 rounded cursor-pointer shrink-0"
              title="Remove from wishlist"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <span className={`text-white font-sans font-semibold block mt-1.5 ${compact ? "text-sm" : "text-base"}`}>
            {formatPrice(product.price)}
          </span>
          {product.badge && (
            <span className="inline-block mt-1 px-2 py-0.5 bg-indigo-500/90 text-white text-[10px] font-mono tracking-widest uppercase rounded">
              {product.badge}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={() => {
              onMoveToCart(product, defaultSize, defaultColor);
              onRemove(product);
            }}
            className="flex-1 py-2.5 px-4 bg-[#1E1F22] border border-white/5 hover:border-indigo-500 hover:bg-indigo-500 text-white text-xs tracking-widest uppercase font-mono transition-all flex items-center justify-center gap-2 cursor-pointer rounded-lg"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Move to Bag</span>
          </button>
          <Link
            to={`/product/${product.id}`}
            className="py-2.5 px-4 border border-white/10 hover:border-white/30 text-xs tracking-widest uppercase font-mono transition-all text-zinc-400 hover:text-white rounded-lg"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}

