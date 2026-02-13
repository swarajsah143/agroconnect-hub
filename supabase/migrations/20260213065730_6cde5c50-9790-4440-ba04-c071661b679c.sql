
-- Create crop catalog table (master list of all known crops)
CREATE TABLE public.crop_catalog (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  default_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.crop_catalog ENABLE ROW LEVEL SECURITY;

-- Everyone can read the catalog
CREATE POLICY "Catalog is viewable by everyone"
  ON public.crop_catalog FOR SELECT
  USING (true);

-- Create farmer_listings join table
CREATE TABLE public.farmer_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_id UUID NOT NULL,
  crop_catalog_id UUID REFERENCES public.crop_catalog(id) ON DELETE CASCADE,
  crop_id UUID REFERENCES public.crops(id) ON DELETE CASCADE,
  price NUMERIC NOT NULL,
  quantity INTEGER NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg',
  location TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT listing_has_source CHECK (crop_catalog_id IS NOT NULL OR crop_id IS NOT NULL)
);

-- Enable RLS
ALTER TABLE public.farmer_listings ENABLE ROW LEVEL SECURITY;

-- Everyone can view active listings
CREATE POLICY "Active listings are viewable by everyone"
  ON public.farmer_listings FOR SELECT
  USING (true);

-- Farmers can manage their own listings
CREATE POLICY "Farmers can insert their own listings"
  ON public.farmer_listings FOR INSERT
  WITH CHECK (auth.uid() = farmer_id);

CREATE POLICY "Farmers can update their own listings"
  ON public.farmer_listings FOR UPDATE
  USING (auth.uid() = farmer_id);

CREATE POLICY "Farmers can delete their own listings"
  ON public.farmer_listings FOR DELETE
  USING (auth.uid() = farmer_id);

-- Trigger for updated_at
CREATE TRIGGER update_farmer_listings_updated_at
  BEFORE UPDATE ON public.farmer_listings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed the crop catalog
INSERT INTO public.crop_catalog (name, category, default_image_url) VALUES
  -- Vegetables
  ('Potato', 'Vegetables', 'https://images.unsplash.com/photo-1518977676601-b53f82ber630?w=400'),
  ('Onion', 'Vegetables', 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400'),
  ('Tomato', 'Vegetables', 'https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=400'),
  ('Cabbage', 'Vegetables', 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400'),
  ('Cauliflower', 'Vegetables', 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400'),
  ('Carrot', 'Vegetables', 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400'),
  ('Spinach', 'Vegetables', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400'),
  ('Brinjal', 'Vegetables', 'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=400'),
  ('Capsicum', 'Vegetables', 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400'),
  ('Green Chilli', 'Vegetables', 'https://images.unsplash.com/photo-1588252303782-cb80119abd6c?w=400'),
  -- Fruits
  ('Apple', 'Fruits', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400'),
  ('Banana', 'Fruits', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400'),
  ('Mango', 'Fruits', 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400'),
  ('Orange', 'Fruits', 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400'),
  ('Grapes', 'Fruits', 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400'),
  ('Papaya', 'Fruits', 'https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=400'),
  ('Pomegranate', 'Fruits', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400'),
  ('Guava', 'Fruits', 'https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?w=400'),
  ('Watermelon', 'Fruits', 'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=400'),
  -- Grains
  ('Rice', 'Grains', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'),
  ('Wheat', 'Grains', 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400'),
  ('Maize', 'Grains', 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400'),
  ('Barley', 'Grains', 'https://images.unsplash.com/photo-1631898039984-fd5e255c4253?w=400'),
  -- Pulses
  ('Lentils', 'Pulses', 'https://images.unsplash.com/photo-1585011664466-b7bbe92f34ef?w=400'),
  ('Chickpeas', 'Pulses', 'https://images.unsplash.com/photo-1612257416648-ee7a6c5b16a4?w=400'),
  ('Green Gram', 'Pulses', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400'),
  ('Black Gram', 'Pulses', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400'),
  -- Spices
  ('Ginger', 'Spices', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400'),
  ('Garlic', 'Spices', 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=400'),
  ('Turmeric', 'Spices', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400'),
  ('Coriander', 'Spices', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400');
