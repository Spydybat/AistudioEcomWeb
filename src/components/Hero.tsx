import { useState, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Play, Compass } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  highlight: string;
  description: string;
  image: string;
  ctaText: string;
  category: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    title: "PREMIUM MARKETPLACE",
    subtitle: "FASHION, TECH, HOME",
    highlight: "Curated departments with luxury-grade presentation",
    description: "Discover fashion, electronics, home, beauty, sports, grocery, books, and more through a polished marketplace built for high-intent shopping.",
    image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=1600",
    ctaText: "Explore Departments",
    category: "all",
  },
  {
    id: 2,
    title: "CONNECTED LIVING",
    subtitle: "ELECTRONICS & MOBILES",
    highlight: "Smart devices, audio, phones, and creator hardware",
    description: "Shop refined technology products with specifications, variants, comparison tables, and recommendations designed for confident decisions.",
    image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1600",
    ctaText: "Explore Electronics",
    category: "electronics",
  },
  {
    id: 3,
    title: "HOME ELEVATED",
    subtitle: "KITCHEN, FURNITURE, BEAUTY",
    highlight: "Useful, beautiful products for everyday rituals",
    description: "From copper cookware to modular furniture and clean skincare, the catalog now supports rich multi-category discovery.",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=1600",
    ctaText: "Explore Home",
    category: "home-kitchen",
  }
];

interface HeroProps {
  onExploreClick: () => void;
  onFilterCategory: (catId: string) => void;
}

export default function Hero({ onExploreClick, onFilterCategory }: HeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance loop every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % HERO_SLIDES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const activeSlide = HERO_SLIDES[currentIndex];

  const handleCta = (catId: string) => {
    onFilterCategory(catId);
    onExploreClick();
  };

  return (
    <div className="relative h-[65vh] sm:h-[80vh] w-full overflow-hidden bg-[#111214] text-white">
      {/* Background Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Shimmer Dark overlay to protect text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#111214]/95 via-[#1E1F22]/60 to-transparent z-10" />
          <div className="absolute inset-0 bg-black/30 z-10" />
          
          <img
            src={activeSlide.image}
            alt={activeSlide.title}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </AnimatePresence>

      {/* Content overlays */}
      <div className="absolute inset-0 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center h-full">
        <div className="max-w-xl sm:max-w-2xl">
          {/* Slide metadata */}
          <motion.p
            key={`meta-${activeSlide.id}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xs font-mono tracking-[0.3em] text-zinc-300 uppercase mb-2 sm:mb-3 flex items-center gap-2"
          >
            <Compass className="h-4 w-4 animate-spin-slow text-yellow-500/80" />
            <span>{activeSlide.subtitle}</span>
          </motion.p>

          {/* Core high typography display heading */}
          <motion.h1
            key={`title-${activeSlide.id}`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            className="text-5xl sm:text-7xl lg:text-8xl font-sans font-bold tracking-tight text-white leading-[1.1] mb-2 sm:mb-4 drop-shadow-2xl"
          >
            {activeSlide.title}
          </motion.h1>

          <motion.h3
            key={`highlight-${activeSlide.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            className="text-lg sm:text-2xl tracking-widest text-zinc-200 mt-1 mb-4 sm:mb-6 font-light uppercase drop-shadow-md"
          >
            {activeSlide.highlight}
          </motion.h3>

          {/* Sub description */}
          <motion.p
            key={`desc-${activeSlide.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            className="text-sm sm:text-base text-zinc-300 mb-6 sm:mb-10 font-sans font-normal leading-relaxed max-w-xl drop-shadow"
          >
            {activeSlide.description}
          </motion.p>

          {/* CTA actions */}
          <motion.div
            key={`actions-${activeSlide.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4 items-center"
          >
            <button
              id={`cta-btn-${activeSlide.id}`}
              onClick={() => handleCta(activeSlide.category)}
              className="px-8 sm:px-10 py-4 bg-indigo-500 text-white hover:bg-indigo-600 font-semibold tracking-widest text-xs uppercase transition-all duration-300 flex items-center gap-3 rounded-full shadow-[0_4px_14px_rgba(88,101,242,0.5)] hover:scale-105 cursor-pointer"
            >
              <span>{activeSlide.ctaText}</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={onExploreClick}
              className="px-8 sm:px-10 py-4 glass-dark text-white hover:bg-[#313338]/50 font-medium tracking-widest text-xs uppercase transition-all duration-300 flex items-center gap-2 rounded-full shadow-xl hover:scale-105 cursor-pointer"
            >
              <span>View All Products</span>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Slide Navigation Triggers (Bottom Left & Right controls) */}
      <div className="absolute bottom-6 sm:bottom-10 right-4 sm:right-10 z-20 flex space-x-3">
        <button
          onClick={handlePrev}
          className="p-3 sm:p-4 rounded-full glass-dark text-zinc-300 hover:text-white hover:bg-[#313338]/80 hover:scale-110 transition-all cursor-pointer shadow-lg border border-white/5"
          title="Previous marketplace slide"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
        <button
          onClick={handleNext}
          className="p-3 sm:p-4 rounded-full glass-dark text-zinc-300 hover:text-white hover:bg-[#313338]/80 hover:scale-110 transition-all cursor-pointer shadow-lg border border-white/5"
          title="Next marketplace slide"
        >
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>

      {/* Progress Indicator Dots */}
      <div className="absolute bottom-6 sm:bottom-10 left-4 sm:left-10 z-20 flex items-center space-x-3">
        {HERO_SLIDES.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setCurrentIndex(idx)}
            className="group flex items-center cursor-pointer"
            title={`Select marketplace slide ${idx + 1}`}
          >
            <span
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "w-8 bg-indigo-500" : "w-1.5 bg-zinc-600 group-hover:bg-zinc-400"
              }`}
            />
          </button>
        ))}
        <span className="text-[10px] font-mono tracking-widest text-zinc-400 ml-2">
          0{currentIndex + 1} / 0{HERO_SLIDES.length}
        </span>
      </div>
    </div>
  );
}
