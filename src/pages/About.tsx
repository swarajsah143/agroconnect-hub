import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Eye, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const About = () => {
  const { t } = useLanguage();

  const teamMembers = [
    { name: 'Swaraj', role: t.about.founderCEO, bg: 'from-primary/20 to-primary/5' },
    { name: 'Asim', role: t.about.cto, bg: 'from-accent/20 to-accent/5' },
    { name: 'Abhishek', role: t.about.headAgriculture, bg: 'from-secondary/40 to-secondary/10' },
    { name: 'Kartik', role: t.about.headOperations, bg: 'from-primary/20 to-primary/5' },
    { name: 'Dipendra', role: t.about.headMarketing, bg: 'from-accent/20 to-accent/5' },
    { name: 'Manish', role: t.about.headProduct, bg: 'from-secondary/40 to-secondary/10' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Hero */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-serif font-bold">{t.about.title}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t.about.subtitle}</p>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-8 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-serif font-bold">{t.about.ourMission}</h2>
                <p className="text-muted-foreground leading-relaxed">{t.about.missionDesc}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-serif font-bold">{t.about.ourVision}</h2>
                <p className="text-muted-foreground leading-relaxed">{t.about.visionDesc}</p>
              </CardContent>
            </Card>
          </div>

          {/* What We Do */}
          <div className="space-y-6">
            <h2 className="text-3xl font-serif font-bold text-center">{t.about.whatWeDo}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto bg-secondary rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{t.about.connect}</h3>
                <p className="text-muted-foreground">{t.about.connectDesc}</p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto bg-secondary rounded-full flex items-center justify-center">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{t.about.empower}</h3>
                <p className="text-muted-foreground">{t.about.empowerDesc}</p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto bg-secondary rounded-full flex items-center justify-center">
                  <Eye className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{t.about.transform}</h3>
                <p className="text-muted-foreground">{t.about.transformDesc}</p>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="space-y-6">
            <h2 className="text-3xl font-serif font-bold text-center">{t.about.ourTeam}</h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto">{t.about.teamDesc}</p>
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 pt-6">
              {teamMembers.map((member) => (
                <Card key={member.name}>
                  <CardContent className="p-6 text-center space-y-3">
                    <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${member.bg} flex items-center justify-center`}>
                      <span className="text-2xl font-bold text-primary">{member.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
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
                <p className="opacity-90">{t.about.farmers}</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">5K+</p>
                <p className="opacity-90">{t.about.buyers}</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">200+</p>
                <p className="opacity-90">{t.about.experts}</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">50K+</p>
                <p className="opacity-90">{t.about.transactions}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
