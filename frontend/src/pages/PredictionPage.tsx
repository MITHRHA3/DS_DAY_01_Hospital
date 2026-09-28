import React, { useState } from 'react';
import { PredictionResponse, PredictionRequest } from '../types';
import { predictWaiting } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import {
  Sparkles,
  Building2,
  Stethoscope,
  Calendar,
  Clock,
  Clock3,
  Lightbulb,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
} from 'lucide-react';

const DEPARTMENTS = [
  'Cardiology',
  'Dermatology',
  'ENT',
  'General Medicine',
  'Gynecology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
];

const DOCTORS = [
  'Dr. Anitha',
  'Dr. Arun',
  'Dr. Divya',
  'Dr. Hari',
  'Dr. Karthik',
  'Dr. Kavya',
  'Dr. Lakshmi',
  'Dr. Meena',
  'Dr. Nandhini',
  'Dr. Naveen',
  'Dr. Priya',
  'Dr. Rajesh',
  'Dr. Ramesh',
  'Dr. Suresh',
  'Dr. Swetha',
  'Dr. Vijay',
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const APPT_TYPES = ['Regular', 'Follow-up', 'Emergency', 'Walk-in'];
const MINUTES = [0, 10, 20, 30, 40, 50];

export const PredictionPage: React.FC = () => {
  const [department, setDepartment] = useState('Cardiology');
  const [doctor, setDoctor] = useState('Dr. Rajesh');
  const [day, setDay] = useState('Monday');
  const [appointmentType, setAppointmentType] = useState('Regular');
  const [appointmentHour, setAppointmentHour] = useState(10);
  const [appointmentMinute, setAppointmentMinute] = useState(20);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Automatically derive day type
  const dayType = ['Saturday', 'Sunday'].includes(day) ? 'Weekend' : 'Weekday';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload: PredictionRequest = {
      department,
      doctor,
      day,
      appointment_type: appointmentType,
      appointment_hour: Number(appointmentHour),
      appointment_minute: Number(appointmentMinute),
    };

    try {
      const res = await predictWaiting(payload);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Failed to generate prediction. Check backend status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 sm:p-8 rounded-2xl border border-slate-700/60 shadow-premium flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Random Forest Machine Learning Engine
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Patient Waiting Risk Prediction
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Predict whether an upcoming outpatient appointment is likely to experience high waiting time based on historical clinical flow parameters.
          </p>
        </div>

        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 text-xs text-slate-300 space-y-1 font-mono">
          <div>Features: <span className="text-teal-400">7 Parameters</span></div>
          <div>Model: <span className="text-teal-400">RandomForestClassifier</span></div>
          <div>Classes: <span className="text-teal-400">Normal (0) / High (1)</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Prediction Form Column */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
          <h3 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Clock3 className="w-5 h-5 text-teal-600" />
            Appointment Parameters
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Department */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-sky-600" />
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl p-3 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Doctor */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-indigo-600" />
                Assigned Physician / Doctor
              </label>
              <select
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl p-3 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                {DOCTORS.map((doc) => (
                  <option key={doc} value={doc}>
                    {doc}
                  </option>
                ))}
              </select>
            </div>

            {/* Day & Derived Day Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  Appointment Day
                </label>
                <select
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl p-3 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  {DAYS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Day Type (Auto-calculated)
                </label>
                <div className="w-full bg-slate-100 border border-slate-200 text-slate-700 text-sm rounded-xl p-3 font-semibold flex items-center justify-between">
                  <span>{dayType}</span>
                  <span className="text-[10px] uppercase tracking-wider font-mono text-slate-500 px-2 py-0.5 rounded bg-slate-200">
                    Auto Derived
                  </span>
                </div>
              </div>
            </div>

            {/* Appointment Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Appointment Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {APPT_TYPES.map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setAppointmentType(t)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition ${
                      appointmentType === t
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Appointment Hour Slider & Minute Dropdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-600" />
                    Appointment Hour
                  </label>
                  <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 font-mono">
                    {appointmentHour}:00 ({appointmentHour > 12 ? `${appointmentHour - 12} PM` : `${appointmentHour} AM`})
                  </span>
                </div>
                <input
                  type="range"
                  min="9"
                  max="17"
                  step="1"
                  value={appointmentHour}
                  onChange={(e) => setAppointmentHour(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>9 AM</span>
                  <span>1 PM</span>
                  <span>5 PM</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Appointment Minute
                </label>
                <select
                  value={appointmentMinute}
                  onChange={(e) => setAppointmentMinute(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl p-3 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  {MINUTES.map((m) => (
                    <option key={m} value={m}>
                      :{m < 10 ? `0${m}` : m}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Predict Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-sky-600 via-teal-600 to-teal-700 hover:from-sky-700 hover:to-teal-800 text-white font-bold text-sm shadow-md shadow-teal-600/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-75 cursor-pointer mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Evaluating Random Forest Pipeline...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-teal-200" />
                  <span>Predict Waiting Risk</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Prediction Result Column */}
        <div className="lg:col-span-5 space-y-6">
          {result ? (
            <div
              className={`rounded-2xl p-6 sm:p-8 border shadow-premium transition-all animate-fadeIn ${
                result.prediction_class === 1
                  ? 'bg-gradient-to-b from-rose-50/90 to-amber-50/50 border-rose-200 text-rose-950'
                  : 'bg-gradient-to-b from-teal-50/90 to-emerald-50/50 border-teal-200 text-teal-950'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Prediction Diagnostic
                </span>
                <StatusBadge status={result.prediction} size="sm" />
              </div>

              {/* Main Classification Result */}
              <div className="text-center my-6">
                <div
                  className={`inline-flex p-4 rounded-2xl mb-4 ${
                    result.prediction_class === 1
                      ? 'bg-rose-100 text-rose-600 border border-rose-200'
                      : 'bg-emerald-100 text-emerald-600 border border-emerald-200'
                  }`}
                >
                  {result.prediction_class === 1 ? (
                    <ShieldAlert className="w-12 h-12" />
                  ) : (
                    <CheckCircle2 className="w-12 h-12" />
                  )}
                </div>

                <h3
                  className={`text-2xl font-extrabold tracking-tight ${
                    result.prediction_class === 1 ? 'text-rose-900' : 'text-emerald-950'
                  }`}
                >
                  {result.prediction}
                </h3>
              </div>

              {/* Confidence Circular Gauge / Progress */}
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-slate-200/80 shadow-xs mb-6 text-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
                  Prediction Confidence
                </span>

                <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-100"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={result.prediction_class === 1 ? 'text-rose-500' : 'text-teal-500'}
                      strokeDasharray={`${result.confidence}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-extrabold text-slate-900">
                      {result.confidence}%
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-xs text-slate-500 mt-4 px-2 font-medium">
                  <span>Normal Prob: {result.probabilities.normal}%</span>
                  <span>High Prob: {result.probabilities.high}%</span>
                </div>
              </div>

              {/* Operational Recommendation */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  Recommended Operational Action
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {result.recommendation}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-card text-center flex flex-col items-center justify-center min-h-[380px]">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4 border border-teal-100">
                <Sparkles className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">
                Ready to Evaluate Appointment Risk
              </h4>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                Select appointment options on the left and click <strong>"Predict Waiting Risk"</strong> to pass the data through the trained Random Forest model.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
