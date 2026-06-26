import { motion } from "motion/react";
import { CATEGORIES } from "../data/products";

export default function FeaturedCategories({
  onFilterCategory
}: {
  onFilterCategory: (catId: string) => void;
}) {
  const visualCategories = CATEGORIES.filter(c => c.id !== "all" && c.featured).slice(0, 4);

  return (
    <section className="py-24 sm:py-32 bg-[#1E1F22] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 sm:mb-24"
        >
          <h2 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-white uppercase">
            Shop By Category
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {visualCategories.map((category, idx) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              onClick={() => {
                onFilterCategory(category.id);
                document.getElementById('product-catalog')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="relative group aspect-square md:aspect-[4/3] rounded-[2rem] overflow-hidden cursor-pointer"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="absolute inset-0 p-8 sm:p-12 flex flex-col justify-end items-center sm:items-start text-center sm:text-left transition-transform duration-500 group-hover:-translate-y-2">
                <h3 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-wide uppercase mb-2">
                  {category.name}
                </h3>
                <span className="text-white/80 text-xs font-mono tracking-[0.2em] uppercase font-semibold">
                  Explore Department
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
