import React, { useState, useMemo, useEffect } from "react";
import { Search, Plus, Edit2, Trash2, X } from "lucide-react";
import DataTable from "../../components/admin/DataTable";
import { supabase } from "../../supabaseClient";

export default function AdminBrandsPage() {
  const [BRANDS, setBRANDS] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    tagline: "",
    image: "",
  });

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    const { data, error } = await supabase.from("brands").select("*").order("name");
    if (!error && data) {
      setBRANDS(data);
    }
  };

  const filtered = useMemo(() => {
    let result = [...BRANDS];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.slug?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [search, BRANDS]);

  const openAddModal = () => {
    setEditingBrand(null);
    setFormData({ 
      name: "", 
      slug: "", 
      tagline: "", 
      image: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (brand: any) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name || "",
      slug: brand.slug || "",
      tagline: brand.tagline || "",
      image: brand.image || "",
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (brand: any) => {
    setEditingBrand(brand);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      tagline: formData.tagline || null,
      image: formData.image || null,
    };

    if (editingBrand) {
      const { data, error } = await supabase.from("brands").update(payload).eq("id", editingBrand.id).select();

      if (error) {
        alert("Failed to update brand");
        console.error(error);
        return;
      }

      if (data && data.length > 0) {
        setBRANDS(BRANDS.map((b) => (b.id === editingBrand.id ? data[0] : b)));
      }
    } else {
      const { data, error } = await supabase.from("brands").insert([payload]).select();

      if (error) {
        alert("Failed to add brand");
        console.error(error);
        return;
      }

      if (data && data.length > 0) {
        setBRANDS([...BRANDS, data[0]]);
      }
    }
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (!editingBrand) return;
    
    const { error } = await supabase.from("brands").delete().eq("id", editingBrand.id);

    if (error) {
      alert("Failed to delete brand");
      console.error(error);
      return;
    }

    setBRANDS(BRANDS.filter((b) => b.id !== editingBrand.id));
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Brands
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            {BRANDS.length} brands total
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          Add Brand
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search brands..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#1E1F22] border border-white/5 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 placeholder-zinc-500"
          />
        </div>
      </div>

      <DataTable
        headers={[
          "Brand",
          "Slug",
          "Tagline",
          "Created At",
          "Actions",
        ]}
      >
        {filtered.map((brand) => (
          <tr key={brand.id} className="hover:bg-[#2B2D31] transition-colors">
            <td className="px-4 sm:px-6 py-3">
              <div className="flex items-center gap-3">
                {brand.image && (
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="w-10 h-10 rounded-lg object-cover border border-white/5"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div>
                  <p className="text-sm font-medium text-white line-clamp-1">
                    {brand.name}
                  </p>
                </div>
              </div>
            </td>
            <td className="px-4 sm:px-6 py-3 text-zinc-400">
              {brand.slug}
            </td>
            <td className="px-4 sm:px-6 py-3 text-zinc-400 line-clamp-1">
              {brand.tagline || "-"}
            </td>
            <td className="px-4 sm:px-6 py-3 text-zinc-400 text-sm">
              {new Date(brand.created_at).toLocaleDateString()}
            </td>
            <td className="px-4 sm:px-6 py-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(brand)}
                  className="p-1.5 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-md transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => openDeleteModal(brand)}
                  className="p-1.5 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-md transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>

      {filtered.length === 0 && (
        <p className="text-center text-zinc-500 py-8">
          No brands match your search.
        </p>
      )}

      {/* Add/Edit Brand Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 overflow-y-auto">
          <div className="bg-[#1E1F22] border border-white/10 rounded-xl w-full max-w-lg overflow-hidden my-8">
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <h2 className="text-lg font-medium text-white">
                {editingBrand ? "Edit Brand" : "Add Brand"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#111214] border border-white/5 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Slug (optional)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="Auto-generated if left blank"
                  className="w-full px-3 py-2 bg-[#111214] border border-white/5 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) =>
                    setFormData({ ...formData, tagline: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#111214] border border-white/5 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#111214] border border-white/5 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                  {editingBrand ? "Save Changes" : "Create Brand"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-[#1E1F22] border border-white/10 rounded-xl w-full max-w-sm overflow-hidden p-6 text-center">
            <Trash2 className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Delete Brand?
            </h2>
            <p className="text-zinc-400 text-sm mb-6">
              Are you sure you want to delete &quot;{editingBrand?.name}&quot;? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
