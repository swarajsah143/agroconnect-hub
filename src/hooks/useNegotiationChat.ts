import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { NegotiationMessage } from './useNegotiations';

export const useNegotiationChat = (negotiationId: string) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<NegotiationMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  const fetchMessages = useCallback(async () => {
    if (!negotiationId) return;

    const { data, error } = await supabase
      .from('negotiation_messages')
      .select('*')
      .eq('negotiation_id', negotiationId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMessages(data as NegotiationMessage[]);
    }
    setLoading(false);
  }, [negotiationId]);

  useEffect(() => {
    fetchMessages();

    // Mark messages as read
    if (user) {
      supabase
        .from('negotiation_messages')
        .update({ is_read: true })
        .eq('negotiation_id', negotiationId)
        .neq('sender_id', user.id);
    }

    // Subscribe to real-time messages
    const channel = supabase
      .channel(`chat-${negotiationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'negotiation_messages',
          filter: `negotiation_id=eq.${negotiationId}`
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as NegotiationMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [negotiationId, user, fetchMessages]);

  const sendMessage = async (message: string) => {
    if (!user || !message.trim()) return;

    const { error } = await supabase
      .from('negotiation_messages')
      .insert({
        negotiation_id: negotiationId,
        sender_id: user.id,
        message: message.trim(),
        message_type: 'message'
      });

    return { error: error?.message };
  };

  const sendOffer = async (amount: number, isCounterOffer: boolean = false) => {
    if (!user) return;

    // Insert message
    const { error: msgError } = await supabase
      .from('negotiation_messages')
      .insert({
        negotiation_id: negotiationId,
        sender_id: user.id,
        offer_amount: amount,
        message_type: isCounterOffer ? 'counter_offer' : 'offer',
        message: `${isCounterOffer ? 'Counter offer' : 'Offer'}: ₹${amount}`
      });

    if (msgError) return { error: msgError.message };

    // Update negotiation
    const { error: negError } = await supabase
      .from('negotiations')
      .update({
        current_offer: amount,
        offered_by: user.id,
        status: 'active'
      })
      .eq('id', negotiationId);

    return { error: negError?.message };
  };

  const acceptOffer = async (finalPrice: number) => {
    if (!user) return;

    // Insert accept message
    await supabase
      .from('negotiation_messages')
      .insert({
        negotiation_id: negotiationId,
        sender_id: user.id,
        message_type: 'accept',
        message: `Offer accepted at ₹${finalPrice}`,
        offer_amount: finalPrice
      });

    // Update negotiation
    const { error } = await supabase
      .from('negotiations')
      .update({
        status: 'accepted',
        final_price: finalPrice
      })
      .eq('id', negotiationId);

    return { error: error?.message };
  };

  const rejectOffer = async () => {
    if (!user) return;

    await supabase
      .from('negotiation_messages')
      .insert({
        negotiation_id: negotiationId,
        sender_id: user.id,
        message_type: 'reject',
        message: 'Offer rejected'
      });

    const { error } = await supabase
      .from('negotiations')
      .update({ status: 'rejected' })
      .eq('id', negotiationId);

    return { error: error?.message };
  };

  return {
    messages,
    loading,
    isTyping,
    sendMessage,
    sendOffer,
    acceptOffer,
    rejectOffer,
    refetch: fetchMessages
  };
};
