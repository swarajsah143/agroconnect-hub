import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, CheckCircle } from 'lucide-react';
import { useCropCatalog, useFarmerListings, useAddListing, CatalogCrop } from '@/hooks/useCropCatalog';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import CropImage from '@/components/CropImage';

const CropCatalogBrowser = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: catalog = [], isLoading: catalogLoading } = useCropCatalog();
  const { data: myListings = [] } = useFarmerListings();
  const addListing = useAddListing();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedCrop, setSelectedCrop] = useState<CatalogCrop | null>(null);
  const [listingForm, setListingForm] = useState({
    price: '',
    quantity: '',
    unit: 'kg',
    location: '',
    description: '',
  });

  // Set of catalog crop IDs already listed by this farmer
  const listedCatalogIds = new Set(myListings.map(l => l.crop_catalog_id).filter(Boolean));

  const categories = ['all', ...Array.from(new Set(catalog.map(c => c.category)))];

  const filtered = catalog.filter(crop => {
    const matchSearch = crop.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'all' || crop.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const handleListCrop = () => {
    if (!user || !selectedCrop) return;
    if (!listingForm.price || !listingForm.quantity || !listingForm.location) {
      toast({ variant: 'destructive', title: 'Missing fields', description: 'Fill in price, quantity, and location' });
      return;
    }
    addListing.mutate({
      farmer_id: user.id,
      crop_catalog_id: selectedCrop.id,
      price: Number(listingForm.price),
      quantity: Number(listingForm.quantity),
      unit: listingForm.unit,
      location: listingForm.location,
      description: listingForm.description || undefined,
    }, {
      onSuccess: () => {
        toast({ title: `${selectedCrop.name} listed successfully!` });
        setSelectedCrop(null);
        setListingForm({ price: '', quantity: '', unit: 'kg', location: '', description: '' });
      },
      onError: (err: any) => toast({ variant: 'destructive', title: 'Error', description: err.message }),
    });
  };

  if (catalogLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Crop Catalog</CardTitle>
          <p className="text-sm text-muted-foreground">Browse and list crops from the catalog, or add custom crops above.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search crops..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filtered.map(crop => {
              const isListed = listedCatalogIds.has(crop.id);
              return (
                <div
                  key={crop.id}
                  className={`relative border rounded-lg overflow-hidden transition-shadow hover:shadow-md ${isListed ? 'opacity-70' : 'cursor-pointer'}`}
                  onClick={() => !isListed && setSelectedCrop(crop)}
                >
                  <CropImage
                    cropName={crop.name}
                    imageUrl={crop.default_image_url}
                    className="aspect-square"
                  />
                  <div className="p-2">
                    <p className="font-medium text-sm truncate">{crop.name}</p>
                    <Badge variant="secondary" className="text-xs mt-1">{crop.category}</Badge>
                  </div>
                  {isListed && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-4">No crops found matching your search.</p>
          )}
        </CardContent>
      </Card>

      {/* Listing dialog */}
      <Dialog open={!!selectedCrop} onOpenChange={open => !open && setSelectedCrop(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>List {selectedCrop?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-3">
              {selectedCrop && (
                <CropImage
                  cropName={selectedCrop.name}
                  imageUrl={selectedCrop.default_image_url}
                  className="w-16 h-16 rounded"
                />
              )}
              <div>
                <p className="font-semibold">{selectedCrop?.name}</p>
                <Badge variant="secondary">{selectedCrop?.category}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Price (₹) *</Label>
                <Input
                  type="number"
                  value={listingForm.price}
                  onChange={e => setListingForm({ ...listingForm, price: e.target.value })}
                  placeholder="e.g., 45"
                />
              </div>
              <div className="space-y-1">
                <Label>Quantity *</Label>
                <Input
                  type="number"
                  value={listingForm.quantity}
                  onChange={e => setListingForm({ ...listingForm, quantity: e.target.value })}
                  placeholder="e.g., 500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Unit</Label>
                <Select value={listingForm.unit} onValueChange={v => setListingForm({ ...listingForm, unit: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilograms (kg)</SelectItem>
                    <SelectItem value="ton">Tons</SelectItem>
                    <SelectItem value="quintal">Quintals</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Location *</Label>
                <Input
                  value={listingForm.location}
                  onChange={e => setListingForm({ ...listingForm, location: e.target.value })}
                  placeholder="e.g., Punjab"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label>Description</Label>
              <Textarea
                value={listingForm.description}
                onChange={e => setListingForm({ ...listingForm, description: e.target.value })}
                placeholder="Optional description"
                rows={2}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setSelectedCrop(null)}>Cancel</Button>
              <Button onClick={handleListCrop} disabled={addListing.isPending}>
                {addListing.isPending ? 'Listing...' : 'List Crop'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CropCatalogBrowser;
