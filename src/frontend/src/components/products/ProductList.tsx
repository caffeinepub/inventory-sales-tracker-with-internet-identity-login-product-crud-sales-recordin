import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Edit, Trash2, Package } from 'lucide-react';
import { formatCurrency, formatNumber } from '../../lib/format';
import type { Product } from '../../backend';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

export default function ProductList({ products, onEdit, onDelete }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Package className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-semibold">No products yet</h3>
        <p className="text-sm text-muted-foreground">Add your first product to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Cost</TableHead>
            <TableHead className="text-right">Sale Price</TableHead>
            <TableHead className="text-right">Stock</TableHead>
            <TableHead className="text-right">Threshold</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const isLowStock = product.lowStockThreshold
              ? product.stockQuantity <= product.lowStockThreshold
              : false;

            return (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="text-right">{formatCurrency(product.costPrice)}</TableCell>
                <TableCell className="text-right">{formatCurrency(product.salePrice)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {formatNumber(product.stockQuantity)}
                    {isLowStock && (
                      <Badge variant="destructive" className="text-xs">
                        Low
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {product.lowStockThreshold ? formatNumber(product.lowStockThreshold) : '-'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(product)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(product.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
