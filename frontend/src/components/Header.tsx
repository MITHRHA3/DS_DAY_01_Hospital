import React from 'react';
import { Menu, ShieldCheck, Database } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle: string;
  onOpenMobileMenu: () => void;
  modelOnline?: boolean;
  totalPatients?: number;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onOpenMobileMenu,
  modelOnline = true,
  totalPatients = 10000,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-4 flex items-center justify-between transition-all">
      <div className="flex items-center space-x-3 sm:space-x-4">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
          aria-label="Open Sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-xl line-clamp-1">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Model Status Indicator */}
        <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-semibold shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Model Online
          </span>
        </div>

        {/* Dataset badge */}
        <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
          <Database className="w-3.5 h-3.5 text-slate-500" />
          <span>{totalPatients.toLocaleString()} Records</span>
        </div>
      </div>
    </header>
  );
};
