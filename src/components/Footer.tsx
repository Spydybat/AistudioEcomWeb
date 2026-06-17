import { Flame, Instagram, Facebook, Twitter, ShieldCheck } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-950 text-neutral-400 text-xs tracking-wide border-t border-neutral-900 pt-16 pb-8 sm:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-16">
        
        {/* Brand Meta Column */}
        <div className="space-y-4">
          <h3 className="text-sm font-serif font-semibold text-white tracking-widest uppercase">
            AURA STUDIO
          </h3>
          <p className="text-neutral-500 font-light leading-relaxed max-w-sm">
            Fostering timeless garments spun from pure GOTS organic cottons, Mongolian shearling, Irish linen, and Grade-A cashmere thread-work. Pure form, ethical production coordinates.
          </p>
          <div className="flex space-x-4 pt-2">
            <a href="#instagram" className="text-neutral-500 hover:text-white transition-colors" title="Aura Instagram">
              <Instagram className="h-4.5 w-4.5" />
            </a>
            <a href="#facebook" className="text-neutral-500 hover:text-white transition-colors" title="Aura Facebook">
              <Facebook className="h-4.5 w-4.5" />
            </a>
            <a href="#twitter" className="text-neutral-500 hover:text-white transition-colors" title="Aura Twitter">
              <Twitter className="h-4.5 w-4.5" />
            </a>
          </div>
        </div>

        {/* Collections links */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono font-medium tracking-widest uppercase text-white">
            Collections Range
          </h4>
          <ul className="space-y-2.5 font-light">
            {["Seasonal Trench Coats", "Pure Mongolian Cashmere", "Deconstructed Suit Blazes", "Signature Linen Trouser", "Essentials Staple Shirts"].map((link) => (
              <li key={link}>
                <a href="#product-catalog" className="text-neutral-500 hover:text-white transition-colors block">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Studio Ethos links */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono font-medium tracking-widest uppercase text-white">
            The Studio Story
          </h4>
          <ul className="space-y-2.5 font-light">
            {["100% Traceable Fibers", " Milanese Atelier Guilds", "Carbon-Neutral Delivery", "Garment Repair Circularity", "Seasonal Lookbook V4"].map((link) => (
              <li key={link}>
                <a href="#editorial-heritage" className="text-neutral-500 hover:text-white transition-colors block">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Services links */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono font-medium tracking-widest uppercase text-white">
            Atelier Customer Concierge
          </h4>
          <ul className="space-y-2.5 font-light">
            {["Complimentary FedEx Courier", "Atelier Fittings Appointment", "Virtual Sizing Consultations", "Extended 30-Day Return Desk", "Luxury Cedar storage Box Care"].map((link) => (
              <li key={link}>
                <a href="#customer-care" className="text-neutral-500 hover:text-white transition-colors block">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-neutral-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px]/none tracking-wider text-neutral-600 font-mono">
        <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
          <span>© {currentYear} AURA STUDIO APPAREL INC. ALL RIGHTS PRIVILEGED.</span>
          <span className="hidden sm:inline text-neutral-800">•</span>
          <span>DEVELOPED SECURELY VIA ATELIER DEPLOY</span>
        </div>

        {/* Safe standard logos */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[9px] text-neutral-600 mr-2 uppercase tracking-widest flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" />
            Secure Verification:
          </span>
          <div className="flex gap-1">
            {["AMEX", "VISA", "MC", "APPLE PAY", "PAYPAL"].map((p) => (
              <span key={p} className="px-1.5 py-0.5 border border-neutral-900 hover:border-neutral-800 text-neutral-500 text-[8px] bg-neutral-950 rounded select-none uppercase font-bold">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
