import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockCrops, Crop } from '@/data/mockData';
import { Plus, Edit, Trash2, MessageCircle } from 'lucide-react';
import NegotiationsList from '@/components/bargaining/NegotiationsList';
import IncomingOrders from '@/components/orders/IncomingOrders';
import { useToast } from '@/hooks/use-toast';

const FarmerDashboard = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Vegetables',
    quantity: '',
    unit: 'kg',
    price: '',
    location: '',
    description: ''
  });

  useEffect(() => {
    if (!loading && (!user || profile?.role !== 'farmer')) {
      navigate('/auth?role=farmer');
      return;
    }
    // Load farmer's crops
    if (user) {
      setCrops(mockCrops.filter(c => c.farmerId === user.id));
    }
  }, [user, profile, loading, navigate]);

  const handleSubmit = () => {
    if (!formData.name || !formData.quantity || !formData.price || !formData.location) {
      toast({
        variant: 'destructive',
        title: 'Missing fields',
        description: 'Please fill in all required fields',
      });
      return;
    }

    const newCrop: Crop = {
      id: Date.now().toString(),
      farmerId: user!.id,
      farmerName: profile?.name || 'Farmer',
      name: formData.name,
      category: formData.category,
      quantity: Number(formData.quantity),
      unit: formData.unit,
      price: Number(formData.price),
      location: formData.location,
      description: formData.description,
      image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400'
    };

    if (editingCrop) {
      setCrops(crops.map(c => c.id === editingCrop.id ? { ...newCrop, id: editingCrop.id } : c));
      toast({ title: 'Crop updated successfully!' });
    } else {
      setCrops([...crops, newCrop]);
      toast({ title: 'Crop added successfully!' });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Vegetables',
      quantity: '',
      unit: 'kg',
      price: '',
      location: '',
      description: ''
    });
    setEditingCrop(null);
    setDialogOpen(false);
  };

  const handleEdit = (crop: Crop) => {
    setEditingCrop(crop);
    setFormData({
      name: crop.name,
      category: crop.category,
      quantity: crop.quantity.toString(),
      unit: crop.unit,
      price: crop.price.toString(),
      location: crop.location,
      description: crop.description
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setCrops(crops.filter(c => c.id !== id));
    toast({ title: 'Crop deleted successfully' });
  };

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">Farmer Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {profile?.name}!</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingCrop(null); resetForm(); }}>
                <Plus className="w-4 h-4 mr-2" />
                Add New Crop
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingCrop ? 'Edit Crop' : 'Add New Crop'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Crop Name *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Organic Tomatoes"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Vegetables">Vegetables</SelectItem>
                        <SelectItem value="Fruits">Fruits</SelectItem>
                        <SelectItem value="Grains">Grains</SelectItem>
                        <SelectItem value="Pulses">Pulses</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Quantity *</Label>
                    <Input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      placeholder="e.g., 500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Unit</Label>
                    <Select value={formData.unit} onValueChange={(v) => setFormData({ ...formData, unit: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">Kilograms (kg)</SelectItem>
                        <SelectItem value="ton">Tons</SelectItem>
                        <SelectItem value="quintal">Quintals</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Price per unit (₹) *</Label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="e.g., 45"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Location *</Label>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g., Punjab"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of your crop"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={resetForm}>Cancel</Button>
                  <Button onClick={handleSubmit}>
                    {editingCrop ? 'Update Crop' : 'Add Crop'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{crops.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Quantity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{crops.reduce((acc, c) => acc + c.quantity, 0)} kg</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Inquiries</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">12</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">₹{crops.reduce((acc, c) => acc + (c.quantity * c.price), 0).toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        {/* Crops List */}
        <Card>
          <CardHeader>
            <CardTitle>My Crops</CardTitle>
          </CardHeader>
          <CardContent>
            {crops.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="mb-4">You haven't added any crops yet</p>
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Crop
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {crops.map((crop) => (
                  <div key={crop.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4 flex-1">
                      <img src={crop.image} alt={crop.name} className="w-16 h-16 rounded object-cover" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{crop.name}</h3>
                        <p className="text-sm text-muted-foreground">{crop.category} • {crop.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">₹{crop.price}/{crop.unit}</p>
                        <p className="text-sm text-muted-foreground">{crop.quantity} {crop.unit} available</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(crop)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(crop.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Negotiations */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Price Negotiations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <NegotiationsList />
          </CardContent>
        </Card>

        {/* Incoming Orders - Real-time */}
        <div className="mt-8">
          <IncomingOrders />
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
