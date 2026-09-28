import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon: LucideIcon;
  badge?: string;
  badgeType?: 'neutral' | 'warning' | 'danger' | 'success' | 'info';
  colorTheme?: 'sky' | 'teal' | 'indigo' | 'amber' | 'rose';
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  badge,
  badgeType = 'neutral',
  colorTheme = 'sky',
}) => {
  const themeClasses = {
    sky: 'bg-sky-50 text-sky-600 border-sky-100',
    teal: 'bg-teal-50 text-teal-600 border-teal-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
  }[colorTheme];

  const badgeClasses = {
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    info: 'bg-sky-50 text-sky-700 border-sky-200',
  }[badgeType];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card hover:shadow-premium transition-all duration-200 flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {title}
          </span>
          <div className={`p-2.5 rounded-xl border ${themeClasses} transition-transform group-hover:scale-105`}>
            <Icon className="w-5 h-5 stroke-[2]" />
          </div>
        </div>

        <div className="flex items-baseline space-x-1.5 mt-1">
          <span className="text-3xl font-bold text-slate-900 tracking-tight">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>
          {unit && (
            <span className="text-sm font-semibold text-slate-500">
              {unit}
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500 font-medium">
          {subtitle || 'Real-time CSV analytics'}
        </span>
        {badge && (
          <span className={`px-2 py-0.5 rounded-full font-semibold border ${badgeClasses}`}>
            {badge}
          </span>
        )}
      </div>
    </div>
  );
};
