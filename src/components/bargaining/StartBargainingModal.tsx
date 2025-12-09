import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useNegotiations } from '@/hooks/useNegotiations';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, DollarSign, Package } from 'lucide-react';

interface Crop {
  id: string;
  farmer_id: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  image?: string;
  farmer_name?: string;
}

interface StartBargainingModalProps {
  crop: Crop;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const StartBargainingModal = ({ crop, open, onOpenChange, onSuccess }: StartBargainingModalProps) => {
  const [offerPrice, setOfferPrice] = useState(Math.floor(crop.price * 0.85));
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const { startNegotiation } = useNegotiations();
  const { toast } = useToast();

  const discount = ((crop.price - offerPrice) / crop.price * 100).toFixed(1);
  const totalOriginal = crop.price * quantity;
  const totalOffer = offerPrice * quantity;
  const savings = totalOriginal - totalOffer;

  const handleSubmit = async () => {
    if (offerPrice <= 0 || quantity <= 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid input',
        description: 'Please enter valid offer price and quantity.'
      });
      return;
    }

    setLoading(true);
    const result = await startNegotiation(
      crop.id,
      crop.farmer_id,
      crop.price,
      offerPrice,
      quantity
    );

    setLoading(false);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error
      });
      return;
    }

    toast({
      title: 'Negotiation started!',
      description: `Your offer of ₹${offerPrice} has been sent to the farmer.`
    });

    onOpenChange(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            Start Bargaining
          </DialogTitle>
          <DialogDescription>
            Make your offer for {crop.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product info */}
          <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
            {crop.image && (
              <img 
                src={crop.image} 
                alt={crop.name} 
                className="w-16 h-16 rounded-lg object-cover"
              />
            )}
            <div className="flex-1">
              <h4 className="font-semibold">{crop.name}</h4>
              <p className="text-sm text-muted-foreground">
                by {crop.farmer_name || 'Farmer'}
              </p>
              <p className="text-lg font-bold text-primary">
                ₹{crop.price}/{crop.unit}
              </p>
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Quantity ({crop.unit})
            </Label>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                min={1}
                max={crop.quantity}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">
                Max: {crop.quantity} {crop.unit}
              </span>
            </div>
          </div>

          {/* Offer price */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Your Offer Price (per {crop.unit})
            </Label>
            <div className="flex items-center gap-3">
              <span className="text-lg">₹</span>
              <Input
                type="number"
                min={1}
                value={offerPrice}
                onChange={(e) => setOfferPrice(parseInt(e.target.value) || 0)}
                className="text-lg font-semibold"
              />
            </div>
            <Slider
              value={[offerPrice]}
              onValueChange={(v) => setOfferPrice(v[0])}
              min={Math.floor(crop.price * 0.5)}
              max={crop.price}
              step={1}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>₹{Math.floor(crop.price * 0.5)}</span>
              <span>Original: ₹{crop.price}</span>
            </div>
          </div>

          {/* Summary */}
          <div className="p-4 bg-primary/10 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Original Total:</span>
              <span className="line-through text-muted-foreground">₹{totalOriginal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Your Offer:</span>
              <span className="font-bold text-lg">₹{totalOffer}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-green-500">You Save:</span>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                  {discount}% off
                </Badge>
                <span className="font-semibold text-green-400">₹{savings}</span>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleSubmit} 
            className="w-full" 
            disabled={loading || offerPrice >= crop.price}
          >
            {loading ? 'Sending...' : 'Send Offer'}
          </Button>
          
          {offerPrice >= crop.price && (
            <p className="text-sm text-center text-amber-500">
              Your offer should be lower than the original price
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StartBargainingModal;
