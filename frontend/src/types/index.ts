export interface HealthStatus {
  status: string;
  model_loaded: boolean;
  dataset_loaded: boolean;
  total_records: number;
}

export interface DeptAvg {
  department: string;
  avg_waiting: number;
  is_highest: boolean;
}

export interface DeptRegistrationVsDoctor {
  department: string;
  registration_waiting: number;
  doctor_waiting: number;
}

export interface WeekdayVsWeekend {
  weekday_avg: number;
  weekend_avg: number;
  diff_pct: number;
}

export interface SummaryData {
  total_patients: number;
  avg_total_waiting: number;
  avg_registration_waiting: number;
  avg_doctor_waiting: number;
  high_waiting_percentage: number;
  avg_by_department: DeptAvg[];
  dept_registration_vs_doctor: DeptRegistrationVsDoctor[];
  weekday_vs_weekend: WeekdayVsWeekend;
}

export interface Insight {
  id: number;
  title: string;
  description: string;
  category: string;
  metric: string;
  impact: 'High' | 'Medium' | 'Low';
}

export interface DepartmentPerformance {
  department: string;
  patients: number;
  avg_registration_wait: number;
  avg_doctor_wait: number;
  avg_total_wait: number;
  median_wait: number;
  high_waiting_pct: number;
  doctors_count: number;
  doctors: string[];
}

export interface VolumeByHour {
  hour: string;
  hour_num: number;
  patients: number;
}

export interface WaitingByHour {
  hour: string;
  hour_num: number;
  avg_waiting: number;
}

export interface WaitingByType {
  appointment_type: string;
  avg_waiting: number;
  patient_count: number;
}

export interface PeakCongestion {
  peak_hour: string;
  peak_avg_wait: number;
  patients_count: number;
}

export interface SchedulingData {
  volume_by_hour: VolumeByHour[];
  waiting_by_hour: WaitingByHour[];
  waiting_by_type: WaitingByType[];
  peak_congestion: PeakCongestion;
}

export interface DistBin {
  bin: string;
  count: number;
}

export interface HourVsWaiting {
  hour: string;
  avg_waiting: number;
  patient_count: number;
  is_peak: boolean;
}

export interface FilterOptions {
  departments: string[];
  doctors: string[];
  appointment_types: string[];
  days: string[];
  day_types: string[];
}

export interface WaitingAnalyticsData {
  filtered_count: number;
  distribution: DistBin[];
  dept_waiting: { department: string; avg_waiting: number }[];
  registration_vs_doctor: DeptRegistrationVsDoctor[];
  hour_vs_waiting: HourVsWaiting[];
  filter_options: FilterOptions;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
}

export interface ModelPerformanceData {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  confusion_matrix: number[][];
  feature_importance: FeatureImportance[];
}

export interface PredictionRequest {
  department: string;
  doctor: string;
  day: string;
  appointment_type: string;
  appointment_hour: number;
  appointment_minute: number;
}

export interface PredictionResponse {
  prediction: string;
  prediction_class: number;
  confidence: number;
  probabilities: {
    normal: number;
    high: number;
  };
  day_type: string;
  recommendation: string;
}

export type PageTab = 'overview' | 'analytics' | 'prediction' | 'departments' | 'scheduling' | 'model';
