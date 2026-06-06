import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/axios';
import { Loader2, Search, Filter, Plus, FileText, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

export default function RfqListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const isVendor = user?.role === 'VENDOR';

  const { data, isLoading } = useQuery({
    queryKey: ['rfqs', searchTerm],
    queryFn: async () => {
      const res = await apiClient.get('/rfqs/', {
        params: { search: searchTerm, limit: 50 },
      });
      return res.data;
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return <Badge className="bg-blue-500 hover:bg-blue-600">Published</Badge>;
      case 'DRAFT': return <Badge variant="secondary" className="bg-slate-200 text-slate-800">Draft</Badge>;
      case 'CLOSED': return <Badge className="bg-green-600 hover:bg-green-700">Closed (Evaluating)</Badge>;
      case 'AWARDED': return <Badge className="bg-purple-600 hover:bg-purple-700">Awarded</Badge>;
      case 'CANCELLED': return <Badge variant="destructive">Cancelled</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {isVendor ? 'RFQ Marketplace' : 'RFQ Management'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isVendor 
              ? 'Discover and bid on open Requests for Quotation.' 
              : 'Create, publish, and manage procurement requests.'}
          </p>
        </div>
        {!isVendor && (
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Create RFQ
          </Button>
        )}
      </div>

      {/* KPI Cards for Procurement Officers */}
      {!isVendor && (
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">Drafts</p>
            <p className="text-2xl font-bold">2</p>
          </div>
          <div className="rounded-xl border bg-card p-4 shadow-sm border-l-4 border-l-blue-500">
            <p className="text-sm text-muted-foreground">Published (Active)</p>
            <p className="text-2xl font-bold">5</p>
          </div>
          <div className="rounded-xl border bg-card p-4 shadow-sm border-l-4 border-l-green-500">
            <p className="text-sm text-muted-foreground">Closed (Evaluating)</p>
            <p className="text-2xl font-bold">3</p>
          </div>
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">Awarded</p>
            <p className="text-2xl font-bold">12</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex w-full max-w-sm items-center gap-2 rounded-md border bg-background px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-primary">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search RFQs by title or ID..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" /> Filter
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>RFQ Number</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : data?.data?.items?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No RFQs found.
                </TableCell>
              </TableRow>
            ) : (
              data?.data?.items?.map((rfq: any) => (
                <TableRow key={rfq.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      RFQ-{rfq.id.split('-')[0].toUpperCase()}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate" title={rfq.title}>{rfq.title}</TableCell>
                  <TableCell>{rfq.category?.name || 'General'}</TableCell>
                  <TableCell>{new Date(rfq.submission_deadline).toLocaleDateString()}</TableCell>
                  <TableCell>{getStatusBadge(rfq.status)}</TableCell>
                  <TableCell className="text-right">
                    {isVendor ? (
                      <Button variant="outline" size="sm">View & Bid</Button>
                    ) : (
                      <div className="flex justify-end gap-2">
                        {rfq.status === 'CLOSED' && (
                          <Button 
                            variant="default" 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => navigate(`/comparison/${rfq.id}`)}
                          >
                            Compare Bids
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          Details <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
