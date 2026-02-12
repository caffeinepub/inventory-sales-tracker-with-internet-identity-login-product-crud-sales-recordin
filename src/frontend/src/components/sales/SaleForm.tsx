import { useState } from 'react';
import { useGetAllProducts, useRecordSale } from '../../hooks/useQueries';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../../lib/format';
import type { Product } from '../../backend';

interface SaleFormProps {
  onSuccess: () => void;
}

export default function SaleForm({ onSuccess }: SaleFormProps) {
  const { data: products } = useGetAllProducts();
  const recordSale = useRecordSale();

  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [salePriceOverride, setSalePriceOverride] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const selectedProduct = products?.find((p) => p.id === selectedProductId);

  const calculateProfit = () => {
    if (!selectedProduct || !quantity) return 0;

    const qty = parseInt(quantity);
    if (isNaN(qty)) return 0;

    const salePrice = salePriceOverride
      ? parseFloat(salePriceOverride) * 100
      : Number(selectedProduct.salePrice);
    const costPrice = Number(selectedProduct.costPrice);

    return (salePrice - costPrice) * qty;
  };

  const profit = calculateProfit();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!selectedProductId) {
      setError('Please select a product');
      return;
    }

    if (!selectedProduct) {
      setError('Selected product not found');
      return;
    }

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      setError('Please enter a valid quantity (greater than 0)');
      return;
    }

    if (qty > Number(selectedProduct.stockQuantity)) {
      setError(`Not enough stock. Available: ${selectedProduct.stockQuantity}`);
      return;
    }

    const salePrice = salePriceOverride
      ? parseFloat(salePriceOverride)
      : Number(selectedProduct.salePrice) / 100;

    if (salePriceOverride && (isNaN(salePrice) || salePrice < 0)) {
      setError('Please enter a valid sale price');
      return;
    }

    const saleData = {
      id: `sale_${Date.now()}`,
      productId: selectedProductId,
      quantity: BigInt(qty),
      salePrice: BigInt(Math.round(salePrice * 100)),
      costPrice: selectedProduct.costPrice,
      profit: BigInt(Math.round(profit)),
      timestamp: BigInt(Date.now() * 1_000_000),
      notes: notes.trim() || undefined,
    };

    try {
      await recordSale.mutateAsync(saleData);
      setSuccess(true);
      setSelectedProductId('');
      setQuantity('');
      setSalePriceOverride('');
      setNotes('');
      setTimeout(() => {
        setSuccess(false);
        onSuccess();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to record sale');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="product">Product</Label>
        <Select value={selectedProductId} onValueChange={setSelectedProductId} disabled={recordSale.isPending}>
          <SelectTrigger id="product">
            <SelectValue placeholder="Select a product" />
          </SelectTrigger>
          <SelectContent>
            {products?.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.name} (Stock: {product.stockQuantity.toString()})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedProduct && (
        <div className="rounded-lg border bg-muted/50 p-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Cost Price:</span>
            <span className="font-medium">{formatCurrency(selectedProduct.costPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Default Sale Price:</span>
            <span className="font-medium">{formatCurrency(selectedProduct.salePrice)}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            placeholder="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            disabled={recordSale.isPending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="salePrice">Sale Price Override ($)</Label>
          <Input
            id="salePrice"
            type="number"
            step="0.01"
            min="0"
            placeholder="Optional"
            value={salePriceOverride}
            onChange={(e) => setSalePriceOverride(e.target.value)}
            disabled={recordSale.isPending}
          />
        </div>
      </div>

      {quantity && selectedProduct && (
        <div className="rounded-lg border bg-primary/5 p-3">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Estimated Profit:</span>
            <span className={`font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(profit)}
            </span>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          placeholder="Add any additional notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={recordSale.isPending}
          rows={3}
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-500 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>Sale recorded successfully!</AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={recordSale.isPending} className="w-full">
        {recordSale.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Recording...
          </>
        ) : (
          'Record Sale'
        )}
      </Button>
    </form>
  );
}
