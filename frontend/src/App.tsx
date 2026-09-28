import React, { useState, useEffect } from 'react';
import { PageTab, SummaryData, Insight } from './types';
import { getSummary, getInsights, getHealth } from './services/api';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewPage } from './pages/OverviewPage';
import { WaitingAnalyticsPage } from './pages/WaitingAnalyticsPage';
import { PredictionPage } from './pages/PredictionPage';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { SchedulingPage } from './pages/SchedulingPage';
import { ModelPerformancePage } from './pages/ModelPerformancePage';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PageTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modelOnline, setModelOnline] = useState(true);

  const fetchGlobalData = async () => {
    setLoading(true);
    setError(null);
    try {
      const health = await getHealth();
      setModelOnline(health.model_loaded);

      const [summaryRes, insightsRes] = await Promise.all([
        getSummary(),
        getInsights(),
      ]);

      setSummary(summaryRes);
      setInsights(insightsRes);
    } catch (err: any) {
      setError(err.message || 'Unable to connect to MediFlow AI backend on port 8000.');
      setModelOnline(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobalData();
  }, []);

  // Determine title and subtitle based on activeTab
  const getHeaderInfo = () => {
    switch (activeTab) {
      case 'overview':
        return {
          title: 'Hospital Operations Intelligence',
          subtitle: 'Understand patient flow, identify bottlenecks, and predict waiting-time risk.',
        };
      case 'analytics':
        return {
          title: 'Waiting Time Analytics',
          subtitle: 'Explore where patient delays occur across the outpatient journey.',
        };
      case 'prediction':
        return {
          title: 'Patient Waiting Risk Prediction',
          subtitle: 'Predict whether an upcoming patient appointment is likely to experience high waiting time.',
        };
      case 'departments':
        return {
          title: 'Department Performance',
          subtitle: 'Evaluate throughput, average delays, and assigned medical staff.',
        };
      case 'scheduling':
        return {
          title: 'Appointment Scheduling & Congestion',
          subtitle: 'Investigate whether appointment booking distribution contributes to clinic congestion.',
        };
      case 'model':
        return {
          title: 'Random Forest Model Performance',
          subtitle: 'Inspect machine learning metrics, confusion matrix, and feature importances.',
        };
    }
  };

  const { title, subtitle } = getHeaderInfo();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Persistent / Responsive Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={mobileMenuOpen}
        setIsOpen={setMobileMenuOpen}
        modelOnline={modelOnline}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <Header
          title={title}
          subtitle={subtitle}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          modelOnline={modelOnline}
          totalPatients={summary?.total_patients || 10000}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'overview' && (
            <OverviewPage
              summary={summary}
              insights={insights}
              loading={loading}
              error={error}
              onRetry={fetchGlobalData}
            />
          )}

          {activeTab === 'analytics' && <WaitingAnalyticsPage />}

          {activeTab === 'prediction' && <PredictionPage />}

          {activeTab === 'departments' && <DepartmentsPage />}

          {activeTab === 'scheduling' && <SchedulingPage />}

          {activeTab === 'model' && <ModelPerformancePage />}
        </main>

        {/* Global Footer */}
        <footer className="border-t border-slate-200/80 bg-white py-4 px-8 text-center text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
            <span className="font-semibold text-slate-700">
              MediFlow AI — Hospital Operations Intelligence Platform
            </span>
            <span className="text-slate-400">
              Powered by FastAPI & Scikit-Learn Random Forest Pipeline
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};
