import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface StatusBadgeProps {
  status: 'HIGH WAITING TIME' | 'NORMAL WAITING TIME' | 'HIGH' | 'NORMAL' | string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const isHigh = status.toUpperCase().includes('HIGH');

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3.5 py-1.5 text-sm gap-2',
    lg: 'px-5 py-2 text-base gap-2.5 font-bold',
  }[size];

  if (isHigh) {
    return (
      <span
        className={`inline-flex items-center rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-semibold shadow-xs ${sizeClasses}`}
      >
        <AlertTriangle className={size === 'lg' ? 'w-5 h-5 text-rose-600' : 'w-4 h-4 text-rose-600'} />
        <span>{status}</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold shadow-xs ${sizeClasses}`}
    >
      <CheckCircle2 className={size === 'lg' ? 'w-5 h-5 text-emerald-600' : 'w-4 h-4 text-emerald-600'} />
      <span>{status}</span>
    </span>
  );
};
