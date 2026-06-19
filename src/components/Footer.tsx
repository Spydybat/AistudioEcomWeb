import { Instagram, Facebook, Twitter, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-950 text-neutral-400 text-xs tracking-wide border-t border-neutral-900 pt-20 pb-8 sm:pt-32 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-white/5 blur-[120px] rounded-[100%] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-20">
          
          {/* Brand Meta Column */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-xl font-serif font-bold text-white tracking-widest uppercase">
              AURA STUDIO
            </h3>
            <p className="text-neutral-400 font-light leading-relaxed max-w-sm">
              Fostering timeless garments spun from pure GOTS organic cottons, Mongolian shearling, Irish linen, and Grade-A cashmere thread-work. Pure form, ethical production coordinates.
            </p>
            <div className="flex space-x-6 pt-2">
              <a href="#instagram" className="text-neutral-500 hover:text-white hover:-translate-y-1 transition-all" title="Aura Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#facebook" className="text-neutral-500 hover:text-white hover:-translate-y-1 transition-all" title="Aura Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#twitter" className="text-neutral-500 hover:text-white hover:-translate-y-1 transition-all" title="Aura Twitter">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </motion.div>

          {/* Collections links */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <h4 className="text-xs font-mono font-semibold tracking-widest uppercase text-white mb-2">
              Collections Range
            </h4>
            <ul className="space-y-4 font-light">
              <li><Link to="/products" className="text-neutral-400 hover:text-white transition-colors block">Shop All Collections</Link></li>
              <li><Link to="/products" className="text-neutral-400 hover:text-white transition-colors block">Seasonal Trench Coats</Link></li>
              <li><Link to="/products" className="text-neutral-400 hover:text-white transition-colors block">Pure Mongolian Cashmere</Link></li>
              <li><Link to="/products" className="text-neutral-400 hover:text-white transition-colors block">Deconstructed Suit Blazes</Link></li>
            </ul>
          </motion.div>

          {/* Studio Ethos links */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <h4 className="text-xs font-mono font-semibold tracking-widest uppercase text-white mb-2">
              The Studio Story
            </h4>
            <ul className="space-y-4 font-light">
              <li><Link to="/about" className="text-neutral-400 hover:text-white transition-colors block">Our Heritage</Link></li>
              <li><Link to="/about" className="text-neutral-400 hover:text-white transition-colors block">100% Traceable Fibers</Link></li>
              <li><Link to="/about" className="text-neutral-400 hover:text-white transition-colors block">Milanese Atelier Guilds</Link></li>
              <li><Link to="/about" className="text-neutral-400 hover:text-white transition-colors block">Carbon-Neutral Delivery</Link></li>
            </ul>
          </motion.div>

          {/* Customer Services links */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <h4 className="text-xs font-mono font-semibold tracking-widest uppercase text-white mb-2">
              Atelier Customer Concierge
            </h4>
            <ul className="space-y-4 font-light">
              <li><Link to="/contact" className="text-neutral-400 hover:text-white transition-colors block">Contact Concierge</Link></li>
              <li><Link to="/contact" className="text-neutral-400 hover:text-white transition-colors block">Complimentary FedEx Courier</Link></li>
              <li><Link to="/contact" className="text-neutral-400 hover:text-white transition-colors block">Extended 30-Day Return Desk</Link></li>
              <li><Link to="/contact" className="text-neutral-400 hover:text-white transition-colors block">Luxury Cedar Storage Care</Link></li>
            </ul>
          </motion.div>

        </div>

        {/* Bottom bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="border-t border-neutral-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-[10px]/none tracking-[0.2em] text-neutral-500 font-mono uppercase"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <span>© {currentYear} AURA STUDIO APPAREL INC.</span>
            <span className="hidden sm:inline text-neutral-800">•</span>
            <span>ALL RIGHTS PRIVILEGED</span>
          </div>

          {/* Safe standard logos */}
          <div className="flex flex-wrap gap-4 items-center">
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Secure Verification
            </span>
            <div className="flex gap-2">
              {["AMEX", "VISA", "MC", "APPLE", "PAYPAL"].map((p) => (
                <span key={p} className="px-2 py-1 border border-neutral-800 text-neutral-400 text-[9px] bg-neutral-900 rounded select-none uppercase font-bold">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
