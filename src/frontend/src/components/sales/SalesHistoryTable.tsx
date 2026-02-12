import { useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { ShoppingCart } from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../lib/format';
import { useGetAllProducts } from '../../hooks/useQueries';
import type { SaleRecord } from '../../backend';

interface SalesHistoryTableProps {
  sales: SaleRecord[];
}

export default function SalesHistoryTable({ sales }: SalesHistoryTableProps) {
  const { data: products } = useGetAllProducts();

  const productMap = useMemo(() => {
    const map = new Map();
    products?.forEach((p) => map.set(p.id, p.name));
    return map;
  }, [products]);

  const sortedSales = useMemo(() => {
    return [...sales].sort((a, b) => Number(b.timestamp - a.timestamp));
  }, [sales]);

  if (sales.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <ShoppingCart className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-semibold">No sales recorded yet</h3>
        <p className="text-sm text-muted-foreground">Record your first sale to see it here</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date & Time</TableHead>
            <TableHead>Product</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Sale Price</TableHead>
            <TableHead className="text-right">Cost</TableHead>
            <TableHead className="text-right">Profit</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedSales.map((sale) => {
            const productName = productMap.get(sale.productId) || 'Unknown Product';
            const totalSale = Number(sale.salePrice) * Number(sale.quantity);
            const totalCost = Number(sale.costPrice) * Number(sale.quantity);
            const profit = Number(sale.profit);

            return (
              <TableRow key={sale.id}>
                <TableCell className="whitespace-nowrap">{formatDateTime(sale.timestamp)}</TableCell>
                <TableCell className="font-medium">{productName}</TableCell>
                <TableCell className="text-right">{sale.quantity.toString()}</TableCell>
                <TableCell className="text-right">{formatCurrency(totalSale)}</TableCell>
                <TableCell className="text-right">{formatCurrency(totalCost)}</TableCell>
                <TableCell className="text-right">
                  <Badge variant={profit >= 0 ? 'default' : 'destructive'}>{formatCurrency(profit)}</Badge>
                </TableCell>
                <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                  {sale.notes || '-'}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
