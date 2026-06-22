import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import DataTable from "../../components/admin/DataTable";
import { CUSTOMERS } from "../../data/adminData";

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return CUSTOMERS;
    const q = search.toLowerCase();
    return CUSTOMERS.filter(
      (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900">Customers</h1>
        <p className="text-neutral-500 text-sm mt-1">{CUSTOMERS.length} registered customers</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-neutral-900"
        />
      </div>

      <DataTable headers={["ID", "Name", "Email", "Orders", "Total Spent", "Joined", "Status"]}>
        {filtered.map((customer) => (
          <tr key={customer.id} className="hover:bg-neutral-50">
            <td className="px-4 sm:px-6 py-3 font-mono text-xs text-neutral-500">{customer.id}</td>
            <td className="px-4 sm:px-6 py-3 font-medium text-neutral-900">{customer.name}</td>
            <td className="px-4 sm:px-6 py-3 text-neutral-600 text-xs">{customer.email}</td>
            <td className="px-4 sm:px-6 py-3 text-neutral-600">{customer.orders}</td>
            <td className="px-4 sm:px-6 py-3 font-medium text-neutral-900">${customer.totalSpent.toLocaleString()}</td>
            <td className="px-4 sm:px-6 py-3 text-neutral-600 text-xs">{customer.joinedDate}</td>
            <td className="px-4 sm:px-6 py-3">
              <span
                className={`px-2 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider ${
                  customer.status === "active"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-neutral-100 text-neutral-500"
                }`}
              >
                {customer.status}
              </span>
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
