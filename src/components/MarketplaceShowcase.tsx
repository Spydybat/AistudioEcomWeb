import { Link } from "react-router-dom";
import { ArrowRight, BadgePercent, Building2, Sparkles } from "lucide-react";
import { BRANDS, CATEGORIES, PRODUCTS } from "../data/products";

interface MarketplaceShowcaseProps {
  onFilterCategory: (catId: string) => void;
}

export default function MarketplaceShowcase({ onFilterCategory }: MarketplaceShowcaseProps) {
  const featuredBrands = BRANDS.slice(0, 6);
  const flashDeals = PRODUCTS.filter((product) => product.isFlashDeal).slice(0, 4);
  const featuredDepartments = CATEGORIES.filter((category) => category.id !== "all" && category.featured).slice(0, 8);

  return (
    <section className="bg-[#111214] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div>
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="text-[10px] font-mono tracking-[0.4em] uppercase text-zinc-500 mb-3 flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Featured Brands
              </p>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold uppercase text-white">Premium Brand Pages</h2>
            </div>
            <Link to="/products" className="hidden sm:inline-flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
              Browse marketplace <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredBrands.map((brand) => (
              <Link key={brand.id} to={`/brand/${brand.id}`} className="group overflow-hidden rounded-2xl border border-white/5 bg-[#1E1F22] hover:bg-[#2B2D31] hover:shadow-lg hover:border-white/10 transition-all">
                <div className="relative h-40 overflow-hidden">
                  <img src={brand.image} alt={brand.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <h3 className="absolute bottom-4 left-4 text-2xl font-serif font-bold uppercase text-white">{brand.name}</h3>
                </div>
                <p className="p-4 text-sm leading-6 text-zinc-400">{brand.tagline}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-6">
          <div className="rounded-2xl bg-[#1E1F22] border border-white/5 p-8 text-white">
            <p className="text-[10px] font-mono tracking-[0.4em] uppercase text-zinc-500 mb-4 flex items-center gap-2">
              <BadgePercent className="h-4 w-4" />
              Flash Deals
            </p>
            <h2 className="text-4xl font-serif font-bold uppercase">Limited-time marketplace offers</h2>
            <p className="mt-4 text-sm leading-7 text-white/65">Deal flags, crossed-out pricing, savings badges, and deal-aware filters are now part of the catalog architecture.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {flashDeals.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="rounded-2xl border border-white/5 bg-[#1E1F22] p-4 hover:border-indigo-500 hover:bg-[#2B2D31] transition-all">
                <div className="flex gap-4">
                  <img src={product.images[0]} alt={product.name} className="h-24 w-24 rounded-xl object-cover" referrerPolicy="no-referrer" />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-red-500">Deal ends {product.dealEndsAt || "soon"}</p>
                    <h3 className="mt-1 line-clamp-2 text-sm font-medium text-zinc-100">{product.name}</h3>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="font-semibold text-white">${product.price}.00</span>
                      {product.originalPrice && <span className="text-sm text-zinc-500 line-through">${product.originalPrice}.00</span>}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-mono tracking-[0.4em] uppercase text-zinc-500 mb-6 flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Department Navigation
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {featuredDepartments.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  onFilterCategory(category.id);
                  document.getElementById("product-catalog")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group rounded-2xl border border-white/5 bg-[#1E1F22] p-4 text-left hover:bg-[#2B2D31] hover:border-white/20 transition-all cursor-pointer"
              >
                <span className="block text-xs uppercase tracking-widest text-zinc-300 group-hover:text-white transition-colors">{category.name}</span>
                <span className="mt-2 block text-[11px] leading-5 text-zinc-500 group-hover:text-zinc-400 transition-colors">
                  {category.subcategories?.slice(0, 3).join(", ")}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
