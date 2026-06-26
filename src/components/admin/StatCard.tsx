import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

export default function StatCard({ label, value, icon: Icon, trend, trendUp }: StatCardProps) {
  return (
    <div className="bg-[#1E1F22] border border-white/5 rounded-xl p-5 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-2">{label}</p>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-white">{value}</p>
          {trend && (
            <p className={`text-xs mt-2 ${trendUp ? "text-emerald-500" : "text-zinc-500"}`}>
              {trend}
            </p>
          )}
        </div>
        <div className="p-3 bg-[#2B2D31] rounded-lg">
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  );
}
