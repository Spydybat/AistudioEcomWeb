import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { fetchBrands, fetchProducts, getCategoryName } from "../data/products";
import { useShop } from "../context/ShopContext";

export default function BrandPage() {
  const [PRODUCTS, setPRODUCTS] = useState<any[]>([]);
  const [BRANDS, setBRANDS] = useState<any[]>([]);
  useEffect(() => { fetchProducts().then(setPRODUCTS); fetchBrands().then(setBRANDS); }, []);
  useEffect(() => { fetchProducts().then(setPRODUCTS); fetchBrands().then(setBRANDS); }, []);
  const { brandId } = useParams();
  const brand = BRANDS.find((item) => item.id === brandId);
  const { wishlist, handleAddToCart, handleToggleWishlist, setSelectedCategory } = useShop();

  if (!brand) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center flex-1 bg-white">
        <h1 className="text-4xl font-sans font-bold tracking-tight uppercase text-black mb-4">Brand Not Found</h1>
        <Link to="/products" className="text-zinc-500 font-medium hover:text-black hover:underline transition-colors cursor-pointer">Return to Marketplace</Link>
      </div>
    );
  }

  const products = PRODUCTS.filter((product) => product.brandSlug === brand.id || product.brand === brand.name);
  const categories = (brand.categoryIds || []).map((id) => ({ id, name: getCategoryName(id) }));

  return (
    <div className="flex-1 bg-white">
      <section className="relative min-h-[420px] overflow-hidden bg-white text-black border-b border-zinc-200">
        <img src={brand.image || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2000'} alt={brand.name} className="absolute inset-0 h-full w-full object-cover opacity-20" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <nav className="mb-16 flex text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
            <Link to="/" className="hover:text-black cursor-pointer transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/products" className="hover:text-black cursor-pointer transition-colors">Brands</Link>
            <span className="mx-2">/</span>
            <span className="text-black">{brand.name}</span>
          </nav>
          <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-4">Featured Brand</p>
          <h1 className="text-5xl sm:text-7xl font-sans font-bold tracking-tight uppercase leading-none text-black">{brand.name}</h1>
          <p className="mt-6 max-w-xl text-sm leading-7 text-zinc-600 font-medium">{brand.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className="rounded-full bg-white border border-zinc-200 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-black hover:border-black transition-all cursor-pointer shadow-sm"
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-3">{products.length} Products</p>
            <h2 className="text-3xl sm:text-4xl font-sans font-bold tracking-tight uppercase text-black">Shop {brand.name}</h2>
          </div>
          <Link to="/products" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-black cursor-pointer transition-colors">
            View all marketplace products
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id}>
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                  onOpenQuickView={() => {}}
                  isWishlisted={wishlist.some((item) => item.id === product.id)}
                  onToggleWishlist={handleToggleWishlist}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-zinc-200 bg-zinc-50 py-16 text-center text-zinc-500 font-medium">
            Products from this brand are being prepared for the catalog.
          </div>
        )}
      </section>
    </div>
  );
}
