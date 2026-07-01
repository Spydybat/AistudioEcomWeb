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
  useEffect(() => { fetchProducts().then(setPRODUCTS); }, []);
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
