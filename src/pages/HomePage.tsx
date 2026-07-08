import {  useState , useEffect } from "react";
import { Product } from "../types";
import { fetchProducts } from "../data/products";
import { useShop } from "../context/ShopContext";

// Layout Sections

import Hero from "../components/Hero";
import FeaturedCategories from "../components/FeaturedCategories";
import ProductSlider from "../components/ProductSlider";
import BrandEthos from "../components/BrandEthos";
import AsSeenIn from "../components/AsSeenIn";
import AnimatedStatistics from "../components/AnimatedStatistics";
import Lookbook from "../components/Lookbook";
import ProductGrid from "../components/ProductGrid";
import ProductQuickView from "../components/ProductQuickView";
import Newsletter from "../components/Newsletter";
import Testimonials from "../components/Testimonials";
import TrustBadges from "../components/TrustBadges";
import MarketplaceShowcase from "../components/MarketplaceShowcase";

export default function HomePage() {
  const [PRODUCTS, setPRODUCTS] = useState<any[]>([]);

  useEffect(() => { 
    fetchProducts().then(setPRODUCTS); 
    
    // Connect to deployed backend using the environment variable
    const apiUrl = import.meta.env.VITE_API_URL;
    if (apiUrl) {
      fetch(`${apiUrl}/api/test`)
        .then(async res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          console.log("✅ Backend Connected Successfully\nBackend Response:", data.message);
        })
        .catch(err => {
          console.error("❌ Backend Connection Failed\nError Details:", err);
          
          let suggestion = "";
          if (err instanceof TypeError && err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
             suggestion = "Possible causes: \n1. CORS issue: Check if backend allows requests from this origin.\n2. Incorrect API URL: Verify VITE_API_URL points to the correct Render deployment URL.\n3. Backend is down or still spinning up on Render.";
          } else if (err.message && err.message.includes("HTTP error!")) {
             suggestion = "Possible cause: The endpoint might be incorrect or missing. Check if /api/test exists on the backend.";
          } else {
             suggestion = "Possible causes: Environment variables are not loaded, or fetch configuration is incorrect.";
          }
          console.info("💡 Diagnostic Suggestion: \n" + suggestion);
        });
    } else {
      console.error("❌ Backend Connection Failed\nError Details: VITE_API_URL is undefined.");
      console.info("💡 Diagnostic Suggestion: \nMake sure VITE_API_URL is defined in your .env file.");
    }
  }, []);
  const { 
    wishlist, 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory,
    handleAddToCart,
    handleToggleWishlist
  } = useShop();

  const [activeQuickView, setActiveQuickView] = useState<Product | null>(null);

  const handleScrollToSection = () => {
    const catalogElement = document.getElementById("product-catalog");
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const bestSellers = PRODUCTS.filter((product) => product.isBestSeller).slice(0, 8);
  const trendingProducts = PRODUCTS.filter((product) => product.isTrending).slice(0, 8);
  const recommendations = PRODUCTS.filter((product) => product.rating >= 4.8 && !product.isBestSeller).slice(0, 8);

  return (
    <div>
      <Hero 
        onExploreClick={handleScrollToSection} 
        onFilterCategory={setSelectedCategory} 
      />

      <MarketplaceShowcase onFilterCategory={setSelectedCategory} />

      <FeaturedCategories onFilterCategory={setSelectedCategory} />

      <ProductSlider 
        title="Best Sellers" 
        subtitle="Top Tier Curations"
        products={bestSellers}
        onAddToCart={handleAddToCart}
        onOpenQuickView={setActiveQuickView}
        wishlist={wishlist}
        onToggleWishlist={handleToggleWishlist}
        bgWhite={false}
      />

      <ProductSlider 
        title="Trending Now" 
        subtitle="Currently Popular"
        products={trendingProducts}
        onAddToCart={handleAddToCart}
        onOpenQuickView={setActiveQuickView}
        wishlist={wishlist}
        onToggleWishlist={handleToggleWishlist}
        bgWhite={true}
      />

      <ProductSlider
        title="Recommended For You"
        subtitle="Marketplace Picks"
        products={recommendations}
        onAddToCart={handleAddToCart}
        onOpenQuickView={setActiveQuickView}
        wishlist={wishlist}
        onToggleWishlist={handleToggleWishlist}
        bgWhite={false}
      />

      <BrandEthos />
      <TrustBadges />
      <AnimatedStatistics />

      <Testimonials />
      <AsSeenIn />

      <ProductGrid
        onAddToCart={handleAddToCart}
        onOpenQuickView={setActiveQuickView}
        wishlist={wishlist}
        onToggleWishlist={handleToggleWishlist}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <Lookbook onExploreClick={handleScrollToSection} />

      <Newsletter />

      {/* Local Modal for Quick View */}
      <ProductQuickView
        product={activeQuickView}
        onClose={() => setActiveQuickView(null)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
