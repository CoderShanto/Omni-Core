import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  badgeText?: string;
  color?: 'indigo' | 'cyan' | 'emerald' | 'amber' | 'rose';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  badgeText,
  color = 'indigo'
}) => {
  const colorMap = {
    indigo: 'from-indigo-500/20 to-violet-500/10 text-indigo-400 border-indigo-500/30',
    cyan: 'from-cyan-500/20 to-blue-500/10 text-cyan-400 border-cyan-500/30',
    emerald: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30',
    amber: 'from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30',
    rose: 'from-rose-500/20 to-red-500/10 text-rose-400 border-rose-500/30'
  };

  return (
    <div className="glass-panel p-5 glass-card-interactive flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          {title}
        </span>
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorMap[color]} border flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
        {trend && (
          <p className="text-xs text-emerald-400 mt-1 font-medium flex items-center gap-1">
            <span>↑</span> {trend}
          </p>
        )}
        {badgeText && (
          <span className="text-[11px] text-[var(--text-muted)] mt-1 inline-block">
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
};
