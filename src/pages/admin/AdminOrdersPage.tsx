import {  useState, useMemo , useEffect } from "react";
import DataTable from "../../components/admin/DataTable";
import { fetchOrders } from "../../data/adminData";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20",
  processing: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  shipped: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  delivered: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  cancelled: "bg-red-500/10 text-red-400 border border-red-500/20",
};

export default function AdminOrdersPage() {
  const [ORDERS, setORDERS] = useState<any[]>([]);
  useEffect(() => { fetchOrders().then(setORDERS); }, []);
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    if (statusFilter === "all") return ORDERS;
    return ORDERS.filter((o) => o.status === statusFilter);
  }, [statusFilter, ORDERS]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">Orders</h1>
        <p className="text-zinc-400 text-sm mt-1">{ORDERS.length} total orders</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer ${
              statusFilter === status
                ? "bg-indigo-500 text-white"
                : "bg-[#1E1F22] border border-white/5 text-zinc-400 hover:text-white hover:border-white/20"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <DataTable headers={["Order ID", "Customer", "Email", "Items", "Total", "Date", "Status"]}>
        {filtered.map((order) => (
          <tr key={order.id} className="hover:bg-[#2B2D31] transition-colors">
            <td className="px-4 sm:px-6 py-3 font-mono text-xs text-white">{order.id}</td>
            <td className="px-4 sm:px-6 py-3 text-white">{order.customerName}</td>
            <td className="px-4 sm:px-6 py-3 text-zinc-400 text-xs">{order.customerEmail}</td>
            <td className="px-4 sm:px-6 py-3 text-zinc-400">{order.items}</td>
            <td className="px-4 sm:px-6 py-3 font-medium text-white">${order.total}</td>
            <td className="px-4 sm:px-6 py-3 text-zinc-400 text-xs">{order.date}</td>
            <td className="px-4 sm:px-6 py-3">
              <span className={`px-2 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider ${statusColors[order.status]}`}>
                {order.status}
              </span>
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}

