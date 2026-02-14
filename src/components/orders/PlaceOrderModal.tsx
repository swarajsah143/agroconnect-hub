import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useOrders } from '@/hooks/useOrders';
import { Loader2, ShoppingCart } from 'lucide-react';

interface PlaceOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  crop: {
    id: string;
    farmer_id: string;
    name: string;
    price: number;
    quantity: number;
    unit: string;
    farmer_name?: string;
  };
  onSuccess?: () => void;
}

const PlaceOrderModal = ({ open, onOpenChange, crop, onSuccess }: PlaceOrderModalProps) => {
  const { placeOrder } = useOrders();
  const [quantity, setQuantity] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!quantity || Number(quantity) <= 0) return;

    setSubmitting(true);
    const result = await placeOrder(
      crop.farmer_id,
      crop.id || null,
      crop.name,
      Number(quantity),
      message
    );

    setSubmitting(false);

    if (result.success) {
      setQuantity('');
      setMessage('');
      onOpenChange(false);
      onSuccess?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Place Order
          </DialogTitle>
          <DialogDescription>
            Send an order request to the farmer for {crop.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-3 bg-muted rounded-lg">
            <p className="font-semibold">{crop.name}</p>
            <p className="text-sm text-muted-foreground">
              Price: ₹{crop.price}/{crop.unit} • Available: {crop.quantity} {crop.unit}
            </p>
            {crop.farmer_name && (
              <p className="text-sm text-muted-foreground">Seller: {crop.farmer_name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity ({crop.unit}) *</Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder={`Max: ${crop.quantity}`}
              min="1"
              max={crop.quantity}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message to Farmer (optional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add any special requests or notes..."
              rows={3}
            />
          </div>

          {quantity && Number(quantity) > 0 && (
            <div className="p-3 bg-primary/10 rounded-lg">
              <p className="text-sm font-medium">
                Estimated Total: ₹{(Number(quantity) * crop.price).toLocaleString()}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!quantity || Number(quantity) <= 0 || submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Order Request'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PlaceOrderModal;
