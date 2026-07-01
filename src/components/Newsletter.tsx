import { useState, FormEvent } from "react";
import { ArrowRight, Mail, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { supabase } from "../supabaseClient";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes("@")) {
      setIsSuccess(true);
      setEmail("");
    }
  };

  return (
    <section className="bg-[#111214] text-white py-24 sm:py-32 relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full opacity-30 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Newsletter Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="text-[10px] font-mono tracking-[0.4em] uppercase text-zinc-500 mb-4 flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-zinc-400" />
            <span>EDITORIAL PRIVILEGES</span>
          </p>
          <h2 className="text-4xl sm:text-6xl font-serif font-bold tracking-tight uppercase leading-tight mb-6 text-gradient-dark">
            Join the Aura Circle
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-light leading-relaxed max-w-lg mx-auto">
            Subscribe to receive private invitations to seasonal sample events, limited-edition outerwear releases, and curated styling guides. We respect pure minimalism and never spam.
          </p>
        </motion.div>

        {/* Email Form with Success switcher */}
        {isSuccess ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1E1F22] p-8 rounded-3xl border border-white/5 text-center max-w-md mx-auto shadow-2xl"
          >
            <p className="text-lg font-serif font-semibold text-white mb-2 uppercase tracking-wide">
              Invitation Dispatch Success
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed font-light">
              We have dispatched our digital lookbook volume 04. Check your inbox to unlock your editorial pre-sales entrance code.
            </p>
          </motion.div>
        ) : (
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubscribe} 
            className="flex flex-col sm:flex-row items-stretch gap-4 max-w-xl mx-auto"
            id="newsletter-form"
          >
            <div className="relative flex-1">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500">
                <Mail className="h-5 w-5" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your professional email address"
                required
                className="w-full bg-[#2B2D31] border border-white/5 px-14 py-4 sm:py-5 text-sm tracking-wider placeholder-zinc-500 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-sans rounded-full transition-all shadow-inner backdrop-blur-sm"
              />
            </div>
            
            <button
              type="submit"
              className="px-8 py-4 sm:py-5 bg-indigo-500 text-white hover:bg-indigo-600 text-xs font-semibold tracking-widest uppercase flex items-center justify-center gap-3 transition-all rounded-full shadow-lg hover:shadow-[0_4px_14px_rgba(88,101,242,0.4)] hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Subscribe</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.form>
        )}

        {/* Footnote assurance */}
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-[10px] text-zinc-600 tracking-[0.2em] font-sans font-medium uppercase"
        >
          SECURE ENCRYPTED VERIFICATION SYSTEM • UNSUBSCRIBE ANYTIME • PRIVACY COMPLIANT
        </motion.p>

      </div>
    </section>
  );
}
