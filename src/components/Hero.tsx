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
    title: "SARTORIAL STRUCTURE",
    subtitle: "THE SEASONAL OVERCOAT",
    highlight: "Italian-Crafted Wool Trench Coat",
    description: "Discover clean modern geometries, soft structured tailoring, and natural fabrics woven to endure seasonal transitions.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600",
    ctaText: "Explore Outerwear",
    category: "outerwear",
  },
  {
    id: 2,
    title: "MINIMALIST SILHOUETTE",
    subtitle: "ESSENTIAL KNITWEAR",
    highlight: "Pure Mongolian Cashmere Wardrobe",
    description: "An editorial collection designed with natural monochrome hues, soft breathable fibers, and drape that commands effortless form.",
    image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=1600",
    ctaText: "Explore Knitwear",
    category: "knitwear",
  },
  {
    id: 3,
    title: "TAILORED FLOW",
    subtitle: "SARTORIAL TAILORING",
    highlight: "Deconstructed Linen-Wool Blazers",
    description: "Sophisticated unstructured jackets and sharp pleaded wool pants engineered for unmatched luxury flexibility.",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1600",
    ctaText: "Explore Tailoring",
    category: "tailoring",
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
    <div className="relative h-[65vh] sm:h-[80vh] w-full overflow-hidden bg-neutral-950 text-white">
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
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-neutral-900/45 to-transparent z-10" />
          <div className="absolute inset-0 bg-black/25 z-10" />
          
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
            className="text-xs font-mono tracking-[0.3em] text-neutral-300 uppercase mb-2 sm:mb-3 flex items-center gap-2"
          >
            <Compass className="h-4 w-4 animate-spin-slow text-yellow-500/80" />
            <span>{activeSlide.subtitle}</span>
          </motion.p>

          {/* Core high typography display heading */}
          <motion.h1
            key={`title-${activeSlide.id}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-serif font-semibold tracking-wider text-white leading-tight mb-2 sm:mb-4"
          >
            {activeSlide.title}
          </motion.h1>

          <motion.h3
            key={`highlight-${activeSlide.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-sm sm:text-lg tracking-wider text-neutral-200 mt-1 mb-4 sm:mb-6 font-light uppercase"
          >
            {activeSlide.highlight}
          </motion.h3>

          {/* Sub description */}
          <motion.p
            key={`desc-${activeSlide.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xs sm:text-sm text-neutral-300 mb-6 sm:mb-10 font-sans font-light leading-relaxed max-w-lg"
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
              className="px-6 sm:px-8 py-3.5 bg-white text-black hover:bg-neutral-100 font-medium tracking-widest text-[11px] uppercase transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl cursor-pointer"
            >
              <span>{activeSlide.ctaText}</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={onExploreClick}
              className="px-6 py-3.5 bg-black/30 text-white backdrop-blur hover:bg-black/50 border border-white/20 hover:border-white/50 font-medium tracking-widest text-[11px] uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer"
            >
              <span>View All Collection</span>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Slide Navigation Triggers (Bottom Left & Right controls) */}
      <div className="absolute bottom-6 sm:bottom-10 right-4 sm:right-10 z-20 flex space-x-2">
        <button
          onClick={handlePrev}
          className="p-2 sm:p-3 rounded-full bg-black/40 text-neutral-300 hover:text-white border border-white/10 hover:bg-black/70 hover:border-white/20 transition-all cursor-pointer"
          title="Previous garment slide"
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
        <button
          onClick={handleNext}
          className="p-2 sm:p-3 rounded-full bg-black/40 text-neutral-300 hover:text-white border border-white/10 hover:bg-black/70 hover:border-white/20 transition-all cursor-pointer"
          title="Next garment slide"
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
            title={`Select fashion look ${idx + 1}`}
          >
            <span
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "w-8 bg-white" : "w-1.5 bg-neutral-600 group-hover:bg-neutral-400"
              }`}
            />
          </button>
        ))}
        <span className="text-[10px] font-mono tracking-widest text-neutral-400 ml-2">
          0{currentIndex + 1} / 0{HERO_SLIDES.length}
        </span>
      </div>
    </div>
  );
}
