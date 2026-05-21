
-- OTP verifications: remove all public access; only service role (which bypasses RLS) should access
DROP POLICY IF EXISTS "Allow insert OTPs" ON public.otp_verifications;
DROP POLICY IF EXISTS "Allow select OTPs" ON public.otp_verifications;
DROP POLICY IF EXISTS "Allow update OTPs" ON public.otp_verifications;

-- Profiles: restrict SELECT to authenticated users only
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles viewable by authenticated users"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Negotiation messages: allow senders to delete their own messages within 5 minutes
CREATE POLICY "Senders can delete their own recent messages"
ON public.negotiation_messages
FOR DELETE
TO authenticated
USING (auth.uid() = sender_id AND created_at > now() - interval '5 minutes');
