import { useState, useEffect } from 'react';
import { useCreateProduct, useUpdateProduct } from '../../hooks/useQueries';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import type { Product } from '../../backend';

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSuccess: () => void;
}

export default function ProductFormDialog({ open, onOpenChange, product, onSuccess }: ProductFormDialogProps) {
  const [name, setName] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState('');
  const [error, setError] = useState('');

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const isEditing = !!product;

  useEffect(() => {
    if (product) {
      setName(product.name);
      setCostPrice((Number(product.costPrice) / 100).toString());
      setSalePrice((Number(product.salePrice) / 100).toString());
      setStockQuantity(product.stockQuantity.toString());
      setLowStockThreshold(product.lowStockThreshold ? product.lowStockThreshold.toString() : '');
    } else {
      setName('');
      setCostPrice('');
      setSalePrice('');
      setStockQuantity('');
      setLowStockThreshold('');
    }
    setError('');
  }, [product, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter a product name');
      return;
    }

    const cost = parseFloat(costPrice);
    const sale = parseFloat(salePrice);
    const stock = parseInt(stockQuantity);
    const threshold = lowStockThreshold ? parseInt(lowStockThreshold) : null;

    if (isNaN(cost) || cost < 0) {
      setError('Please enter a valid cost price (0 or greater)');
      return;
    }

    if (isNaN(sale) || sale < 0) {
      setError('Please enter a valid sale price (0 or greater)');
      return;
    }

    if (isNaN(stock) || stock < 0) {
      setError('Please enter a valid stock quantity (0 or greater)');
      return;
    }

    if (threshold !== null && (isNaN(threshold) || threshold < 0)) {
      setError('Please enter a valid threshold (0 or greater)');
      return;
    }

    const productData: Product = {
      id: product?.id || `product_${Date.now()}`,
      name: name.trim(),
      costPrice: BigInt(Math.round(cost * 100)),
      salePrice: BigInt(Math.round(sale * 100)),
      stockQuantity: BigInt(stock),
      lowStockThreshold: threshold !== null ? BigInt(threshold) : undefined,
    };

    try {
      if (isEditing) {
        await updateProduct.mutateAsync(productData);
      } else {
        await createProduct.mutateAsync(productData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || `Failed to ${isEditing ? 'update' : 'create'} product`);
    }
  };

  const isPending = createProduct.isPending || updateProduct.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update product details' : 'Enter product information to add to inventory'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              placeholder="e.g., Widget A"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="costPrice">Cost Price ($)</Label>
              <Input
                id="costPrice"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salePrice">Sale Price ($)</Label>
              <Input
                id="salePrice"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                disabled={isPending}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stockQuantity">Stock Quantity</Label>
              <Input
                id="stockQuantity"
                type="number"
                min="0"
                placeholder="0"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
              <Input
                id="lowStockThreshold"
                type="number"
                min="0"
                placeholder="Optional"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(e.target.value)}
                disabled={isPending}
              />
            </div>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : isEditing ? (
                'Update Product'
              ) : (
                'Create Product'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
