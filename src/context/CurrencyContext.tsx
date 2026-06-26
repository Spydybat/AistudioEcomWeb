import React, { createContext, useContext, useState, ReactNode } from "react";

export const REGIONS = [
  { id: "US", flag: "🇺🇸", name: "United States", currency: "USD", symbol: "$" },
  { id: "IN", flag: "🇮🇳", name: "India", currency: "INR", symbol: "₹" },
  { id: "GB", flag: "🇬🇧", name: "United Kingdom", currency: "GBP", symbol: "£" },
  { id: "EU", flag: "🇪🇺", name: "Europe", currency: "EUR", symbol: "€" },
  { id: "JP", flag: "🇯🇵", name: "Japan", currency: "JPY", symbol: "¥" },
  { id: "CA", flag: "🇨🇦", name: "Canada", currency: "CAD", symbol: "$" },
  { id: "AU", flag: "🇦🇺", name: "Australia", currency: "AUD", symbol: "$" },
];

const EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  INR: 83.5,
  GBP: 0.79,
  EUR: 0.93,
  JPY: 155.2,
  CAD: 1.36,
  AUD: 1.52,
};

interface CurrencyContextType {
  selectedRegionId: string;
  setSelectedRegionId: (id: string) => void;
  activeRegion: typeof REGIONS[0];
  formatPrice: (priceInUsd: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [selectedRegionId, setRegionId] = useState(() => {
    return localStorage.getItem("aura_region") || "US";
  });

  const setSelectedRegionId = (id: string) => {
    setRegionId(id);
    localStorage.setItem("aura_region", id);
  };

  const activeRegion = REGIONS.find((r) => r.id === selectedRegionId) || REGIONS[0];

  const formatPrice = (priceInUsd: number) => {
    const rate = EXCHANGE_RATES[activeRegion.currency] || 1;
    const converted = priceInUsd * rate;

    // Special case for JPY (no decimals)
    if (activeRegion.currency === "JPY") {
      return `${activeRegion.symbol}${Math.round(converted).toLocaleString()}`;
    }

    // Special case for INR (Indian number formatting)
    if (activeRegion.currency === "INR") {
      return `${activeRegion.symbol}${converted.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }

    // Default formatting
    return `${activeRegion.symbol}${converted.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <CurrencyContext.Provider value={{ selectedRegionId, setSelectedRegionId, activeRegion, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
