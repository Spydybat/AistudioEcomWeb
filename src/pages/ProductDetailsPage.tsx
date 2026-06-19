import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, Heart, Share2, ShieldCheck, Truck, RotateCcw, CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import { PRODUCTS } from "../data/products";
import { useShop } from "../context/ShopContext";

// Sub-components
import ProductGallery from "../components/ProductGallery";
import ProductTabs from "../components/ProductTabs";
import FAQAccordion from "../components/FAQAccordion";
import ProductSlider from "../components/ProductSlider";

const DUMMY_FAQS = [
  { question: "How does the sizing run?", answer: "Our garments are designed for a tailored, true-to-size fit. We recommend selecting your standard size. For a more relaxed silhouette, consider sizing up." },
  { question: "What are the care instructions?", answer: "Dry clean only using environmentally friendly processes. Avoid prolonged exposure to direct sunlight. Store in the provided cedar-lined garment bag." },
  { question: "Can I customize the tailoring?", answer: "Yes, we offer complimentary bespoke alterations at any of our flagship Milan, Tokyo, or New York boutiques within 30 days of purchase." },
];

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { wishlist, handleAddToCart, handleToggleWishlist, setIsCartOpen, showToast } = useShop();
  
  const product = PRODUCTS.find(p => p.id === id);

  const [selectedColor, setSelectedColor] = useState(product?.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product?.sizes[1] || product?.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0]);
      setSelectedSize(product.sizes[1] || product.sizes[0]);
      setQuantity(1);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center flex-1">
        <h1 className="text-4xl font-serif mb-4">Product Not Found</h1>
        <Link to="/products" className="text-neutral-500 underline">Return to Shop</Link>
      </div>
    );
  }

  const isWishlisted = wishlist.some((item) => item.id === product.id);
  const isOutOfStock = false; // Mocking stock state

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

  // Get related products (same category, exclude current)
  const relatedProducts = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="flex-1 w-full relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        
        {/* Breadcrumb */}
        <nav className="flex text-[10px] uppercase tracking-widest text-neutral-400 mb-8 font-mono">
          <Link to="/" className="hover:text-neutral-900 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-neutral-900 transition-colors">Collections</Link>
          <span className="mx-2">/</span>
          <span className="text-neutral-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Left: Gallery */}
          <div className="w-full">
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col pt-2 lg:pt-0">
            
            {/* Meta Data */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] tracking-widest text-neutral-500 uppercase font-mono">{product.category}</span>
                {product.badge && (
                  <span className="px-2 py-1 bg-neutral-900 text-white text-[9px] font-mono tracking-widest uppercase rounded">
                    {product.badge}
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-neutral-900 mb-4 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm font-medium text-neutral-900 ml-1">{product.rating}</span>
                </div>
                <span className="text-xs text-neutral-400 uppercase tracking-widest hover:text-neutral-900 cursor-pointer transition-colors">
                  Read {product.reviews} Reviews
                </span>
              </div>
            </div>

            {/* Price block */}
            <div className="mb-8 flex items-baseline gap-3">
              <span className="text-3xl font-sans font-light text-neutral-900">${product.price}.00</span>
              {product.originalPrice && (
                <span className="text-lg font-sans text-neutral-400 line-through">${product.originalPrice}.00</span>
              )}
            </div>

            {/* Variants: Colors */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                  Color: <span className="text-neutral-900 font-sans font-medium text-sm ml-1">{selectedColor?.name}</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                {product.colors.map((color) => {
                  const isSelected = selectedColor?.name === color.name;
                  return (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className="w-8 h-8 rounded-full flex items-center justify-center relative cursor-pointer group"
                    >
                      <div 
                        className={`absolute inset-0 rounded-full border transition-all duration-300 ${isSelected ? "border-neutral-900 scale-110" : "border-transparent group-hover:border-neutral-300 scale-100"}`}
                      />
                      <div 
                        className="w-6 h-6 rounded-full shadow-inner border border-neutral-200"
                        style={{ backgroundColor: color.hex }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Variants: Sizes */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                  Size: <span className="text-neutral-900 font-sans font-medium text-sm ml-1">{selectedSize}</span>
                </span>
                <button className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest underline hover:text-neutral-900 transition-colors">
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {product.sizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 text-xs tracking-widest uppercase transition-all rounded-lg border cursor-pointer ${
                        isSelected
                          ? "bg-neutral-900 text-white border-neutral-900 shadow-md scale-[1.02]"
                          : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-900"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Purchase Actions */}
            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-4 h-14">
                {/* Quantity */}
                <div className="h-full flex items-center border border-neutral-200 rounded-xl bg-white w-32 shrink-0">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex-1 h-full hover:bg-neutral-50 text-neutral-500 rounded-l-xl cursor-pointer transition-colors">-</button>
                  <span className="flex-1 text-center font-medium text-neutral-900">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="flex-1 h-full hover:bg-neutral-50 text-neutral-500 rounded-r-xl cursor-pointer transition-colors">+</button>
                </div>
                
                {/* Add to Cart */}
                <button
                  onClick={handleQuickAdd}
                  disabled={isAdding || isOutOfStock}
                  className={`flex-1 h-full flex items-center justify-center text-xs tracking-widest uppercase font-bold transition-all rounded-xl cursor-pointer ${
                    isOutOfStock 
                      ? "bg-neutral-100 text-neutral-400" 
                      : isAdding
                        ? "bg-neutral-100 text-neutral-400"
                        : "bg-white text-neutral-900 border-2 border-neutral-900 hover:bg-neutral-50 hover:shadow-lg"
                  }`}
                >
                  {isOutOfStock ? "Out of Stock" : isAdding ? "Adding..." : "Add to Bag"}
                </button>
              </div>

              {/* Buy Now & Actions */}
              <div className="flex gap-4 h-14">
                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className={`flex-[3] h-full rounded-xl text-xs tracking-widest uppercase font-bold transition-all cursor-pointer ${
                    isOutOfStock 
                      ? "bg-neutral-200 text-neutral-400"
                      : "bg-neutral-900 text-white hover:bg-neutral-800 hover:shadow-xl hover:-translate-y-0.5"
                  }`}
                >
                  Buy It Now
                </button>
                
                <button
                  onClick={() => handleToggleWishlist(product)}
                  className="flex-1 h-full flex items-center justify-center border border-neutral-200 rounded-xl hover:border-neutral-900 transition-colors group cursor-pointer"
                  title="Add to Wishlist"
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500 stroke-red-500" : "text-neutral-600 group-hover:text-red-500 transition-colors"}`} />
                </button>

                <button
                  onClick={handleShare}
                  className="flex-1 h-full flex items-center justify-center border border-neutral-200 rounded-xl hover:border-neutral-900 transition-colors text-neutral-600 group cursor-pointer"
                  title="Share Product"
                >
                  <Share2 className="h-5 w-5 group-hover:text-neutral-900 transition-colors" />
                </button>
              </div>
            </div>

            {/* Trust Section */}
            <div className="grid grid-cols-2 gap-4 py-6 border-y border-neutral-100 mb-8">
              <div className="flex items-center gap-3 text-neutral-600">
                <Truck className="h-5 w-5 text-neutral-400" />
                <span className="text-xs uppercase tracking-wider font-medium">Free Shipping</span>
              </div>
              <div className="flex items-center gap-3 text-neutral-600">
                <RotateCcw className="h-5 w-5 text-neutral-400" />
                <span className="text-xs uppercase tracking-wider font-medium">30-Day Returns</span>
              </div>
              <div className="flex items-center gap-3 text-neutral-600">
                <ShieldCheck className="h-5 w-5 text-neutral-400" />
                <span className="text-xs uppercase tracking-wider font-medium">2-Year Warranty</span>
              </div>
              <div className="flex items-center gap-3 text-neutral-600">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span className="text-xs uppercase tracking-wider font-medium">In Stock Ready</span>
              </div>
            </div>

            {/* In-page Accordion FAQ */}
            <div className="mt-4">
              <h3 className="text-xs font-mono tracking-widest text-neutral-400 uppercase mb-4">Concierge Desk</h3>
              <FAQAccordion faqs={DUMMY_FAQS} />
            </div>

          </div>
        </div>

        {/* Bottom Tabs */}
        <ProductTabs description={product.description} details={product.details} />

      </div>

      {/* Reviews Section (Visual Polish Placeholder) */}
      <div className="bg-neutral-50 py-24 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold mb-4">Client Testimonials</h2>
            <div className="flex justify-center items-center gap-2 text-yellow-500 mb-2">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
            </div>
            <p className="text-neutral-500 text-sm">Based on {product.reviews} verified reviews</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Review Cards */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-neutral-100 shadow-sm">
                <div className="flex text-yellow-500 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
                </div>
                <h4 className="font-serif font-semibold text-lg mb-2">Exceptional Quality</h4>
                <p className="text-neutral-500 text-sm leading-relaxed mb-6">
                  "The craftsmanship of this piece exceeded all my expectations. The fabric falls perfectly and the attention to detail is evident in every stitch. Worth every penny."
                </p>
                <div className="text-xs tracking-widest font-mono text-neutral-400 uppercase">
                  Verified Buyer • New York
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="py-12">
          <ProductSlider 
            title="Complete The Look" 
            subtitle="Curated Pairings"
            products={relatedProducts}
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
