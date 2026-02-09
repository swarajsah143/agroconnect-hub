import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useOrders } from '@/hooks/useOrders';
import ReplyToOrderModal from './ReplyToOrderModal';
import { Package, MessageCircle, Clock, User, Mail } from 'lucide-react';
import type { Order } from '@/hooks/useOrders';

const IncomingOrders = () => {
  const { orders, loading } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [replyModalOpen, setReplyModalOpen] = useState(false);

  const handleReply = (order: Order) => {
    setSelectedOrder(order);
    setReplyModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'replied':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Replied</Badge>;
      case 'accepted':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Incoming Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Incoming Orders
            {orders.length > 0 && (
              <Badge className="ml-2">{orders.length}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No incoming orders yet</p>
              <p className="text-sm mt-1">Orders from buyers will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-lg">{order.crop_name}</h4>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {order.quantity}
                      </p>
                    </div>
                  </div>

                  {/* Buyer Info */}
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{order.buyer_name}</span>
                    </div>
                    {order.buyer_email && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <span>{order.buyer_email}</span>
                      </div>
                    )}
                  </div>

                  {/* Order Message */}
                  {order.message && (
                    <div className="p-3 bg-muted rounded-lg mb-3">
                      <p className="text-sm italic">"{order.message}"</p>
                    </div>
                  )}

                  {/* Timestamp */}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                    <Clock className="w-3 h-3" />
                    {new Date(order.created_at).toLocaleString()}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleReply(order)}
                      disabled={order.status === 'accepted' || order.status === 'rejected'}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Reply to Buyer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedOrder && (
        <ReplyToOrderModal
          open={replyModalOpen}
          onOpenChange={setReplyModalOpen}
          order={selectedOrder}
          onSuccess={() => setSelectedOrder(null)}
        />
      )}
    </>
  );
};

export default IncomingOrders;
