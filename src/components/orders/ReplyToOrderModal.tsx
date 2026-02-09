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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useOrderReplies } from '@/hooks/useOrderReplies';
import { Loader2, MessageCircle, Check, X, RefreshCw } from 'lucide-react';
import type { Order } from '@/hooks/useOrders';

interface ReplyToOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order;
  onSuccess?: () => void;
}

const ReplyToOrderModal = ({ open, onOpenChange, order, onSuccess }: ReplyToOrderModalProps) => {
  const { sendReply } = useOrderReplies();
  const [replyType, setReplyType] = useState<'accept' | 'reject' | 'counter_offer' | 'message'>('message');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) return;

    setSubmitting(true);
    const result = await sendReply(order.id, message, replyType);
    setSubmitting(false);

    if (result.success) {
      setMessage('');
      setReplyType('message');
      onOpenChange(false);
      onSuccess?.();
    }
  };

  const getPlaceholder = () => {
    switch (replyType) {
      case 'accept':
        return 'Confirm the order details and delivery information...';
      case 'reject':
        return 'Explain why you cannot fulfill this order...';
      case 'counter_offer':
        return 'Propose alternative terms (different price, quantity, or delivery)...';
      default:
        return 'Write your message to the buyer...';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Reply to Order
          </DialogTitle>
          <DialogDescription>
            Respond to the buyer's order request
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Order Summary */}
          <div className="p-3 bg-muted rounded-lg space-y-1">
            <p className="font-semibold">{order.crop_name}</p>
            <p className="text-sm text-muted-foreground">
              Quantity: {order.quantity} • From: {order.buyer_name}
            </p>
            {order.message && (
              <p className="text-sm mt-2 italic">"{order.message}"</p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Received: {new Date(order.created_at).toLocaleString()}
            </p>
          </div>

          {/* Reply Type Selection */}
          <div className="space-y-3">
            <Label>Response Type</Label>
            <RadioGroup
              value={replyType}
              onValueChange={(v) => setReplyType(v as any)}
              className="grid grid-cols-2 gap-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="accept" id="accept" />
                <Label htmlFor="accept" className="flex items-center gap-1 cursor-pointer">
                  <Check className="w-4 h-4 text-green-600" />
                  Accept
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="reject" id="reject" />
                <Label htmlFor="reject" className="flex items-center gap-1 cursor-pointer">
                  <X className="w-4 h-4 text-red-600" />
                  Reject
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="counter_offer" id="counter_offer" />
                <Label htmlFor="counter_offer" className="flex items-center gap-1 cursor-pointer">
                  <RefreshCw className="w-4 h-4 text-orange-600" />
                  Counter Offer
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="message" id="message" />
                <Label htmlFor="message" className="flex items-center gap-1 cursor-pointer">
                  <MessageCircle className="w-4 h-4 text-blue-600" />
                  Message
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Message Input */}
          <div className="space-y-2">
            <Label htmlFor="reply-message">Your Message *</Label>
            <Textarea
              id="reply-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={getPlaceholder()}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!message.trim() || submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Reply'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReplyToOrderModal;
