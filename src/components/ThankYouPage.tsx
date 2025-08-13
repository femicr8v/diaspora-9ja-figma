import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  CheckCircle,
  ArrowRight,
  Home,
  User,
  Gift,
  Sparkles,
  Users,
  TrendingUp,
} from "lucide-react";
import logoImage from "figma:asset/0be1b3fe61946b6a71598093280579589812311d.png";

interface ThankYouPageProps {
  userName: string;
  onGoToDashboard: () => void;
  onReturnHome: () => void;
}

export default function ThankYouPage({
  userName,
  onGoToDashboard,
  onReturnHome,
}: ThankYouPageProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Trigger confetti animation
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const welcomeBenefits = [
    {
      icon: TrendingUp,
      title: "Premium Investment Access",
      description: "Exclusive deals worth $50M+ available now",
    },
    {
      icon: Users,
      title: "Global Network",
      description: "Connect with 15,000+ Nigerians worldwide",
    },
    {
      icon: Gift,
      title: "Welcome Bonus",
      description: "60% off first month + exclusive resources",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-background to-accent/10 relative overflow-hidden">
      {/* Confetti Animation Placeholder */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-10">
          <div className="absolute inset-0">
            {/* Animated confetti elements */}
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-accent rounded-full animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 3}s`,
                }}
              />
            ))}
            {[...Array(30)].map((_, i) => (
              <div
                key={`confetti-${i}`}
                className="absolute w-1 h-4 bg-primary rounded-full animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1.5 + Math.random() * 2}s`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur-sm relative z-20">
        <div className="container mx-auto max-w-7xl px-6 py-4 flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <img
                src={logoImage}
                alt="Diaspora 9ja Logo"
                className="w-10 h-10 object-contain"
              />
            </div>
            <h1 className="text-xl font-bold text-primary font-headers">
              Diaspora 9ja
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto max-w-4xl px-6 py-16 text-center relative z-20">
        {/* Success Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center shadow-lg animate-bounce">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>

        {/* Success Message */}
        <div className="mb-12">
          <Badge
            variant="secondary"
            className="mb-6 bg-green-100 text-green-700 border-green-200 font-semibold text-base px-4 py-2"
          >
            🎉 Welcome to the Community!
          </Badge>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold gradient-text font-headers leading-tight mb-6">
            Thank You for Joining, {userName}!
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8 max-w-3xl mx-auto">
            Your payment was successful. Welcome to Diaspora 9ja — the most
            trusted platform connecting Nigerians worldwide. You're now part of
            an exclusive community of 15,000+ ambitious professionals and
            entrepreneurs.
          </p>
        </div>

        {/* Welcome Benefits */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {welcomeBenefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card
                key={index}
                className="border-border/40 bg-background/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-headers font-bold text-lg text-foreground mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* What's Next */}
        <Card className="border-border/40 bg-gradient-to-r from-primary/5 to-accent/5 backdrop-blur-sm shadow-2xl mb-12">
          <CardContent className="p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground font-headers mb-6">
              What's Next?
            </h2>

            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div className="space-y-4">
                <h3 className="font-headers font-bold text-lg text-foreground flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-accent" />
                  Immediate Access
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Premium investment opportunities
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Exclusive community forums
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Monthly networking events
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-headers font-bold text-lg text-foreground flex items-center">
                  <Gift className="w-5 h-5 mr-2 text-accent" />
                  Welcome Package
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Diaspora Investment Guide (PDF)
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Directory of 5,000+ businesses
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Exclusive webinar invitations
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <Button
            size="lg"
            onClick={onGoToDashboard}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 min-w-[200px]"
          >
            <User className="w-5 h-5 mr-2" />
            Go to Dashboard
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={onReturnHome}
            className="border-2 border-border hover:border-primary/30 text-muted-foreground hover:text-primary px-8 py-4 text-lg font-semibold min-w-[200px]"
          >
            <Home className="w-5 h-5 mr-2" />
            Return Home
          </Button>
        </div>

        {/* Support Information */}
        <div className="mt-16 p-8 bg-background/60 backdrop-blur-sm rounded-2xl border border-border/40">
          <h3 className="font-headers font-bold text-lg text-foreground mb-4">
            Need Help Getting Started?
          </h3>
          <p className="text-muted-foreground mb-6">
            Our community team is here to help you make the most of your
            membership. Don't hesitate to reach out if you have any questions.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center text-sm">
            <a
              href="mailto:support@diaspora9ja.com"
              className="text-primary hover:underline font-medium"
            >
              support@diaspora9ja.com
            </a>
            <span className="hidden md:block text-muted-foreground">•</span>
            <a
              href="tel:+442079460958"
              className="text-primary hover:underline font-medium"
            >
              +44 20 7946 0958
            </a>
            <span className="hidden md:block text-muted-foreground">•</span>
            <span className="text-muted-foreground">
              Live chat available 24/7
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
