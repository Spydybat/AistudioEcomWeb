import { Instagram, Facebook, Twitter, ShieldCheck, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-zinc-600 border-t border-zinc-200 pt-20 pb-12 sm:pt-28 relative overflow-hidden font-medium">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Section: Newsletter & Socials */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 border-b border-zinc-200 pb-16 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-md"
          >
            <h3 className="text-xl font-sans font-bold text-black tracking-tight uppercase mb-3">
              Join The Atelier
            </h3>
            <p className="text-sm text-zinc-500 mb-6">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <form className="flex items-center gap-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-1 bg-zinc-50 border border-zinc-200 rounded-full px-5 py-3.5 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors"
              />
              <button 
                type="submit" 
                className="bg-black text-white p-3.5 rounded-full hover:bg-zinc-800 transition-colors shadow-sm cursor-pointer"
                title="Subscribe"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </form>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex gap-3"
          >
            <a href="#instagram" className="w-12 h-12 flex items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 hover:text-black hover:border-black transition-all cursor-pointer shadow-sm" title="Instagram">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#facebook" className="w-12 h-12 flex items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 hover:text-black hover:border-black transition-all cursor-pointer shadow-sm" title="Facebook">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#twitter" className="w-12 h-12 flex items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 hover:text-black hover:border-black transition-all cursor-pointer shadow-sm" title="Twitter">
              <Twitter className="h-5 w-5" />
            </a>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-20">
          
          {/* Brand Meta Column */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-xl font-sans font-bold text-black tracking-tight uppercase">
              AURA STUDIO
            </h3>
            <p className="text-zinc-500 text-sm leading-relaxed pr-4">
              Fostering timeless garments spun from pure GOTS organic cottons, Mongolian shearling, Irish linen, and Grade-A cashmere thread-work. Pure form, ethical production coordinates.
            </p>
          </motion.div>

          {/* Collections links */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <h4 className="text-[10px] font-bold tracking-widest uppercase text-black mb-4">
              Collections Range
            </h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/products" className="text-zinc-500 hover:text-black hover:underline transition-all block w-max cursor-pointer">Shop All Collections</Link></li>
              <li><Link to="/products" className="text-zinc-500 hover:text-black hover:underline transition-all block w-max cursor-pointer">Seasonal Trench Coats</Link></li>
              <li><Link to="/products" className="text-zinc-500 hover:text-black hover:underline transition-all block w-max cursor-pointer">Pure Mongolian Cashmere</Link></li>
              <li><Link to="/products" className="text-zinc-500 hover:text-black hover:underline transition-all block w-max cursor-pointer">Deconstructed Suit Blazes</Link></li>
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
            <h4 className="text-[10px] font-bold tracking-widest uppercase text-black mb-4">
              The Studio Story
            </h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/about" className="text-zinc-500 hover:text-black hover:underline transition-all block w-max cursor-pointer">Our Heritage</Link></li>
              <li><Link to="/about" className="text-zinc-500 hover:text-black hover:underline transition-all block w-max cursor-pointer">100% Traceable Fibers</Link></li>
              <li><Link to="/about" className="text-zinc-500 hover:text-black hover:underline transition-all block w-max cursor-pointer">Milanese Atelier Guilds</Link></li>
              <li><Link to="/about" className="text-zinc-500 hover:text-black hover:underline transition-all block w-max cursor-pointer">Carbon-Neutral Delivery</Link></li>
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
            <h4 className="text-[10px] font-bold tracking-widest uppercase text-black mb-4">
              Atelier Customer Concierge
            </h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/wishlist" className="text-zinc-500 hover:text-black hover:underline transition-all block w-max cursor-pointer">Wishlist</Link></li>
              <li><Link to="/cart" className="text-zinc-500 hover:text-black hover:underline transition-all block w-max cursor-pointer">Shopping Bag</Link></li>
              <li><Link to="/contact" className="text-zinc-500 hover:text-black hover:underline transition-all block w-max cursor-pointer">Contact Concierge</Link></li>
            </ul>
          </motion.div>

        </div>

        {/* Bottom bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="border-t border-zinc-200 pt-8 mt-12"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-[10px] tracking-[0.2em] text-zinc-500 font-sans uppercase font-bold">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left order-2 sm:order-1">
              <span>© {currentYear} AURA STUDIO APPAREL INC.</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 order-1 sm:order-2">
              <a href="#privacy" className="hover:text-black transition-colors cursor-pointer">Privacy</a>
              <span className="hidden sm:inline text-zinc-300">•</span>
              <a href="#terms" className="hover:text-black transition-colors cursor-pointer">Terms</a>
            </div>
          </div>

          {/* Safe standard logos */}
          <div className="flex flex-wrap gap-4 items-center mt-8 justify-center sm:justify-start">
            <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              <ShieldCheck className="h-4 w-4" />
              Secure Verification
            </span>
            <div className="flex gap-2 ml-4">
              {["AMEX", "VISA", "MC", "APPLE", "PAYPAL"].map((p) => (
                <span key={p} className="px-2 py-1 border border-zinc-200 text-zinc-500 text-[9px] bg-zinc-50 rounded uppercase font-bold select-none cursor-default">
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

