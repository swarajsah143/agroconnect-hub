import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Sprout, LogOut, LayoutDashboard, Menu, X, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import LanguageSelector from './LanguageSelector';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'farmer':
        return '/farmer-dashboard';
      case 'buyer':
        return '/buyer-dashboard';
      case 'expert':
        return '/expert-dashboard';
      default:
        return '/';
    }
  };

  const navLinks = [
    { to: '/', label: t.nav.home },
    { to: '/marketplace', label: t.nav.marketplace },
    { to: '/analytics', label: t.nav.analytics },
    { to: '/about', label: t.nav.about },
  ];

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-xl font-serif font-bold group"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors duration-300">
              <Sprout className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="gradient-text">AgroConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.to}
                to={link.to} 
                className="text-muted-foreground hover:text-foreground link-underline transition-colors duration-300 py-1"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSelector />
            {isAuthenticated && <NotificationBell />}
            {isAuthenticated ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate(getDashboardLink())}
                  className="hover-glow border-primary/30 hover:border-primary/60"
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  {t.nav.dashboard}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {t.nav.logout}
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/auth')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {t.nav.login}
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => navigate('/auth?mode=register')}
                  className="shimmer bg-primary hover:bg-primary/90"
                >
                  {t.nav.getStarted}
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fadeInUp">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.to}
                  to={link.to} 
                  className="text-muted-foreground hover:text-foreground transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                <LanguageSelector />
                {isAuthenticated && <NotificationBell />}
              </div>
              <div className="flex flex-col gap-2 pt-4 border-t border-border/50">
                {isAuthenticated ? (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => { navigate(getDashboardLink()); setMobileMenuOpen(false); }}
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      {t.nav.dashboard}
                    </Button>
                    <Button variant="ghost" onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>
                      <LogOut className="w-4 h-4 mr-2" />
                      {t.nav.logout}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }}
                    >
                      {t.nav.login}
                    </Button>
                    <Button onClick={() => { navigate('/auth?mode=register'); setMobileMenuOpen(false); }}>
                      {t.nav.getStarted}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
