import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface ProductTabsProps {
  description: string;
  details: string[];
}

export default function ProductTabs({ description, details }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<"description" | "specifications" | "shipping">("description");

  const tabs = [
    { id: "description", label: "Description" },
    { id: "specifications", label: "Specifications" },
    { id: "shipping", label: "Shipping & Returns" },
  ] as const;

  return (
    <div className="mt-16 border-t border-neutral-200 pt-10">
      {/* Tab Navigation */}
      <div className="flex items-center gap-8 border-b border-neutral-200 mb-8 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 text-sm tracking-widest uppercase font-medium transition-colors relative whitespace-nowrap cursor-pointer ${
              activeTab === tab.id ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-700"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900"
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[200px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-neutral-600 font-light leading-relaxed"
          >
            {activeTab === "description" && (
              <div className="max-w-3xl space-y-4">
                <p>{description}</p>
                <p>Designed in our Milan studio and crafted with uncompromising attention to detail, this piece represents the pinnacle of modern luxury. Each garment undergoes a rigorous 40-point inspection process.</p>
              </div>
            )}
            
            {activeTab === "specifications" && (
              <div className="max-w-3xl">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 mt-2 shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {activeTab === "shipping" && (
              <div className="max-w-3xl space-y-6">
                <div>
                  <h4 className="font-medium text-neutral-900 mb-2 uppercase tracking-widest text-xs">Complimentary Shipping</h4>
                  <p>Enjoy free global express shipping on all orders via FedEx Priority. Orders placed before 2PM EST ship same day.</p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900 mb-2 uppercase tracking-widest text-xs">30-Day Returns</h4>
                  <p>Returns are elegantly simple. Use the pre-paid label included in your premium cedar-lined shipping box to return unworn items within 30 days.</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
