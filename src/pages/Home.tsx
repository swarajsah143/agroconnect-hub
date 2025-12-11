import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sprout, Users, ShoppingCart, GraduationCap, TrendingUp, Shield, ArrowRight, Leaf, Zap, Bug } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/contexts/LanguageContext';

const Home = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-24 md:py-36 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium animate-fadeInUp">
              <Leaf className="w-4 h-4" />
              {t.home.empoweringAgriculture}
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground leading-tight animate-fadeInUp delay-100">
              {t.home.heroTitle} <span className="gradient-text">{t.home.farmers}</span>{t.home.buyersExperts}
              <span className="gradient-text"> {t.home.experts}</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fadeInUp delay-200">
              {t.home.heroSubtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-fadeInUp delay-300">
              <Button 
                size="lg" 
                onClick={() => navigate('/auth?mode=register')} 
                className="text-lg px-8 h-14 shimmer group"
              >
                {t.home.getStarted}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate('/crop-disease')} 
                className="text-lg px-8 h-14 hover-glow border-primary/30 hover:border-primary/60 group"
              >
                <Bug className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                {t.home.aiDiseaseDetection}
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-12 max-w-lg mx-auto animate-fadeInUp delay-400">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text">500+</div>
                <div className="text-sm text-muted-foreground mt-1">{t.home.statFarmers}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text">1K+</div>
                <div className="text-sm text-muted-foreground mt-1">{t.home.statProducts}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text">50+</div>
                <div className="text-sm text-muted-foreground mt-1">{t.home.statExperts}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role Cards Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/30 to-transparent" />
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">
              {t.home.chooseYour} <span className="gradient-text">{t.home.role}</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t.home.roleSubtitle}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="hover-lift cursor-pointer group bg-card/50 backdrop-blur border-border/50" onClick={() => navigate('/auth?role=farmer')}>
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Sprout className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold mb-2">{t.home.farmer}</h3>
                  <p className="text-muted-foreground">{t.home.farmerDesc}</p>
                </div>
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300">
                  {t.home.joinAsFarmer}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="hover-lift cursor-pointer group bg-card/50 backdrop-blur border-border/50" onClick={() => navigate('/auth?role=buyer')}>
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-accent/20 to-accent/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <ShoppingCart className="w-10 h-10 text-accent" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold mb-2">{t.home.buyer}</h3>
                  <p className="text-muted-foreground">{t.home.buyerDesc}</p>
                </div>
                <Button variant="outline" className="w-full group-hover:bg-accent group-hover:text-accent-foreground group-hover:border-accent transition-all duration-300">
                  {t.home.joinAsBuyer}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="hover-lift cursor-pointer group bg-card/50 backdrop-blur border-border/50" onClick={() => navigate('/auth?role=expert')}>
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary/20 to-accent/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <GraduationCap className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold mb-2">{t.home.expert}</h3>
                  <p className="text-muted-foreground">{t.home.expertDesc}</p>
                </div>
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300">
                  {t.home.joinAsExpert}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">
              {t.home.whyChoose} <span className="gradient-text">{t.home.agroconnect}?</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t.home.whyChooseSubtitle}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center space-y-4 group">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary/20 to-transparent rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">{t.home.directConnection}</h3>
              <p className="text-muted-foreground">{t.home.directConnectionDesc}</p>
            </div>
            
            <div className="text-center space-y-4 group">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-accent/20 to-transparent rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold">{t.home.trustedPlatform}</h3>
              <p className="text-muted-foreground">{t.home.trustedPlatformDesc}</p>
            </div>
            
            <div className="text-center space-y-4 group">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary/20 to-accent/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">{t.home.expertGuidance}</h3>
              <p className="text-muted-foreground">{t.home.expertGuidanceDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              {t.home.joinUsers}
            </div>
            
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 text-primary-foreground">
              {t.home.readyToTransform}
            </h2>
            <p className="text-lg mb-8 text-primary-foreground/80 max-w-xl mx-auto">
              {t.home.ctaSubtitle}
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              onClick={() => navigate('/auth?mode=register')} 
              className="text-lg px-8 h-14 hover:scale-105 transition-transform duration-300"
            >
              {t.home.createFreeAccount}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sprout className="w-5 h-5 text-primary" />
              <span className="font-serif font-bold gradient-text">AgroConnect</span>
            </div>
            <p className="text-muted-foreground text-sm">{t.home.copyright}</p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-muted-foreground hover:text-foreground link-underline text-sm py-1">{t.home.privacy}</a>
              <a href="#" className="text-muted-foreground hover:text-foreground link-underline text-sm py-1">{t.home.terms}</a>
              <a href="#" className="text-muted-foreground hover:text-foreground link-underline text-sm py-1">{t.home.contact}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
