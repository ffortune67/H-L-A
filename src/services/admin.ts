// Admin dashboard API service
// Handles admin-related API calls
export interface AdminOverview {
  total_donations: number;
  total_amount: number;
  pending_count: number;
  verified_count: number;
  recent_transactions?: Array<{
    id: string;
    amount: number;
    currency: string;
    email?: string;
    transaction_type: string;
    transaction_reference: string;
    created_at: string;
  }>;
}

export interface AdminDashboardResponse {
  overview: AdminOverview;
}

export const adminService = {
  async getDashboard(): Promise<AdminDashboardResponse> {
    const response = await fetch('/api/admin/dashboard', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors du chargement du dashboard');
    }

    return data;
  },
};
