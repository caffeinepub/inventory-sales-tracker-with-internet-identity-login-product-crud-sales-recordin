import { useState } from 'react';
import { useGetAllSales } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import SaleForm from '../components/sales/SaleForm';
import SalesHistoryTable from '../components/sales/SalesHistoryTable';
import { Loader2 } from 'lucide-react';

export default function Sales() {
  const { data: sales, isLoading } = useGetAllSales();
  const [activeTab, setActiveTab] = useState('record');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sales</h1>
        <p className="text-muted-foreground">Record sales and view history</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="record">Record Sale</TabsTrigger>
          <TabsTrigger value="history">Sales History</TabsTrigger>
        </TabsList>

        <TabsContent value="record" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Record New Sale</CardTitle>
              <CardDescription>Enter sale details to update inventory and track profit</CardDescription>
            </CardHeader>
            <CardContent>
              <SaleForm onSuccess={() => setActiveTab('history')} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Sales History</CardTitle>
              <CardDescription>All recorded sales transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <SalesHistoryTable sales={sales || []} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
