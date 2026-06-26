import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useShop } from "../context/ShopContext";
import { useCurrency } from "../context/CurrencyContext";
import WishlistItemRow from "../components/wishlist/WishlistItemRow";
import EmptyState from "../components/ui/EmptyState";

export default function WishlistPage() {
  const {
    wishlist,
    handleToggleWishlist,
    handleAddToCartFromWishlist,
    handleMoveAllWishlistToCart,
    cart,
  } = useShop();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  const handleMoveAllToCart = () => {
    handleMoveAllWishlistToCart();
  };

  const totalValue = wishlist.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
      <nav className="flex text-[10px] uppercase tracking-widest text-zinc-500 mb-6 font-mono">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-100">Wishlist</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">
            Your Wishlist
          </h1>
          <p className="text-zinc-400 text-sm mt-2">
            {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved for later
          </p>
        </div>
        {wishlist.length > 0 && (
          <div className="flex gap-3">
            <button
              onClick={handleMoveAllToCart}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 text-white text-xs uppercase tracking-widest hover:bg-indigo-600 transition-colors rounded-full cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4" />
              Move All to Bag
            </button>
          </div>
        )}
      </div>

      {wishlist.length === 0 ? (
        <EmptyState
          icon={<Heart className="h-7 w-7" />}
          title="Your wishlist is empty"
          description="Save items you love by tapping the heart icon on any product."
          actionLabel="Browse Collections"
          actionTo="/products"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 bg-[#1E1F22] border border-white/5 rounded-xl p-4 sm:p-6">
            {wishlist.map((product) => (
              <div key={product.id}>
                <WishlistItemRow
                  product={product}
                  onRemove={handleToggleWishlist}
                  onMoveToCart={handleAddToCartFromWishlist}
                />
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="bg-[#111214] border border-white/5 p-6 rounded-xl space-y-4">
              <h2 className="text-sm font-mono uppercase tracking-widest text-white font-semibold">
                Wishlist Summary
              </h2>
              <div className="flex justify-between text-sm text-zinc-400">
                <span>Total Items</span>
                <span>{wishlist.length}</span>
              </div>
              <div className="border-t border-white/5 pt-3 flex justify-between items-baseline">
                <span className="font-semibold uppercase tracking-wider text-white">Total Value</span>
                <span className="text-2xl font-serif font-bold text-white">{formatPrice(totalValue)}</span>
              </div>
              <button
                onClick={handleMoveAllToCart}
                className="w-full py-3.5 bg-indigo-500 text-white text-xs uppercase tracking-widest hover:bg-indigo-600 transition-colors rounded-full cursor-pointer"
              >
                Move All to Bag
              </button>
            </div>

            {cart.length > 0 && (
              <div className="bg-[#1E1F22] border border-white/5 p-4 rounded-xl flex items-center justify-between">
                <span className="text-sm text-zinc-400">
                  {cart.reduce((s, i) => s + i.quantity, 0)} items in your bag
                </span>
                <button
                  onClick={() => navigate("/cart")}
                  className="text-xs uppercase tracking-widest text-white underline hover:no-underline cursor-pointer"
                >
                  View Bag
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
