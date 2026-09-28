import React, { useState, useEffect } from 'react';
import { DepartmentPerformance } from '../types';
import { getDepartments } from '../services/api';
import { TableSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';
import { DepartmentDetailModal } from '../components/DepartmentDetailModal';
import { Building2, ArrowUpDown, Search, ChevronRight, AlertCircle } from 'lucide-react';

type SortField = 'department' | 'patients' | 'avg_registration_wait' | 'avg_doctor_wait' | 'avg_total_wait' | 'median_wait' | 'high_waiting_pct';

export const DepartmentsPage: React.FC = () => {
  const [departments, setDepartments] = useState<DepartmentPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('avg_total_wait');
  const [sortAsc, setSortAsc] = useState(false);

  const [selectedDept, setSelectedDept] = useState<DepartmentPerformance | null>(null);

  const fetchDepts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch department performance metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepts();
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const filteredDepts = departments
    .filter((d) => d.department.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (typeof aVal === 'string') {
        return sortAsc
          ? (aVal as string).localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal as string);
      }
      return sortAsc ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });

  if (error) {
    return <ErrorState message={error} onRetry={fetchDepts} />;
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Search and Table Container */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal-600" />
              Department Operational Metrics
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Select any department row to view detailed doctor breakdown and throughput stats
            </p>
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-9 pr-4 py-2.5 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
        </div>

        {loading ? (
          <TableSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-xs font-semibold uppercase tracking-wider bg-slate-50/70">
                  <th
                    onClick={() => handleSort('department')}
                    className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition rounded-l-xl"
                  >
                    <div className="flex items-center space-x-1">
                      <span>Department</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('patients')}
                    className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition text-right"
                  >
                    <div className="flex items-center justify-end space-x-1">
                      <span>Patients</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('avg_registration_wait')}
                    className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition text-right"
                  >
                    <div className="flex items-center justify-end space-x-1">
                      <span>Avg Reg Wait</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('avg_doctor_wait')}
                    className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition text-right"
                  >
                    <div className="flex items-center justify-end space-x-1">
                      <span>Avg Doc Wait</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('avg_total_wait')}
                    className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition text-right"
                  >
                    <div className="flex items-center justify-end space-x-1">
                      <span>Avg Total Wait</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('median_wait')}
                    className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition text-right"
                  >
                    <div className="flex items-center justify-end space-x-1">
                      <span>Median Wait</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('high_waiting_pct')}
                    className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition text-right rounded-r-xl"
                  >
                    <div className="flex items-center justify-end space-x-1">
                      <span>High Wait %</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredDepts.map((d) => {
                  const isHighRisk = d.high_waiting_pct > 40;
                  return (
                    <tr
                      key={d.department}
                      onClick={() => setSelectedDept(d)}
                      className={`hover:bg-slate-50/90 cursor-pointer transition-colors group ${
                        isHighRisk ? 'bg-rose-50/20' : ''
                      }`}
                    >
                      <td className="py-4 px-4 font-semibold text-slate-900 flex items-center justify-between">
                        <span>{d.department}</span>
                        <ChevronRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </td>
                      <td className="py-4 px-4 text-right text-slate-700 font-mono">
                        {d.patients.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right text-slate-600 font-mono">
                        {d.avg_registration_wait} min
                      </td>
                      <td className="py-4 px-4 text-right text-slate-600 font-mono">
                        {d.avg_doctor_wait} min
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-slate-900 font-mono">
                        {d.avg_total_wait} min
                      </td>
                      <td className="py-4 px-4 text-right text-slate-600 font-mono">
                        {d.median_wait} min
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span
                          className={`inline-flex items-center gap-1 font-semibold px-2.5 py-1 rounded-full text-xs border ${
                            isHighRisk
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {isHighRisk && <AlertCircle className="w-3 h-3 text-rose-600" />}
                          {d.high_waiting_pct}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal View for Department Details */}
      <DepartmentDetailModal
        department={selectedDept}
        onClose={() => setSelectedDept(null)}
      />
    </div>
  );
};
