-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('farmer', 'buyer', 'expert')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Create crops table
CREATE TABLE public.crops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg',
  price DECIMAL(10,2) NOT NULL,
  location TEXT NOT NULL,
  image TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on crops
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;

-- Crops policies
CREATE POLICY "Crops are viewable by everyone" 
ON public.crops FOR SELECT USING (true);

CREATE POLICY "Farmers can insert their own crops" 
ON public.crops FOR INSERT WITH CHECK (auth.uid() = farmer_id);

CREATE POLICY "Farmers can update their own crops" 
ON public.crops FOR UPDATE USING (auth.uid() = farmer_id);

CREATE POLICY "Farmers can delete their own crops" 
ON public.crops FOR DELETE USING (auth.uid() = farmer_id);

-- Create negotiations table for bargaining sessions
CREATE TABLE public.negotiations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_id UUID NOT NULL REFERENCES public.crops(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL,
  farmer_id UUID NOT NULL,
  initial_price DECIMAL(10,2) NOT NULL,
  current_offer DECIMAL(10,2),
  offered_by UUID,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'accepted', 'rejected', 'cancelled')),
  final_price DECIMAL(10,2),
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on negotiations
ALTER TABLE public.negotiations ENABLE ROW LEVEL SECURITY;

-- Negotiations policies
CREATE POLICY "Participants can view their negotiations" 
ON public.negotiations FOR SELECT 
USING (auth.uid() = buyer_id OR auth.uid() = farmer_id);

CREATE POLICY "Buyers can start negotiations" 
ON public.negotiations FOR INSERT 
WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Participants can update their negotiations" 
ON public.negotiations FOR UPDATE 
USING (auth.uid() = buyer_id OR auth.uid() = farmer_id);

-- Create negotiation messages table for chat
CREATE TABLE public.negotiation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  negotiation_id UUID NOT NULL REFERENCES public.negotiations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  message TEXT,
  offer_amount DECIMAL(10,2),
  message_type TEXT NOT NULL DEFAULT 'message' CHECK (message_type IN ('message', 'offer', 'counter_offer', 'accept', 'reject')),
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on negotiation_messages
ALTER TABLE public.negotiation_messages ENABLE ROW LEVEL SECURITY;

-- Messages policies
CREATE POLICY "Participants can view messages" 
ON public.negotiation_messages FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.negotiations n 
    WHERE n.id = negotiation_id 
    AND (n.buyer_id = auth.uid() OR n.farmer_id = auth.uid())
  )
);

CREATE POLICY "Participants can send messages" 
ON public.negotiation_messages FOR INSERT 
WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.negotiations n 
    WHERE n.id = negotiation_id 
    AND (n.buyer_id = auth.uid() OR n.farmer_id = auth.uid())
  )
);

CREATE POLICY "Participants can update message read status" 
ON public.negotiation_messages FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.negotiations n 
    WHERE n.id = negotiation_id 
    AND (n.buyer_id = auth.uid() OR n.farmer_id = auth.uid())
  )
);

-- Enable realtime for negotiations and messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.negotiations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.negotiation_messages;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_crops_updated_at
BEFORE UPDATE ON public.crops
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_negotiations_updated_at
BEFORE UPDATE ON public.negotiations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();