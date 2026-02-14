import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Negotiation {
  id: string;
  crop_id: string;
  buyer_id: string;
  farmer_id: string;
  initial_price: number;
  current_offer: number | null;
  offered_by: string | null;
  status: 'pending' | 'active' | 'accepted' | 'rejected' | 'cancelled';
  final_price: number | null;
  quantity: number;
  created_at: string;
  updated_at: string;
  crop?: {
    name: string;
    image: string;
    unit: string;
  };
  buyer_profile?: {
    name: string;
  };
  farmer_profile?: {
    name: string;
  };
}

export interface NegotiationMessage {
  id: string;
  negotiation_id: string;
  sender_id: string;
  message: string | null;
  offer_amount: number | null;
  message_type: 'message' | 'offer' | 'counter_offer' | 'accept' | 'reject';
  is_read: boolean;
  created_at: string;
}

export const useNegotiations = () => {
  const { user, profile } = useAuth();
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNegotiations = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('negotiations')
      .select(`
        *,
        crop:crops(name, image, unit)
      `)
      .order('updated_at', { ascending: false });

    if (!error && data) {
      // Fetch profiles for each negotiation
      const enrichedNegotiations = await Promise.all(
        data.map(async (neg) => {
          const [buyerProfile, farmerProfile] = await Promise.all([
            supabase.from('profiles').select('name').eq('user_id', neg.buyer_id).single(),
            supabase.from('profiles').select('name').eq('user_id', neg.farmer_id).single()
          ]);
          
          return {
            ...neg,
            buyer_profile: buyerProfile.data,
            farmer_profile: farmerProfile.data
          } as Negotiation;
        })
      );
      
      setNegotiations(enrichedNegotiations);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNegotiations();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('negotiations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'negotiations'
        },
        () => {
          fetchNegotiations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const startNegotiation = async (
    cropId: string, 
    farmerId: string, 
    initialPrice: number, 
    offerPrice: number, 
    quantity: number
  ) => {
    if (!user) return { error: 'Not authenticated' };

    const insertData: any = {
      buyer_id: user.id,
      farmer_id: farmerId,
      initial_price: initialPrice,
      current_offer: offerPrice,
      offered_by: user.id,
      quantity,
      status: 'pending' as const,
      ...(cropId ? { crop_id: cropId } : {}),
    };

    const { data, error } = await supabase
      .from('negotiations')
      .insert(insertData)
      .select()
      .single();

    if (error) return { error: error.message };

    // Add initial offer message
    await supabase
      .from('negotiation_messages')
      .insert({
        negotiation_id: data.id,
        sender_id: user.id,
        offer_amount: offerPrice,
        message_type: 'offer',
        message: `Initial offer: ₹${offerPrice}`
      });

    return { data };
  };

  const updateNegotiation = async (
    negotiationId: string, 
    updates: Partial<Negotiation>
  ) => {
    const { error } = await supabase
      .from('negotiations')
      .update(updates)
      .eq('id', negotiationId);

    return { error: error?.message };
  };

  return {
    negotiations,
    loading,
    startNegotiation,
    updateNegotiation,
    refetch: fetchNegotiations
  };
};
