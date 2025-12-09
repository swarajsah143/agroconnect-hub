import { useState } from 'react';
import { useNegotiations, Negotiation } from '@/hooks/useNegotiations';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageCircle, 
  Clock, 
  CheckCircle, 
  XCircle,
  ChevronRight,
  Package
} from 'lucide-react';
import { cn } from '@/lib/utils';
import NegotiationChat from './NegotiationChat';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const NegotiationsList = () => {
  const { negotiations, loading } = useNegotiations();
  const { user, profile } = useAuth();
  const [selectedNegotiation, setSelectedNegotiation] = useState<Negotiation | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-amber-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected':
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'active':
        return 'bg-primary/20 text-primary border-primary/30';
      default:
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (negotiations.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No negotiations yet</h3>
        <p className="text-muted-foreground">
          {profile?.role === 'buyer' 
            ? 'Start bargaining on products from the marketplace' 
            : 'Wait for buyers to send you offers'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {/* Negotiations list */}
      <ScrollArea className="h-[600px]">
        <div className="space-y-3 pr-4">
          {negotiations.map((neg) => {
            const isBuyer = user?.id === neg.buyer_id;
            const otherPartyName = isBuyer ? neg.farmer_profile?.name : neg.buyer_profile?.name;
            const isSelected = selectedNegotiation?.id === neg.id;

            return (
              <Card 
                key={neg.id}
                className={cn(
                  'cursor-pointer transition-all hover:border-primary/50',
                  isSelected && 'border-primary bg-primary/5'
                )}
                onClick={() => setSelectedNegotiation(neg)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {neg.crop?.image && (
                      <img 
                        src={neg.crop.image} 
                        alt={neg.crop?.name}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold truncate">{neg.crop?.name}</h4>
                        <Badge 
                          variant="outline" 
                          className={cn('text-xs', getStatusColor(neg.status))}
                        >
                          {getStatusIcon(neg.status)}
                          <span className="ml-1 capitalize">{neg.status}</span>
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {isBuyer ? 'Seller' : 'Buyer'}: {otherPartyName}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-sm">
                        <span className="text-muted-foreground line-through">
                          ₹{neg.initial_price}
                        </span>
                        {neg.current_offer && (
                          <span className="font-semibold text-primary">
                            ₹{neg.current_offer}
                          </span>
                        )}
                        {neg.final_price && (
                          <span className="font-bold text-green-400">
                            Final: ₹{neg.final_price}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Package className="w-3 h-3" />
                          {neg.quantity} {neg.crop?.unit}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>

      {/* Chat panel - Desktop */}
      <div className="hidden lg:block h-[600px]">
        {selectedNegotiation ? (
          <NegotiationChat 
            negotiation={selectedNegotiation}
            onClose={() => setSelectedNegotiation(null)}
          />
        ) : (
          <div className="h-full flex items-center justify-center border border-dashed border-border rounded-lg">
            <div className="text-center text-muted-foreground">
              <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p>Select a negotiation to view chat</p>
            </div>
          </div>
        )}
      </div>

      {/* Chat panel - Mobile Sheet */}
      {selectedNegotiation && (
        <Sheet open={!!selectedNegotiation} onOpenChange={() => setSelectedNegotiation(null)}>
          <SheetContent side="right" className="w-full sm:max-w-lg p-0">
            <NegotiationChat 
              negotiation={selectedNegotiation}
              onClose={() => setSelectedNegotiation(null)}
            />
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};

export default NegotiationsList;
