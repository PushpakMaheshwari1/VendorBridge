import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, FileText, CheckSquare, Loader2 } from 'lucide-react';

export default function DashboardPage() {
  // Fetch real data to calculate KPIs (this would ideally be a single /dashboard/kpis endpoint)
  const { data: vendorsData, isLoading: vendorsLoading } = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      const res = await apiClient.get('/vendors/');
      return res.data;
    },
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await apiClient.get('/users/');
      return res.data;
    },
  });

  if (vendorsLoading || usersLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const vendors = vendorsData?.data?.items || [];
  const users = usersData?.data?.items || [];
  
  const activeVendors = vendors.filter((v: any) => v.status === 'ACTIVE').length;
  const pendingVendors = vendors.filter((v: any) => v.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* KPI: Total Vendors */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendors.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeVendors} active, {pendingVendors} pending
            </p>
          </CardContent>
        </Card>

        {/* KPI: Active Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              Employees and Vendor accounts
            </p>
          </CardContent>
        </Card>

        {/* KPI: Open RFQs (Placeholder) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open RFQs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +3 published this week
            </p>
          </CardContent>
        </Card>

        {/* KPI: Pending Approvals (Placeholder) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">5</div>
            <p className="text-xs text-muted-foreground">
              Requires manager action
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="mt-8 rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <p className="text-sm">Vendor <strong>TechCorp Solutions</strong> registered.</p>
            <span className="text-xs text-muted-foreground ml-auto">2 hours ago</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <p className="text-sm">RFQ <strong>#RFQ-2026-001</strong> published by Admin.</p>
            <span className="text-xs text-muted-foreground ml-auto">5 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
