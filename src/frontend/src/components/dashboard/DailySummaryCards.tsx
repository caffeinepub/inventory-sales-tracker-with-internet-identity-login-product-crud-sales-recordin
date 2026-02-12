import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { TrendingUp, DollarSign, ShoppingCart, Wallet } from 'lucide-react';
import { formatCurrency } from '../../lib/format';

interface DailySummaryCardsProps {
  totalSales: number;
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
}

export default function DailySummaryCards({
  totalSales,
  totalRevenue,
  totalCost,
  totalProfit,
}: DailySummaryCardsProps) {
  const cards = [
    {
      title: 'Total Sales',
      value: totalSales.toString(),
      icon: ShoppingCart,
      color: 'text-chart-1',
    },
    {
      title: 'Revenue',
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      color: 'text-chart-2',
    },
    {
      title: 'Cost',
      value: formatCurrency(totalCost),
      icon: Wallet,
      color: 'text-chart-3',
    },
    {
      title: 'Profit',
      value: formatCurrency(totalProfit),
      icon: TrendingUp,
      color: 'text-chart-4',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <Icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
