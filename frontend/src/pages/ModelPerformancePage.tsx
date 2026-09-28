import React, { useState, useEffect } from 'react';
import { ModelPerformanceData } from '../types';
import { getModelPerformance } from '../services/api';
import { KPICard } from '../components/KPICard';
import { ChartCard } from '../components/ChartCard';
import { KPISkeleton, ChartSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';
import { Cpu, Target, Award, ShieldCheck, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export const ModelPerformancePage: React.FC = () => {
  const [data, setData] = useState<ModelPerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModelPerf = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getModelPerformance();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch Random Forest model metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModelPerf();
  }, []);

  if (error) {
    return <ErrorState message={error} onRetry={fetchModelPerf} />;
  }

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <KPISkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  const { accuracy, precision, recall, f1_score, confusion_matrix, feature_importance } = data;
  const [[tn, fp], [fn, tp]] = confusion_matrix;
  const total = tn + fp + fn + tp;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Model Technical Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white border border-slate-700/60 shadow-premium flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20 shrink-0">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Random Forest Classifier Architecture
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              200 decision trees, balanced class weights, ColumnTransformer OneHotEncoder pipeline loaded via Joblib pickle binary.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-teal-500/10 border border-teal-500/30 px-3.5 py-2 rounded-xl text-teal-300 text-xs font-mono">
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          <span>hospital_waiting_model.pkl</span>
        </div>
      </div>

      {/* Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Accuracy"
          value={`${accuracy}%`}
          subtitle="Overall correct predictions"
          icon={Target}
          colorTheme="sky"
          badge="Scikit-Learn"
        />

        <KPICard
          title="Precision"
          value={`${precision}%`}
          subtitle="Positive predictive value"
          icon={Award}
          colorTheme="teal"
          badge="High Waiting"
        />

        <KPICard
          title="Recall"
          value={`${recall}%`}
          subtitle="Sensitivity / True Positive Rate"
          icon={CheckCircle2}
          colorTheme="indigo"
          badge="Coverage"
        />

        <KPICard
          title="F1 Score"
          value={`${f1_score}%`}
          subtitle="Harmonic mean of precision & recall"
          icon={Layers}
          colorTheme="amber"
          badge="Balanced"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Confusion Matrix Card */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-slate-900">
                Confusion Matrix
              </h3>
              <span className="text-xs font-mono text-slate-500">
                {total.toLocaleString()} Patients Evaluated
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Classification distribution across Normal Waiting (0) and High Waiting (1)
            </p>

            {/* Matrix Grid */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-center text-xs font-semibold text-slate-500">
                <div>Predicted Normal</div>
                <div>Predicted High</div>
              </div>

              {/* Row 1: Actual Normal */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-xl text-center">
                  <span className="text-2xl font-extrabold text-emerald-950 font-mono block">
                    {tn.toLocaleString()}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 block mt-1">
                    True Normal (TN)
                  </span>
                  <span className="text-[10px] text-emerald-600 block mt-0.5">
                    {((tn / total) * 100).toFixed(1)}% of dataset
                  </span>
                </div>

                <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-xl text-center">
                  <span className="text-2xl font-extrabold text-amber-950 font-mono block">
                    {fp.toLocaleString()}
                  </span>
                  <span className="text-[11px] font-semibold text-amber-800 block mt-1">
                    False High (FP)
                  </span>
                  <span className="text-[10px] text-amber-700 block mt-0.5">
                    {((fp / total) * 100).toFixed(1)}% of dataset
                  </span>
                </div>
              </div>

              {/* Row 2: Actual High */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-rose-50/80 border border-rose-200 p-4 rounded-xl text-center">
                  <span className="text-2xl font-extrabold text-rose-950 font-mono block">
                    {fn.toLocaleString()}
                  </span>
                  <span className="text-[11px] font-semibold text-rose-800 block mt-1">
                    False Normal (FN)
                  </span>
                  <span className="text-[10px] text-rose-700 block mt-0.5">
                    {((fn / total) * 100).toFixed(1)}% of dataset
                  </span>
                </div>

                <div className="bg-teal-50/80 border border-teal-200 p-4 rounded-xl text-center">
                  <span className="text-2xl font-extrabold text-teal-950 font-mono block">
                    {tp.toLocaleString()}
                  </span>
                  <span className="text-[11px] font-semibold text-teal-800 block mt-1">
                    True High (TP)
                  </span>
                  <span className="text-[10px] text-teal-700 block mt-0.5">
                    {((tp / total) * 100).toFixed(1)}% of dataset
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Actual Classes: Normal & High</span>
            <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-semibold">
              Balanced Sample
            </span>
          </div>
        </div>

        {/* Feature Importance Horizontal Chart */}
        <div className="lg:col-span-7">
          <ChartCard
            title="Factors Influencing High Waiting Time"
            subtitle="Top Random Forest feature importances extracted directly from pipeline"
          >
            <ResponsiveContainer width="100%" height={340}>
              <BarChart
                layout="vertical"
                data={feature_importance}
                margin={{ top: 10, right: 30, left: 30, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" unit="%" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="feature"
                  tick={{ fill: '#0f172a', fontSize: 12, fontWeight: 500 }}
                  width={140}
                />
                <Tooltip
                  formatter={(val: number) => [`${val}%`, 'Relative Weight']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#ffffff',
                  }}
                />
                <Bar dataKey="importance" radius={[0, 6, 6, 0]} barSize={20}>
                  {feature_importance.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? '#38bdf8' : index < 3 ? '#14b8a6' : '#6366f1'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </div>
  );
};
