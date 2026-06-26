import { Shield, RefreshCcw, Lock, Gift } from "lucide-react";

export default function TrustBadges() {
  const badges = [
    {
      icon: <Shield className="h-6 w-6 mb-4 text-zinc-400 group-hover:text-white group-hover:scale-110 transition-all duration-300" />,
      title: "Secure Checkout",
      desc: "256-bit encryption",
    },
    {
      icon: <RefreshCcw className="h-6 w-6 mb-4 text-zinc-400 group-hover:text-white group-hover:scale-110 transition-all duration-300" />,
      title: "30-Day Returns",
      desc: "Complimentary worldwide",
    },
    {
      icon: <Gift className="h-6 w-6 mb-4 text-zinc-400 group-hover:text-white group-hover:scale-110 transition-all duration-300" />,
      title: "Premium Packaging",
      desc: "Signature gift wrap",
    },
    {
      icon: <Lock className="h-6 w-6 mb-4 text-zinc-400 group-hover:text-white group-hover:scale-110 transition-all duration-300" />,
      title: "Lifetime Warranty",
      desc: "On all hardware",
    },
  ];

  return (
    <div className="bg-[#1E1F22] py-16 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/5">
          {badges.map((badge, idx) => (
            <div key={idx} className="flex flex-col items-center text-center px-4 group cursor-default">
              {badge.icon}
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-white mb-2">
                {badge.title}
              </h4>
              <p className="text-[10px] text-zinc-500 font-medium tracking-wide">
                {badge.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
