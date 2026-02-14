-- Make negotiations.crop_id nullable to support catalog-only listings
ALTER TABLE public.negotiations ALTER COLUMN crop_id DROP NOT NULL;
