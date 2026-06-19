import { Shield, RefreshCcw, Lock, Gift } from "lucide-react";

export default function TrustBadges() {
  const badges = [
    {
      icon: <Shield className="h-6 w-6 mb-4 text-neutral-800 group-hover:scale-110 transition-transform" />,
      title: "Secure Checkout",
      desc: "256-bit encryption",
    },
    {
      icon: <RefreshCcw className="h-6 w-6 mb-4 text-neutral-800 group-hover:scale-110 transition-transform" />,
      title: "30-Day Returns",
      desc: "Complimentary worldwide",
    },
    {
      icon: <Gift className="h-6 w-6 mb-4 text-neutral-800 group-hover:scale-110 transition-transform" />,
      title: "Premium Packaging",
      desc: "Signature gift wrap",
    },
    {
      icon: <Lock className="h-6 w-6 mb-4 text-neutral-800 group-hover:scale-110 transition-transform" />,
      title: "Lifetime Warranty",
      desc: "On all hardware",
    },
  ];

  return (
    <div className="bg-white py-16 border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-neutral-100">
          {badges.map((badge, idx) => (
            <div key={idx} className="flex flex-col items-center text-center px-4 group cursor-default">
              {badge.icon}
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-neutral-900 mb-2">
                {badge.title}
              </h4>
              <p className="text-[10px] text-neutral-400 font-medium tracking-wide">
                {badge.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
