import { useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Camera, Loader2, Mail, Phone, Calendar, Pencil, Sprout, ShoppingBag, GraduationCap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const roleMeta: Record<string, { label: string; icon: typeof Sprout; color: string }> = {
  farmer: { label: 'Farmer', icon: Sprout, color: 'bg-green-500/15 text-green-500' },
  buyer: { label: 'Buyer', icon: ShoppingBag, color: 'bg-blue-500/15 text-blue-500' },
  expert: { label: 'Expert', icon: GraduationCap, color: 'bg-purple-500/15 text-purple-500' },
};

const ProfileCard = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [signedAvatarUrl, setSignedAvatarUrl] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: profile?.name || '',
    phone: profile?.phone || '',
    bio: profile?.bio || '',
  });

  // Resolve signed URL for private avatar bucket
  const resolveAvatar = async (path: string | null | undefined) => {
    if (!path) { setSignedAvatarUrl(null); return; }
    const { data } = await supabase.storage.from('avatars').createSignedUrl(path, 3600);
    setSignedAvatarUrl(data?.signedUrl ?? null);
  };

  // Re-resolve when avatar_url changes
  if (profile?.avatar_url && !signedAvatarUrl) {
    void resolveAvatar(profile.avatar_url);
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({ variant: 'destructive', title: 'File too large', description: 'Please choose an image under 5MB.' });
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `${user.id}/avatar-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true, contentType: file.type });
      if (uploadError) throw uploadError;

      // Remove old avatar
      if (profile?.avatar_url && profile.avatar_url !== path) {
        await supabase.storage.from('avatars').remove([profile.avatar_url]);
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: path })
        .eq('user_id', user.id);
      if (updateError) throw updateError;

      setSignedAvatarUrl(null);
      await resolveAvatar(path);
      await refreshProfile();
      toast({ title: 'Profile photo updated' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      toast({ variant: 'destructive', title: 'Upload failed', description: msg });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (!user) return;
    if (!form.name.trim()) {
      toast({ variant: 'destructive', title: 'Name required' });
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ name: form.name.trim(), phone: form.phone.trim() || null, bio: form.bio.trim() || null })
        .eq('user_id', user.id);
      if (error) throw error;
      await refreshProfile();
      toast({ title: 'Profile updated' });
      setEditOpen(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Update failed';
      toast({ variant: 'destructive', title: 'Update failed', description: msg });
    } finally {
      setSaving(false);
    }
  };

  if (!profile || !user) return null;

  const meta = roleMeta[profile.role] || roleMeta.farmer;
  const Icon = meta.icon;
  const initials = profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  const joined = new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long' });

  return (
    <Card className="overflow-hidden">
      <div className="h-24 bg-gradient-to-r from-primary/30 via-primary/15 to-accent/20" />
      <CardContent className="pt-0 -mt-12">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="relative group">
            <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
              <AvatarImage src={signedAvatarUrl ?? undefined} alt={profile.name} />
              <AvatarFallback className="text-2xl font-semibold bg-primary/20 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:scale-110 transition-transform disabled:opacity-60"
              aria-label="Change photo"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          </div>

          <div className="flex-1 pt-12 sm:pt-14 w-full">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-serif font-bold">{profile.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`${meta.color} border-0`}>
                    <Icon className="w-3 h-3 mr-1" />
                    {meta.label}
                  </Badge>
                </div>
              </div>

              <Dialog open={editOpen} onOpenChange={(o) => { setEditOpen(o); if (o) setForm({ name: profile.name, phone: profile.phone || '', bio: profile.bio || '' }); }}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm"><Pencil className="w-4 h-4 mr-2" /> Edit Profile</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Edit Profile</DialogTitle></DialogHeader>
                  <div className="space-y-4 py-2">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 9876543210" />
                    </div>
                    <div className="space-y-2">
                      <Label>Bio</Label>
                      <Textarea rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Tell others about yourself" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} disabled={saving}>
                      {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving</> : 'Save'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 mt-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" /> <span className="truncate">{user.email}</span>
              </div>
              {profile.phone && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" /> {profile.phone}
                </div>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" /> Joined {joined}
              </div>
            </div>

            {profile.bio && (
              <p className="mt-4 text-sm text-foreground/80 leading-relaxed">{profile.bio}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;