import {
  HealthStatus,
  SummaryData,
  Insight,
  DepartmentPerformance,
  SchedulingData,
  WaitingAnalyticsData,
  ModelPerformanceData,
  PredictionRequest,
  PredictionResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    if (!res.ok) {
      const errText = await res.text();
      let detail = `Server responded with status ${res.status}`;
      try {
        const errJson = JSON.parse(errText);
        detail = errJson.detail || detail;
      } catch {
        detail = errText || detail;
      }
      throw new Error(detail);
    }

    return (await res.json()) as T;
  } catch (error: any) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the prediction & analytics service. Please verify the FastAPI backend is running on port 8000.');
    }
    throw error;
  }
}

export const getHealth = async (): Promise<HealthStatus> => {
  return fetchJson<HealthStatus>('/api/health');
};

export const getSummary = async (): Promise<SummaryData> => {
  return fetchJson<SummaryData>('/api/summary');
};

export const getInsights = async (): Promise<Insight[]> => {
  return fetchJson<Insight[]>('/api/insights');
};

export const getDepartments = async (): Promise<DepartmentPerformance[]> => {
  return fetchJson<DepartmentPerformance[]>('/api/departments');
};

export const getScheduling = async (): Promise<SchedulingData> => {
  return fetchJson<SchedulingData>('/api/scheduling');
};

export const getWaitingAnalytics = async (params?: {
  department?: string;
  doctor?: string;
  appointment_type?: string;
  day?: string;
  day_type?: string;
}): Promise<WaitingAnalyticsData> => {
  const query = new URLSearchParams();
  if (params?.department && params.department !== 'All') query.append('department', params.department);
  if (params?.doctor && params.doctor !== 'All') query.append('doctor', params.doctor);
  if (params?.appointment_type && params.appointment_type !== 'All') query.append('appointment_type', params.appointment_type);
  if (params?.day && params.day !== 'All') query.append('day', params.day);
  if (params?.day_type && params.day_type !== 'All') query.append('day_type', params.day_type);

  const queryString = query.toString() ? `?${query.toString()}` : '';
  return fetchJson<WaitingAnalyticsData>(`/api/waiting-analytics${queryString}`);
};

export const getModelPerformance = async (): Promise<ModelPerformanceData> => {
  return fetchJson<ModelPerformanceData>('/api/model-performance');
};

export const predictWaiting = async (payload: PredictionRequest): Promise<PredictionResponse> => {
  return fetchJson<PredictionResponse>('/api/predict', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};
