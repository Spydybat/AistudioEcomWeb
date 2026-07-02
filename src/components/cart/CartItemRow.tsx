import { Plus, Minus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { CartItem } from "../../types";
import { useCurrency } from "../../context/CurrencyContext";

interface CartItemRowProps {
  item: CartItem;
  index: number;
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  compact?: boolean;
}

export default function CartItemRow({
  item,
  index,
  onUpdateQuantity,
  onRemoveItem,
  compact = false,
}: CartItemRowProps) {
  const { formatPrice } = useCurrency();
  const imageSize = compact ? "w-16 h-20" : "w-24 h-28";

  return (
    <div className="flex gap-4 py-5 border-b border-zinc-100 last:border-0">
      <Link
        to={`/product/${item.product.id}`}
        className={`${imageSize} bg-zinc-50 overflow-hidden border border-zinc-200 shrink-0 hover:opacity-90 transition-opacity rounded-xl flex items-center justify-center`}
      >
        {(() => {
          const imageUrl = item?.product?.images?.[0] ?? (item?.product as any)?.image ?? (item?.product as any)?.thumbnail ?? null;
          return imageUrl ? (
            <img
              src={imageUrl}
              alt={item.product.name}
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
              to={`/product/${item.product.id}`}
              className={`font-sans font-bold text-black tracking-tight line-clamp-2 hover:text-zinc-600 transition-colors ${compact ? "text-xs sm:text-sm" : "text-sm sm:text-base"}`}
            >
              {item.product.name}
            </Link>
            <button
              onClick={() => onRemoveItem(index)}
              className="text-zinc-400 hover:text-red-500 p-1.5 rounded-full hover:bg-zinc-100 cursor-pointer shrink-0 transition-colors"
              title="Remove item"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[10px] text-zinc-500 font-sans font-medium uppercase tracking-widest">
            <span className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block border border-zinc-200 shadow-sm"
                style={{ backgroundColor: item.selectedColor.hex }}
              />
              <span className="text-black font-bold">{item.selectedColor.name}</span>
            </span>
            <span>•</span>
            <span>Size: <span className="text-black font-bold">{item.selectedSize}</span></span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center border border-zinc-200 bg-white rounded-full overflow-hidden shadow-sm">
            <button
              onClick={() => onUpdateQuantity(index, item.quantity - 1)}
              className="p-1.5 px-2 hover:bg-zinc-50 text-zinc-500 disabled:opacity-30 cursor-pointer transition-colors"
              disabled={item.quantity <= 1}
              title="Decrease quantity"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="px-3 text-sm font-sans font-bold text-black min-w-[2rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(index, item.quantity + 1)}
              className="p-1.5 px-2 hover:bg-zinc-50 text-zinc-500 cursor-pointer transition-colors"
              title="Increase quantity"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <span className={`font-sans font-bold text-black ${compact ? "text-sm" : "text-base"}`}>
            {formatPrice(item.product.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}

