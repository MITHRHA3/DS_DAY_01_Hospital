import React, { useState, useEffect } from 'react';
import { SchedulingData } from '../types';
import { getScheduling } from '../services/api';
import { ChartCard } from '../components/ChartCard';
import { ChartSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';
import { Clock, Users, AlertTriangle, CalendarCheck } from 'lucide-react';
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
  ReferenceDot,
} from 'recharts';

export const SchedulingPage: React.FC = () => {
  const [data, setData] = useState<SchedulingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedulingData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getScheduling();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch appointment scheduling metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedulingData();
  }, []);

  if (error) {
    return <ErrorState message={error} onRetry={fetchSchedulingData} />;
  }

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <ChartSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  const { volume_by_hour, waiting_by_hour, waiting_by_type, peak_congestion } = data;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Peak Congestion Period Callout Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-rose-600 rounded-2xl p-6 sm:p-8 text-white shadow-premium flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shrink-0">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100 block">
              Congestion Analysis Alert
            </span>
            <h3 className="text-2xl font-bold tracking-tight text-white mt-1">
              Peak Congestion: {peak_congestion.peak_hour}
            </h3>
            <p className="text-xs text-amber-50 mt-1 max-w-xl">
              Historical outpatient traffic demonstrates maximum total waiting times during this slot averaging{' '}
              <strong className="text-white underline">{peak_congestion.peak_avg_wait} minutes</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-6 bg-slate-900/40 backdrop-blur-md px-6 py-4 rounded-xl border border-white/20 font-mono text-sm">
          <div>
            <span className="text-[10px] text-amber-200 block uppercase">Peak Hour Wait</span>
            <span className="text-xl font-bold text-white">{peak_congestion.peak_avg_wait} min</span>
          </div>
          <div className="h-8 w-px bg-white/20" />
          <div>
            <span className="text-[10px] text-amber-200 block uppercase">Patients Scheduled</span>
            <span className="text-xl font-bold text-white">{peak_congestion.patients_count}</span>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointment Volume by Hour */}
        <ChartCard
          title="Appointment Volume by Hour"
          subtitle="Hourly booking distribution across all outpatient clinics"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={volume_by_hour} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="hour" tick={{ fill: '#475569', fontSize: 12 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip
                formatter={(val: number) => [`${val} patients`, 'Scheduled Volume']}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  color: '#ffffff',
                }}
              />
              <Bar dataKey="patients" fill="#0284c7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Average Waiting Time by Hour */}
        <ChartCard
          title="Average Waiting Time by Hour"
          subtitle="Line chart highlighting hourly delay curve and congestion spikes"
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={waiting_by_hour} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="hour" tick={{ fill: '#475569', fontSize: 12 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} unit="m" />
              <Tooltip
                formatter={(val: number) => [`${val} mins`, 'Avg Waiting Time']}
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
                stroke="#14b8a6"
                strokeWidth={3}
                dot={{ r: 4, fill: '#14b8a6' }}
                activeDot={{ r: 7, fill: '#0f766e' }}
              />
              <ReferenceDot
                x={peak_congestion.peak_hour}
                y={peak_congestion.peak_avg_wait}
                r={8}
                fill="#f43f5e"
                stroke="#ffffff"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Appointment Type vs Waiting Time */}
      <ChartCard
        title="Appointment Type vs Waiting Time"
        subtitle="Comparing average waiting time across Regular, Follow-up, Emergency, and Walk-in visits"
      >
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={waiting_by_type} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="appointment_type" tick={{ fill: '#0f172a', fontSize: 13, fontWeight: 500 }} />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} unit=" min" />
            <Tooltip
              formatter={(val: number) => [`${val} minutes`, 'Avg Waiting Time']}
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                color: '#ffffff',
              }}
            />
            <Bar dataKey="avg_waiting" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};
