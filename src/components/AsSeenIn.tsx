import { motion } from "motion/react";

const LOGOS = [
  "VOGUE",
  "GQ",
  "HYPEBEAST",
  "ESQUIRE",
  "MONOCLE",
  "KINFOLK",
];

export default function AsSeenIn() {
  return (
    <section className="py-12 border-y border-neutral-200 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <p className="text-[10px] tracking-[0.2em] text-neutral-400 uppercase font-medium mb-8">
          Recognized by industry leaders
        </p>
        
        <div className="w-full relative flex overflow-x-hidden">
          {/* Fading edges for infinite scroll effect */}
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />
          
          <motion.div
            className="flex items-center gap-16 sm:gap-24 whitespace-nowrap px-8"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 30,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {[...LOGOS, ...LOGOS, ...LOGOS].map((logo, idx) => (
              <span
                key={idx}
                className="text-2xl sm:text-3xl font-serif font-bold tracking-widest text-neutral-300 hover:text-neutral-900 transition-colors cursor-default select-none grayscale opacity-70 hover:opacity-100 hover:grayscale-0 duration-500"
              >
                {logo}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
