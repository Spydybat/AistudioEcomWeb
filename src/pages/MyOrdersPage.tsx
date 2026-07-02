import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Eye, X, Package } from "lucide-react";
import { useShop } from "../context/ShopContext";
import { supabase } from "../supabaseClient";
import { useCurrency } from "../context/CurrencyContext";
import EmptyState from "../components/ui/EmptyState";
import { motion, AnimatePresence } from "motion/react";

export default function MyOrdersPage() {
  const { user } = useShop();
  const { formatPrice } = useCurrency();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function fetchOrders() {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*, order_items(*, products(*))")
          .eq("profile_id", user?.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching orders:", error);
        } else {
          setOrders(data || []);
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "text-emerald-700 bg-emerald-50 border-emerald-200";
      case "shipped":
        return "text-black bg-zinc-100 border-zinc-200";
      case "cancelled":
        return "text-rose-700 bg-rose-50 border-rose-200";
      default:
        return "text-amber-700 bg-amber-50 border-amber-200";
    }
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full relative">
      <nav className="flex text-[10px] uppercase tracking-widest text-zinc-500 mb-6 font-mono">
        <Link to="/" className="hover:text-black transition-colors cursor-pointer">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-black font-bold">My Orders</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-sans font-bold tracking-tight text-black uppercase">
          My Orders
        </h1>
        <p className="text-zinc-500 font-medium text-sm mt-2">
          View your order history and check shipment status.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No orders yet"
          description="You haven't placed any orders yet. Discover our premium collection."
          actionLabel="Explore Marketplace"
          onAction={() => window.location.href = "/products"}
        />
      ) : (
        <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50">
                  <th className="px-6 py-4 text-[10px] font-bold tracking-widest uppercase text-zinc-500">Order ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold tracking-widest uppercase text-zinc-500">Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold tracking-widest uppercase text-zinc-500">Total</th>
                  <th className="px-6 py-4 text-[10px] font-bold tracking-widest uppercase text-zinc-500">Payment Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold tracking-widest uppercase text-zinc-500">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold tracking-widest uppercase text-zinc-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-sm">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-black">{order.order_number}</td>
                    <td className="px-6 py-4 text-zinc-600 font-medium">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-black font-bold">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize text-zinc-600 font-medium">{order.payment_status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-zinc-500 hover:text-black bg-white hover:bg-zinc-100 rounded-full transition-all inline-flex items-center justify-center border border-zinc-200 shadow-sm cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={() => setSelectedOrder(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white border border-zinc-200 rounded-3xl z-50 shadow-2xl"
            >
              <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-zinc-200 p-6 flex justify-between items-center z-10">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-black" />
                  <h2 className="text-lg font-sans font-bold tracking-tight uppercase text-black">
                    Order {selectedOrder.order_number}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-zinc-100 rounded-full transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5 text-zinc-500" />
                </button>
              </div>

              <div className="p-6 space-y-8">
                {/* Order Meta Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-5 bg-zinc-50 rounded-2xl border border-zinc-200">
                  <div>
                    <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-1">Date</p>
                    <p className="text-sm font-medium text-black">{new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-1">Total</p>
                    <p className="text-sm font-bold text-black">{formatPrice(selectedOrder.total)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-1">Payment</p>
                    <p className="text-sm font-medium text-zinc-600 capitalize">{selectedOrder.payment_status}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-1">Status</p>
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>

                {/* Shipping Info */}
                <div>
                  <h3 className="text-xs font-bold tracking-widest text-black uppercase mb-4">Shipping Address</h3>
                  <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-200 text-sm font-medium text-zinc-600">
                    <p className="font-bold text-black mb-1">{selectedOrder.customer_name}</p>
                    <p>{selectedOrder.address}</p>
                    <p>{selectedOrder.city}, {selectedOrder.state} {selectedOrder.postal_code}</p>
                    <p>{selectedOrder.country}</p>
                  </div>
                </div>

                {/* Line Items */}
                <div>
                  <h3 className="text-xs font-bold tracking-widest text-black uppercase mb-4">Items Ordered</h3>
                  <div className="bg-zinc-50 border border-zinc-200 rounded-2xl overflow-hidden divide-y divide-zinc-200">
                    {selectedOrder.order_items?.map((item: any) => (
                      <div key={item.id} className="p-4 flex gap-4 items-center bg-white">
                        <div className="w-16 h-20 bg-zinc-100 rounded-xl border border-zinc-200 overflow-hidden shrink-0">
                          <img
                            src={item.products?.images?.[0] ?? (item.products as any)?.image ?? item.products?.thumbnail ?? ""}
                            alt={item.products?.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm text-black font-bold">{item.products?.name}</h4>
                          <p className="text-xs font-medium text-zinc-500 mt-1 uppercase tracking-widest">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-zinc-500">{formatPrice(item.price)}</p>
                          <p className="text-sm font-bold text-black mt-1">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
