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
      <div className="w-16 h-16 bg-zinc-50 border border-zinc-200 rounded-full flex items-center justify-center mb-6 text-zinc-500">
        {icon}
      </div>
      <h2 className="text-sm font-sans font-bold tracking-wider uppercase text-black mb-2">{title}</h2>
      <p className="text-zinc-500 text-sm font-medium mb-8 max-w-md">{description}</p>
      {actionTo ? (
        <Link
          to={actionTo}
          className="bg-black text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:-translate-y-0.5"
        >
          {actionLabel}
        </Link>
      ) : (
        <button
          onClick={onAction}
          className="bg-black text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
