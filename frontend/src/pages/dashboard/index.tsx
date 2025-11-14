import { useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import DonutChart from '@/components/charts/DonutChart';
import BarChart from '@/components/charts/BarChart';
import { useAuth } from '@/hooks/useAuth';
import { useDashboard } from '@/hooks/useDashboard';
import { format } from 'date-fns';

export default function DashboardPage() {
  const router = useRouter();
  const { data: authData, isLoading: authLoading } = useAuth();
  const { data: dashboardData, isLoading: dashboardLoading } = useDashboard();

  useEffect(() => {
    if (!authLoading && !authData?.user) {
      router.push('/auth/login');
    }
  }, [authData, authLoading, router]);

  if (authLoading || dashboardLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const chartData = dashboardData?.customersByStatus.map(s => ({
    name: s.status.replace('-', ' ').toUpperCase(),
    value: s.count,
  })) || [];

  const barData = [{
    name: 'This Month',
    target: dashboardData?.targetAmount || 0,
    actual: dashboardData?.actualAmount || 0,
  }];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Target"
            value={formatCurrency(dashboardData?.targetAmount || 0)}
            icon="🎯"
          />
          <StatCard
            title="Actual"
            value={formatCurrency(dashboardData?.actualAmount || 0)}
            icon="💰"
          />
          <StatCard
            title="Pipeline Value"
            value={formatCurrency(dashboardData?.pipelineValue || 0)}
            icon="📈"
          />
          <StatCard
            title="Active Customers"
            value={dashboardData?.activeCustomers || 0}
            icon="👥"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Target vs Actual</h2>
            <BarChart data={barData} />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Funnel</h2>
            <DonutChart data={chartData} />
          </div>
        </div>

        {dashboardData?.needsFollowUp && dashboardData.needsFollowUp.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Customers Needing Follow-up</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PIC
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Potential
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dashboardData.needsFollowUp.map((customer: any) => (
                    <tr key={customer.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {customer.companyName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.pic}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(customer.potential)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {dashboardData?.recentProgress && dashboardData.recentProgress.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {dashboardData.recentProgress.map((progress: any) => (
                <div key={progress.id} className="border-l-4 border-primary pl-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {progress.customer?.companyName}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{progress.description}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {format(new Date(progress.date), 'MMM dd, yyyy')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
