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
    <section className="py-24 sm:py-32 bg-white overflow-hidden border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-20 sm:mb-28"
        >
          <div className="max-w-xl">
            <p className="text-[10px] font-mono tracking-[0.4em] uppercase text-neutral-400 mb-4 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-neutral-400" />
              <span>Sartorial Editorial Volume 04</span>
            </p>
            <h2 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-neutral-900 uppercase">
              The Seasonal Lookbook
            </h2>
          </div>
          <p className="mt-6 md:mt-0 text-neutral-500 text-sm font-light leading-relaxed max-w-sm">
            Curated pairings styled by the Tokyo and Milan design centers, illustrating how to drape structured wool coats with luxurious loungewear.
          </p>
        </motion.div>

        {/* Look Grid Layout */}
        <div className="space-y-32 sm:space-y-48">
          {LOOKS.map((look, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={look.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className={`flex flex-col ${
                  isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                } items-center gap-12 lg:gap-24`}
              >
                {/* Lookbook Photograph container */}
                <div className="w-full lg:w-1/2 relative group">
                  <div className="absolute inset-0 bg-neutral-100 translate-x-4 translate-y-4 rounded-3xl z-0 transition-transform duration-500 group-hover:translate-x-6 group-hover:translate-y-6" />
                  <div className="relative overflow-hidden z-10 aspect-[3/4] bg-neutral-100 rounded-3xl shadow-2xl">
                    <img
                      src={look.image}
                      alt={look.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>

                {/* Lookbook Details */}
                <div className="w-full lg:w-1/2 text-left space-y-6">
                  <span className="text-[11px] font-mono tracking-[0.4em] font-medium text-neutral-400 mb-2 block uppercase">
                    {look.number} — {look.theme}
                  </span>
                  
                  <h3 className="text-3xl sm:text-4xl font-serif font-semibold text-neutral-900 tracking-wide uppercase leading-tight">
                    {look.title}
                  </h3>
                  
                  <p className="text-neutral-500 text-sm font-light leading-relaxed">
                    {look.description}
                  </p>

                  {/* Garment details list */}
                  <div className="pt-6 border-t border-neutral-100">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase block mb-4">
                      Featured Outfits
                    </span>
                    <ul className="space-y-3">
                      {look.garments.map((garment, idx) => (
                        <li key={idx} className="flex items-center text-sm tracking-wide text-neutral-700 font-sans">
                          <span className="w-1.5 h-1.5 bg-neutral-900 rounded-full mr-4" />
                          <span>{garment}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Interactive Cta */}
                  <button
                    onClick={onExploreClick}
                    className="mt-8 px-8 py-4 bg-neutral-900 text-white hover:bg-neutral-800 hover:-translate-y-1 font-semibold tracking-widest text-xs uppercase transition-all duration-300 flex items-center gap-3 rounded-full shadow-lg hover:shadow-xl cursor-pointer"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Purchase Look Garments</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
