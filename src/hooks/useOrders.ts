import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Order {
  id: string;
  buyer_id: string;
  farmer_id: string;
  crop_id: string | null;
  crop_name: string;
  quantity: number;
  message: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  buyer_name?: string;
  buyer_email?: string;
  farmer_name?: string;
}

export interface OrderReply {
  id: string;
  order_id: string;
  sender_id: string;
  message: string;
  reply_type: string;
  created_at: string;
  sender_name?: string;
}

export const useOrders = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    if (!user || !profile) return;

    setLoading(true);
    try {
      // Fetch orders based on role
      const query = profile.role === 'farmer' 
        ? supabase.from('orders').select('*').eq('farmer_id', user.id)
        : supabase.from('orders').select('*').eq('buyer_id', user.id);

      const { data: ordersData, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch profile names for each order
      const ordersWithNames = await Promise.all(
        (ordersData || []).map(async (order) => {
          // Get buyer profile
          const { data: buyerProfile } = await supabase
            .from('profiles')
            .select('name')
            .eq('user_id', order.buyer_id)
            .single();

          // Get farmer profile
          const { data: farmerProfile } = await supabase
            .from('profiles')
            .select('name')
            .eq('user_id', order.farmer_id)
            .single();

          // Get buyer email from auth (only farmer needs this)
          let buyerEmail = '';
          if (profile.role === 'farmer') {
            const { data: { user: buyerUser } } = await supabase.auth.admin?.getUserById?.(order.buyer_id) || { data: { user: null } };
            buyerEmail = buyerUser?.email || 'Email not available';
          }

          return {
            ...order,
            buyer_name: buyerProfile?.name || 'Unknown Buyer',
            buyer_email: buyerEmail,
            farmer_name: farmerProfile?.name || 'Unknown Farmer'
          };
        })
      );

      setOrders(ordersWithNames);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }, [user, profile]);

  const placeOrder = async (
    farmerId: string,
    cropId: string | null,
    cropName: string,
    quantity: number,
    message: string
  ) => {
    if (!user) return { success: false, error: 'Not authenticated' };

    try {
      const { data, error } = await supabase
        .from('orders')
        .insert({
          buyer_id: user.id,
          farmer_id: farmerId,
          crop_id: cropId,
          crop_name: cropName,
          quantity,
          message,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: '✅ Order Placed',
        description: `Your order for ${cropName} has been sent to the farmer.`
      });

      return { success: true, data };
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to place order'
      });
      return { success: false, error: error.message };
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(prev => 
        prev.map(o => o.id === orderId ? { ...o, status } : o)
      );

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  // Real-time subscription
  useEffect(() => {
    if (!user || !profile) return;

    fetchOrders();

    const filter = profile.role === 'farmer' 
      ? `farmer_id=eq.${user.id}` 
      : `buyer_id=eq.${user.id}`;

    const channel = supabase
      .channel('orders-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            fetchOrders(); // Refetch to get complete data with names
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as Order;
            setOrders(prev => 
              prev.map(o => o.id === updated.id ? { ...o, ...updated } : o)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, profile, fetchOrders]);

  return {
    orders,
    loading,
    placeOrder,
    updateOrderStatus,
    refetch: fetchOrders
  };
};
