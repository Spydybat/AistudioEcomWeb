import { motion } from "motion/react";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Elena R.",
    role: "Verified Buyer",
    text: "The cashmere sweater is an absolute dream. The attention to detail and the quality of the fabric is unmatched.",
    rating: 5,
  },
  {
    name: "James M.",
    role: "Verified Buyer",
    text: "I've never felt linen this soft. It drapes perfectly and has become the staple of my summer wardrobe.",
    rating: 5,
  },
  {
    name: "Sarah T.",
    role: "Verified Buyer",
    text: "You can tell the tailoring is Italian. The fit is impeccable, and the unconstructed shoulders give it that perfect effortless look.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-white overflow-hidden border-y border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[10px] font-sans font-bold tracking-widest uppercase text-zinc-500 mb-4">
            Words from our clients
          </p>
          <h2 className="text-3xl sm:text-4xl font-sans font-bold tracking-tight text-black uppercase">
            A Global Consensus
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="bg-zinc-50 p-8 rounded-2xl border border-zinc-200 hover:border-black transition-all duration-300 flex flex-col cursor-default"
            >
              <div className="flex gap-1 mb-6 text-yellow-500">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-zinc-600 font-sans font-medium text-lg leading-relaxed mb-8 italic">
                "{testimonial.text}"
              </p>
              <div className="mt-auto">
                <p className="text-sm font-bold text-black uppercase tracking-wider mb-1">
                  {testimonial.name}
                </p>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                  {testimonial.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
