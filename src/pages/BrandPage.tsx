import { Link, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { BRANDS, PRODUCTS, getCategoryName } from "../data/products";
import { useShop } from "../context/ShopContext";

export default function BrandPage() {
  const { brandId } = useParams();
  const brand = BRANDS.find((item) => item.id === brandId);
  const { wishlist, handleAddToCart, handleToggleWishlist, setSelectedCategory } = useShop();

  if (!brand) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center flex-1">
        <h1 className="text-4xl font-serif mb-4">Brand Not Found</h1>
        <Link to="/products" className="text-zinc-400 underline">Return to Marketplace</Link>
      </div>
    );
  }

  const products = PRODUCTS.filter((product) => product.brandSlug === brand.id || product.brand === brand.name);
  const categories = brand.categoryIds.map((id) => ({ id, name: getCategoryName(id) }));

  return (
    <div className="flex-1 bg-white">
      <section className="relative min-h-[420px] overflow-hidden bg-neutral-950 text-white">
        <img src={brand.image} alt={brand.name} className="absolute inset-0 h-full w-full object-cover opacity-65" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/60 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <nav className="mb-16 flex text-[10px] uppercase tracking-widest text-white/50 font-mono">
            <Link to="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/products" className="hover:text-white">Brands</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{brand.name}</span>
          </nav>
          <p className="text-[10px] font-mono tracking-[0.4em] uppercase text-white/50 mb-4">Featured Brand</p>
          <h1 className="text-5xl sm:text-7xl font-serif font-bold uppercase leading-none">{brand.name}</h1>
          <p className="mt-6 max-w-xl text-sm leading-7 text-white/70">{brand.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className="rounded-full bg-white/10 border border-white/20 px-4 py-2 text-[10px] uppercase tracking-widest hover:bg-white hover:text-white transition-colors"
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
            <p className="text-[10px] font-mono tracking-[0.4em] uppercase text-zinc-400 mb-3">{products.length} Products</p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold uppercase text-white">Shop {brand.name}</h2>
          </div>
          <Link to="/products" className="text-xs uppercase tracking-widest text-zinc-300 hover:text-white">
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
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 py-16 text-center text-zinc-400">
            Products from this brand are being prepared for the catalog.
          </div>
        )}
      </section>
    </div>
  );
}
