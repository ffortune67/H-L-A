import { useState, useEffect } from 'react';
import { adminService, AdminOverview } from '../services/admin';

export interface UseAdminDashboardReturn {
  overview: AdminOverview | null;
  loading: boolean;
  error: string | null;
  activeTab: 'overview' | 'donations' | 'transactions';
  setActiveTab: (tab: 'overview' | 'donations' | 'transactions') => void;
  refetch: () => Promise<void>;
}

export function useAdminDashboard(): UseAdminDashboardReturn {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'donations' | 'transactions'>('overview');

  const fetchOverview = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getDashboard();
      setOverview(data.overview);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchOverview();
  }, []);

  return {
    overview,
    loading,
    error,
    activeTab,
    setActiveTab,
    refetch: fetchOverview,
  };
}
