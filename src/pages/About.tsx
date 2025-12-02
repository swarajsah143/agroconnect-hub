import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Eye, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Hero */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-serif font-bold">About AgroConnect</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Empowering farmers, connecting buyers, and fostering agricultural excellence through technology
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-8 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-serif font-bold">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To revolutionize agricultural trade by creating a transparent, efficient, and fair marketplace 
                  that directly connects farmers with buyers, eliminating intermediaries and ensuring better prices 
                  for both parties.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-serif font-bold">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To become India's most trusted agricultural platform, where every farmer has access to fair markets, 
                  expert guidance, and modern tools to maximize their yields and income while ensuring buyers get 
                  fresh, quality produce.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* What We Do */}
          <div className="space-y-6">
            <h2 className="text-3xl font-serif font-bold text-center">What We Do</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto bg-secondary rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Connect</h3>
                <p className="text-muted-foreground">
                  Bridge the gap between farmers and buyers through our easy-to-use platform
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto bg-secondary rounded-full flex items-center justify-center">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Empower</h3>
                <p className="text-muted-foreground">
                  Provide farmers with tools and knowledge to improve their farming practices
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto bg-secondary rounded-full flex items-center justify-center">
                  <Eye className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Transform</h3>
                <p className="text-muted-foreground">
                  Modernize agricultural trade with transparent pricing and direct communication
                </p>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="space-y-6">
            <h2 className="text-3xl font-serif font-bold text-center">Our Team</h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto">
              AgroConnect is built by a passionate team of agricultural experts, technologists, and entrepreneurs 
              committed to transforming India's agricultural landscape.
            </p>
            <div className="grid md:grid-cols-4 gap-6 pt-6">
              {[
                { name: 'Rajesh Kumar', role: 'Founder & CEO', bg: 'from-primary/20 to-primary/5' },
                { name: 'Priya Singh', role: 'Chief Technology Officer', bg: 'from-accent/20 to-accent/5' },
                { name: 'Amit Sharma', role: 'Head of Agriculture', bg: 'from-secondary/40 to-secondary/10' },
                { name: 'Sneha Patel', role: 'Head of Operations', bg: 'from-primary/20 to-primary/5' }
              ].map((member) => (
                <Card key={member.name}>
                  <CardContent className="p-6 text-center space-y-3">
                    <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${member.bg}`} />
                    <div>
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-primary text-primary-foreground rounded-lg p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold mb-2">10K+</p>
                <p className="opacity-90">Farmers</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">5K+</p>
                <p className="opacity-90">Buyers</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">200+</p>
                <p className="opacity-90">Experts</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">50K+</p>
                <p className="opacity-90">Transactions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
