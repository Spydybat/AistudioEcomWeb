import { useState, useMemo } from "react";
import DataTable from "../../components/admin/DataTable";
import { ORDERS } from "../../data/adminData";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    if (statusFilter === "all") return ORDERS;
    return ORDERS.filter((o) => o.status === statusFilter);
  }, [statusFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900">Orders</h1>
        <p className="text-neutral-500 text-sm mt-1">{ORDERS.length} total orders</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer ${
              statusFilter === status
                ? "bg-neutral-900 text-white"
                : "bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-900"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <DataTable headers={["Order ID", "Customer", "Email", "Items", "Total", "Date", "Status"]}>
        {filtered.map((order) => (
          <tr key={order.id} className="hover:bg-neutral-50">
            <td className="px-4 sm:px-6 py-3 font-mono text-xs text-neutral-900">{order.id}</td>
            <td className="px-4 sm:px-6 py-3 text-neutral-900">{order.customerName}</td>
            <td className="px-4 sm:px-6 py-3 text-neutral-600 text-xs">{order.customerEmail}</td>
            <td className="px-4 sm:px-6 py-3 text-neutral-600">{order.items}</td>
            <td className="px-4 sm:px-6 py-3 font-medium text-neutral-900">${order.total}</td>
            <td className="px-4 sm:px-6 py-3 text-neutral-600 text-xs">{order.date}</td>
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
