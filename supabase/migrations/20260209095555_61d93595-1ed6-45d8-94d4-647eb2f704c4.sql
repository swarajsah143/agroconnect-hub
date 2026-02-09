-- Create orders table for buyer-farmer communication
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID NOT NULL,
  farmer_id UUID NOT NULL,
  crop_id UUID REFERENCES public.crops(id) ON DELETE SET NULL,
  crop_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_replies table for conversation
CREATE TABLE public.order_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  message TEXT NOT NULL,
  reply_type TEXT NOT NULL DEFAULT 'message',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_replies ENABLE ROW LEVEL SECURITY;

-- RLS Policies for orders table
-- Buyers can view their own orders
CREATE POLICY "Buyers can view their own orders"
ON public.orders
FOR SELECT
USING (auth.uid() = buyer_id);

-- Farmers can view orders sent to them
CREATE POLICY "Farmers can view orders sent to them"
ON public.orders
FOR SELECT
USING (auth.uid() = farmer_id);

-- Buyers can create orders
CREATE POLICY "Buyers can create orders"
ON public.orders
FOR INSERT
WITH CHECK (auth.uid() = buyer_id);

-- Farmers can update order status
CREATE POLICY "Farmers can update orders sent to them"
ON public.orders
FOR UPDATE
USING (auth.uid() = farmer_id);

-- RLS Policies for order_replies table
-- Both parties can view replies on their orders
CREATE POLICY "Participants can view order replies"
ON public.order_replies
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_replies.order_id
    AND (o.buyer_id = auth.uid() OR o.farmer_id = auth.uid())
  )
);

-- Both parties can send replies
CREATE POLICY "Participants can send order replies"
ON public.order_replies
FOR INSERT
WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_replies.order_id
    AND (o.buyer_id = auth.uid() OR o.farmer_id = auth.uid())
  )
);

-- Create updated_at trigger for orders
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable real-time for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_replies;