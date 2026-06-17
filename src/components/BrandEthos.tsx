import { Award, Leaf, Truck, ShieldCheck } from "lucide-react";

export default function BrandEthos() {
  const values = [
    {
      icon: <Leaf className="h-6 w-6 stroke-[1.2] text-neutral-800" />,
      title: "100% Traceable Fibers",
      subtitle: "GOTS & OEKO-TEX certified organic linens, Mongolian wools, and Egyptian cotton crops ensuring pure wearability."
    },
    {
      icon: <Award className="h-6 w-6 stroke-[1.2] text-neutral-800" />,
      title: "Sartorial Quality Standards",
      subtitle: "Meticulously crafted in Milanese and Tuscan studios using traditional hand-finishing sewing techniques."
    },
    {
      icon: <Truck className="h-6 w-6 stroke-[1.2] text-neutral-800" />,
      title: "Carbon-Neutral Logistics",
      subtitle: "Your garments arrive in biodegradable compostable boxes shipped using climate-neutral certified transport partners."
    },
    {
      icon: <ShieldCheck className="h-6 w-6 stroke-[1.2] text-neutral-800" />,
      title: "Garment Lifetime Promise",
      subtitle: "Under our commitment to circularity, we offer complimentary repair sewing sessions and custom button replacements."
    }
  ];

  return (
    <section className="bg-neutral-50 border-y border-neutral-100 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Ethos Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-neutral-400 mb-3">
            Craft • Sustainability • Circularity
          </p>
          <h2 className="text-2xl sm:text-3xl font-serif font-semibold tracking-wide text-neutral-900 uppercase">
            Designed for Form, Spun for the Planet
          </h2>
          <div className="w-12 h-[1px] bg-neutral-900 mx-auto mt-6 mb-4" />
          <p className="text-xs sm:text-sm text-neutral-500 font-light leading-relaxed">
            Aura Studio is an architectural project creating wardrobe baseline staples. We believe in minimal purchase volume, fine pristine fibers, and complete production transparency.
          </p>
        </div>

        {/* Ethos Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {values.map((value, idx) => (
            <div 
              key={idx} 
              className="bg-white p-6 border border-neutral-100 hover:border-neutral-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-start rounded-none"
            >
              <div className="p-3 bg-neutral-50 rounded-full mb-6 flex items-center justify-center">
                {value.icon}
              </div>
              <h3 className="text-sm font-medium tracking-wider text-neutral-900 uppercase mb-3">
                {value.title}
              </h3>
              <p className="text-xs text-neutral-500 font-light leading-relaxed">
                {value.subtitle}
              </p>
            </div>
          ))}
        </div>

        {/* Brand visual quote */}
        <div className="mt-16 sm:mt-24 bg-white border border-neutral-100 px-6 py-12 sm:p-16 flex flex-col md:flex-row items-center gap-8 justify-between">
          <div className="max-w-xl">
            <h4 className="text-lg sm:text-xl font-serif font-medium text-neutral-900 mb-3 leading-tight uppercase">
              "We make clothes so beautiful, natural, and timeless, you will cherish them for decades."
            </h4>
            <p className="text-xs text-neutral-400 tracking-wider font-mono uppercase">
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
            className="whitespace-nowrap px-6 py-3.5 border-b border-black text-black hover:text-neutral-500 hover:border-neutral-500 font-medium text-xs tracking-widest uppercase transition-colors"
          >
            Explore Materials Heritage
          </button>
        </div>

      </div>
    </section>
  );
}
