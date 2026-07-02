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
        <Link to="/" className="hover:text-black transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-black font-semibold">Wishlist</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-sans font-bold tracking-tight text-black uppercase">
            Your Wishlist
          </h1>
          <p className="text-zinc-500 text-sm mt-2 font-medium">
            {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved for later
          </p>
        </div>
        {wishlist.length > 0 && (
          <div className="flex gap-3">
            <button
              onClick={handleMoveAllToCart}
              className="flex items-center gap-2 px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 rounded-full cursor-pointer"
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
          <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-2xl p-4 sm:p-6 shadow-sm">
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
            <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-2xl space-y-4 shadow-sm">
              <h2 className="text-sm font-sans uppercase tracking-widest text-black font-bold">
                Wishlist Summary
              </h2>
              <div className="flex justify-between text-sm text-zinc-500 font-medium">
                <span>Total Items</span>
                <span className="text-black">{wishlist.length}</span>
              </div>
              <div className="border-t border-zinc-200 pt-4 flex justify-between items-baseline">
                <span className="text-xs font-bold uppercase tracking-widest text-black">Total Value</span>
                <span className="text-xl font-sans font-bold text-black">{formatPrice(totalValue)}</span>
              </div>
              <button
                onClick={handleMoveAllToCart}
                className="w-full py-4 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 rounded-full cursor-pointer mt-4"
              >
                Move All to Bag
              </button>
            </div>

            {cart.length > 0 && (
              <div className="bg-white border border-zinc-200 p-5 rounded-2xl flex items-center justify-between shadow-sm">
                <span className="text-sm font-medium text-zinc-600">
                  <strong className="text-black">{cart.reduce((s, i) => s + i.quantity, 0)} items</strong> in your bag
                </span>
                <button
                  onClick={() => navigate("/cart")}
                  className="text-xs font-bold uppercase tracking-widest text-black underline hover:no-underline cursor-pointer"
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
