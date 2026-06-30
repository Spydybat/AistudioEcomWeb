import { motion, useInView } from "motion/react";
import { useRef, useEffect, useState } from "react";

function Counter({ from, to, suffix = "", duration = 2 }: { from: number; to: number; suffix?: string; duration?: number }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true, margin: "-100px" });
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (inView) {
      let startTimestamp: number;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
        const currentCount = Math.floor(progress * (to - from) + from);
        setCount(currentCount);
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [inView, from, to, duration]);

  return <span ref={nodeRef}>{count}{suffix}</span>;
}

export default function AnimatedStatistics() {
  return (
    <section className="py-20 bg-neutral-950 text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-5" />
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-transparent to-neutral-950" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center divide-x divide-white/10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center justify-center px-4"
          >
            <h4 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold mb-3 text-gradient-dark">
              <Counter from={0} to={10} suffix="K+" />
            </h4>
            <p className="text-[10px] sm:text-xs tracking-[0.2em] text-zinc-400 uppercase font-medium">Customers Worldwide</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center px-4"
          >
            <h4 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold mb-3 text-gradient-dark">
              <Counter from={0} to={98} suffix="%" />
            </h4>
            <p className="text-[10px] sm:text-xs tracking-[0.2em] text-zinc-400 uppercase font-medium">Satisfaction Rate</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center justify-center px-4"
          >
            <h4 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold mb-3 text-gradient-dark">
              <Counter from={0} to={24} suffix="/7" />
            </h4>
            <p className="text-[10px] sm:text-xs tracking-[0.2em] text-zinc-400 uppercase font-medium">Concierge Support</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center justify-center px-4 border-none md:border-l"
          >
            <h4 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold mb-3 text-gradient-dark">
              <Counter from={0} to={100} suffix="%" />
            </h4>
            <p className="text-[10px] sm:text-xs tracking-[0.2em] text-zinc-400 uppercase font-medium">Carbon Neutral</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
