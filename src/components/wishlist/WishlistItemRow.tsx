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
  const defaultSize = product.sizes[1] || product.sizes[0];
  const defaultColor = product.colors[0];
  const imageSize = compact ? "w-16 h-20" : "w-24 h-28";

  return (
    <div className="flex gap-4 py-4 border-b border-neutral-100 last:border-0">
      <Link
        to={`/product/${product.id}`}
        className={`${imageSize} bg-neutral-50 overflow-hidden border border-neutral-100 shrink-0 hover:opacity-90 transition-opacity`}
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </Link>

      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex justify-between items-start gap-2">
            <Link
              to={`/product/${product.id}`}
              className={`font-serif font-medium text-neutral-950 tracking-wide line-clamp-2 hover:text-neutral-600 transition-colors ${compact ? "text-xs sm:text-sm" : "text-sm sm:text-base"}`}
            >
              {product.name}
            </Link>
            <button
              onClick={() => onRemove(product)}
              className="text-neutral-400 hover:text-red-500 p-1 rounded cursor-pointer shrink-0"
              title="Remove from wishlist"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <span className={`text-neutral-900 font-sans font-semibold block mt-1.5 ${compact ? "text-sm" : "text-base"}`}>
            {formatPrice(product.price)}
          </span>
          {product.badge && (
            <span className="inline-block mt-1 px-2 py-0.5 bg-neutral-900 text-white text-[9px] font-mono tracking-widest uppercase rounded">
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
            className="flex-1 py-2.5 px-4 bg-neutral-950 hover:bg-neutral-800 text-white text-[10px] tracking-widest uppercase font-mono transition-colors flex items-center justify-center gap-2 cursor-pointer rounded-lg"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Move to Bag</span>
          </button>
          <Link
            to={`/product/${product.id}`}
            className="py-2.5 px-4 border border-neutral-200 hover:border-black text-[10px] tracking-widest uppercase font-mono transition-all text-neutral-600 hover:text-black rounded-lg"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
