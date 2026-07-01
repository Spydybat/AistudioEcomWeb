import {  useState, useMemo , useEffect } from "react";
import { Search } from "lucide-react";
import DataTable from "../../components/admin/DataTable";
import { fetchProducts, fetchCategories } from "../../data/products";

export default function AdminProductsPage() {
  const [PRODUCTS, setPRODUCTS] = useState<any[]>([]);
  const [CATEGORIES, setCATEGORIES] = useState<any[]>([]);
  useEffect(() => { fetchProducts().then(setPRODUCTS); fetchCategories().then(setCATEGORIES); }, []);
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
  }, [search, categoryFilter, PRODUCTS]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">Products</h1>
        <p className="text-zinc-400 text-sm mt-1">{PRODUCTS.length} products in catalog</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#1E1F22] border border-white/5 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 placeholder-zinc-500"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 bg-[#1E1F22] border border-white/5 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <DataTable headers={["Product", "Category", "Price", "Rating", "Reviews", "Status"]}>
        {filtered.map((product) => (
          <tr key={product.id} className="hover:bg-[#2B2D31] transition-colors">
            <td className="px-4 sm:px-6 py-3">
              <div className="flex items-center gap-3">
                <img
                  src={product?.images?.[0] ?? ""}
                  alt={product.name}
                  className="w-10 h-10 rounded-lg object-cover border border-white/5"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <p className="text-sm font-medium text-white line-clamp-1">{product.name}</p>
                  {product.badge && (
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">{product.badge}</span>
                  )}
                </div>
              </div>
            </td>
            <td className="px-4 sm:px-6 py-3 text-zinc-400 capitalize">{product.category}</td>
            <td className="px-4 sm:px-6 py-3 font-medium text-white">
              ${product.price}
              {product.originalPrice && (
                <span className="text-zinc-500 line-through ml-1 text-xs">${product.originalPrice}</span>
              )}
            </td>
            <td className="px-4 sm:px-6 py-3 text-zinc-400">{product.rating}</td>
            <td className="px-4 sm:px-6 py-3 text-zinc-400">{product.reviews}</td>
            <td className="px-4 sm:px-6 py-3">
              <span className="px-2 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Active
              </span>
            </td>
          </tr>
        ))}
      </DataTable>

      {filtered.length === 0 && (
        <p className="text-center text-zinc-500 py-8">No products match your search.</p>
      )}
    </div>
  );
}

