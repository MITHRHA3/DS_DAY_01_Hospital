import React from 'react';
import { SummaryData, Insight } from '../types';
import { KPICard } from '../components/KPICard';
import { ChartCard } from '../components/ChartCard';
import { InsightCard } from '../components/InsightCard';
import { KPISkeleton, ChartSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';
import { Users, Clock, UserCheck, Stethoscope, AlertTriangle, CalendarDays } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from 'recharts';

interface OverviewPageProps {
  summary: SummaryData | null;
  insights: Insight[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  summary,
  insights,
  loading,
  error,
  onRetry,
}) => {
  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  if (loading || !summary) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <KPISkeleton key={i} />
          ))}
        </div>
        <ChartSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title="Total Patients"
          value={summary.total_patients}
          subtitle="Processed Records"
          icon={Users}
          colorTheme="sky"
          badge="100% CSV Data"
        />

        <KPICard
          title="Average Waiting Time"
          value={summary.avg_total_waiting}
          unit="min"
          subtitle="Door-to-consultation"
          icon={Clock}
          colorTheme="teal"
          badge="Overall Avg"
        />

        <KPICard
          title="Registration Waiting"
          value={summary.avg_registration_waiting}
          unit="min"
          subtitle="Intake & Queueing"
          icon={UserCheck}
          colorTheme="indigo"
          badge="Stage 1"
        />

        <KPICard
          title="Doctor Waiting"
          value={summary.avg_doctor_waiting}
          unit="min"
          subtitle="Post-registration wait"
          icon={Stethoscope}
          colorTheme="amber"
          badge="Stage 2"
        />

        <KPICard
          title="High Waiting Patients"
          value={`${summary.high_waiting_percentage}%`}
          subtitle="Exceeding threshold"
          icon={AlertTriangle}
          colorTheme="rose"
          badge={summary.high_waiting_percentage > 40 ? 'Action Needed' : 'Normal'}
          badgeType={summary.high_waiting_percentage > 40 ? 'danger' : 'success'}
        />
      </div>

      {/* Main Overview Chart */}
      <ChartCard
        title="Average Waiting Time by Department"
        subtitle="Horizontal comparison across all outpatient departments. Highest department highlighted."
      >
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            layout="vertical"
            data={summary.avg_by_department}
            margin={{ top: 10, right: 30, left: 40, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
            <XAxis type="number" unit=" min" tick={{ fill: '#64748b', fontSize: 12 }} />
            <YAxis
              type="category"
              dataKey="department"
              tick={{ fill: '#0f172a', fontSize: 13, fontWeight: 500 }}
              width={120}
            />
            <Tooltip
              formatter={(val: number) => [`${val} minutes`, 'Avg Total Wait']}
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                color: '#ffffff',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
              }}
              itemStyle={{ color: '#38bdf8' }}
            />
            <Bar dataKey="avg_waiting" radius={[0, 6, 6, 0]} barSize={22}>
              {summary.avg_by_department.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.is_highest ? '#f43f5e' : '#0ea5e9'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Secondary Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Registration vs Doctor Waiting */}
        <ChartCard
          title="Registration vs Doctor Waiting Time"
          subtitle="Stacked breakdown of intake delay versus physician availability delay"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={summary.dept_registration_vs_doctor}
              margin={{ top: 20, right: 20, left: 0, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="department"
                tick={{ fill: '#475569', fontSize: 11 }}
                interval={0}
                angle={-20}
                textAnchor="end"
              />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} unit="m" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  color: '#ffffff',
                }}
              />
              <Legend verticalAlign="top" height={36} />
              <Bar
                name="Registration Wait"
                dataKey="registration_waiting"
                stackId="a"
                fill="#38bdf8"
                radius={[0, 0, 4, 4]}
              />
              <Bar
                name="Doctor Wait"
                dataKey="doctor_waiting"
                stackId="a"
                fill="#14b8a6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Card 2: Weekday vs Weekend */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card hover:shadow-premium transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Weekday vs Weekend Comparison
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Comparative analysis of patient delay patterns by day type
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600 border border-teal-100">
                <CalendarDays className="w-5 h-5" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
                <span className="text-xs font-semibold text-slate-500 uppercase">
                  Weekday Average
                </span>
                <div className="text-3xl font-bold text-slate-900 mt-2">
                  {summary.weekday_vs_weekend.weekday_avg}{' '}
                  <span className="text-sm font-normal text-slate-500">min</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Monday to Friday outpatient traffic
                </p>
              </div>

              <div className="bg-teal-50/60 p-5 rounded-2xl border border-teal-200/80">
                <span className="text-xs font-semibold text-teal-700 uppercase">
                  Weekend Average
                </span>
                <div className="text-3xl font-bold text-teal-950 mt-2">
                  {summary.weekday_vs_weekend.weekend_avg}{' '}
                  <span className="text-sm font-normal text-teal-700">min</span>
                </div>
                <p className="text-xs text-teal-700 mt-2">
                  Saturday & Sunday appointments
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-600">Variance Percentage:</span>
            <span
              className={`px-3 py-1 rounded-full border ${
                summary.weekday_vs_weekend.diff_pct > 0
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}
            >
              {summary.weekday_vs_weekend.diff_pct > 0 ? '+' : ''}
              {summary.weekday_vs_weekend.diff_pct}% difference on weekends
            </span>
          </div>
        </div>
      </div>

      {/* Operational Insights Panel */}
      <InsightCard insights={insights} />
    </div>
  );
};
