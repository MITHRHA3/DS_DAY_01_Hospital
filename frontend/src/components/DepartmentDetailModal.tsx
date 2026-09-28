import React from 'react';
import { DepartmentPerformance } from '../types';
import { X, Users, Clock, UserCheck, AlertTriangle, Building2, Stethoscope } from 'lucide-react';

interface DepartmentDetailModalProps {
  department: DepartmentPerformance | null;
  onClose: () => void;
}

export const DepartmentDetailModal: React.FC<DepartmentDetailModalProps> = ({
  department,
  onClose,
}) => {
  if (!department) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight text-white">
                {department.department} Department
              </h3>
              <p className="text-xs text-slate-400">
                Detailed operational performance metrics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Key Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Total Patients</span>
              <span className="text-xl font-bold text-slate-900 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-sky-600" />
                {department.patients.toLocaleString()}
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Avg Total Wait</span>
              <span className="text-xl font-bold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-teal-600" />
                {department.avg_total_wait} <span className="text-xs text-slate-500 font-normal">min</span>
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Median Wait</span>
              <span className="text-xl font-bold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-600" />
                {department.median_wait} <span className="text-xs text-slate-500 font-normal">min</span>
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70">
              <span className="text-xs font-semibold text-slate-500 block mb-1">High Wait %</span>
              <span className={`text-xl font-bold flex items-center gap-1.5 ${department.high_waiting_pct > 40 ? 'text-rose-600' : 'text-emerald-600'}`}>
                <AlertTriangle className="w-4 h-4" />
                {department.high_waiting_pct}%
              </span>
            </div>
          </div>

          {/* Registration vs Doctor Breakdown */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-teal-600" />
              Patient Flow Breakdown
            </h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>Registration Waiting Time</span>
                  <span>{department.avg_registration_wait} mins</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-500 rounded-full"
                    style={{
                      width: `${Math.min(100, (department.avg_registration_wait / department.avg_total_wait) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>Doctor Consultation Waiting Time</span>
                  <span>{department.avg_doctor_wait} mins</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-500 rounded-full"
                    style={{
                      width: `${Math.min(100, (department.avg_doctor_wait / department.avg_total_wait) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Doctors List */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-indigo-600" />
              Assigned Doctors ({department.doctors_count})
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {department.doctors.map((doc, idx) => (
                <div
                  key={idx}
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 flex items-center space-x-2 shadow-xs"
                >
                  <div className="w-2 h-2 rounded-full bg-teal-500" />
                  <span>{doc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
