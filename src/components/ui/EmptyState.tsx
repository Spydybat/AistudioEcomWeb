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
      <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-6 text-neutral-400">
        {icon}
      </div>
      <h2 className="text-lg font-serif font-semibold text-neutral-900 mb-2">{title}</h2>
      <p className="text-neutral-500 text-sm mb-8 max-w-md">{description}</p>
      {actionTo ? (
        <Link
          to={actionTo}
          className="bg-black text-white px-8 py-3 rounded-full text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors"
        >
          {actionLabel}
        </Link>
      ) : (
        <button
          onClick={onAction}
          className="bg-black text-white px-8 py-3 rounded-full text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
