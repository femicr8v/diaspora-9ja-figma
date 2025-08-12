import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  ArrowLeft, 
  MessageSquare, 
  Users, 
  Calendar, 
  Bell,
  ExternalLink,
  CheckCircle,
  Star,
  Newspaper,
  TrendingUp,
  Briefcase,
  BookOpen,
  ArrowRight
} from "lucide-react";
import logoImage from 'figma:asset/0be1b3fe61946b6a71598093280579589812311d.png';

interface WelcomeScreenProps {
  userName: string;
  onBack: () => void;
  onNavigate: (page: 'news' | 'investment' | 'business' | 'blog') => void;
}

export default function WelcomeScreen({ userName, onBack, onNavigate }: WelcomeScreenProps) {
  const handleJoinDiscord = () => {
    // In a real app, this would redirect to Discord invite
    window.open('https://discord.gg/diaspora9ja', '_blank');
  };

  const handleSkip = () => {
    // Navigate to latest news as the main dashboard
    onNavigate('news');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Welcome Card */}
        <Card className="border-border/40 shadow-xl bg-background/80 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            {/* Welcome Header */}
            <div className="mb-8">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className="w-16 h-16 flex items-center justify-center">
                  <img 
                    src={logoImage} 
                    alt="Diaspora 9ja Logo" 
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
              </div>
              <Badge variant="secondary" className="mb-4 bg-accent/10 text-accent border-accent/20">
                Account Created Successfully
              </Badge>
              <h1 className="text-3xl md:text-4xl mb-2 text-foreground">
                Welcome to Diaspora 9ja, {userName}! 🎉
              </h1>
              <p className="text-lg text-muted-foreground">
                You're now part of a thriving global Nigerian community
              </p>
            </div>

            {/* Platform Features */}
            <div className="bg-primary/5 rounded-xl p-6 mb-8 border border-primary/20">
              <h2 className="text-xl mb-4 text-foreground">
                Explore Our Platform
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <button
                  onClick={() => onNavigate('news')}
                  className="p-4 bg-background rounded-lg border border-border/40 hover:bg-primary/5 transition-colors text-center"
                >
                  <Newspaper className="w-6 h-6 text-primary mx-auto mb-2" />
                  <span className="text-sm font-medium text-foreground">Latest News</span>
                </button>
                <button
                  onClick={() => onNavigate('investment')}
                  className="p-4 bg-background rounded-lg border border-border/40 hover:bg-accent/5 transition-colors text-center"
                >
                  <TrendingUp className="w-6 h-6 text-accent mx-auto mb-2" />
                  <span className="text-sm font-medium text-foreground">Investments</span>
                </button>
                <button
                  onClick={() => onNavigate('business')}
                  className="p-4 bg-background rounded-lg border border-border/40 hover:bg-primary/5 transition-colors text-center"
                >
                  <Briefcase className="w-6 h-6 text-primary mx-auto mb-2" />
                  <span className="text-sm font-medium text-foreground">Business</span>
                </button>
                <button
                  onClick={() => onNavigate('blog')}
                  className="p-4 bg-background rounded-lg border border-border/40 hover:bg-accent/5 transition-colors text-center"
                >
                  <BookOpen className="w-6 h-6 text-accent mx-auto mb-2" />
                  <span className="text-sm font-medium text-foreground">Blog</span>
                </button>
              </div>
              <p className="text-sm text-muted-foreground">
                Click on any section to explore content relevant to the Nigerian diaspora
              </p>
            </div>

            {/* Discord Section */}
            <div className="bg-accent/5 rounded-xl p-6 mb-8 border border-accent/20">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-accent" />
                </div>
              </div>
              <h2 className="text-xl mb-3 text-foreground">
                Join Our Discord Community
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Connect with fellow Nigerians in real-time! Our Discord server is where the magic happens - 
                from daily conversations to exclusive events and networking opportunities.
              </p>
              
              {/* Discord Benefits */}
              <div className="grid md:grid-cols-2 gap-4 mb-6 text-left">
                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground">Active Community</h4>
                    <p className="text-sm text-muted-foreground">Chat with 500+ members daily</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground">Exclusive Events</h4>
                    <p className="text-sm text-muted-foreground">Weekly meetups and workshops</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Bell className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground">Real-time Updates</h4>
                    <p className="text-sm text-muted-foreground">Latest opportunities and news</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Star className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground">Verified Members</h4>
                    <p className="text-sm text-muted-foreground">Connect with professionals</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleJoinDiscord}
                size="lg"
                className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3 mb-3"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Join Discord Server
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Button
                onClick={() => onNavigate('news')}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
              >
                Explore Platform
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                onClick={handleJoinDiscord}
                variant="outline"
                size="lg"
                className="border-accent/20 text-accent hover:bg-accent/5 px-8"
              >
                Join Discord
                <MessageSquare className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Footer Note */}
            <p className="text-sm text-muted-foreground">
              You can access all platform features and join Discord anytime from the navigation
            </p>
          </CardContent>
        </Card>

        {/* Community Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <Card className="border-border/40 bg-background/60">
            <CardContent className="p-4">
              <div className="text-2xl font-semibold text-primary">2.5K+</div>
              <div className="text-sm text-muted-foreground">Community Members</div>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-background/60">
            <CardContent className="p-4">
              <div className="text-2xl font-semibold text-accent">50+</div>
              <div className="text-sm text-muted-foreground">Countries</div>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-background/60">
            <CardContent className="p-4">
              <div className="text-2xl font-semibold text-primary">100+</div>
              <div className="text-sm text-muted-foreground">Weekly Events</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}