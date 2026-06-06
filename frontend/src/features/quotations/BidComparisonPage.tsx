import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '@/api/axios';
import { Loader2, ArrowLeft, Trophy, CheckCircle2, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function BidComparisonPage() {
  const { rfqId } = useParams();
  const navigate = useNavigate();

  const { data: rfqData, isLoading: rfqLoading } = useQuery({
    queryKey: ['rfq', rfqId],
    queryFn: async () => {
      const res = await apiClient.get(`/rfqs/${rfqId}`);
      return res.data;
    },
    enabled: !!rfqId,
  });

  const { data: quotesData, isLoading: quotesLoading } = useQuery({
    queryKey: ['rfq-quotations', rfqId],
    queryFn: async () => {
      const res = await apiClient.get(`/quotations/rfq/${rfqId}`);
      return res.data;
    },
    enabled: !!rfqId,
  });

  if (rfqLoading || quotesLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const rfq = rfqData?.data;
  const quotations = quotesData?.data || [];

  // Find lowest price
  const lowestPrice = Math.min(...quotations.map((q: any) => q.total_price));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/rfqs')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            Bid Comparison: {rfq?.title}
            <Badge variant="outline" className="text-sm font-normal">
              RFQ-{rfq?.id?.split('-')[0].toUpperCase()}
            </Badge>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Evaluate vendor submissions side-by-side to select the winning bid.
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[200px] border-r font-semibold">Evaluation Criteria</TableHead>
                {quotations.map((quote: any, idx: number) => (
                  <TableHead key={quote.id} className="min-w-[250px] text-center p-4">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <span className="text-lg font-bold text-primary">Vendor {idx + 1}</span>
                      <span className="text-sm font-normal text-muted-foreground">
                        {quote.vendor?.company_name || 'Vendor Company'}
                      </span>
                      {quote.status === 'SELECTED' && (
                        <Badge className="bg-purple-600 flex gap-1 mt-2">
                          <Trophy className="h-3 w-3" /> Winner
                        </Badge>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Total Price Row */}
              <TableRow>
                <TableCell className="border-r font-medium bg-muted/20">Total Quoted Price</TableCell>
                {quotations.map((quote: any) => (
                  <TableCell key={quote.id} className="text-center p-4">
                    <div className="flex flex-col items-center gap-1">
                      <span className={`text-xl font-bold ${quote.total_price === lowestPrice ? 'text-green-600' : ''}`}>
                        ${quote.total_price.toLocaleString()}
                      </span>
                      {quote.total_price === lowestPrice && (
                        <Badge variant="outline" className="border-green-500 text-green-600 flex gap-1 mt-1">
                          <TrendingDown className="h-3 w-3" /> Lowest Price
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                ))}
              </TableRow>

              {/* Delivery Date Row */}
              <TableRow>
                <TableCell className="border-r font-medium bg-muted/20">Proposed Delivery Date</TableCell>
                {quotations.map((quote: any) => (
                  <TableCell key={quote.id} className="text-center p-4">
                    <span className="font-medium text-slate-700">
                      {new Date(quote.proposed_delivery_date).toLocaleDateString()}
                    </span>
                  </TableCell>
                ))}
              </TableRow>

              {/* Remarks Row */}
              <TableRow>
                <TableCell className="border-r font-medium bg-muted/20">Vendor Remarks</TableCell>
                {quotations.map((quote: any) => (
                  <TableCell key={quote.id} className="text-center p-4 text-sm text-muted-foreground align-top">
                    {quote.remarks || 'No remarks provided.'}
                  </TableCell>
                ))}
              </TableRow>

              {/* Action Row */}
              <TableRow>
                <TableCell className="border-r font-medium bg-muted/20"></TableCell>
                {quotations.map((quote: any) => (
                  <TableCell key={quote.id} className="text-center p-4">
                    {quote.status !== 'SELECTED' && rfq?.status !== 'AWARDED' ? (
                      <Button className="w-full bg-primary hover:bg-primary/90 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" /> Award Contract
                      </Button>
                    ) : quote.status === 'SELECTED' ? (
                      <Button disabled className="w-full bg-purple-600 text-white opacity-100 flex items-center gap-2">
                        <Trophy className="h-4 w-4" /> Awarded
                      </Button>
                    ) : (
                      <Button disabled variant="outline" className="w-full">
                        Not Selected
                      </Button>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
