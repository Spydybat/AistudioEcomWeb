import { Link } from "react-router-dom";
import { ShoppingBag, Trash2 } from "lucide-react";
import { useShop } from "../context/ShopContext";
import CartItemRow from "../components/cart/CartItemRow";
import CartSummary from "../components/cart/CartSummary";
import EmptyState from "../components/ui/EmptyState";

export default function CartPage() {
  const {
    cart,
    handleUpdateCartQty,
    handleRemoveCartItem,
    handleClearCart,
  } = useShop();

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
      <nav className="flex text-[10px] uppercase tracking-widest text-zinc-500 mb-6 font-mono">
        <Link to="/" className="hover:text-black transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-black font-semibold">Shopping Bag</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-sans font-bold tracking-tight text-black uppercase">
            Your Shopping Bag
          </h1>
          <p className="text-zinc-500 text-sm mt-2 font-medium">
            {cart.length === 0
              ? "No items in your bag"
              : `${cart.reduce((s, i) => s + i.quantity, 0)} items in your bag`}
          </p>
        </div>
        {cart.length > 0 && (
          <button
            onClick={handleClearCart}
            className="flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-zinc-500 hover:text-red-500 transition-colors cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
            Clear Bag
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="h-7 w-7" />}
          title="Your bag is empty"
          description="Discover our curated luxury collections and add items to your bag."
          actionLabel="Continue Shopping"
          actionTo="/products"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-2xl p-4 sm:p-6 shadow-sm">
            {cart.map((item, index) => (
              <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.name}`}>
                <CartItemRow
                  item={item}
                  index={index}
                  onUpdateQuantity={handleUpdateCartQty}
                  onRemoveItem={handleRemoveCartItem}
                />
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <CartSummary cartItems={cart} />
            <Link
              to="/wishlist"
              className="block text-center mt-5 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-black transition-colors"
            >
              View Wishlist
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
