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
    <div className="bg-white border border-neutral-200 rounded-xl p-5 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-2">{label}</p>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900">{value}</p>
          {trend && (
            <p className={`text-xs mt-2 ${trendUp ? "text-emerald-600" : "text-neutral-500"}`}>
              {trend}
            </p>
          )}
        </div>
        <div className="p-3 bg-neutral-100 rounded-lg">
          <Icon className="h-5 w-5 text-neutral-600" />
        </div>
      </div>
    </div>
  );
}
