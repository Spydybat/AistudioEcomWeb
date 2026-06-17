import { useState, FormEvent } from "react";
import { ArrowRight, Mail, Sparkles } from "lucide-react";

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
    <section className="bg-neutral-900 text-white py-16 sm:py-24 border-t border-neutral-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Newsletter Header */}
        <div className="mb-8">
          <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-neutral-400 mb-3 flex items-center justify-center gap-1.5">
            <Sparkles className="h-4 w-4 text-neutral-500" />
            <span>EDITORIAL PRIVILEGES</span>
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold tracking-wide uppercase leading-tight mb-4">
            Join the Aura Studio Circle
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm font-light leading-relaxed max-w-sm sm:max-w-md mx-auto">
            Subscribe to receive private invitations to seasonal sample events, limited-edition outerwear releases, and curated styling guides. We respect pure minimalism and never spam.
          </p>
        </div>

        {/* Email Form with Success switcher */}
        {isSuccess ? (
          <div className="bg-neutral-850 p-6 border border-neutral-800 animate-fadeIn text-center max-w-md mx-auto">
            <p className="text-sm font-sans font-medium text-white mb-1.5 uppercase tracking-wide">
              Invitation Dispatch Success!
            </p>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              We have dispatched our digital lookbook volume 04. Check your inbox to unlock your editorial pre-sales entrance code.
            </p>
          </div>
        ) : (
          <form 
            onSubmit={handleSubscribe} 
            className="flex flex-col sm:flex-row items-stretch gap-2.5 max-w-lg mx-auto"
            id="newsletter-form"
          >
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your professional email address"
                required
                className="w-full bg-neutral-950 border border-neutral-800 px-11 py-4 text-xs tracking-wider placeholder-neutral-500 text-white focus:outline-none focus:border-neutral-400 font-sans rounded-none transition-all"
              />
            </div>
            
            <button
              type="submit"
              className="px-8 py-4 bg-white text-black hover:bg-neutral-200 text-xs font-mono tracking-widest font-semibold uppercase flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
            >
              <span>Subscribe</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        {/* Footnote assurance */}
        <p className="mt-5 text-[9.5px]/none text-neutral-500 tracking-wider font-mono">
          SECURE ENCRYPTED VERIFICATION SYSTEM • UNSUBSCRIBE ANYTIME • PRIVACY COMPLIANT
        </p>

      </div>
    </section>
  );
}
