import { Plus, Minus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { CartItem } from "../../types";

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
  const imageSize = compact ? "w-16 h-20" : "w-24 h-28";

  return (
    <div className="flex gap-4 py-4 border-b border-neutral-100 last:border-0">
      <Link
        to={`/product/${item.product.id}`}
        className={`${imageSize} bg-neutral-50 overflow-hidden border border-neutral-100 shrink-0 hover:opacity-90 transition-opacity`}
      >
        <img
          src={item.product.images[0]}
          alt={item.product.name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </Link>

      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex justify-between items-start gap-2">
            <Link
              to={`/product/${item.product.id}`}
              className={`font-serif font-medium text-neutral-950 tracking-wide line-clamp-2 hover:text-neutral-600 transition-colors ${compact ? "text-xs sm:text-sm" : "text-sm sm:text-base"}`}
            >
              {item.product.name}
            </Link>
            <button
              onClick={() => onRemoveItem(index)}
              className="text-neutral-400 hover:text-red-500 p-1 rounded cursor-pointer shrink-0"
              title="Remove item"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[10px] text-neutral-500">
            <span className="flex items-center gap-1">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block border border-black/10"
                style={{ backgroundColor: item.selectedColor.hex }}
              />
              <span>{item.selectedColor.name}</span>
            </span>
            <span>•</span>
            <span>Size: {item.selectedSize}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center border border-neutral-200 bg-neutral-50 rounded-md">
            <button
              onClick={() => onUpdateQuantity(index, item.quantity - 1)}
              className="p-2 hover:bg-neutral-100 text-neutral-600 disabled:opacity-30 cursor-pointer"
              disabled={item.quantity <= 1}
              title="Decrease quantity"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="px-3 text-sm font-mono font-medium text-neutral-800 min-w-[2rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(index, item.quantity + 1)}
              className="p-2 hover:bg-neutral-100 text-neutral-600 cursor-pointer"
              title="Increase quantity"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <span className={`font-sans font-semibold text-neutral-950 ${compact ? "text-sm" : "text-base"}`}>
            ${(item.product.price * item.quantity).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
