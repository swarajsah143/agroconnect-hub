import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, MessageCircle, TrendingUp, Package } from 'lucide-react';
import NegotiationsList from '@/components/bargaining/NegotiationsList';
import MyOrders from '@/components/orders/MyOrders';
import { useAllCrops } from '@/hooks/useCrops';
import { getCropImage } from '@/utils/cropImages';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const BuyerDashboard = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const { data: crops = [] } = useAllCrops();

  // Fetch farmer profiles for recommended crops
  const farmerIds = [...new Set(crops.map(c => c.farmer_id))];
  const { data: profiles = [] } = useQuery({
    queryKey: ['profiles', farmerIds],
    queryFn: async () => {
      if (farmerIds.length === 0) return [];
      const { data, error } = await supabase.from('profiles').select('user_id, name').in('user_id', farmerIds);
      if (error) throw error;
      return data;
    },
    enabled: farmerIds.length > 0,
  });
  const farmerNameMap = Object.fromEntries(profiles.map(p => [p.user_id, p.name]));

  useEffect(() => {
    if (!loading && (!user || profile?.role !== 'buyer')) {
      navigate('/auth?role=buyer');
    }
  }, [user, profile, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold mb-2">Buyer Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {profile?.name}!</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">Active Inquiries</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold">8</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">Completed Orders</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold">24</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold">₹1.2L</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">Saved</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold">₹18K</p></CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/marketplace')}>
            <CardContent className="p-6 text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Browse Marketplace</h3>
              <p className="text-sm text-muted-foreground">Find fresh produce from farmers</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">My Inquiries</h3>
              <p className="text-sm text-muted-foreground">View and manage your inquiries</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Order History</h3>
              <p className="text-sm text-muted-foreground">Track your past purchases</p>
            </CardContent>
          </Card>
        </div>

        {/* My Orders */}
        <div className="mb-8">
          <MyOrders />
        </div>

        {/* Negotiations */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              My Negotiations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <NegotiationsList />
          </CardContent>
        </Card>

        {/* Recommended Products - from Supabase */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Recommended for You
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {crops.slice(0, 3).map((crop) => (
                <div key={crop.id} className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <img src={crop.image || getCropImage(crop.name)} alt={crop.name} className="w-full h-40 object-cover" />
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold">{crop.name}</h3>
                    <p className="text-sm text-muted-foreground">{farmerNameMap[crop.farmer_id] || 'Farmer'}</p>
                    <div className="flex justify-between items-center pt-2">
                      <p className="text-lg font-bold text-primary">₹{crop.price}/{crop.unit}</p>
                      <Button size="sm" onClick={() => navigate('/marketplace')}>Inquire</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BuyerDashboard;
