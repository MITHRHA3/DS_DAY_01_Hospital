import React from 'react';
import { Insight } from '../types';
import { Sparkles, AlertTriangle, Lightbulb, TrendingUp, Clock, Users, ArrowUpRight } from 'lucide-react';

interface InsightCardProps {
  insights: Insight[];
}

export const InsightCard: React.FC<InsightCardProps> = ({ insights }) => {
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'bottleneck':
        return AlertTriangle;
      case 'intake':
        return Users;
      case 'clinical':
        return Lightbulb;
      case 'capacity':
        return Clock;
      case 'scheduling':
        return TrendingUp;
      default:
        return Sparkles;
    }
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'High':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-teal-50 text-teal-700 border-teal-200';
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-premium relative overflow-hidden border border-slate-700/60">
      {/* Decorative subtle background glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Operational Insights
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                AI Engine
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Automated operational diagnostics derived directly from outpatient dataset
            </p>
          </div>
        </div>
        <div className="text-xs font-mono text-slate-400 hidden sm:block">
          {insights.length} Key Diagnostics
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map((item) => {
          const Icon = getCategoryIcon(item.category);
          return (
            <div
              key={item.id}
              className="bg-slate-800/60 backdrop-blur-md rounded-xl p-4 border border-slate-700/50 hover:border-slate-600 transition duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/80 text-teal-300 text-xs font-medium border border-slate-700">
                    <Icon className="w-3.5 h-3.5" />
                    {item.category}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getImpactBadge(item.impact)}`}>
                    {item.impact} Impact
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-white group-hover:text-teal-300 transition-colors mt-1">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Metric</span>
                <span className="font-mono font-bold text-teal-400 flex items-center gap-1">
                  {item.metric}
                  <ArrowUpRight className="w-3 h-3 text-teal-400" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
