import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import DataTable from "../../components/admin/DataTable";
import { PRODUCTS, CATEGORIES } from "../../data/products";

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filtered = useMemo(() => {
    let result = [...PRODUCTS];
    if (categoryFilter !== "all") {
      result = result.filter((p) => p.category === categoryFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }
    return result;
  }, [search, categoryFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900">Products</h1>
        <p className="text-neutral-500 text-sm mt-1">{PRODUCTS.length} products in catalog</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-neutral-900"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 border border-neutral-200 rounded-lg text-sm bg-white focus:outline-none focus:border-neutral-900"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <DataTable headers={["Product", "Category", "Price", "Rating", "Reviews", "Status"]}>
        {filtered.map((product) => (
          <tr key={product.id} className="hover:bg-neutral-50">
            <td className="px-4 sm:px-6 py-3">
              <div className="flex items-center gap-3">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-10 h-10 rounded-lg object-cover border border-neutral-100"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <p className="text-sm font-medium text-neutral-900 line-clamp-1">{product.name}</p>
                  {product.badge && (
                    <span className="text-[10px] font-mono text-neutral-500 uppercase">{product.badge}</span>
                  )}
                </div>
              </div>
            </td>
            <td className="px-4 sm:px-6 py-3 text-neutral-600 capitalize">{product.category}</td>
            <td className="px-4 sm:px-6 py-3 font-medium text-neutral-900">
              ${product.price}
              {product.originalPrice && (
                <span className="text-neutral-400 line-through ml-1 text-xs">${product.originalPrice}</span>
              )}
            </td>
            <td className="px-4 sm:px-6 py-3 text-neutral-600">{product.rating}</td>
            <td className="px-4 sm:px-6 py-3 text-neutral-600">{product.reviews}</td>
            <td className="px-4 sm:px-6 py-3">
              <span className="px-2 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-emerald-100 text-emerald-700">
                Active
              </span>
            </td>
          </tr>
        ))}
      </DataTable>

      {filtered.length === 0 && (
        <p className="text-center text-neutral-500 py-8">No products match your search.</p>
      )}
    </div>
  );
}
