import { Award, Leaf, Truck, ShieldCheck, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export default function BrandEthos() {
  const values = [
    {
      icon: <Leaf className="h-6 w-6 stroke-[1.2] text-current" />,
      title: "100% Traceable Fibers",
      subtitle: "GOTS & OEKO-TEX certified organic linens, Mongolian wools, and Egyptian cotton crops ensuring pure wearability."
    },
    {
      icon: <Award className="h-6 w-6 stroke-[1.2] text-current" />,
      title: "Sartorial Quality Standards",
      subtitle: "Meticulously crafted in Milanese and Tuscan studios using traditional hand-finishing sewing techniques."
    },
    {
      icon: <Truck className="h-6 w-6 stroke-[1.2] text-current" />,
      title: "Carbon-Neutral Logistics",
      subtitle: "Your garments arrive in biodegradable compostable boxes shipped using climate-neutral certified transport partners."
    },
    {
      icon: <ShieldCheck className="h-6 w-6 stroke-[1.2] text-current" />,
      title: "Garment Lifetime Promise",
      subtitle: "Under our commitment to circularity, we offer complimentary repair sewing sessions and custom button replacements."
    }
  ];

  return (
    <section className="bg-neutral-50 border-y border-neutral-100 py-20 sm:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Ethos Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <p className="text-[10px] font-mono tracking-[0.4em] uppercase text-neutral-400 mb-4">
            Craft • Sustainability • Circularity
          </p>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-neutral-900 uppercase">
            Designed for Form, Spun for the Planet
          </h2>
          <div className="w-16 h-[2px] bg-neutral-900 mx-auto mt-8 mb-6" />
          <p className="text-sm sm:text-base text-neutral-500 font-light leading-relaxed">
            Aura Studio is an architectural project creating wardrobe baseline staples. We believe in minimal purchase volume, fine pristine fibers, and complete production transparency.
          </p>
        </motion.div>

        {/* Ethos Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {values.map((value, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white p-8 border border-neutral-100 hover:border-neutral-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-start rounded-2xl group cursor-default"
            >
              <div className="p-4 bg-neutral-50 text-neutral-800 group-hover:bg-neutral-900 group-hover:text-white transition-colors duration-300 rounded-2xl mb-8 flex items-center justify-center">
                {value.icon}
              </div>
              <h3 className="text-base font-semibold tracking-wider text-neutral-900 uppercase mb-3 group-hover:text-neutral-700 transition-colors">
                {value.title}
              </h3>
              <p className="text-sm text-neutral-500 font-light leading-relaxed">
                {value.subtitle}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Brand visual quote */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 sm:mt-32 bg-neutral-950 text-white rounded-3xl p-10 sm:p-16 flex flex-col md:flex-row items-center gap-10 justify-between shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="max-w-2xl relative z-10">
            <h4 className="text-2xl sm:text-4xl font-serif font-medium text-white mb-6 leading-tight">
              "We make clothes so beautiful, natural, and timeless, you will cherish them for decades."
            </h4>
            <p className="text-xs text-neutral-400 tracking-[0.2em] font-sans uppercase">
              – AURA STUDIO DESIGN TEAM, MILAN
            </p>
          </div>
          <button 
            onClick={() => {
              const catalogElement = document.getElementById("product-catalog");
              if (catalogElement) {
                catalogElement.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="whitespace-nowrap px-8 py-4 bg-white text-black hover:bg-neutral-200 rounded-full font-semibold text-xs tracking-widest uppercase transition-all shadow-lg hover:shadow-xl flex items-center gap-2 hover:scale-105 relative z-10 cursor-pointer"
          >
            Explore Materials Heritage
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>

      </div>
    </section>
  );
}
