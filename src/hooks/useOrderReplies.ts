import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface OrderReply {
  id: string;
  order_id: string;
  sender_id: string;
  message: string;
  reply_type: string;
  created_at: string;
  sender_name?: string;
}

export const useOrderReplies = (orderId?: string) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [replies, setReplies] = useState<OrderReply[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReplies = useCallback(async () => {
    if (!orderId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('order_replies')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Fetch sender names
      const repliesWithNames = await Promise.all(
        (data || []).map(async (reply) => {
          const { data: senderProfile } = await supabase
            .from('profiles')
            .select('name')
            .eq('user_id', reply.sender_id)
            .single();

          return {
            ...reply,
            sender_name: senderProfile?.name || 'Unknown'
          };
        })
      );

      setReplies(repliesWithNames);
    } catch (error) {
      console.error('Error fetching replies:', error);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  const sendReply = async (
    targetOrderId: string,
    message: string,
    replyType: 'accept' | 'reject' | 'counter_offer' | 'message'
  ) => {
    if (!user || !message.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter a message'
      });
      return { success: false };
    }

    try {
      const { data, error } = await supabase
        .from('order_replies')
        .insert({
          order_id: targetOrderId,
          sender_id: user.id,
          message: message.trim(),
          reply_type: replyType
        })
        .select()
        .single();

      if (error) throw error;

      // Update order status based on reply type
      let newStatus = 'replied';
      if (replyType === 'accept') newStatus = 'accepted';
      if (replyType === 'reject') newStatus = 'rejected';

      await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', targetOrderId);

      toast({
        title: '✅ Reply Sent',
        description: 'Your reply has been sent to the buyer.'
      });

      return { success: true, data };
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to send reply'
      });
      return { success: false, error: error.message };
    }
  };

  // Real-time subscription for replies
  useEffect(() => {
    if (!orderId) return;

    fetchReplies();

    const channel = supabase
      .channel(`order-replies-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'order_replies',
          filter: `order_id=eq.${orderId}`
        },
        () => {
          fetchReplies(); // Refetch to get complete data with names
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, fetchReplies]);

  return {
    replies,
    loading,
    sendReply,
    refetch: fetchReplies
  };
};
