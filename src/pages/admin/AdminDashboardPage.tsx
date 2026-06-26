import { DollarSign, ShoppingCart, Users, Package, TrendingUp } from "lucide-react";
import StatCard from "../../components/admin/StatCard";
import DataTable from "../../components/admin/DataTable";
import { PRODUCTS } from "../../data/products";
import { ORDERS, CUSTOMERS } from "../../data/adminData";

export default function AdminDashboardPage() {
  const totalRevenue = ORDERS.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = ORDERS.filter((o) => o.status === "pending" || o.status === "processing").length;
  const recentOrders = ORDERS.slice(0, 5);

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20",
    processing: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    shipped: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
    delivered: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    cancelled: "bg-red-500/10 text-red-400 border border-red-500/20",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">Dashboard</h1>
        <p className="text-zinc-400 text-sm mt-1">Welcome back. Here&apos;s your store overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend="+12.5% from last month"
          trendUp
        />
        <StatCard
          label="Total Orders"
          value={ORDERS.length}
          icon={ShoppingCart}
          trend={`${pendingOrders} pending`}
        />
        <StatCard
          label="Customers"
          value={CUSTOMERS.length}
          icon={Users}
          trend="+3 new this week"
          trendUp
        />
        <StatCard
          label="Products"
          value={PRODUCTS.length}
          icon={Package}
          trend="All active"
          trendUp
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-serif font-semibold text-white">Recent Orders</h2>
            <TrendingUp className="h-4 w-4 text-zinc-400" />
          </div>
          <DataTable headers={["Order", "Customer", "Total", "Status"]}>
            {recentOrders.map((order) => (
              <tr key={order.id} className="hover:bg-[#2B2D31] transition-colors">
                <td className="px-4 sm:px-6 py-3 font-mono text-xs text-white">{order.id}</td>
                <td className="px-4 sm:px-6 py-3 text-zinc-400">{order.customerName}</td>
                <td className="px-4 sm:px-6 py-3 font-medium text-white">${order.total}</td>
                <td className="px-4 sm:px-6 py-3">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </DataTable>
        </div>

        <div>
          <h2 className="text-lg font-serif font-semibold text-white mb-4">Top Products</h2>
          <div className="bg-[#1E1F22] border border-white/5 rounded-xl divide-y divide-white/5">
            {PRODUCTS.slice(0, 5).map((product, i) => (
              <div key={product.id} className="flex items-center gap-4 p-4 hover:bg-[#2B2D31] transition-colors">
                <span className="text-xs font-mono text-zinc-500 w-6">#{i + 1}</span>
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-10 h-10 rounded-lg object-cover border border-white/5"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white line-clamp-1">{product.name}</p>
                  <p className="text-xs text-zinc-400">{product.category}</p>
                </div>
                <span className="text-sm font-semibold text-white">${product.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
