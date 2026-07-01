import {  useState, useMemo , useEffect } from "react";
import { Search } from "lucide-react";
import DataTable from "../../components/admin/DataTable";
import { fetchCustomers } from "../../data/adminData";

export default function AdminCustomersPage() {
  const [CUSTOMERS, setCUSTOMERS] = useState<any[]>([]);
  useEffect(() => { fetchCustomers().then(setCUSTOMERS); }, []);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return CUSTOMERS;
    const q = search.toLowerCase();
    return CUSTOMERS.filter(
      (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    );
  }, [search, CUSTOMERS]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">Customers</h1>
        <p className="text-zinc-400 text-sm mt-1">{CUSTOMERS.length} registered customers</p>
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

      <DataTable headers={["ID", "Name", "Email", "Orders", "Total Spent", "Joined", "Status"]}>
        {filtered.map((customer) => (
          <tr key={customer.id} className="hover:bg-[#2B2D31] transition-colors">
            <td className="px-4 sm:px-6 py-3 font-mono text-xs text-zinc-500">{customer.id}</td>
            <td className="px-4 sm:px-6 py-3 font-medium text-white">{customer.name}</td>
            <td className="px-4 sm:px-6 py-3 text-zinc-400 text-xs">{customer.email}</td>
            <td className="px-4 sm:px-6 py-3 text-zinc-400">{customer.orders}</td>
            <td className="px-4 sm:px-6 py-3 font-medium text-white">${customer.totalSpent.toLocaleString()}</td>
            <td className="px-4 sm:px-6 py-3 text-zinc-400 text-xs">{customer.joinedDate}</td>
            <td className="px-4 sm:px-6 py-3">
              <span
                className={`px-2 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider border ${
                  customer.status === "active"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-neutral-500/10 text-zinc-400 border-neutral-500/20"
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

