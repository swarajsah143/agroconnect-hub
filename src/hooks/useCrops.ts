import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface CropRow {
  id: string;
  farmer_id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  location: string;
  image: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

// Fetch all crops (for marketplace)
export function useAllCrops() {
  return useQuery({
    queryKey: ['all-crops'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crops')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as CropRow[];
    },
  });
}

// Fetch farmer's own crops
export function useFarmerCrops() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['farmer-crops', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('crops')
        .select('*')
        .eq('farmer_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as CropRow[];
    },
    enabled: !!user,
  });
}

// Add crop mutation
export function useAddCrop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (crop: {
      farmer_id: string;
      name: string;
      category: string;
      quantity: number;
      unit: string;
      price: number;
      location: string;
      description: string;
      image?: string;
    }) => {
      const { data, error } = await supabase.from('crops').insert([crop]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmer-crops'] });
      queryClient.invalidateQueries({ queryKey: ['all-crops'] });
      queryClient.invalidateQueries({ queryKey: ['unified-crops-farmer'] });
      queryClient.invalidateQueries({ queryKey: ['unified-crops-all'] });
    },
  });
}

// Update crop mutation
export function useUpdateCrop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CropRow> & { id: string }) => {
      const { data, error } = await supabase.from('crops').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmer-crops'] });
      queryClient.invalidateQueries({ queryKey: ['all-crops'] });
      queryClient.invalidateQueries({ queryKey: ['unified-crops-farmer'] });
      queryClient.invalidateQueries({ queryKey: ['unified-crops-all'] });
    },
  });
}

// Delete crop mutation
export function useDeleteCrop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('crops').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmer-crops'] });
      queryClient.invalidateQueries({ queryKey: ['all-crops'] });
      queryClient.invalidateQueries({ queryKey: ['unified-crops-farmer'] });
      queryClient.invalidateQueries({ queryKey: ['unified-crops-all'] });
    },
  });
}
