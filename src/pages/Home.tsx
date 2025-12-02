import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sprout, Users, ShoppingCart, GraduationCap, TrendingUp, Shield } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground leading-tight">
              Connecting Farmers, Buyers & Agricultural Experts
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              AgroConnect brings together the agricultural community in one modern, trusted marketplace platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button size="lg" onClick={() => navigate('/auth?mode=register')} className="text-lg px-8">
                Get Started
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/marketplace')} className="text-lg px-8">
                Browse Marketplace
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Role Cards Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">
            Choose Your Role
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/auth?role=farmer')}>
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <Sprout className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-serif font-bold">Farmer</h3>
                <p className="text-muted-foreground">
                  List your crops, manage inventory, and connect directly with buyers
                </p>
                <Button variant="outline" className="w-full">Join as Farmer</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/auth?role=buyer')}>
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-serif font-bold">Buyer</h3>
                <p className="text-muted-foreground">
                  Browse fresh produce, compare prices, and buy directly from farmers
                </p>
                <Button variant="outline" className="w-full">Join as Buyer</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/auth?role=expert')}>
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-serif font-bold">Expert</h3>
                <p className="text-muted-foreground">
                  Share knowledge, answer questions, and help farmers succeed
                </p>
                <Button variant="outline" className="w-full">Join as Expert</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">
            Why Choose AgroConnect?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-accent/20 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Direct Connection</h3>
              <p className="text-muted-foreground">
                No middlemen. Connect farmers directly with buyers for fair prices
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-accent/20 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Trusted Platform</h3>
              <p className="text-muted-foreground">
                Verified users and secure transactions for peace of mind
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-accent/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Expert Guidance</h3>
              <p className="text-muted-foreground">
                Access agricultural expertise to improve yields and profits
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Ready to Transform Agriculture?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of farmers, buyers, and experts already using AgroConnect
          </p>
          <Button size="lg" variant="secondary" onClick={() => navigate('/auth?mode=register')} className="text-lg px-8">
            Create Your Account
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 AgroConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
