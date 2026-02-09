import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useOrders } from '@/hooks/useOrders';
import { useOrderReplies, OrderReply } from '@/hooks/useOrderReplies';
import { supabase } from '@/integrations/supabase/client';
import { Package, Clock, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import type { Order } from '@/hooks/useOrders';

const OrderRepliesSection = ({ orderId }: { orderId: string }) => {
  const { replies, loading } = useOrderReplies(orderId);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-2">
        <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (replies.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic">No replies yet</p>
    );
  }

  return (
    <div className="space-y-2">
      {replies.map((reply) => (
        <div key={reply.id} className="p-2 bg-background rounded border border-border">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">{reply.sender_name}</span>
            <Badge variant="outline" className="text-xs">
              {reply.reply_type === 'accept' ? '✅ Accept' :
               reply.reply_type === 'reject' ? '❌ Reject' :
               reply.reply_type === 'counter_offer' ? '🔄 Counter' : '💬 Message'}
            </Badge>
          </div>
          <p className="text-sm">{reply.message}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {new Date(reply.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

const MyOrders = () => {
  const { orders, loading } = useOrders();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

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

  const toggleExpand = (orderId: string) => {
    setExpandedOrder(prev => prev === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            My Orders
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          My Orders
          {orders.length > 0 && (
            <Badge className="ml-2">{orders.length}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No orders yet</p>
            <p className="text-sm mt-1">Your order requests will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{order.crop_name}</h4>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {order.quantity} • To: {order.farmer_name}
                    </p>
                  </div>
                </div>

                {/* Order Message */}
                {order.message && (
                  <p className="text-sm text-muted-foreground mb-2 italic">
                    Your note: "{order.message}"
                  </p>
                )}

                {/* Timestamp */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                  <Clock className="w-3 h-3" />
                  {new Date(order.created_at).toLocaleString()}
                </div>

                {/* Expand/Collapse Replies */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => toggleExpand(order.id)}
                  className="w-full justify-between"
                >
                  <span className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    View Replies
                  </span>
                  {expandedOrder === order.id ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>

                {/* Replies Section */}
                {expandedOrder === order.id && (
                  <div className="mt-3 p-3 bg-muted rounded-lg">
                    <OrderRepliesSection orderId={order.id} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MyOrders;
