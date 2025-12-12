-- Create table for OTP verifications
CREATE TABLE public.otp_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  otp_hash TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;

-- Allow inserting OTPs (public access for registration flow)
CREATE POLICY "Allow insert OTPs"
ON public.otp_verifications
FOR INSERT
WITH CHECK (true);

-- Allow updating OTPs (for verification attempts)
CREATE POLICY "Allow update OTPs"
ON public.otp_verifications
FOR UPDATE
USING (true);

-- Allow selecting OTPs (for verification)
CREATE POLICY "Allow select OTPs"
ON public.otp_verifications
FOR SELECT
USING (true);

-- Create index for faster email lookups
CREATE INDEX idx_otp_verifications_email ON public.otp_verifications(email);

-- Create function to clean up expired OTPs (can be called periodically)
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.otp_verifications WHERE expires_at < now();
END;
$$;