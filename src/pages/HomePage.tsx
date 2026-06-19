import { useState } from "react";
import { Product } from "../types";
import { PRODUCTS } from "../data/products";
import { useShop } from "../context/ShopContext";

// Layout Sections
import AnnouncementBar from "../components/AnnouncementBar";
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

export default function HomePage() {
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

  const bestSellers = PRODUCTS.slice(0, 6);
  const trendingProducts = PRODUCTS.slice(4, 10);

  return (
    <div>
      <AnnouncementBar />

      <Hero 
        onExploreClick={handleScrollToSection} 
        onFilterCategory={setSelectedCategory} 
      />

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
