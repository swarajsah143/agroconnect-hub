import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'negotiation' | 'order' | 'order_reply' | 'message';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  negotiationId?: string;
  orderId?: string;
}

const NotificationBell = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    // Listen for new negotiations
    const negotiationChannel = supabase
      .channel('new-negotiations')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'negotiations',
          filter: profile?.role === 'farmer' ? `farmer_id=eq.${user.id}` : `buyer_id=eq.${user.id}`
        },
        async (payload) => {
          const newNeg = payload.new as any;
          
          // Only notify farmers of new negotiations from buyers
          if (profile?.role === 'farmer' && newNeg.farmer_id === user.id) {
            const newNotification: Notification = {
              id: newNeg.id,
              type: 'negotiation',
              title: 'New Price Offer',
              message: `You received a new offer of ₹${newNeg.current_offer}`,
              read: false,
              createdAt: new Date().toISOString(),
              negotiationId: newNeg.id
            };
            
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
            
            toast({
              title: '🔔 New Price Offer',
              description: `You received a new offer of ₹${newNeg.current_offer}`,
            });
          }
        }
      )
      .subscribe();

    // Listen for negotiation updates
    const updateChannel = supabase
      .channel('negotiation-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'negotiations'
        },
        async (payload) => {
          const updated = payload.new as any;
          
          // Notify about accepted/rejected negotiations
          if (updated.status === 'accepted') {
            const newNotification: Notification = {
              id: `${updated.id}-accepted`,
              type: 'negotiation',
              title: '✅ Offer Accepted',
              message: `Deal closed at ₹${updated.final_price}`,
              read: false,
              createdAt: new Date().toISOString(),
              negotiationId: updated.id
            };
            
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
            
            toast({
              title: '✅ Offer Accepted',
              description: `Deal closed at ₹${updated.final_price}`,
            });
          } else if (updated.offered_by !== user.id && updated.current_offer) {
            const newNotification: Notification = {
              id: `${updated.id}-counter`,
              type: 'message',
              title: '💬 Counter Offer',
              message: `New counter offer: ₹${updated.current_offer}`,
              read: false,
              createdAt: new Date().toISOString(),
              negotiationId: updated.id
            };
            
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
          }
        }
      )
      .subscribe();

    // Listen for new messages
    const messageChannel = supabase
      .channel('new-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'negotiation_messages'
        },
        async (payload) => {
          const newMsg = payload.new as any;
          
          if (newMsg.sender_id !== user.id) {
            const newNotification: Notification = {
              id: newMsg.id,
              type: 'message',
              title: '💬 New Message',
              message: newMsg.message || `New ${newMsg.message_type}`,
              read: false,
              createdAt: new Date().toISOString(),
              negotiationId: newMsg.negotiation_id
            };
            
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
          }
        }
      )
      .subscribe();

    // Listen for new orders (for farmers)
    const orderChannel = supabase
      .channel('new-orders')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
          filter: `farmer_id=eq.${user.id}`
        },
        async (payload) => {
          const newOrder = payload.new as any;
          
          // Fetch buyer name
          const { data: buyerProfile } = await supabase
            .from('profiles')
            .select('name')
            .eq('user_id', newOrder.buyer_id)
            .single();

          const newNotification: Notification = {
            id: `order-${newOrder.id}`,
            type: 'order',
            title: '📦 New Order Request',
            message: `${buyerProfile?.name || 'A buyer'} wants to order ${newOrder.quantity} of ${newOrder.crop_name}`,
            read: false,
            createdAt: new Date().toISOString(),
            orderId: newOrder.id
          };
          
          setNotifications(prev => {
            // Prevent duplicate notifications
            if (prev.some(n => n.id === newNotification.id)) return prev;
            return [newNotification, ...prev];
          });
          setUnreadCount(prev => prev + 1);
          
          toast({
            title: '📦 New Order Request',
            description: `${buyerProfile?.name || 'A buyer'} wants to order ${newOrder.crop_name}`,
          });
        }
      )
      .subscribe();

    // Listen for order replies (for buyers)
    const orderReplyChannel = supabase
      .channel('new-order-replies')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'order_replies'
        },
        async (payload) => {
          const newReply = payload.new as any;
          
          // Only notify if the reply is not from the current user
          if (newReply.sender_id === user.id) return;

          // Check if this order belongs to the current user
          const { data: order } = await supabase
            .from('orders')
            .select('buyer_id, crop_name')
            .eq('id', newReply.order_id)
            .single();

          if (!order || order.buyer_id !== user.id) return;

          // Fetch sender name
          const { data: senderProfile } = await supabase
            .from('profiles')
            .select('name')
            .eq('user_id', newReply.sender_id)
            .single();

          const replyTypeEmoji = 
            newReply.reply_type === 'accept' ? '✅' :
            newReply.reply_type === 'reject' ? '❌' :
            newReply.reply_type === 'counter_offer' ? '🔄' : '💬';

          const newNotification: Notification = {
            id: `reply-${newReply.id}`,
            type: 'order_reply',
            title: `${replyTypeEmoji} Farmer Replied`,
            message: `${senderProfile?.name || 'Farmer'} responded to your order for ${order.crop_name}`,
            read: false,
            createdAt: new Date().toISOString(),
            orderId: newReply.order_id
          };
          
          setNotifications(prev => {
            // Prevent duplicate notifications
            if (prev.some(n => n.id === newNotification.id)) return prev;
            return [newNotification, ...prev];
          });
          setUnreadCount(prev => prev + 1);
          
          toast({
            title: `${replyTypeEmoji} Farmer Replied`,
            description: `${senderProfile?.name || 'Farmer'} responded to your order`,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(negotiationChannel);
      supabase.removeChannel(updateChannel);
      supabase.removeChannel(messageChannel);
      supabase.removeChannel(orderChannel);
      supabase.removeChannel(orderReplyChannel);
    };
  }, [user, profile, toast]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold">Notifications</h4>
          {notifications.length > 0 && (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all read
              </Button>
              <Button variant="ghost" size="sm" onClick={clearNotifications}>
                Clear
              </Button>
            </div>
          )}
        </div>
        
        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                    notification.read 
                      ? 'bg-background border-border' 
                      : 'bg-primary/5 border-primary/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(notification.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
