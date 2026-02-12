import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertTriangle, Package } from 'lucide-react';
import { formatNumber } from '../../lib/format';
import type { Product } from '../../backend';
import { useGetCallerUserProfile } from '../../hooks/useUserProfile';

interface LowStockAlertListProps {
  alerts: Product[];
}

export default function LowStockAlertList({ alerts }: LowStockAlertListProps) {
  const { data: userProfile } = useGetCallerUserProfile();

  if (alerts.length === 0) {
    return (
      <Alert>
        <Package className="h-4 w-4" />
        <AlertDescription>All products are well stocked. No alerts at this time.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {alerts.length} {alerts.length === 1 ? 'product needs' : 'products need'} restocking
        </AlertDescription>
      </Alert>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Current Stock</TableHead>
              <TableHead className="text-right">Threshold</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alerts.map((product) => {
              const threshold = product.lowStockThreshold
                ? Number(product.lowStockThreshold)
                : Number(userProfile?.defaultLowStockThreshold || 0);
              const isCustomThreshold = !!product.lowStockThreshold;

              return (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-right">{formatNumber(product.stockQuantity)}</TableCell>
                  <TableCell className="text-right">
                    {formatNumber(threshold)}
                    {isCustomThreshold && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        Custom
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="destructive">Low Stock</Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
