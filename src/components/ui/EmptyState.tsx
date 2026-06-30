import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  actionTo?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="py-16 text-center flex flex-col items-center">
      <div className="w-16 h-16 bg-[#111214] border border-white/5 rounded-full flex items-center justify-center mb-6 text-zinc-500">
        {icon}
      </div>
      <h2 className="text-lg font-serif font-semibold text-white mb-2">{title}</h2>
      <p className="text-zinc-400 text-sm mb-8 max-w-md">{description}</p>
      {actionTo ? (
        <Link
          to={actionTo}
          className="bg-indigo-500 text-white px-8 py-3 rounded-full text-xs uppercase tracking-widest hover:bg-indigo-600 transition-colors"
        >
          {actionLabel}
        </Link>
      ) : (
        <button
          onClick={onAction}
          className="bg-indigo-500 text-white px-8 py-3 rounded-full text-xs uppercase tracking-widest hover:bg-indigo-600 transition-colors cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
