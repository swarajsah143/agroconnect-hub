import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { getCropImage } from '@/utils/cropImages';

/**
 * Unified crop item that normalizes data from both
 * the legacy `crops` table and the new `farmer_listings + crop_catalog` system.
 */
export interface UnifiedCrop {
  id: string;
  source: 'crops' | 'listing';
  farmer_id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  location: string;
  image: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
  // For listings linked to crop_catalog
  crop_catalog_id?: string | null;
  crop_id?: string | null;
}

/** Fetch ALL visible crops for the marketplace (both sources, active only) */
export function useAllUnifiedCrops() {
  return useQuery({
    queryKey: ['unified-crops-all'],
    queryFn: async () => {
      // 1. Legacy crops table
      const { data: crops, error: cropsErr } = await supabase
        .from('crops')
        .select('*')
        .order('created_at', { ascending: false });
      if (cropsErr) throw cropsErr;

      // 2. Farmer listings with catalog join
      const { data: listings, error: listErr } = await supabase
        .from('farmer_listings')
        .select('*, crop_catalog(*)')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      if (listErr) throw listErr;

      const unified: UnifiedCrop[] = [];

      // Track crop_ids from listings to avoid duplicates
      const listingCropIds = new Set(
        (listings || []).filter(l => l.crop_id).map(l => l.crop_id)
      );

      // Add legacy crops (skip if already represented by a listing)
      for (const c of crops || []) {
        if (listingCropIds.has(c.id)) continue;
        unified.push({
          id: c.id,
          source: 'crops',
          farmer_id: c.farmer_id,
          name: c.name,
          category: c.category,
          quantity: c.quantity,
          unit: c.unit,
          price: c.price,
          location: c.location,
          image: c.image || getCropImage(c.name),
          description: c.description,
          is_active: true,
          created_at: c.created_at,
        });
      }

      // Add catalog listings
      for (const l of listings || []) {
        const catalog = l.crop_catalog as any;
        unified.push({
          id: l.id,
          source: 'listing',
          farmer_id: l.farmer_id,
          name: catalog?.name || 'Unknown Crop',
          category: catalog?.category || 'Other',
          quantity: l.quantity,
          unit: l.unit,
          price: l.price,
          location: l.location,
          image: catalog?.default_image_url || getCropImage(catalog?.name || ''),
          description: l.description,
          is_active: l.is_active,
          created_at: l.created_at,
          crop_catalog_id: l.crop_catalog_id,
          crop_id: l.crop_id,
        });
      }

      return unified;
    },
  });
}

/** Fetch crops for the currently logged-in farmer (both sources) */
export function useFarmerUnifiedCrops() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['unified-crops-farmer', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data: crops, error: cropsErr } = await supabase
        .from('crops')
        .select('*')
        .eq('farmer_id', user.id)
        .order('created_at', { ascending: false });
      if (cropsErr) throw cropsErr;

      const { data: listings, error: listErr } = await supabase
        .from('farmer_listings')
        .select('*, crop_catalog(*)')
        .eq('farmer_id', user.id)
        .order('created_at', { ascending: false });
      if (listErr) throw listErr;

      const unified: UnifiedCrop[] = [];
      const listingCropIds = new Set(
        (listings || []).filter(l => l.crop_id).map(l => l.crop_id)
      );

      for (const c of crops || []) {
        if (listingCropIds.has(c.id)) continue;
        unified.push({
          id: c.id,
          source: 'crops',
          farmer_id: c.farmer_id,
          name: c.name,
          category: c.category,
          quantity: c.quantity,
          unit: c.unit,
          price: c.price,
          location: c.location,
          image: c.image || getCropImage(c.name),
          description: c.description,
          is_active: true,
          created_at: c.created_at,
        });
      }

      for (const l of listings || []) {
        const catalog = l.crop_catalog as any;
        unified.push({
          id: l.id,
          source: 'listing',
          farmer_id: l.farmer_id,
          name: catalog?.name || 'Unknown Crop',
          category: catalog?.category || 'Other',
          quantity: l.quantity,
          unit: l.unit,
          price: l.price,
          location: l.location,
          image: catalog?.default_image_url || getCropImage(catalog?.name || ''),
          description: l.description,
          is_active: l.is_active,
          created_at: l.created_at,
          crop_catalog_id: l.crop_catalog_id,
          crop_id: l.crop_id,
        });
      }

      return unified;
    },
    enabled: !!user,
  });
}
