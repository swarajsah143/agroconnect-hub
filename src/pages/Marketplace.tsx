import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockCrops, Crop } from '@/data/mockData';
import { Search, MapPin, MessageCircle, DollarSign } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import StartBargainingModal from '@/components/bargaining/StartBargainingModal';

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [bargainModalOpen, setBargainModalOpen] = useState(false);
  const { user, profile, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const filteredCrops = mockCrops.filter((crop) => {
    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         crop.farmerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || crop.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(mockCrops.map(c => c.category)))];

  const handleBargain = (crop: Crop) => {
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please login as a buyer to start bargaining.',
      });
      navigate('/auth?role=buyer');
      return;
    }
    
    if (profile?.role !== 'buyer') {
      toast({
        variant: 'destructive',
        title: 'Access Denied',
        description: 'Only buyers can negotiate prices.',
      });
      return;
    }

    setSelectedCrop(crop);
    setBargainModalOpen(true);
  };

  const handleInquire = (crop: Crop) => {
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please login as a buyer to send inquiries.',
      });
      navigate('/auth?role=buyer');
      return;
    }
    
    if (profile?.role !== 'buyer') {
      toast({
        variant: 'destructive',
        title: 'Access Denied',
        description: 'Only buyers can send inquiries.',
      });
      return;
    }

    toast({
      title: 'Inquiry Sent!',
      description: `Your inquiry for ${crop.name} has been sent to ${crop.farmerName}.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold mb-4">Marketplace</h1>
          <p className="text-muted-foreground">Browse fresh produce directly from farmers</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search crops or farmers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Crops Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrops.map((crop) => (
            <Card key={crop.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video overflow-hidden">
                <img
                  src={crop.image}
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
                    <p className="text-sm text-muted-foreground">per {crop.unit}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{crop.quantity} {crop.unit}</p>
                    <p className="text-sm text-muted-foreground">available</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-border">
                  <p className="text-sm">
                    <span className="text-muted-foreground">Seller:</span>{' '}
                    <span className="font-medium">{crop.farmerName}</span>
                  </p>
                </div>
              </CardContent>
              <CardFooter className="p-5 pt-0 flex gap-2">
                <Button 
                  variant="default"
                  className="flex-1" 
                  onClick={() => handleBargain(crop)}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Negotiate Price
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleInquire(crop)}
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredCrops.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No crops found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Bargaining Modal */}
      {selectedCrop && (
        <StartBargainingModal
          crop={{
            id: selectedCrop.id,
            farmer_id: selectedCrop.farmerId,
            name: selectedCrop.name,
            price: selectedCrop.price,
            quantity: selectedCrop.quantity,
            unit: selectedCrop.unit,
            image: selectedCrop.image,
            farmer_name: selectedCrop.farmerName
          }}
          open={bargainModalOpen}
          onOpenChange={setBargainModalOpen}
          onSuccess={() => {
            toast({
              title: 'Negotiation Started',
              description: 'Check your dashboard to continue the conversation.'
            });
            navigate('/buyer-dashboard');
          }}
        />
      )}
    </div>
  );
};

export default Marketplace;
