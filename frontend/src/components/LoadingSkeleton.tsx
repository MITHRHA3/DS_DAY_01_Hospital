import React from 'react';

export const KPISkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl p-5 border border-slate-200/80 animate-pulse">
    <div className="flex justify-between items-center mb-4">
      <div className="h-3 bg-slate-200 rounded w-1/3"></div>
      <div className="w-9 h-9 bg-slate-200 rounded-xl"></div>
    </div>
    <div className="h-8 bg-slate-200 rounded w-1/2 mb-3"></div>
    <div className="h-3 bg-slate-100 rounded w-2/3"></div>
  </div>
);

export const ChartSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl p-6 border border-slate-200/80 animate-pulse min-h-[340px] flex flex-col justify-between">
    <div className="flex justify-between items-start mb-6">
      <div className="space-y-2 w-1/2">
        <div className="h-4 bg-slate-200 rounded w-2/3"></div>
        <div className="h-3 bg-slate-100 rounded w-1/3"></div>
      </div>
      <div className="h-8 bg-slate-200 rounded w-20"></div>
    </div>
    <div className="w-full h-48 bg-slate-100 rounded-xl flex items-end p-4 space-x-3">
      <div className="w-1/6 bg-slate-200 h-1/3 rounded-t"></div>
      <div className="w-1/6 bg-slate-200 h-2/3 rounded-t"></div>
      <div className="w-1/6 bg-slate-200 h-full rounded-t"></div>
      <div className="w-1/6 bg-slate-200 h-1/2 rounded-t"></div>
      <div className="w-1/6 bg-slate-200 h-3/4 rounded-t"></div>
      <div className="w-1/6 bg-slate-200 h-2/5 rounded-t"></div>
    </div>
  </div>
);

export const TableSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl p-6 border border-slate-200/80 animate-pulse">
    <div className="h-6 bg-slate-200 rounded w-1/4 mb-6"></div>
    <div className="space-y-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-12 bg-slate-100 rounded-xl w-full"></div>
      ))}
    </div>
  </div>
);
