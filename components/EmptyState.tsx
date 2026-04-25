import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  icon:        LucideIcon;
  title:       string;
  description: string;
  actionLabel?: string;
  actionHref?:  string;
}

export default function EmptyState({
  icon: Icon, title, description, actionLabel, actionHref
}: EmptyStateProps) {
  return (
    <div className="bg-slate-900 border border-dashed border-slate-700 rounded-2xl p-14 text-center">
      <Icon size={40} className="text-slate-600 mx-auto mb-3" />
      <h3 className="font-amiri text-xl text-slate-300 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm mb-6">{description}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition-all active:scale-95"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}