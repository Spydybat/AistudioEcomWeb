import { useState, useMemo, useEffect } from "react";
import { Search, X, Eye, User } from "lucide-react";
import DataTable from "../../components/admin/DataTable";
import { supabase } from "../../supabaseClient";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20",
  processing: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  shipped: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  delivered: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  cancelled: "bg-red-500/10 text-red-400 border border-red-500/20",
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  useEffect(() => {
    fetchCustomersFromSupabase();
  }, []);

  const fetchCustomersFromSupabase = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*, orders(id, order_number, total, status, created_at, customer_name, email)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching customers:", error);
    } else if (data) {
      // Map to compute total orders, total spent, and fallback names/emails
      const computedCustomers = data.map((profile: any) => {
        const orderHistory = profile.orders || [];
        const totalSpent = orderHistory.reduce(
          (acc: number, order: any) => acc + (order.total || 0),
          0
        );
        
        const fallbackName = orderHistory.find((o: any) => o.customer_name)?.customer_name;
        const fallbackEmail = orderHistory.find((o: any) => o.email)?.email;

        return {
          ...profile,
          full_name: profile.full_name || fallbackName || "Unknown User",
          email: profile.email || fallbackEmail || "No Email",
          totalOrders: orderHistory.length,
          totalSpent,
        };
      });
      setCustomers(computedCustomers);
    }
    setLoading(false);
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return customers;
    const q = search.toLowerCase();
    return customers.filter(
      (c) =>
        (c.full_name && c.full_name.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q))
    );
  }, [search, customers]);

  return (
    <div className="space-y-6 relative">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
          Customers
        </h1>
        <p className="text-zinc-400 text-sm mt-1">
          {customers.length} registered customers
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full pl-10 pr-4 py-2.5 bg-[#1E1F22] border border-white/5 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 placeholder-zinc-500"
        />
      </div>

      {loading ? (
        <div className="bg-[#1E1F22] border border-white/5 rounded-xl p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading customers...</p>
        </div>
      ) : customers.length === 0 ? (
        <div className="bg-[#1E1F22] border border-white/5 rounded-xl p-12 text-center">
          <User className="mx-auto h-12 w-12 text-zinc-600 mb-4" />
          <p className="text-zinc-400">No customers found.</p>
        </div>
      ) : (
        <DataTable
          headers={[
            "Name",
            "Email",
            "Total Orders",
            "Total Spent",
            "Joined",
            "Actions",
          ]}
        >
          {filtered.map((customer) => (
            <tr
              key={customer.id}
              className="hover:bg-[#2B2D31] transition-colors"
            >
              <td className="px-4 sm:px-6 py-3 font-medium text-white flex items-center gap-3">
                {customer.avatar_url ? (
                  <img
                    src={customer.avatar_url}
                    alt={customer.full_name}
                    className="w-8 h-8 rounded-full border border-white/10"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                    {customer.full_name
                      ? customer.full_name.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                )}
                {customer.full_name || "Unknown User"}
              </td>
              <td className="px-4 sm:px-6 py-3 text-zinc-400 text-xs">
                {customer.email}
              </td>
              <td className="px-4 sm:px-6 py-3 text-zinc-400">
                {customer.totalOrders}
              </td>
              <td className="px-4 sm:px-6 py-3 font-medium text-white">
                ${customer.totalSpent?.toFixed(2) || "0.00"}
              </td>
              <td className="px-4 sm:px-6 py-3 text-zinc-400 text-xs">
                {new Date(customer.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 sm:px-6 py-3">
                <button
                  onClick={() => setSelectedCustomer(customer)}
                  className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                  title="View Details"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </DataTable>
      )}

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 overflow-y-auto">
          <div className="bg-[#1E1F22] border border-white/10 rounded-xl w-full max-w-3xl overflow-hidden my-8">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/5 bg-[#111214]">
              <div className="flex items-center gap-4">
                {selectedCustomer.avatar_url ? (
                  <img
                    src={selectedCustomer.avatar_url}
                    alt={selectedCustomer.full_name}
                    className="w-12 h-12 rounded-full border border-white/10"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-lg">
                    {selectedCustomer.full_name
                      ? selectedCustomer.full_name.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-serif font-bold text-white">
                    {selectedCustomer.full_name || "Unknown User"}
                  </h3>
                  <p className="text-zinc-400 text-sm mt-1">
                    {selectedCustomer.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-8">
              {/* Customer Meta Data */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider font-mono mb-1">
                    Phone
                  </p>
                  <p className="text-sm font-medium text-white">
                    {selectedCustomer.phone || "Not provided"}
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider font-mono mb-1">
                    Joined Date
                  </p>
                  <p className="text-sm font-medium text-white">
                    {new Date(selectedCustomer.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider font-mono mb-1">
                    Total Orders
                  </p>
                  <p className="text-sm font-medium text-white">
                    {selectedCustomer.totalOrders}
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider font-mono mb-1">
                    Total Spent
                  </p>
                  <p className="text-sm font-medium text-white text-emerald-400">
                    ${selectedCustomer.totalSpent?.toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>

              {/* Order History */}
              <div>
                <h4 className="text-sm uppercase tracking-widest font-mono text-zinc-500 mb-4 border-b border-white/5 pb-2">
                  Order History
                </h4>
                {(!selectedCustomer.orders ||
                  selectedCustomer.orders.length === 0) ? (
                  <p className="text-zinc-400 text-sm text-center py-6 bg-white/5 rounded-lg border border-white/5">
                    No orders placed yet.
                  </p>
                ) : (
                  <div className="bg-[#111214] border border-white/5 rounded-xl overflow-hidden divide-y divide-white/5">
                    {selectedCustomer.orders.map((order: any) => (
                      <div
                        key={order.id}
                        className="p-4 flex flex-wrap gap-4 items-center justify-between hover:bg-white/[0.02] transition-colors"
                      >
                        <div className="min-w-[120px]">
                          <p className="text-xs text-zinc-500 font-mono mb-1">
                            Order ID
                          </p>
                          <p className="text-sm font-medium text-white font-mono">
                            {order.order_number ||
                              order.id.slice(0, 8).toUpperCase()}
                          </p>
                        </div>
                        <div className="min-w-[100px]">
                          <p className="text-xs text-zinc-500 font-mono mb-1">
                            Date
                          </p>
                          <p className="text-sm text-zinc-300">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="min-w-[80px]">
                          <p className="text-xs text-zinc-500 font-mono mb-1">
                            Total
                          </p>
                          <p className="text-sm font-medium text-white">
                            ${order.total?.toFixed(2) || "0.00"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500 font-mono mb-1">
                            Status
                          </p>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider ${
                              statusColors[order.status] ||
                              statusColors.pending
                            }`}
                          >
                            {order.status || "pending"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
