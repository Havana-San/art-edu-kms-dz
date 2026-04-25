import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon:  LucideIcon;
  label: string;
  value: string | number;
  color: string;
  bg:    string;
}

export default function StatsCard({ icon: Icon, label, value, color, bg }: StatsCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
        <Icon size={20} className={color} />
      </div>
      <div className="text-2xl font-black text-white mb-1">{value}</div>
      <div className="text-slate-400 text-xs">{label}</div>
    </div>
  );
}