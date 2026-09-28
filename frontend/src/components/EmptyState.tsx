import React from 'react';
import { Database, FilterX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  onReset?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Data Available',
  message = 'No records match the current filter selection.',
  onReset,
}) => {
  return (
    <div className="bg-white rounded-2xl p-12 border border-slate-200/80 shadow-card text-center flex flex-col items-center justify-center my-6">
      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4 border border-slate-200">
        <FilterX className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mb-6">{message}</p>
      {onReset && (
        <button
          onClick={onReset}
          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-md transition"
        >
          Reset All Filters
        </button>
      )}
    </div>
  );
};
