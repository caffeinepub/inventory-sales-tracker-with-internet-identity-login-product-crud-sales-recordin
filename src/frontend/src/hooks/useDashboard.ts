import { useGetSalesByDateRange } from './useQueries';
import type { SaleRecord } from '../backend';

export function useDailySummary(selectedDate: Date) {
  const startOfDay = new Date(selectedDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(selectedDate);
  endOfDay.setHours(23, 59, 59, 999);

  const startTime = BigInt(startOfDay.getTime() * 1_000_000);
  const endTime = BigInt(endOfDay.getTime() * 1_000_000);

  const salesQuery = useGetSalesByDateRange(startTime, endTime);

  const sales = salesQuery.data || [];
  const totalSales = sales.length;
  const totalRevenue = sales.reduce((sum, sale) => sum + Number(sale.salePrice) * Number(sale.quantity), 0);
  const totalCost = sales.reduce((sum, sale) => sum + Number(sale.costPrice) * Number(sale.quantity), 0);
  const totalProfit = sales.reduce((sum, sale) => sum + Number(sale.profit), 0);

  return {
    ...salesQuery,
    data: {
      sales,
      totalSales,
      totalRevenue,
      totalCost,
      totalProfit,
    },
  };
}
