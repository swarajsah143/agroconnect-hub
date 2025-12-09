import { useState, useRef, useEffect } from 'react';
import { useNegotiationChat } from '@/hooks/useNegotiationChat';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  DollarSign, 
  Check, 
  X, 
  CheckCheck,
  MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Negotiation } from '@/hooks/useNegotiations';

interface NegotiationChatProps {
  negotiation: Negotiation;
  onClose?: () => void;
}

const NegotiationChat = ({ negotiation, onClose }: NegotiationChatProps) => {
  const { user, profile } = useAuth();
  const { messages, sendMessage, sendOffer, acceptOffer, rejectOffer, loading } = useNegotiationChat(negotiation.id);
  const [newMessage, setNewMessage] = useState('');
  const [offerAmount, setOfferAmount] = useState('');
  const [showOfferInput, setShowOfferInput] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isBuyer = user?.id === negotiation.buyer_id;
  const isFarmer = user?.id === negotiation.farmer_id;
  const otherPartyName = isBuyer ? negotiation.farmer_profile?.name : negotiation.buyer_profile?.name;
  const canMakeOffer = negotiation.offered_by !== user?.id && negotiation.status !== 'accepted' && negotiation.status !== 'rejected';
  const isNegotiationActive = negotiation.status !== 'accepted' && negotiation.status !== 'rejected' && negotiation.status !== 'cancelled';

  useEffect(() => {
    // Scroll to bottom on new messages
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    await sendMessage(newMessage);
    setNewMessage('');
  };

  const handleSendOffer = async () => {
    const amount = parseFloat(offerAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    const isCounter = messages.some(m => m.message_type === 'offer' || m.message_type === 'counter_offer');
    await sendOffer(amount, isCounter);
    setOfferAmount('');
    setShowOfferInput(false);
  };

  const handleAccept = async () => {
    if (negotiation.current_offer) {
      await acceptOffer(negotiation.current_offer);
    }
  };

  const handleReject = async () => {
    await rejectOffer();
  };

  const getMessageStyles = (senderId: string, type: string) => {
    const isMe = senderId === user?.id;
    
    if (type === 'accept') {
      return 'bg-green-500/20 text-green-400 border border-green-500/30';
    }
    if (type === 'reject') {
      return 'bg-red-500/20 text-red-400 border border-red-500/30';
    }
    if (type === 'offer' || type === 'counter_offer') {
      return isMe 
        ? 'bg-primary text-primary-foreground' 
        : 'bg-accent text-accent-foreground border border-primary/30';
    }
    
    return isMe 
      ? 'bg-primary text-primary-foreground' 
      : 'bg-muted text-foreground';
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {negotiation.crop?.image && (
              <img 
                src={negotiation.crop.image} 
                alt={negotiation.crop?.name} 
                className="w-10 h-10 rounded-lg object-cover"
              />
            )}
            <div>
              <h3 className="font-semibold">{negotiation.crop?.name}</h3>
              <p className="text-sm text-muted-foreground">
                Negotiating with {otherPartyName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant={negotiation.status === 'accepted' ? 'default' : 'secondary'}
              className={cn(
                negotiation.status === 'accepted' && 'bg-green-500',
                negotiation.status === 'rejected' && 'bg-red-500'
              )}
            >
              {negotiation.status}
            </Badge>
            {onClose && (
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Price info */}
        <div className="mt-3 flex items-center gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Original: </span>
            <span className="font-semibold">₹{negotiation.initial_price}/{negotiation.crop?.unit}</span>
          </div>
          {negotiation.current_offer && (
            <div>
              <span className="text-muted-foreground">Current Offer: </span>
              <span className="font-semibold text-primary">₹{negotiation.current_offer}</span>
            </div>
          )}
          {negotiation.final_price && (
            <div className="text-green-400">
              <span>Final Price: </span>
              <span className="font-bold">₹{negotiation.final_price}</span>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-3">
          {messages.map((msg) => {
            const isMe = msg.sender_id === user?.id;
            
            return (
              <div 
                key={msg.id} 
                className={cn('flex', isMe ? 'justify-end' : 'justify-start')}
              >
                <div 
                  className={cn(
                    'max-w-[75%] px-4 py-2 rounded-2xl',
                    getMessageStyles(msg.sender_id, msg.message_type)
                  )}
                >
                  {msg.message_type === 'offer' || msg.message_type === 'counter_offer' ? (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-semibold">
                        {msg.message_type === 'counter_offer' ? 'Counter Offer' : 'Offer'}: ₹{msg.offer_amount}
                      </span>
                    </div>
                  ) : msg.message_type === 'accept' ? (
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>{msg.message}</span>
                    </div>
                  ) : msg.message_type === 'reject' ? (
                    <div className="flex items-center gap-2">
                      <X className="w-4 h-4" />
                      <span>{msg.message}</span>
                    </div>
                  ) : (
                    <p>{msg.message}</p>
                  )}
                  
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span className="text-[10px] opacity-60">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isMe && msg.is_read && (
                      <CheckCheck className="w-3 h-3 text-primary" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Action buttons for pending offers */}
      {canMakeOffer && negotiation.current_offer && isNegotiationActive && (
        <div className="p-3 border-t border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <Button 
              variant="default" 
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={handleAccept}
            >
              <Check className="w-4 h-4 mr-2" />
              Accept ₹{negotiation.current_offer}
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setShowOfferInput(true)}
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Counter Offer
            </Button>
            <Button 
              variant="destructive" 
              size="icon"
              onClick={handleReject}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Offer input */}
      {showOfferInput && isNegotiationActive && (
        <div className="p-3 border-t border-border bg-accent/20">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
              <Input
                type="number"
                placeholder="Enter your offer"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button onClick={handleSendOffer}>
              Send Offer
            </Button>
            <Button variant="ghost" onClick={() => setShowOfferInput(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Message input */}
      {isNegotiationActive && (
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            {!showOfferInput && canMakeOffer && (
              <Button variant="outline" size="icon" onClick={() => setShowOfferInput(true)}>
                <DollarSign className="w-4 h-4" />
              </Button>
            )}
            <Button onClick={handleSendMessage} size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Closed negotiation message */}
      {!isNegotiationActive && (
        <div className="p-4 border-t border-border bg-muted/50 text-center">
          <p className="text-muted-foreground">
            {negotiation.status === 'accepted' 
              ? `✅ Deal closed at ₹${negotiation.final_price}` 
              : '❌ This negotiation has been closed'}
          </p>
        </div>
      )}
    </div>
  );
};

export default NegotiationChat;
