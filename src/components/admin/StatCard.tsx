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
    <div className="bg-white border border-zinc-200 rounded-2xl p-5 sm:p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">{label}</p>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-black">{value}</p>
          {trend && (
            <p className={`text-xs mt-2 ${trendUp ? "text-emerald-500" : "text-zinc-500"}`}>
              {trend}
            </p>
          )}
        </div>
        <div className="p-3 bg-zinc-100 rounded-lg">
          <Icon className="h-5 w-5 text-black" />
        </div>
      </div>
    </div>
  );
}
