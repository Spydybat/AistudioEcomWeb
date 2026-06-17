import { ArrowRight, Sparkles, BookOpen } from "lucide-react";
import { motion } from "motion/react";

interface LookItem {
  id: string;
  number: string;
  title: string;
  theme: string;
  image: string;
  description: string;
  garments: string[];
}

const LOOKS: LookItem[] = [
  {
    id: "look-01",
    number: "LOOK 01",
    title: "Monochrome Minimalist Fluidity",
    theme: "Urban Tailoring",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800",
    description: "Centering the cashmere rib-knit jogger with relaxed alabaster knits. Styled in perfect, drape-forward camel and warm cream accessories.",
    garments: ["Mongolian Cashmere Knit", "Rib-knit Lounge Pants"]
  },
  {
    id: "look-02",
    number: "LOOK 02",
    title: "Structured Modern Architectural Form",
    theme: "Sartorial Armor",
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=800",
    description: "The double-breasted trench layered over tailoring. Sharp shoulder outlines meet relaxed collar silhouettes.",
    garments: ["Double-Breasted Trench", "Tailored Pleated Trouser"]
  }
];

interface LookbookProps {
  onExploreClick: () => void;
}

export default function Lookbook({ onExploreClick }: LookbookProps) {
  return (
    <section className="py-20 sm:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-20">
          <div className="max-w-xl">
            <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-neutral-400 mb-3 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-neutral-400" />
              <span>Sartorial Editorial Volume 04</span>
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold tracking-wide text-neutral-900 uppercase">
              The Seasonal Lookbook
            </h2>
          </div>
          <p className="mt-4 md:mt-0 text-neutral-500 text-xs sm:text-sm font-light leading-relaxed max-w-sm">
            Curated pairings styled by the Tokyo and Milan design centers, illustrating how to drape structured wool coats with luxurious loungewear.
          </p>
        </div>

        {/* Look Grid Layout */}
        <div className="space-y-24 sm:space-y-36">
          {LOOKS.map((look, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={look.id}
                className={`flex flex-col ${
                  isEven ? "lg:flex-row animate-fadeIn" : "lg:flex-row-reverse animate-fadeIn"
                } items-center gap-12 lg:gap-20`}
              >
                {/* Lookbook Photograph container */}
                <div className="w-full lg:w-1/2 relative group">
                  <div className="absolute inset-0 border border-neutral-250 translate-x-3 translate-y-3 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500 z-0" />
                  <div className="relative overflow-hidden z-10 aspect-[3/4] bg-neutral-100 shadow-md">
                    <img
                      src={look.image}
                      alt={look.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                {/* Lookbook Details */}
                <div className="w-full lg:w-1/2 text-left space-y-5">
                  <span className="text-[11px] font-mono tracking-[0.3em] font-medium text-neutral-400 mb-2 block uppercase">
                    {look.number} — {look.theme}
                  </span>
                  
                  <h3 className="text-xl sm:text-2xl font-serif font-semibold text-neutral-900 tracking-wide uppercase leading-snug">
                    {look.title}
                  </h3>
                  
                  <p className="text-neutral-500 text-xs sm:text-sm font-light leading-relaxed">
                    {look.description}
                  </p>

                  {/* Garment details list */}
                  <div className="pt-4 border-t border-neutral-100">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase block mb-3">
                      Featured Outfits
                    </span>
                    <ul className="space-y-2">
                      {look.garments.map((garment, idx) => (
                        <li key={idx} className="flex items-center text-xs tracking-wide text-neutral-700 font-sans">
                          <span className="w-1.5 h-1.5 bg-neutral-950 rounded-full mr-3" />
                          <span>{garment}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Interactive Cta */}
                  <button
                    onClick={onExploreClick}
                    className="mt-6 px-6 py-3.5 bg-neutral-950 text-white hover:bg-neutral-800 font-medium tracking-widest text-[11px]/none uppercase transition-colors flex items-center gap-3 shadow-md hover:shadow-lg cursor-pointer"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>Purchase Look Garments</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
