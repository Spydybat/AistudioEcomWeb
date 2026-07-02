import React, { useState, useMemo, useEffect } from "react";
import { Search, Plus, Edit2, Trash2, X } from "lucide-react";
import DataTable from "../../components/admin/DataTable";
import { supabase } from "../../supabaseClient";

export default function AdminCategoriesPage() {
  const [CATEGORIES, setCATEGORIES] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    featured: false,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase.from("categories").select("*").order("name");
    if (!error && data) {
      setCATEGORIES(data);
    }
  };

  const filtered = useMemo(() => {
    let result = [...CATEGORIES];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.slug?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [search, CATEGORIES]);

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({ 
      name: "", 
      slug: "", 
      description: "", 
      image: "", 
      featured: false 
    });
    setIsModalOpen(true);
  };

  const openEditModal = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || "",
      slug: category.slug || "",
      description: category.description || "",
      image: category.image || "",
      featured: !!category.featured,
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (category: any) => {
    setEditingCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: formData.description || null,
      image: formData.image || null,
      featured: formData.featured,
    };

    if (editingCategory) {
      const { data, error } = await supabase.from("categories").update(payload).eq("id", editingCategory.id).select();

      if (error) {
        alert("Failed to update category");
        console.error(error);
        return;
      }

      if (data && data.length > 0) {
        setCATEGORIES(CATEGORIES.map((c) => (c.id === editingCategory.id ? data[0] : c)));
      }
    } else {
      const { data, error } = await supabase.from("categories").insert([payload]).select();

      if (error) {
        alert("Failed to add category");
        console.error(error);
        return;
      }

      if (data && data.length > 0) {
        setCATEGORIES([...CATEGORIES, data[0]]);
      }
    }
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (!editingCategory) return;
    
    const { error } = await supabase.from("categories").delete().eq("id", editingCategory.id);

    if (error) {
      alert("Failed to delete category");
      console.error(error);
      return;
    }

    setCATEGORIES(CATEGORIES.filter((c) => c.id !== editingCategory.id));
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-black">
            Categories
          </h1>
          <p className="text-zinc-600 text-sm mt-1">
            {CATEGORIES.length} categories total
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-zinc-800 text-black rounded-lg transition-colors text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-lg text-sm text-black focus:outline-none focus:border-indigo-500 placeholder-zinc-500"
          />
        </div>
      </div>

      <DataTable
        headers={[
          "Category",
          "Slug",
          "Featured",
          "Created At",
          "Actions",
        ]}
      >
        {filtered.map((category) => (
          <tr key={category.id} className="hover:bg-zinc-100 transition-colors">
            <td className="px-4 sm:px-6 py-3">
              <div className="flex items-center gap-3">
                {category.image && (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-10 h-10 rounded-lg object-cover border border-zinc-200"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div>
                  <p className="text-sm font-medium text-black line-clamp-1">
                    {category.name}
                  </p>
                  {category.description && (
                    <p className="text-xs text-zinc-600 line-clamp-1">
                      {category.description}
                    </p>
                  )}
                </div>
              </div>
            </td>
            <td className="px-4 sm:px-6 py-3 text-zinc-600">
              {category.slug}
            </td>
            <td className="px-4 sm:px-6 py-3">
              <span className={`px-2 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider ${category.featured ? 'bg-zinc-100 text-black border border-indigo-500/20' : 'bg-zinc-500/10 text-zinc-600 border border-zinc-500/20'}`}>
                {category.featured ? "Yes" : "No"}
              </span>
            </td>
            <td className="px-4 sm:px-6 py-3 text-zinc-600 text-sm">
              {new Date(category.created_at).toLocaleDateString()}
            </td>
            <td className="px-4 sm:px-6 py-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(category)}
                  className="p-1.5 text-zinc-600 hover:text-black bg-zinc-100 hover:bg-zinc-200 rounded-md transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => openDeleteModal(category)}
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
        <p className="text-center text-zinc-600 py-8">
          No categories match your search.
        </p>
      )}

      {/* Add/Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 overflow-y-auto">
          <div className="bg-white border border-zinc-300 rounded-2xl w-full max-w-lg overflow-hidden my-8">
            <div className="flex items-center justify-between p-4 border-b border-zinc-200">
              <h2 className="text-lg font-medium text-black">
                {editingCategory ? "Edit Category" : "Add Category"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-600 hover:text-black transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-black focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Slug (optional)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="Auto-generated if left blank"
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-black focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-black focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-black focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-zinc-300 bg-zinc-50 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-[white]"
                />
                <label htmlFor="featured" className="text-sm font-medium text-zinc-700">
                  Featured Category
                </label>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-700 hover:text-black bg-zinc-100 hover:bg-zinc-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-black bg-black text-white hover:bg-zinc-800 transition-colors"
                >
                  {editingCategory ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-white border border-zinc-300 rounded-2xl w-full max-w-sm overflow-hidden p-6 text-center">
            <Trash2 className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-black mb-2">
              Delete Category?
            </h2>
            <p className="text-zinc-600 text-sm mb-6">
              Are you sure you want to delete &quot;{editingCategory?.name}&quot;? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-700 hover:text-black bg-zinc-100 hover:bg-zinc-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg text-sm font-medium text-black bg-red-500 hover:bg-red-600 transition-colors"
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
