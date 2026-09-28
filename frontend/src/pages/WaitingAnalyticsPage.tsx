import React, { useState, useEffect } from 'react';
import { WaitingAnalyticsData } from '../types';
import { getWaitingAnalytics } from '../services/api';
import { ChartCard } from '../components/ChartCard';
import { ChartSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { Filter, RotateCcw } from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceDot,
} from 'recharts';

export const WaitingAnalyticsPage: React.FC = () => {
  const [data, setData] = useState<WaitingAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedDoctor, setSelectedDoctor] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedDay, setSelectedDay] = useState('All');
  const [selectedDayType, setSelectedDayType] = useState('All');

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getWaitingAnalytics({
        department: selectedDept,
        doctor: selectedDoctor,
        appointment_type: selectedType,
        day: selectedDay,
        day_type: selectedDayType,
      });
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch waiting time analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [selectedDept, selectedDoctor, selectedType, selectedDay, selectedDayType]);

  const handleResetFilters = () => {
    setSelectedDept('All');
    setSelectedDoctor('All');
    setSelectedType('All');
    setSelectedDay('All');
    setSelectedDayType('All');
  };

  if (error) {
    return <ErrorState message={error} onRetry={fetchAnalytics} />;
  }

  const options = data?.filter_options;
  const peakHourItem = data?.hour_vs_waiting.find((h) => h.is_peak);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
            <Filter className="w-4 h-4 text-teal-600" />
            <span>Interactive Data Filters</span>
          </div>
          <button
            onClick={handleResetFilters}
            className="flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-900 font-medium transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Department Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">
              Department
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              {options?.departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Doctor Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">
              Doctor
            </label>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              {options?.doctors.map((doc) => (
                <option key={doc} value={doc}>
                  {doc}
                </option>
              ))}
            </select>
          </div>

          {/* Appointment Type Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">
              Appointment Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              {options?.appointment_types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Day Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">
              Day of Week
            </label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              {options?.days.map((dy) => (
                <option key={dy} value={dy}>
                  {dy}
                </option>
              ))}
            </select>
          </div>

          {/* Day Type Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">
              Day Type
            </label>
            <select
              value={selectedDayType}
              onChange={(e) => setSelectedDayType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              {options?.day_types.map((dt) => (
                <option key={dt} value={dt}>
                  {dt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {data && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>
              Showing analytics for{' '}
              <strong className="text-slate-900">{data.filtered_count.toLocaleString()}</strong> patients
            </span>
            {data.filtered_count < 10000 && (
              <span className="text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                Filtered Data Active
              </span>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      ) : !data || data.filtered_count === 0 ? (
        <EmptyState onReset={handleResetFilters} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chart 1: Distribution Histogram */}
          <ChartCard
            title="Chart 1 — Total Waiting Time Distribution"
            subtitle="Histogram breakdown showing frequency of patient waiting durations"
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.distribution} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="bin" tick={{ fill: '#475569', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip
                  formatter={(val: number) => [`${val} patients`, 'Patient Count']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#ffffff',
                  }}
                />
                <Bar dataKey="count" fill="#0284c7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Chart 2: Department Waiting Time */}
          <ChartCard
            title="Chart 2 — Department Waiting Time"
            subtitle="Horizontal comparison of average total waiting time across departments"
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                layout="vertical"
                data={data.dept_waiting}
                margin={{ top: 10, right: 20, left: 30, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" unit="m" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis type="category" dataKey="department" tick={{ fill: '#0f172a', fontSize: 12 }} width={110} />
                <Tooltip
                  formatter={(val: number) => [`${val} min`, 'Avg Wait']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#ffffff',
                  }}
                />
                <Bar dataKey="avg_waiting" fill="#14b8a6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Chart 3: Registration vs Doctor Waiting */}
          <ChartCard
            title="Chart 3 — Registration vs Doctor Waiting"
            subtitle="Stacked bar chart comparing stage 1 vs stage 2 outpatient delays"
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.registration_vs_doctor} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="department" tick={{ fill: '#475569', fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
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
                <Bar name="Registration" dataKey="registration_waiting" stackId="a" fill="#0ea5e9" radius={[0, 0, 4, 4]} />
                <Bar name="Doctor Wait" dataKey="doctor_waiting" stackId="a" fill="#0d9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Chart 4: Appointment Hour vs Waiting Time */}
          <ChartCard
            title="Chart 4 — Appointment Hour vs Waiting Time"
            subtitle="Line chart tracking congestion curve through the day. Peak hour highlighted."
          >
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={data.hour_vs_waiting} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="hour" tick={{ fill: '#475569', fontSize: 12 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} unit="m" />
                <Tooltip
                  formatter={(val: number) => [`${val} minutes`, 'Avg Total Wait']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#ffffff',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="avg_waiting"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#6366f1' }}
                  activeDot={{ r: 7, fill: '#4338ca' }}
                />
                {peakHourItem && (
                  <ReferenceDot
                    x={peakHourItem.hour}
                    y={peakHourItem.avg_waiting}
                    r={8}
                    fill="#f43f5e"
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}
    </div>
  );
};
