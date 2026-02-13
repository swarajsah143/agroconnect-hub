import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, DollarSign, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import StartBargainingModal from '@/components/bargaining/StartBargainingModal';
import PlaceOrderModal from '@/components/orders/PlaceOrderModal';
import { useAllCrops, CropRow } from '@/hooks/useCrops';
import { getCropImage } from '@/utils/cropImages';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedCrop, setSelectedCrop] = useState<CropRow | null>(null);
  const [bargainModalOpen, setBargainModalOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderCrop, setOrderCrop] = useState<CropRow | null>(null);
  const { user, profile, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: crops = [], isLoading } = useAllCrops();

  // Fetch farmer profiles for display names
  const farmerIds = [...new Set(crops.map(c => c.farmer_id))];
  const { data: profiles = [] } = useQuery({
    queryKey: ['profiles', farmerIds],
    queryFn: async () => {
      if (farmerIds.length === 0) return [];
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, name')
        .in('user_id', farmerIds);
      if (error) throw error;
      return data;
    },
    enabled: farmerIds.length > 0,
  });

  const farmerNameMap = Object.fromEntries(profiles.map(p => [p.user_id, p.name]));

  const filteredCrops = crops.filter((crop) => {
    const farmerName = farmerNameMap[crop.farmer_id] || '';
    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         farmerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || crop.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(crops.map(c => c.category)))];

  const handleBargain = (crop: CropRow) => {
    if (!isAuthenticated) {
      toast({ title: t.marketplace.loginRequired, description: t.marketplace.loginToBargain });
      navigate('/auth?role=buyer');
      return;
    }
    if (profile?.role !== 'buyer') {
      toast({ variant: 'destructive', title: t.marketplace.accessDenied, description: t.marketplace.onlyBuyers });
      return;
    }
    setSelectedCrop(crop);
    setBargainModalOpen(true);
  };

  const handlePlaceOrder = (crop: CropRow) => {
    if (!isAuthenticated) {
      toast({ title: t.marketplace.loginRequired, description: t.marketplace.loginToBargain });
      navigate('/auth?role=buyer');
      return;
    }
    if (profile?.role !== 'buyer') {
      toast({ variant: 'destructive', title: t.marketplace.accessDenied, description: t.marketplace.onlyBuyers });
      return;
    }
    setOrderCrop(crop);
    setOrderModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold mb-4">{t.marketplace.title}</h1>
          <p className="text-muted-foreground">{t.marketplace.subtitle}</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder={t.marketplace.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder={t.marketplace.allCategories} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat === 'all' ? t.marketplace.allCategories : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <>
            {/* Crops Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCrops.map((crop) => {
                const farmerName = farmerNameMap[crop.farmer_id] || 'Farmer';
                return (
                  <Card key={crop.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={crop.image || getCropImage(crop.name)}
                        alt={crop.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-5 space-y-3">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{crop.name}</h3>
                        <p className="text-sm text-muted-foreground">{crop.description}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {crop.location}
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-2xl font-bold text-primary">₹{crop.price}</p>
                          <p className="text-sm text-muted-foreground">{t.marketplace.perUnit} {crop.unit}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{crop.quantity} {crop.unit}</p>
                          <p className="text-sm text-muted-foreground">{t.marketplace.available}</p>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-border">
                        <p className="text-sm">
                          <span className="text-muted-foreground">{t.marketplace.seller}:</span>{' '}
                          <span className="font-medium">{farmerName}</span>
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="p-5 pt-0 flex gap-2">
                      <Button variant="default" className="flex-1" onClick={() => handleBargain(crop)}>
                        <DollarSign className="w-4 h-4 mr-2" />
                        {t.marketplace.negotiatePrice}
                      </Button>
                      <Button variant="outline" onClick={() => handlePlaceOrder(crop)}>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Order
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>

            {filteredCrops.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">{t.marketplace.noResults}</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bargaining Modal */}
      {selectedCrop && (
        <StartBargainingModal
          crop={{
            id: selectedCrop.id,
            farmer_id: selectedCrop.farmer_id,
            name: selectedCrop.name,
            price: selectedCrop.price,
            quantity: selectedCrop.quantity,
            unit: selectedCrop.unit,
            image: selectedCrop.image || undefined,
            farmer_name: farmerNameMap[selectedCrop.farmer_id] || 'Farmer'
          }}
          open={bargainModalOpen}
          onOpenChange={setBargainModalOpen}
          onSuccess={() => {
            toast({ title: t.marketplace.negotiationStarted, description: t.marketplace.checkDashboard });
            navigate('/buyer-dashboard');
          }}
        />
      )}

      {/* Place Order Modal */}
      {orderCrop && (
        <PlaceOrderModal
          crop={{
            id: orderCrop.id,
            farmer_id: orderCrop.farmer_id,
            name: orderCrop.name,
            price: orderCrop.price,
            quantity: orderCrop.quantity,
            unit: orderCrop.unit,
            farmer_name: farmerNameMap[orderCrop.farmer_id] || 'Farmer'
          }}
          open={orderModalOpen}
          onOpenChange={setOrderModalOpen}
          onSuccess={() => navigate('/buyer-dashboard')}
        />
      )}
    </div>
  );
};

export default Marketplace;
