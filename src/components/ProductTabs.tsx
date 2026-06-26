import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface ProductTabsProps {
  description: string;
  details: string[];
  specifications?: Record<string, string>;
  warranty?: string;
  shipping?: string;
}

export default function ProductTabs({ description, details, specifications, warranty, shipping }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<"description" | "specifications" | "shipping">("description");

  const tabs = [
    { id: "description", label: "Description" },
    { id: "specifications", label: "Specifications" },
    { id: "shipping", label: "Shipping & Returns" },
  ] as const;

  return (
    <div className="mt-16 border-t border-white/5 pt-10">
      {/* Tab Navigation */}
      <div className="flex items-center gap-8 border-b border-white/5 mb-8 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 text-sm tracking-widest uppercase font-medium transition-colors relative whitespace-nowrap cursor-pointer ${
              activeTab === tab.id ? "text-white" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
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
            className="text-zinc-400 font-light leading-relaxed"
          >
            {activeTab === "description" && (
              <div className="max-w-3xl space-y-4">
                <p>{description}</p>
                <p>Selected for the Aura marketplace through a quality-first buying process, this product is evaluated for presentation, materials, usability, and after-purchase support before it reaches the catalog.</p>
              </div>
            )}
            
            {activeTab === "specifications" && (
              <div className="max-w-4xl space-y-8">
                {specifications && (
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(specifications).map(([label, value]) => (
                      <div key={label} className="rounded-xl border border-white/5 bg-[#1E1F22] px-4 py-3">
                        <dt className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">{label}</dt>
                        <dd className="mt-1 text-sm text-zinc-300">{value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {activeTab === "shipping" && (
              <div className="max-w-3xl space-y-6">
                <div>
                  <h4 className="font-medium text-white mb-2 uppercase tracking-widest text-xs">Complimentary Shipping</h4>
                  <p>{shipping || "Enjoy fast tracked delivery on eligible marketplace orders. Orders placed before 2PM local warehouse time usually ship same day."}</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2 uppercase tracking-widest text-xs">Returns & Warranty</h4>
                  <p>Returns are simple within 30 days for eligible unused items. {warranty || "Warranty coverage varies by product and brand."}</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
