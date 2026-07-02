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
    <div className="flex gap-4 py-5 border-b border-zinc-100 last:border-0">
      <Link
        to={`/product/${product.id}`}
        className={`${imageSize} bg-zinc-50 overflow-hidden border border-zinc-200 shrink-0 hover:opacity-90 transition-opacity rounded-xl flex items-center justify-center`}
      >
        {(() => {
          const imageUrl = product?.images?.[0] ?? (product as any)?.image ?? (product as any)?.thumbnail ?? null;
          return imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="text-[10px] text-zinc-500 font-medium">No Image</span>
          );
        })()}
      </Link>

      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex justify-between items-start gap-2">
            <Link
              to={`/product/${product.id}`}
              className={`font-sans font-bold text-black tracking-tight line-clamp-2 hover:text-zinc-600 transition-colors ${compact ? "text-xs sm:text-sm" : "text-sm sm:text-base"}`}
            >
              {product.name}
            </Link>
            <button
              onClick={() => onRemove(product)}
              className="text-zinc-400 hover:text-red-500 p-1.5 rounded-full hover:bg-zinc-100 cursor-pointer shrink-0 transition-colors"
              title="Remove from wishlist"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <span className={`text-black font-sans font-bold block mt-1.5 ${compact ? "text-sm" : "text-base"}`}>
            {formatPrice(product.price)}
          </span>
          {product.badge && (
            <span className="inline-block mt-1.5 px-2.5 py-1 bg-black text-white text-[9px] font-sans font-bold tracking-widest uppercase rounded">
              {product.badge}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={() => {
              onMoveToCart(product, defaultSize, defaultColor);
              onRemove(product);
            }}
            className="flex-1 py-3 px-4 bg-black border border-black hover:bg-zinc-800 text-white text-[10px] tracking-widest uppercase font-sans font-bold transition-all flex items-center justify-center gap-2 cursor-pointer rounded-full shadow-sm hover:-translate-y-0.5"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Move to Bag</span>
          </button>
          <Link
            to={`/product/${product.id}`}
            className="py-3 px-5 border border-zinc-200 hover:border-black text-[10px] tracking-widest uppercase font-sans font-bold transition-all text-zinc-600 hover:text-black rounded-full"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}

