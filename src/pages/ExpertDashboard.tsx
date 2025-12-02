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
import { mockExpertPosts, mockQuestions, ExpertPost } from '@/data/mockData';
import { Plus, ThumbsUp, MessageSquare, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ExpertDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [posts, setPosts] = useState<ExpertPost[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Farming Techniques'
  });

  useEffect(() => {
    if (!user || user.role !== 'expert') {
      navigate('/auth?role=expert');
      return;
    }
    // Load expert's posts
    setPosts(mockExpertPosts.filter(p => p.expertId === user.id));
  }, [user, navigate]);

  const handleSubmit = () => {
    if (!formData.title || !formData.content) {
      toast({
        variant: 'destructive',
        title: 'Missing fields',
        description: 'Please fill in all required fields',
      });
      return;
    }

    const newPost: ExpertPost = {
      id: Date.now().toString(),
      expertId: user!.id,
      expertName: user!.name,
      title: formData.title,
      content: formData.content,
      category: formData.category,
      createdAt: new Date().toISOString().split('T')[0],
      likes: 0
    };

    setPosts([newPost, ...posts]);
    toast({ title: 'Post published successfully!' });

    setFormData({
      title: '',
      content: '',
      category: 'Farming Techniques'
    });
    setDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">Expert Dashboard</h1>
            <p className="text-muted-foreground">Welcome, {user?.name}!</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Best Practices for Organic Farming"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Farming Techniques">Farming Techniques</SelectItem>
                      <SelectItem value="Crop Health">Crop Health</SelectItem>
                      <SelectItem value="Sustainability">Sustainability</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Market Trends">Market Trends</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Content *</Label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Share your expertise and insights..."
                    rows={8}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleSubmit}>Publish Post</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{posts.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Likes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{posts.reduce((acc, p) => acc + p.likes, 0)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Questions Answered</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">46</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Followers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">234</p>
            </CardContent>
          </Card>
        </div>

        {/* Questions from Farmers */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Recent Questions from Farmers
              </CardTitle>
              <Button variant="outline" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockQuestions.map((question) => (
                <div key={question.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{question.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{question.content}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Asked by {question.farmerName}</span>
                        <span>•</span>
                        <span>{question.answers} answers</span>
                        <span>•</span>
                        <span>{question.createdAt}</span>
                      </div>
                    </div>
                    <Button size="sm">Answer</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* My Posts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              My Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {posts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="mb-4">You haven't created any posts yet</p>
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Post
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {[...posts, ...mockExpertPosts].map((post) => (
                  <div key={post.id} className="p-6 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{post.category}</span>
                          <span className="text-sm text-muted-foreground">{post.createdAt}</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                        <p className="text-muted-foreground mb-4">{post.content}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{post.likes} likes</span>
                      </div>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExpertDashboard;
