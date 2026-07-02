import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle, GitCompare, Heart, RotateCcw, Share2, ShieldCheck, ShoppingBag, Star, Truck } from "lucide-react";
import { fetchProducts, getCategoryName, getProductsByIds, getRelatedProducts, LOCAL_PRODUCTS } from "../data/products";
import { Product } from "../types";
import { useShop } from "../context/ShopContext";
import { useCurrency } from "../context/CurrencyContext";

import FAQAccordion from "../components/FAQAccordion";
import ProductGallery from "../components/ProductGallery";
import ProductSlider from "../components/ProductSlider";
import ProductTabs from "../components/ProductTabs";

const MARKETPLACE_FAQS = [
  {
    question: "How do variants work?",
    answer: "Choose the color, finish, size, storage, bundle, or format shown on the product page. Your selected option is saved into the cart line item.",
  },
  {
    question: "Are returns supported across departments?",
    answer: "Most marketplace items are eligible for 30-day returns when unused and returned with original packaging. Category-specific exclusions are handled at checkout.",
  },
  {
    question: "How are recommendations selected?",
    answer: "Recommendations combine the same department, brand affinity, tags, and explicitly curated related products from the catalog data.",
  },
];

export default function ProductDetailsPage() {
  const [PRODUCTS, setPRODUCTS] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts().then((data) => {
      setPRODUCTS(data);
      setIsLoading(false);
    });
  }, []);

  const { id } = useParams();
  const { wishlist, handleAddToCart, handleToggleWishlist, setIsCartOpen, showToast } = useShop();
  const { formatPrice } = useCurrency();
  
  const activeProducts = PRODUCTS.length > 0 ? PRODUCTS : LOCAL_PRODUCTS;
  const product = activeProducts.find((item) => item.id === id || item.slug === id || String(item.id) === String(id));

  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] ?? { name: "Default", hex: "#000" });
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[1] ?? product?.sizes?.[0] ?? "Default");
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  useEffect(() => {
    if (product) {
      setSelectedColor(product?.colors?.[0] ?? { name: "Default", hex: "#000" });
      setSelectedSize(product?.sizes?.[1] ?? product?.sizes?.[0] ?? "Default");
      setQuantity(1);
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const stored = JSON.parse(localStorage.getItem("aura_recently_viewed") || "[]") as string[];
    setRecentlyViewed(getProductsByIds(stored.filter((itemId) => itemId !== product.id), activeProducts).slice(0, 4));
    const nextIds = [product.id, ...stored.filter((itemId) => itemId !== product.id)].slice(0, 8);
    localStorage.setItem("aura_recently_viewed", JSON.stringify(nextIds));
  }, [product]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center flex-1">
        <p className="text-zinc-500 font-medium">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center flex-1">
        <h1 className="text-4xl font-sans font-bold text-black uppercase mb-4">Product Not Found</h1>
        <Link to="/products" className="text-zinc-500 font-bold uppercase tracking-widest text-xs hover:text-black underline">Return to Shop</Link>
      </div>
    );
  }

  const isWishlisted = wishlist.some((item) => item.id === product.id);
  const isOutOfStock = product.stock === 0;
  const variantLabel = product.variants?.[0]?.label || (product.category === "fashion" ? "Size" : "Option");
  const relatedProducts = getRelatedProducts(product, 6, activeProducts);
  const frequentlyBoughtTogether = getProductsByIds(product.frequentlyBoughtTogether, activeProducts).slice(0, 3);
  const comparisonProducts = [product, ...relatedProducts.slice(0, 2)];

  const handleQuickAdd = () => {
    if (!selectedColor || !selectedSize) return;
    setIsAdding(true);
    setTimeout(() => {
      for (let i = 0; i < quantity; i++) {
        handleAddToCart(product, selectedSize, selectedColor);
      }
      setIsAdding(false);
    }, 600);
  };

  const handleBuyNow = () => {
    if (!selectedColor || !selectedSize) return;
    for (let i = 0; i < quantity; i++) {
      handleAddToCart(product, selectedSize, selectedColor);
    }
    setIsCartOpen(true);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Product link copied to clipboard", "info");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 w-full relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <nav className="flex flex-wrap text-[10px] uppercase tracking-widest text-zinc-500 mb-8 font-mono font-medium">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-black transition-colors">Departments</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-black transition-colors">{getCategoryName(product.category)}</Link>
          <span className="mx-2">/</span>
          <span className="text-black font-semibold">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div className="w-full">
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          <div className="flex flex-col pt-2 lg:pt-0">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] tracking-widest text-zinc-500 uppercase font-sans font-bold">
                  {product.brand ? `${product.brand} / ` : ""}{product.department || getCategoryName(product.category)}
                </span>
                {product.badge && (
                  <span className="px-2.5 py-1 bg-black text-white text-[9px] font-sans font-bold tracking-widest uppercase rounded">
                    {product.badge}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold tracking-tight text-black mb-4 leading-tight uppercase">
                {product.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1 text-black">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm font-bold text-black ml-1">{product.rating}</span>
                </div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  Read {product.reviews} Reviews
                </span>
                {product.sku && (
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">SKU {product.sku}</span>
                )}
              </div>
            </div>

            <div className="mb-8 flex items-baseline gap-3">
              <span className="text-3xl font-sans font-bold tracking-tight text-black">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-lg font-sans font-medium text-zinc-400 line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-sans font-bold text-zinc-500 uppercase tracking-widest">
                  Color / Finish: <span className="text-black ml-1">{selectedColor?.name}</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                {product.colors.map((color) => {
                  const isSelected = selectedColor?.name === color.name;
                  return (
                    <button key={color.name} onClick={() => setSelectedColor(color)} className="w-8 h-8 rounded-full flex items-center justify-center relative cursor-pointer group">
                      <div className={`absolute inset-0 rounded-full border transition-all duration-300 ${isSelected ? "border-black scale-110" : "border-transparent group-hover:border-zinc-300 scale-100"}`} />
                      <div className="w-6 h-6 rounded-full shadow-sm border border-zinc-200" style={{ backgroundColor: color.hex }} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-10">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-sans font-bold text-zinc-500 uppercase tracking-widest">
                  {variantLabel}: <span className="text-black ml-1">{selectedSize}</span>
                </span>
                <button className="text-[10px] font-sans font-bold text-zinc-500 uppercase tracking-widest underline hover:text-black transition-colors cursor-pointer">
                  Compare Options
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {product.sizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 px-2 text-xs font-bold tracking-widest uppercase transition-all rounded-xl border cursor-pointer ${
                        isSelected
                          ? "bg-black text-white border-black shadow-[0_4px_12px_rgba(0,0,0,0.1)] scale-[1.02]"
                          : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400 hover:text-black"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-4 h-14">
                <div className="h-full flex items-center border border-zinc-200 rounded-full bg-white w-32 shrink-0 shadow-sm">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex-1 h-full hover:bg-zinc-50 text-zinc-500 rounded-l-full cursor-pointer transition-colors font-bold">-</button>
                  <span className="flex-1 text-center font-sans font-bold text-black">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="flex-1 h-full hover:bg-zinc-50 text-zinc-500 rounded-r-full cursor-pointer transition-colors font-bold">+</button>
                </div>

                <button
                  onClick={handleQuickAdd}
                  disabled={isAdding || isOutOfStock}
                  className={`flex-1 h-full flex items-center justify-center text-xs tracking-widest uppercase font-bold transition-all rounded-full cursor-pointer shadow-sm ${
                    isOutOfStock || isAdding
                      ? "bg-zinc-100 text-zinc-400 border border-zinc-200"
                      : "bg-white text-black border border-zinc-200 hover:border-black hover:bg-zinc-50"
                  }`}
                >
                  {isOutOfStock ? "Out of Stock" : isAdding ? "Adding..." : "Add to Cart"}
                </button>
              </div>

              <div className="flex gap-4 h-14">
                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className={`flex-[3] h-full rounded-full text-xs tracking-widest uppercase font-bold transition-all cursor-pointer ${
                    isOutOfStock ? "bg-zinc-100 text-zinc-400" : "bg-black text-white hover:bg-zinc-800 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:-translate-y-0.5"
                  }`}
                >
                  Buy Now
                </button>

                <button onClick={() => handleToggleWishlist(product)} className="flex-1 h-full flex items-center justify-center border border-zinc-200 rounded-full bg-white hover:border-black transition-colors group cursor-pointer shadow-sm" title="Add to Wishlist">
                  <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500 stroke-red-500" : "text-zinc-500 group-hover:text-red-500 transition-colors"}`} />
                </button>

                <button onClick={handleShare} className="flex-1 h-full flex items-center justify-center border border-zinc-200 rounded-full bg-white hover:border-black transition-colors text-zinc-500 group cursor-pointer shadow-sm" title="Share Product">
                  <Share2 className="h-5 w-5 group-hover:text-black transition-colors" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-6 border-y border-zinc-200 mb-8">
              <div className="flex items-center gap-3 text-zinc-600">
                <Truck className="h-5 w-5 text-zinc-400" />
                <span className="text-[10px] uppercase tracking-widest font-bold">{product.shipping || "Fast Shipping"}</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-600">
                <RotateCcw className="h-5 w-5 text-zinc-400" />
                <span className="text-[10px] uppercase tracking-widest font-bold">30-Day Returns</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-600">
                <ShieldCheck className="h-5 w-5 text-zinc-400" />
                <span className="text-[10px] uppercase tracking-widest font-bold">{product.warranty || "Brand Warranty"}</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-600">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-600">{product.stock ? `${product.stock} In Stock` : "In Stock"}</span>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-[10px] font-sans font-bold tracking-widest text-black uppercase mb-4">Marketplace Desk</h3>
              <FAQAccordion faqs={MARKETPLACE_FAQS} />
            </div>
          </div>
        </div>

        {frequentlyBoughtTogether.length > 0 && (
          <section className="mt-16 rounded-3xl border border-zinc-200 bg-zinc-50 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <p className="text-[10px] font-sans font-bold tracking-[0.35em] uppercase text-zinc-500 mb-2">Smart Bundle</p>
                <h2 className="text-2xl font-sans font-bold tracking-tight uppercase text-black">Frequently Bought Together</h2>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {[product, ...frequentlyBoughtTogether].map((item) => (
                  <Link key={item.id} to={`/product/${item.id}`} className="flex items-center gap-3 rounded-2xl bg-white border border-zinc-200 p-3 hover:border-black transition-colors shadow-sm">
                    <img src={item?.images?.[0] ?? ""} alt={item.name} className="h-14 w-14 rounded-xl object-cover" referrerPolicy="no-referrer" />
                    <div className="max-w-[150px]">
                      <p className="line-clamp-1 text-xs font-bold text-black">{item.name}</p>
                      <p className="text-xs font-medium text-zinc-500">${item.price}.00</p>
                    </div>
                  </Link>
                ))}
              </div>
              <button
                onClick={() => [product, ...frequentlyBoughtTogether].forEach((item) => handleAddToCart(item, item?.sizes?.[0] ?? "Default", item?.colors?.[0] ?? { name: "Default", hex: "#000" }))}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-black px-6 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-zinc-800 transition-all hover:-translate-y-0.5 shadow-[0_4px_12px_rgba(0,0,0,0.1)] cursor-pointer"
              >
                <ShoppingBag className="h-4 w-4" />
                Add Bundle
              </button>
            </div>
          </section>
        )}

        <ProductTabs
          description={product.description}
          details={product.details}
          specifications={product.specifications}
          shipping={product.shipping}
          warranty={product.warranty}
        />

        <section className="mt-16">
          <div className="mb-6 flex items-center gap-3">
            <GitCompare className="h-5 w-5 text-zinc-400" />
            <h2 className="text-2xl font-sans font-bold tracking-tight uppercase text-black">Product Comparison</h2>
          </div>
          <div className="overflow-x-auto rounded-3xl border border-zinc-200 shadow-sm">
            <table className="min-w-full bg-white text-sm">
              <thead className="bg-zinc-50 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500 border-b border-zinc-200">
                <tr>
                  <th className="px-6 py-5">Product</th>
                  <th className="px-6 py-5">Price</th>
                  <th className="px-6 py-5">Rating</th>
                  <th className="px-6 py-5">Brand</th>
                  <th className="px-6 py-5">Best For</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {comparisonProducts.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-5 font-bold text-black">{item.name}</td>
                    <td className="px-6 py-5 font-medium text-zinc-600">${item.price}.00</td>
                    <td className="px-6 py-5 font-medium text-zinc-600">{item.rating} / 5</td>
                    <td className="px-6 py-5 font-medium text-zinc-600">{item.brand || "Aura Studio"}</td>
                    <td className="px-6 py-5 font-medium text-zinc-600">{item.department || getCategoryName(item.category)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div className="bg-zinc-50 py-24 border-y border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-sans font-bold tracking-tight uppercase mb-4 text-black">Verified Reviews</h2>
            <div className="flex justify-center items-center gap-2 text-black mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
            </div>
            <p className="text-zinc-500 text-sm font-medium">Based on {product.reviews} marketplace reviews</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(product.reviewList || []).slice(0, 3).map((review) => (
              <div key={review.id} className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
                <div className="flex text-black mb-5">
                  {[...Array(review.rating)].map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
                </div>
                <h4 className="font-sans font-bold uppercase tracking-tight text-lg mb-3 text-black">{review.title}</h4>
                <p className="text-zinc-600 text-sm leading-relaxed mb-6 font-medium">&quot;{review.comment}&quot;</p>
                <div className="text-[10px] tracking-widest font-sans font-bold text-zinc-400 uppercase">
                  {review.verified ? "Verified Buyer" : "Customer"} / {review.author}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="py-12">
          <ProductSlider
            title="Related Products"
            subtitle="Recommended Pairings"
            products={relatedProducts}
            onAddToCart={handleAddToCart}
            onOpenQuickView={() => {}}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            bgWhite={false}
          />
        </div>
      )}

      {recentlyViewed.length > 0 && (
        <div className="py-12 bg-white border-t border-zinc-200">
          <ProductSlider
            title="Recently Viewed"
            subtitle="Your Browsing Trail"
            products={recentlyViewed}
            onAddToCart={handleAddToCart}
            onOpenQuickView={() => {}}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            bgWhite={true}
          />
        </div>
      )}
    </div>
  );
}
