import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockCrops } from '@/data/mockData';
import { ShoppingCart, MessageCircle, TrendingUp, Package } from 'lucide-react';
import NegotiationsList from '@/components/bargaining/NegotiationsList';

const BuyerDashboard = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

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
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Inquiries</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">8</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">24</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">₹1.2L</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Saved</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">₹18K</p>
            </CardContent>
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

        {/* Recent Inquiries */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>My Recent Inquiries</CardTitle>
              <Button variant="outline" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-4">
                  <img 
                    src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=100" 
                    alt="Tomatoes"
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div>
                    <p className="font-semibold">Organic Tomatoes</p>
                    <p className="text-sm text-muted-foreground">John Farmer • 200 kg requested</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm bg-accent/20 text-accent-foreground px-3 py-1 rounded-full">Pending</span>
                  <Button size="sm" variant="outline">View</Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-4">
                  <img 
                    src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=100" 
                    alt="Wheat"
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div>
                    <p className="font-semibold">Wheat</p>
                    <p className="text-sm text-muted-foreground">Sarah Green • 500 kg requested</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm bg-primary/20 text-primary px-3 py-1 rounded-full">Responded</span>
                  <Button size="sm" variant="outline">View</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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

        {/* Recommended Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Recommended for You
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {mockCrops.slice(0, 3).map((crop) => (
                <div key={crop.id} className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <img src={crop.image} alt={crop.name} className="w-full h-40 object-cover" />
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold">{crop.name}</h3>
                    <p className="text-sm text-muted-foreground">{crop.farmerName}</p>
                    <div className="flex justify-between items-center pt-2">
                      <p className="text-lg font-bold text-primary">₹{crop.price}/{crop.unit}</p>
                      <Button size="sm">Inquire</Button>
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
