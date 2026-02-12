import { useState } from 'react';
import { useDailySummary } from '../hooks/useDashboard';
import { useGetLowStockAlerts } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import DailySummaryCards from '../components/dashboard/DailySummaryCards';
import LowStockAlertList from '../components/dashboard/LowStockAlertList';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { formatDateShort } from '../lib/format';

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { data: summary, isLoading: summaryLoading } = useDailySummary(selectedDate);
  const { data: lowStockAlerts, isLoading: alertsLoading } = useGetLowStockAlerts();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your inventory and sales</p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <CalendarIcon className="h-4 w-4" />
              {formatDateShort(selectedDate)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar mode="single" selected={selectedDate} onSelect={(date) => date && setSelectedDate(date)} />
          </PopoverContent>
        </Popover>
      </div>

      {summaryLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <DailySummaryCards
          totalSales={summary?.totalSales || 0}
          totalRevenue={summary?.totalRevenue || 0}
          totalCost={summary?.totalCost || 0}
          totalProfit={summary?.totalProfit || 0}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Low Stock Alerts</CardTitle>
          <CardDescription>Products that need restocking</CardDescription>
        </CardHeader>
        <CardContent>
          {alertsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <LowStockAlertList alerts={lowStockAlerts || []} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
