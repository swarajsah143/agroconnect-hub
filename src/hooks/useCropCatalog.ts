import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface CatalogCrop {
  id: string;
  name: string;
  category: string;
  default_image_url: string | null;
  created_at: string;
}

export interface FarmerListing {
  id: string;
  farmer_id: string;
  crop_catalog_id: string | null;
  crop_id: string | null;
  price: number;
  quantity: number;
  unit: string;
  location: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Fetch the full crop catalog
export function useCropCatalog() {
  return useQuery({
    queryKey: ['crop-catalog'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crop_catalog')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });
      if (error) throw error;
      return data as CatalogCrop[];
    },
    staleTime: 1000 * 60 * 30, // cache 30 min
  });
}

// Fetch a farmer's listings
export function useFarmerListings() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['farmer-listings', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('farmer_listings')
        .select('*')
        .eq('farmer_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as FarmerListing[];
    },
    enabled: !!user,
  });
}

// Fetch all active listings (for marketplace/buyers)
export function useActiveListings() {
  return useQuery({
    queryKey: ['active-listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('farmer_listings')
        .select('*, crop_catalog(*)')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

// Add a listing from catalog
export function useAddListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (listing: {
      farmer_id: string;
      crop_catalog_id?: string;
      crop_id?: string;
      price: number;
      quantity: number;
      unit: string;
      location: string;
      description?: string;
    }) => {
      const { data, error } = await supabase
        .from('farmer_listings')
        .insert([listing])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmer-listings'] });
      queryClient.invalidateQueries({ queryKey: ['active-listings'] });
      queryClient.invalidateQueries({ queryKey: ['unified-crops-farmer'] });
      queryClient.invalidateQueries({ queryKey: ['unified-crops-all'] });
    },
  });
}

// Update a listing
export function useUpdateListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<FarmerListing> & { id: string }) => {
      const { data, error } = await supabase
        .from('farmer_listings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmer-listings'] });
      queryClient.invalidateQueries({ queryKey: ['active-listings'] });
      queryClient.invalidateQueries({ queryKey: ['unified-crops-farmer'] });
      queryClient.invalidateQueries({ queryKey: ['unified-crops-all'] });
    },
  });
}

// Delete a listing
export function useDeleteListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('farmer_listings').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmer-listings'] });
      queryClient.invalidateQueries({ queryKey: ['active-listings'] });
      queryClient.invalidateQueries({ queryKey: ['unified-crops-farmer'] });
      queryClient.invalidateQueries({ queryKey: ['unified-crops-all'] });
    },
  });
}
