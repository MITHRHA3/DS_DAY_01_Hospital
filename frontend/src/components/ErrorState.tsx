import React from 'react';
import { AlertCircle, RefreshCw, ServerOff } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Backend Connection Required',
  message,
  onRetry,
}) => {
  return (
    <div className="bg-rose-50/60 rounded-2xl p-8 border border-rose-200 shadow-card text-center flex flex-col items-center justify-center my-6">
      <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mb-4 border border-rose-200">
        <ServerOff className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-rose-900 mb-1">{title}</h3>
      <p className="text-sm text-rose-700 max-w-lg mb-6 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md transition"
        >
          <RefreshCw className="w-4 h-4" />
          Retry Connection
        </button>
      )}
    </div>
  );
};
