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
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900">Dashboard</h1>
        <p className="text-neutral-500 text-sm mt-1">Welcome back. Here&apos;s your store overview.</p>
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
            <h2 className="text-lg font-serif font-semibold text-neutral-900">Recent Orders</h2>
            <TrendingUp className="h-4 w-4 text-neutral-400" />
          </div>
          <DataTable headers={["Order", "Customer", "Total", "Status"]}>
            {recentOrders.map((order) => (
              <tr key={order.id} className="hover:bg-neutral-50">
                <td className="px-4 sm:px-6 py-3 font-mono text-xs text-neutral-900">{order.id}</td>
                <td className="px-4 sm:px-6 py-3 text-neutral-600">{order.customerName}</td>
                <td className="px-4 sm:px-6 py-3 font-medium text-neutral-900">${order.total}</td>
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
          <h2 className="text-lg font-serif font-semibold text-neutral-900 mb-4">Top Products</h2>
          <div className="bg-white border border-neutral-200 rounded-xl divide-y divide-neutral-100">
            {PRODUCTS.slice(0, 5).map((product, i) => (
              <div key={product.id} className="flex items-center gap-4 p-4 hover:bg-neutral-50">
                <span className="text-xs font-mono text-neutral-400 w-6">#{i + 1}</span>
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-10 h-10 rounded-lg object-cover border border-neutral-100"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 line-clamp-1">{product.name}</p>
                  <p className="text-xs text-neutral-500">{product.category}</p>
                </div>
                <span className="text-sm font-semibold text-neutral-900">${product.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
