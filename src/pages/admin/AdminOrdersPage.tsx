import { useState, useMemo, useEffect } from "react";
import { X, Eye } from "lucide-react";
import DataTable from "../../components/admin/DataTable";
import { supabase } from "../../supabaseClient";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20",
  processing: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  shipped: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  delivered: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  cancelled: "bg-red-500/10 text-red-400 border border-red-500/20",
};

export default function AdminOrdersPage() {
  const [ORDERS, setORDERS] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  useEffect(() => {
    fetchOrdersFromSupabase();
  }, []);

  const fetchOrdersFromSupabase = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*, products(*))")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
    } else if (data) {
      setORDERS(data);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedOrder) return;
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", selectedOrder.id);

    if (!error) {
      setORDERS(
        ORDERS.map((o) =>
          o.id === selectedOrder.id ? { ...o, status: newStatus } : o
        )
      );
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    } else {
      console.error("Error updating status:", error);
    }
  };

  const filtered = useMemo(() => {
    if (statusFilter === "all") return ORDERS;
    return ORDERS.filter((o) => o.status === statusFilter);
  }, [statusFilter, ORDERS]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-black">
          Orders
        </h1>
        <p className="text-zinc-600 text-sm mt-1">
          {ORDERS.length} total orders
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          "all",
          "pending",
          "processing",
          "shipped",
          "delivered",
          "cancelled",
        ].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer ${
              statusFilter === status
                ? "bg-black text-white"
                : "bg-white border border-zinc-200 text-zinc-600 hover:text-black hover:border-zinc-400"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {ORDERS.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-2xl p-12 text-center">
          <p className="text-zinc-600">No orders found.</p>
        </div>
      ) : (
        <DataTable
          headers={[
            "Order ID",
            "Customer",
            "Email",
            "Items",
            "Total",
            "Date",
            "Status",
            "Actions",
          ]}
        >
          {filtered.map((order) => (
            <tr
              key={order.id}
              className="hover:bg-zinc-100 transition-colors"
            >
              <td className="px-4 sm:px-6 py-3 font-mono text-xs text-black">
                {order.order_number || order.id.slice(0, 8).toUpperCase()}
              </td>
              <td className="px-4 sm:px-6 py-3 text-black">
                {order.customer_name}
              </td>
              <td className="px-4 sm:px-6 py-3 text-zinc-600 text-xs">
                {order.email}
              </td>
              <td className="px-4 sm:px-6 py-3 text-zinc-600">
                {order.order_items?.reduce(
                  (acc: number, item: any) => acc + item.quantity,
                  0
                ) || 0}
              </td>
              <td className="px-4 sm:px-6 py-3 font-medium text-black">
                ${order.total?.toFixed(2) || "0.00"}
              </td>
              <td className="px-4 sm:px-6 py-3 text-zinc-600 text-xs">
                {new Date(order.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 sm:px-6 py-3">
                <span
                  className={`px-2 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider ${
                    statusColors[order.status] || statusColors.pending
                  }`}
                >
                  {order.status || "pending"}
                </span>
              </td>
              <td className="px-4 sm:px-6 py-3">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="p-2 text-zinc-600 hover:text-black hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                  title="View Details"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </DataTable>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 overflow-y-auto">
          <div className="bg-white border border-zinc-300 rounded-2xl w-full max-w-3xl overflow-hidden my-8">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-zinc-200">
              <div>
                <h3 className="text-lg font-serif font-bold text-black">
                  Order Details
                </h3>
                <p className="text-zinc-600 font-mono text-xs mt-1">
                  {selectedOrder.order_number || selectedOrder.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-zinc-600 hover:text-black hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-8">
              {/* Top Meta Data */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-zinc-100 rounded-lg p-4">
                  <p className="text-xs text-zinc-600 uppercase tracking-wider font-mono mb-1">
                    Order Status
                  </p>
                  <select
                    value={selectedOrder.status || "pending"}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded px-2 py-1 text-sm text-black focus:outline-none focus:border-indigo-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="bg-zinc-100 rounded-lg p-4">
                  <p className="text-xs text-zinc-600 uppercase tracking-wider font-mono mb-1">
                    Payment Status
                  </p>
                  <p className="text-sm font-medium text-black capitalize">
                    {selectedOrder.payment_status || "N/A"}
                  </p>
                </div>
                <div className="bg-zinc-100 rounded-lg p-4">
                  <p className="text-xs text-zinc-600 uppercase tracking-wider font-mono mb-1">
                    Order Date
                  </p>
                  <p className="text-sm font-medium text-black">
                    {new Date(selectedOrder.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-zinc-100 rounded-lg p-4">
                  <p className="text-xs text-zinc-600 uppercase tracking-wider font-mono mb-1">
                    Total Amount
                  </p>
                  <p className="text-sm font-medium text-emerald-400">
                    ${selectedOrder.total?.toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>

              {/* Customer & Shipping */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-bold text-black mb-3">
                    Customer Information
                  </h4>
                  <div className="space-y-2 text-sm text-zinc-600">
                    <p>
                      <strong className="text-black">Name:</strong>{" "}
                      {selectedOrder.customer_name || "N/A"}
                    </p>
                    <p>
                      <strong className="text-black">Email:</strong>{" "}
                      {selectedOrder.email || "N/A"}
                    </p>
                    <p>
                      <strong className="text-black">Phone:</strong>{" "}
                      {selectedOrder.phone || "N/A"}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-black mb-3">
                    Shipping Address
                  </h4>
                  <div className="space-y-1 text-sm text-zinc-600">
                    <p>{selectedOrder.address || "N/A"}</p>
                    <p>
                      {selectedOrder.city
                        ? `${selectedOrder.city}, ${selectedOrder.state || ""} ${
                            selectedOrder.postal_code || ""
                          }`
                        : ""}
                    </p>
                    <p>{selectedOrder.country || ""}</p>
                  </div>
                </div>
              </div>

              {/* Line Items */}
              <div>
                <h4 className="text-sm font-bold text-black mb-4">
                  Ordered Products
                </h4>
                <div className="border border-zinc-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-zinc-100 text-zinc-600 font-mono text-[10px] uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3 font-medium">Product</th>
                        <th className="px-4 py-3 font-medium">Unit Price</th>
                        <th className="px-4 py-3 font-medium">Quantity</th>
                        <th className="px-4 py-3 font-medium text-right">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200">
                      {selectedOrder.order_items?.map((item: any) => (
                        <tr key={item.id} className="hover:bg-zinc-100">
                          <td className="px-4 py-3 text-black">
                            {item.products?.name || "Unknown Product"}
                          </td>
                          <td className="px-4 py-3 text-zinc-600">
                            ${item.price?.toFixed(2) || "0.00"}
                          </td>
                          <td className="px-4 py-3 text-zinc-600">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 text-black text-right">
                            ${((item.price || 0) * (item.quantity || 0)).toFixed(
                              2
                            )}
                          </td>
                        </tr>
                      ))}
                      {(!selectedOrder.order_items ||
                        selectedOrder.order_items.length === 0) && (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-4 py-6 text-center text-zinc-600"
                          >
                            No products found for this order.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
