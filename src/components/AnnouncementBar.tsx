import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useCurrency } from "../context/CurrencyContext";

export default function AnnouncementBar() {
  const { formatPrice } = useCurrency();
  const MESSAGES = [
    `Complimentary Global Shipping on Orders Over ${formatPrice(200)}`,
    "Early Access: The Cashmere Collection Vol. 4",
    "Sign up for our newsletter to receive an exclusive gift",
  ];
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="bg-neutral-950 text-white relative z-50 overflow-hidden text-center py-2.5 px-8 flex justify-center items-center h-10">
      <AnimatePresence mode="wait">
        <motion.p
          key={currentIndex}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="text-[10px] sm:text-xs font-mono tracking-widest uppercase font-medium absolute max-w-[85vw] truncate"
        >
          {MESSAGES[currentIndex]}
        </motion.p>
      </AnimatePresence>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute right-4 text-neutral-400 hover:text-white transition-colors cursor-pointer"
        aria-label="Close announcement"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
