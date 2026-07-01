import React, { useState, useMemo, useEffect } from "react";
import { Search, Plus, Edit2, Trash2, X } from "lucide-react";
import DataTable from "../../components/admin/DataTable";
import { fetchProducts, fetchCategories, fetchBrands } from "../../data/products";
import { supabase } from "../../supabaseClient";

export default function AdminProductsPage() {
  const [PRODUCTS, setPRODUCTS] = useState<any[]>([]);
  const [CATEGORIES, setCATEGORIES] = useState<any[]>([]);
  const [BRANDS, setBRANDS] = useState<any[]>([]);
  const [rawCategories, setRawCategories] = useState<any[]>([]);
  const [rawBrands, setRawBrands] = useState<any[]>([]);
  
  useEffect(() => {
    fetchProducts().then(setPRODUCTS);
    fetchCategories().then(setCATEGORIES);
    fetchBrands().then(setBRANDS);
    
    // Fetch raw data to get actual UUIDs
    supabase.from('categories').select('id, name, slug').then(({data}) => setRawCategories(data || []));
    supabase.from('brands').select('id, name, slug').then(({data}) => setRawBrands(data || []));
  }, []);
  
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    category_id: "",
    brand_id: "",
    thumbnail: "",
    details: [] as string[],
    specifications: [] as { key: string; value: string }[],
    colors: [] as { name: string; hex: string }[],
    sizes: [] as string[],
  });

  const isApparelCategory = useMemo(() => {
    if (!formData.category_id) return false;
    const cat = rawCategories.find(c => c.id === formData.category_id);
    if (!cat) return false;
    const identifier = (cat.slug || cat.name).toLowerCase();
    return ['fashion', 'apparel', 'clothing', 'shoes', 'footwear'].includes(identifier);
  }, [formData.category_id, rawCategories]);

  const filtered = useMemo(() => {
    let result = [...PRODUCTS];
    if (categoryFilter !== "all") {
      result = result.filter((p) => p.category === categoryFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [search, categoryFilter, PRODUCTS]);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ 
      name: "", 
      price: "", 
      stock: "", 
      description: "", 
      category_id: "", 
      brand_id: "", 
      thumbnail: "", 
      details: [""],
      specifications: [{ key: "", value: "" }],
      colors: [{ name: "", hex: "#000000" }],
      sizes: [""],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      price: product.price?.toString() || "",
      stock: product.stock?.toString() || "",
      description: product.description || "",
      category_id: product.category_id || "",
      brand_id: product.brand_id || "",
      thumbnail: product.thumbnail || product.images?.[0] || "",
      details: Array.isArray(product.details) && product.details.length > 0 ? product.details : [""],
      specifications: product.specifications && Object.keys(product.specifications).length > 0 
        ? Object.entries(product.specifications).map(([k, v]) => ({ key: k, value: v as string }))
        : [{ key: "", value: "" }],
      colors: Array.isArray(product.colors) && product.colors.length > 0 ? product.colors : [{ name: "", hex: "#000000" }],
      sizes: Array.isArray(product.sizes) && product.sizes.length > 0 ? product.sizes : [""],
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (product: any) => {
    setEditingProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category_id || !formData.brand_id) {
      alert("Please select both a Category and a Brand.");
      return;
    }
    
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(formData.category_id) || !uuidRegex.test(formData.brand_id)) {
      alert("Invalid selection: Category or Brand ID is not a valid UUID.");
      return;
    }
    
    const payload = {
      name: formData.name,
      price: parseFloat(formData.price) || 0,
      stock: parseInt(formData.stock, 10) || 0,
      description: formData.description,
      category_id: formData.category_id,
      brand_id: formData.brand_id,
      thumbnail: formData.thumbnail || null,
    };

    const categoryObj = CATEGORIES.find(c => c.id === formData.category_id);
    const brandObj = BRANDS.find(b => b.id === formData.brand_id);
    const categoryName = categoryObj ? (categoryObj.slug || categoryObj.name) : "uncategorized";
    const brandName = brandObj ? brandObj.name : "Unknown";
    
    const validDetails = formData.details.filter(d => d.trim());
    const validSpecs = formData.specifications.filter(s => s.key.trim() && s.value.trim());
    const validColors = formData.colors.filter(c => c.name.trim() && c.hex.trim());
    const validSizes = isApparelCategory ? formData.sizes.filter(s => s.trim()) : [];
    const specsObject = validSpecs.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});

    if (editingProduct) {
      const { error } = await supabase.from("products").update(payload).eq("id", editingProduct.id);

      if (error) {
        alert("Failed to update product");
        console.error(error);
        return;
      }

      if (payload.thumbnail) {
        const { data: existingImages } = await supabase
          .from('product_images')
          .select('id')
          .eq('product_id', editingProduct.id)
          .eq('sort_order', 0);

        if (existingImages && existingImages.length > 0) {
          await supabase.from('product_images').update({ image_url: payload.thumbnail }).eq('id', existingImages[0].id);
        } else {
          await supabase.from('product_images').insert([{ product_id: editingProduct.id, image_url: payload.thumbnail, sort_order: 0 }]);
        }
      }

      // Update Details
      await supabase.from('product_details').delete().eq('product_id', editingProduct.id);
      if (validDetails.length > 0) {
        const detailsPayload = validDetails.map(d => ({ product_id: editingProduct.id, detail: d }));
        await supabase.from('product_details').insert(detailsPayload);
      }

      // Update Specifications
      await supabase.from('product_specifications').delete().eq('product_id', editingProduct.id);
      if (validSpecs.length > 0) {
        const specsPayload = validSpecs.map(s => ({ product_id: editingProduct.id, spec_key: s.key, spec_value: s.value }));
        await supabase.from('product_specifications').insert(specsPayload);
      }
      
      // Update Colors
      await supabase.from('product_colors').delete().eq('product_id', editingProduct.id);
      if (validColors.length > 0) {
        const colorsPayload = validColors.map(c => ({ product_id: editingProduct.id, color_name: c.name, color_hex: c.hex }));
        await supabase.from('product_colors').insert(colorsPayload);
      }

      // Update Sizes
      await supabase.from('product_sizes').delete().eq('product_id', editingProduct.id);
      if (validSizes.length > 0) {
        const sizesPayload = validSizes.map(s => ({ product_id: editingProduct.id, size: s }));
        await supabase.from('product_sizes').insert(sizesPayload);
      }

      setPRODUCTS(
        PRODUCTS.map((p) =>
          p.id === editingProduct.id ? { 
            ...p, 
            ...payload,
            category: categoryName,
            brand: brandName,
            images: payload.thumbnail ? [payload.thumbnail] : p.images,
            details: validDetails,
            specifications: specsObject,
            colors: validColors,
            sizes: validSizes,
          } : p
        )
      );
    } else {
      const newProduct = {
        ...payload,
        slug: payload.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        sku: `SKU-${Date.now()}`,
      };
      const { data, error } = await supabase.from("products").insert([newProduct]).select();

      if (error) {
        alert("Failed to add product");
        console.error(error);
        return;
      }

      if (data && data.length > 0) {
        const newProdId = data[0].id;
        
        if (payload.thumbnail) {
          await supabase.from('product_images').insert([{ product_id: newProdId, image_url: payload.thumbnail, sort_order: 0 }]);
        }

        if (validDetails.length > 0) {
          const detailsPayload = validDetails.map(d => ({ product_id: newProdId, detail: d }));
          await supabase.from('product_details').insert(detailsPayload);
        }

        if (validSpecs.length > 0) {
          const specsPayload = validSpecs.map(s => ({ product_id: newProdId, spec_key: s.key, spec_value: s.value }));
          await supabase.from('product_specifications').insert(specsPayload);
        }
        
        if (validColors.length > 0) {
          const colorsPayload = validColors.map(c => ({ product_id: newProdId, color_name: c.name, color_hex: c.hex }));
          await supabase.from('product_colors').insert(colorsPayload);
        }

        if (validSizes.length > 0) {
          const sizesPayload = validSizes.map(s => ({ product_id: newProdId, size: s }));
          await supabase.from('product_sizes').insert(sizesPayload);
        }

        const added = {
          ...data[0],
          category: categoryName,
          brand: brandName,
          reviews: 0,
          rating: 0,
          images: payload.thumbnail ? [payload.thumbnail] : [],
          details: validDetails,
          specifications: specsObject,
          colors: validColors,
          sizes: validSizes,
        };
        setPRODUCTS([added, ...PRODUCTS]);
      }
    }
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (!editingProduct) return;
    
    await supabase.from("product_sizes").delete().eq("product_id", editingProduct.id);
    await supabase.from("product_colors").delete().eq("product_id", editingProduct.id);
    await supabase.from("product_images").delete().eq("product_id", editingProduct.id);
    await supabase.from("product_details").delete().eq("product_id", editingProduct.id);
    await supabase.from("product_specifications").delete().eq("product_id", editingProduct.id);

    const { error } = await supabase.from("products").delete().eq("id", editingProduct.id);

    if (error) {
      alert("Failed to delete product");
      console.error(error);
      return;
    }

    setPRODUCTS(PRODUCTS.filter((p) => p.id !== editingProduct.id));
    setIsDeleteModalOpen(false);
  };

  const handleDetailChange = (index: number, value: string) => {
    const newDetails = [...formData.details];
    newDetails[index] = value;
    setFormData({ ...formData, details: newDetails });
  };

  const handleAddDetail = () => {
    setFormData({ ...formData, details: [...formData.details, ""] });
  };

  const handleRemoveDetail = (index: number) => {
    const newDetails = formData.details.filter((_, i) => i !== index);
    setFormData({ ...formData, details: newDetails });
  };

  const handleSpecChange = (index: number, field: "key" | "value", value: string) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index][field] = value;
    setFormData({ ...formData, specifications: newSpecs });
  };

  const handleAddSpec = () => {
    setFormData({ ...formData, specifications: [...formData.specifications, { key: "", value: "" }] });
  };

  const handleRemoveSpec = (index: number) => {
    const newSpecs = formData.specifications.filter((_, i) => i !== index);
    setFormData({ ...formData, specifications: newSpecs });
  };

  const handleColorChange = (index: number, field: "name" | "hex", value: string) => {
    const newColors = [...formData.colors];
    newColors[index][field] = value;
    setFormData({ ...formData, colors: newColors });
  };

  const handleAddColor = () => {
    setFormData({ ...formData, colors: [...formData.colors, { name: "", hex: "#000000" }] });
  };

  const handleRemoveColor = (index: number) => {
    const newColors = formData.colors.filter((_, i) => i !== index);
    setFormData({ ...formData, colors: newColors });
  };

  const handleSizeChange = (index: number, value: string) => {
    const newSizes = [...formData.sizes];
    newSizes[index] = value;
    setFormData({ ...formData, sizes: newSizes });
  };

  const handleAddSize = () => {
    setFormData({ ...formData, sizes: [...formData.sizes, ""] });
  };

  const handleRemoveSize = (index: number) => {
    const newSizes = formData.sizes.filter((_, i) => i !== index);
    setFormData({ ...formData, sizes: newSizes });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Products
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            {PRODUCTS.length} products in catalog
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
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
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <DataTable
        headers={[
          "Product",
          "Category",
          "Price",
          "Rating",
          "Reviews",
          "Status",
          "Actions",
        ]}
      >
        {filtered.map((product) => (
          <tr key={product.id} className="hover:bg-[#2B2D31] transition-colors">
            <td className="px-4 sm:px-6 py-3">
              <div className="flex items-center gap-3">
                <img
                  src={product?.images?.[0] || product?.thumbnail || ""}
                  alt={product.name}
                  className="w-10 h-10 rounded-lg object-cover border border-white/5"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <p className="text-sm font-medium text-white line-clamp-1">
                    {product.name}
                  </p>
                  {product.badge && (
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">
                      {product.badge}
                    </span>
                  )}
                </div>
              </div>
            </td>
            <td className="px-4 sm:px-6 py-3 text-zinc-400 capitalize">
              {product.category || "uncategorized"}
            </td>
            <td className="px-4 sm:px-6 py-3 font-medium text-white">
              ${product.price}
              {product.originalPrice && (
                <span className="text-zinc-500 line-through ml-1 text-xs">
                  ${product.originalPrice}
                </span>
              )}
            </td>
            <td className="px-4 sm:px-6 py-3 text-zinc-400">
              {product.rating ?? "0"}
            </td>
            <td className="px-4 sm:px-6 py-3 text-zinc-400">
              {product.reviews ?? "0"}
            </td>
            <td className="px-4 sm:px-6 py-3">
              <span className="px-2 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Active
              </span>
            </td>
            <td className="px-4 sm:px-6 py-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(product)}
                  className="p-1.5 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-md transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => openDeleteModal(product)}
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
          No products match your search.
        </p>
      )}

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 overflow-y-auto">
          <div className="bg-[#1E1F22] border border-white/10 rounded-xl w-full max-w-lg overflow-hidden my-8">
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <h2 className="text-lg font-medium text-white">
                {editingProduct ? "Edit Product" : "Add Product"}
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#111214] border border-white/5 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#111214] border border-white/5 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">
                    Category
                  </label>
                  <select
                    required
                    value={formData.category_id}
                    onChange={(e) =>
                      setFormData({ ...formData, category_id: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#111214] border border-white/5 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="" disabled>Select a category</option>
                    {rawCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">
                    Brand
                  </label>
                  <select
                    required
                    value={formData.brand_id}
                    onChange={(e) =>
                      setFormData({ ...formData, brand_id: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#111214] border border-white/5 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="" disabled>Select a brand</option>
                    {rawBrands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Primary Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.thumbnail}
                  onChange={(e) =>
                    setFormData({ ...formData, thumbnail: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#111214] border border-white/5 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#111214] border border-white/5 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Product Details Section */}
              <div className="pt-2 border-t border-white/5">
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Product Details
                </label>
                <div className="space-y-2">
                  {formData.details.map((detail, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={detail}
                        onChange={(e) => handleDetailChange(index, e.target.value)}
                        placeholder={`Detail line ${index + 1}`}
                        className="w-full px-3 py-2 bg-[#111214] border border-white/5 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveDetail(index)}
                        className="p-2 text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleAddDetail}
                  className="mt-3 flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Detail Line
                </button>
              </div>
              
              {/* Specifications Section */}
              <div className="pt-2 border-t border-white/5">
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Specifications
                </label>
                <div className="space-y-2">
                  {formData.specifications.map((spec, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={spec.key}
                        onChange={(e) => handleSpecChange(index, "key", e.target.value)}
                        placeholder="e.g. Material"
                        className="w-1/3 px-3 py-2 bg-[#111214] border border-white/5 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                      <input
                        type="text"
                        value={spec.value}
                        onChange={(e) => handleSpecChange(index, "value", e.target.value)}
                        placeholder="e.g. Organic Cotton"
                        className="flex-1 px-3 py-2 bg-[#111214] border border-white/5 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSpec(index)}
                        className="p-2 text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleAddSpec}
                  className="mt-3 flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Specification
                </button>
              </div>
              
              {/* Colors Section */}
              <div className="pt-2 border-t border-white/5">
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Colors
                </label>
                <div className="space-y-2">
                  {formData.colors.map((color, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={color.name}
                        onChange={(e) => handleColorChange(index, "name", e.target.value)}
                        placeholder="e.g. Obsidian Black"
                        className="flex-1 px-3 py-2 bg-[#111214] border border-white/5 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                      <div className="relative">
                        <input
                          type="color"
                          value={color.hex || "#000000"}
                          onChange={(e) => handleColorChange(index, "hex", e.target.value)}
                          className="w-10 h-10 p-0 border-0 rounded-lg overflow-hidden cursor-pointer bg-transparent"
                        />
                      </div>
                      <input
                        type="text"
                        value={color.hex}
                        onChange={(e) => handleColorChange(index, "hex", e.target.value)}
                        placeholder="#000000"
                        className="w-24 px-3 py-2 bg-[#111214] border border-white/5 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 font-mono uppercase"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(index)}
                        className="p-2 text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleAddColor}
                  className="mt-3 flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Color
                </button>
              </div>

              {/* Sizes Section */}
              {isApparelCategory && (
                <div className="pt-2 border-t border-white/5">
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Sizes
                  </label>
                  <div className="space-y-2">
                    {formData.sizes.map((size, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={size}
                          onChange={(e) => handleSizeChange(index, e.target.value)}
                          placeholder="e.g. XL"
                          className="w-full px-3 py-2 bg-[#111214] border border-white/5 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 uppercase"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSize(index)}
                          className="p-2 text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSize}
                    className="mt-3 flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add Size
                  </button>
                </div>
              )}

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
                  {editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal for Product */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-[#1E1F22] border border-white/10 rounded-xl w-full max-w-sm overflow-hidden p-6 text-center">
            <Trash2 className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Delete Product?
            </h2>
            <p className="text-zinc-400 text-sm mb-6">
              Are you sure you want to delete "{editingProduct?.name}"? This
              action cannot be undone.
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
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
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
