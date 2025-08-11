import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { 
  Users, 
  MessageCircle, 
  GraduationCap, 
  Star, 
  ArrowRight, 
  Newspaper, 
  TrendingUp, 
  Briefcase, 
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Target,
  Eye,
  Heart,
  Mail,
  Phone,
  MapPin,
  Send,
  Globe,
  Award,
  Zap,
  Shield,
  Clock,
  CheckCircle,
  X,
  ExternalLink,
  Calendar,
  Building,
  MessageSquare,
  Code,
  TrendingDown,
  PieChart
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import logoImage from 'figma:asset/0be1b3fe61946b6a71598093280579589812311d.png';
import promoImage from 'figma:asset/b9aa05783b5796e1e11473fe37efd8e6f5043e74.png';
import communityGridImage from 'figma:asset/25216db00c875f50abbdd8792389f76c67838d03.png';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LandingPageProps {
  onGetStarted: () => void;
  onNavigate: (page: 'news' | 'investment' | 'business' | 'blog') => void;
  onSignIn: () => void;
}

export default function LandingPage({ onGetStarted, onNavigate, onSignIn }: LandingPageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [membersSlide, setMembersSlide] = useState(0);
  const [showPromo, setShowPromo] = useState(true);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: '',
    company: '',
    phone: ''
  });

  const platformFeatures = [
    {
      id: 'news',
      title: 'Latest News & Updates',
      description: 'Stay informed with breaking news, policy updates, and insider insights specifically curated for the Nigerian diaspora community. Our editorial team ensures you never miss crucial developments.',
      icon: Newspaper,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      gradient: 'from-primary/20 to-primary/5',
      stats: '250+ articles weekly',
      features: ['Real-time updates', 'Expert analysis', 'Global coverage']
    },
    {
      id: 'investment',
      title: 'Investment Opportunities',
      description: 'Discover vetted investment opportunities in Nigeria and across Africa. Connect with fellow diaspora investors and access exclusive deals with full due diligence reports.',
      icon: TrendingUp,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      gradient: 'from-accent/20 to-accent/5',
      stats: '$50M+ deals showcased',
      features: ['Vetted opportunities', 'Due diligence', 'Investor network']
    },
    {
      id: 'business',
      title: 'Business Directory',
      description: 'Connect with Nigerian-owned businesses worldwide. Whether you\'re looking for services or want to showcase your business, our directory is your gateway to the diaspora economy.',
      icon: Briefcase,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      gradient: 'from-primary/20 to-primary/5',
      stats: '5,000+ businesses listed',
      features: ['Global directory', 'Verified listings', 'Direct connections']
    },
    {
      id: 'blog',
      title: 'Community Stories',
      description: 'Read inspiring success stories, cultural insights, and personal journeys from diaspora members. Share your own story and inspire others in the community.',
      icon: BookOpen,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      gradient: 'from-accent/20 to-accent/5',
      stats: '1,000+ stories shared',
      features: ['Personal journeys', 'Success stories', 'Cultural insights']
    }
  ];

  const communityStats = [
    { label: 'Articles this week', value: '28', icon: BookOpen, trend: '+12%' },
    { label: 'Total readers', value: '15.2k', icon: Users, trend: '+24%' },
    { label: 'Premium subscribers', value: '2.1k', icon: Star, trend: '+18%' },
    { label: 'Contributors', value: '47', icon: MessageCircle, trend: '+8%' },
  ];

  const aboutStats = [
    { number: '50+', label: 'Countries Represented', icon: Globe },
    { number: '15,000+', label: 'Active Members', icon: Users },
    { number: '5,000+', label: 'Successful Connections', icon: Heart },
    { number: '98%', label: 'Member Satisfaction', icon: Award },
  ];

  const communityProfiles = [
    {
      name: 'Adaora K.',
      role: 'Software Engineer',
      location: 'Toronto, Canada',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b190?w=200&h=200&fit=crop&crop=face',
      industry: 'Technology'
    },
    {
      name: 'Chinedu M.',
      role: 'Business Owner',
      location: 'London, UK',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
      industry: 'Finance'
    },
    {
      name: 'Kemi O.',
      role: 'Medical Doctor',
      location: 'Dubai, UAE',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face',
      industry: 'Healthcare'
    },
    {
      name: 'Emeka A.',
      role: 'Creative Director',
      location: 'New York, USA',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
      industry: 'Design'
    },
    {
      name: 'Folake S.',
      role: 'Data Scientist',
      location: 'Berlin, Germany',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
      industry: 'Technology'
    },
    {
      name: 'Tunde R.',
      role: 'Entrepreneur',
      location: 'Lagos, Nigeria',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
      industry: 'Business'
    }
  ];

  const faqs = [
    {
      question: "What is Diaspora 9ja?",
      answer: "Diaspora 9ja is a comprehensive digital platform connecting Nigerians worldwide. We provide trusted news, investment opportunities, business networking, mentorship programs, and cultural exchange opportunities tailored specifically for the Nigerian diaspora community."
    },
    {
      question: "Who can join our community?",
      answer: "Anyone with a connection to Nigeria is welcome! Whether you're a Nigerian living abroad, a Nigerian at home looking to connect globally, or someone interested in Nigerian culture and business opportunities. Our community is inclusive and diverse."
    },
    {
      question: "What's included in membership?",
      answer: "Basic membership is free and includes access to community posts, basic news updates, and public forums. Premium membership ($10/month early bird, $25/month regular) includes exclusive content, investment opportunities, priority business listings, mentorship matching, and private community groups."
    },
    {
      question: "How do I upgrade to Premium?",
      answer: "You can upgrade to Premium anytime from your account dashboard. We use Stripe for secure payment processing, and you can cancel anytime. Premium members get immediate access to all exclusive features."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use industry-standard encryption and security measures to protect your data. We never sell your information to third parties and are fully GDPR compliant. Your privacy and security are our top priorities."
    }
  ];

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Us',
      value: 'hello@diaspora9ja.com',
      description: 'For general inquiries and support',
      action: 'mailto:hello@diaspora9ja.com'
    },
    {
      icon: Phone,
      title: 'Call Us',
      value: '+44 20 7946 0958',
      description: 'Business hours: 9 AM - 6 PM GMT',
      action: 'tel:+442079460958'
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      value: 'Available 24/7',
      description: 'Instant support for members',
      action: '#'
    }
  ];

  // Auto-scroll carousel for platform features
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % platformFeatures.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [platformFeatures.length]);

  // Auto-scroll carousel for members
  useEffect(() => {
    const timer = setInterval(() => {
      setMembersSlide((prev) => (prev + 1) % communityProfiles.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [communityProfiles.length]);

  const handleSlideChange = (direction: 'prev' | 'next') => {
    if (direction === 'next') {
      setCurrentSlide((prev) => (prev + 1) % platformFeatures.length);
    } else {
      setCurrentSlide((prev) => (prev - 1 + platformFeatures.length) % platformFeatures.length);
    }
  };

  const handleMembersSlideChange = (direction: 'prev' | 'next') => {
    if (direction === 'next') {
      setMembersSlide((prev) => (prev + 1) % communityProfiles.length);
    } else {
      setMembersSlide((prev) => (prev - 1 + communityProfiles.length) % communityProfiles.length);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', contactForm);
    alert('Thank you for your message! We\'ll get back to you within 24 hours.');
    setContactForm({ name: '', email: '', message: '', company: '', phone: '' });
  };

  const handleContactInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactForm({ ...contactForm, [field]: e.target.value });
  };

  return (
    <div className="min-h-screen">
      {/* Promotional Banner */}
      {showPromo && (
        <div className="relative bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white py-3 px-6">
          <div className="container mx-auto max-w-7xl flex items-center justify-center text-center relative">
            <div className="flex items-center space-x-4">
              <Zap className="w-5 h-5 text-yellow-300" />
              <span className="text-sm md:text-base font-semibold">Limited Time Offer: Get 20% Off Your First Month!</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-mono">
                Use code: GROW20
              </span>
            </div>
            <button
              onClick={() => setShowPromo(false)}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <img 
                src={logoImage} 
                alt="Diaspora 9ja Logo" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <h1 className="text-xl font-bold text-primary font-headers">Diaspora 9ja</h1>
          </div>
          
          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a href="#about" className="text-base text-muted-foreground hover:text-primary transition-colors font-medium">About</a>
            <a href="#platform" className="text-base text-muted-foreground hover:text-primary transition-colors font-medium">Platform</a>
            <a href="#community" className="text-base text-muted-foreground hover:text-primary transition-colors font-medium">Community</a>
            <a href="#testimonials" className="text-base text-muted-foreground hover:text-primary transition-colors font-medium">Testimonials</a>
            <a href="#faqs" className="text-base text-muted-foreground hover:text-primary transition-colors font-medium">FAQs</a>
            <a href="#contact" className="text-base text-muted-foreground hover:text-primary transition-colors font-medium">Contact</a>
            <Button 
              onClick={onGetStarted}
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-base font-semibold animate-pulse-glow"
            >
              Join Now
            </Button>
          </nav>

          {/* Mobile menu button */}
          <Button 
            variant="outline" 
            className="lg:hidden text-base"
            onClick={onGetStarted}
          >
            Join Now
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-6 text-center bg-gradient-to-br from-background via-secondary/20 to-accent/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23e8f5e8%22%20fill-opacity%3D%220.3%22%3E%3Cpath%20d%3D%22m36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <Badge variant="secondary" className="mb-6 md:mb-8 bg-accent/10 text-accent border-accent/20 text-sm font-semibold px-4 py-2">
            🌍 Connecting 15,000+ Nigerians Worldwide
          </Badge>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-6 md:mb-8 font-bold gradient-text font-headers leading-tight">
            Your Global Nigerian Community Hub
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed">
            Join the most trusted platform connecting Nigerians worldwide. Access exclusive opportunities, 
            build meaningful relationships, and stay connected with your heritage while thriving globally.
          </p>
          
          <div className="flex flex-col items-center gap-4 mb-8 md:mb-12">
            <Button 
              size="lg" 
              onClick={onGetStarted}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 md:px-10 py-3 md:py-4 text-base md:text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Start Your Journey
              <ArrowRight className="ml-2 md:ml-3 w-5 md:w-6 h-5 md:h-6" />
            </Button>
            <div className="flex items-center space-x-2 text-sm md:text-base text-muted-foreground">
              <CheckCircle className="w-4 md:w-5 h-4 md:h-5 text-green-500" />
              <span className="font-medium">Free to join • No credit card required</span>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto">
            {aboutStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-12 md:w-16 h-12 md:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                    <Icon className="w-6 md:w-8 h-6 md:h-8 text-primary" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1 font-headers">{stat.number}</div>
                  <p className="text-xs md:text-sm text-muted-foreground font-medium">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enhanced About Us Section */}
      <section id="about" className="py-16 md:py-24 px-6 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16 md:mb-20">
            <Badge variant="secondary" className="mb-4 md:mb-6 bg-primary/10 text-primary border-primary/20 text-sm font-semibold">
              Our Story
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-6 text-foreground font-headers font-bold">
              Bridging Continents, Connecting Hearts
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Born from a vision to unite the Nigerian diaspora, we've built more than a platform—we've created a digital homeland.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 md:gap-12 mb-16 md:mb-20">
            <Card className="border-border/40 hover:border-primary/30 transition-all duration-500 group hover:shadow-2xl bg-gradient-to-br from-background to-primary/5">
              <CardContent className="p-8 md:p-10 text-center">
                <div className="w-16 md:w-20 h-16 md:h-20 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-8 md:w-10 h-8 md:h-10 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl mb-4 md:mb-6 text-foreground font-headers font-bold">Our Mission</h3>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-4 md:mb-6">
                  To unite Nigerians worldwide through a vibrant, inclusive digital hub that fosters networking, 
                  learning, and collaboration across borders and industries.
                </p>
                <ul className="text-left space-y-2 text-sm md:text-base text-muted-foreground">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-primary mr-2" /> Global networking</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-primary mr-2" /> Knowledge sharing</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-primary mr-2" /> Cultural preservation</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border/40 hover:border-accent/30 transition-all duration-500 group hover:shadow-2xl bg-gradient-to-br from-background to-accent/5">
              <CardContent className="p-8 md:p-10 text-center">
                <div className="w-16 md:w-20 h-16 md:h-20 bg-gradient-to-br from-accent to-accent/70 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 group-hover:scale-110 transition-transform duration-300">
                  <Eye className="w-8 md:w-10 h-8 md:h-10 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl mb-4 md:mb-6 text-foreground font-headers font-bold">Our Vision</h3>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-4 md:mb-6">
                  A thriving global community where every Nigerian, regardless of location, feels connected, 
                  supported, and empowered to achieve extraordinary success.
                </p>
                <ul className="text-left space-y-2 text-sm md:text-base text-muted-foreground">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-accent mr-2" /> Borderless connections</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-accent mr-2" /> Mutual support</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-accent mr-2" /> Collective success</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border/40 hover:border-primary/30 transition-all duration-500 group hover:shadow-2xl bg-gradient-to-br from-background to-primary/5">
              <CardContent className="p-8 md:p-10 text-center">
                <div className="w-16 md:w-20 h-16 md:h-20 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-8 md:w-10 h-8 md:h-10 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl mb-4 md:mb-6 text-foreground font-headers font-bold">Our Impact</h3>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-4 md:mb-6">
                  Since 2023, we've facilitated thousands of connections, enabled millions in investments, 
                  and created opportunities that span continents.
                </p>
                <ul className="text-left space-y-2 text-sm md:text-base text-muted-foreground">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-primary mr-2" /> $50M+ in deals</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-primary mr-2" /> 5,000+ businesses</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-primary mr-2" /> 50+ countries</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Founder Story - Hidden on mobile */}
          <div className="hidden md:block bg-gradient-to-r from-secondary/30 to-accent/10 rounded-3xl p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl mb-4 md:mb-6 text-foreground font-headers font-bold">From Vision to Reality</h3>
            <p className="text-base md:text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              "Growing up between Lagos and London, I experienced firsthand the challenges of staying connected 
              to home while building a life abroad. Diaspora 9ja was born from the belief that distance shouldn't 
              diminish our bonds or limit our potential. Today, we're proud to be the bridge that connects 
              our global family."
            </p>
            <div className="mt-6 md:mt-8 flex items-center justify-center space-x-4">
              <div className="w-12 md:w-16 h-12 md:h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="w-6 md:w-8 h-6 md:h-8 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-base font-semibold text-foreground">Founding Team</p>
                <p className="text-sm text-muted-foreground">Diaspora 9ja</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Stats Section with Members Carousel */}
      <section className="py-16 md:py-24 px-6 bg-gradient-to-br from-secondary/30 to-accent/10">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-6 text-foreground font-headers font-bold">
              Our Thriving Community
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Real numbers from real people making real connections across the globe
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-16">
            {communityStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="border-border/40 bg-background/80 text-center hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-6 md:p-8">
                    <div className="w-12 md:w-16 h-12 md:h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 md:w-8 h-6 md:h-8 text-primary" />
                    </div>
                    <div className="text-2xl md:text-4xl font-bold text-primary mb-2 font-headers">{stat.value}</div>
                    <p className="text-sm md:text-base text-muted-foreground mb-2">{stat.label}</p>
                    <div className="text-xs md:text-sm text-green-600 font-medium">↗ {stat.trend}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Members Carousel */}
          <div className="text-center mb-8 md:mb-12">
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 md:mb-4 font-headers">Meet Our Global Members</h3>
            <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8">From every corner of the world, every industry, united by heritage</p>
          </div>
          
          <div className="relative">
            {/* Carousel Container */}
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-out"
                style={{ 
                  transform: `translateX(-${membersSlide * (window.innerWidth < 768 ? 100 : window.innerWidth < 1024 ? 50 : 33.333)}%)`
                }}
              >
                {communityProfiles.map((profile, index) => (
                  <div key={index} className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3">
                    <Card className="border-border/40 bg-background/90 hover:shadow-lg transition-all duration-300 group">
                      <CardContent className="p-6 text-center">
                        <div className="w-16 md:w-20 h-16 md:h-20 mx-auto mb-4 rounded-full overflow-hidden group-hover:scale-105 transition-transform duration-300">
                          <ImageWithFallback
                            src={profile.image}
                            alt={profile.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h4 className="text-sm md:text-base font-semibold text-foreground mb-1">{profile.name}</h4>
                        <p className="text-xs md:text-sm text-muted-foreground mb-1">{profile.role}</p>
                        <p className="text-xs md:text-sm text-accent font-medium mb-2">{profile.location}</p>
                        <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                          {profile.industry}
                        </Badge>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleMembersSlideChange('prev')}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 rounded-full w-8 h-8 md:w-10 md:h-10 p-0 bg-white/90 hover:bg-white shadow-lg border-white/50"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleMembersSlideChange('next')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full w-8 h-8 md:w-10 md:h-10 p-0 bg-white/90 hover:bg-white shadow-lg border-white/50"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-6 md:mt-8 space-x-2">
              {communityProfiles.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setMembersSlide(index)}
                  className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                    index === membersSlide 
                      ? 'bg-primary scale-125 shadow-lg' 
                      : 'bg-muted hover:bg-muted-foreground/50'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="text-center mt-8 md:mt-12">
            <p className="text-base md:text-lg text-muted-foreground mb-4 md:mb-6">
              <span className="font-semibold text-primary">2,000+ members</span> from 
              <span className="font-semibold text-accent"> 50+ countries</span> 
              {" "}building the future together
            </p>
            <Button 
              onClick={onGetStarted}
              variant="outline"
              className="border-primary/20 text-primary hover:bg-primary/5 text-base"
            >
              Join Our Community
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Explore Platform - No White Card */}
      <section id="platform" className="py-16 md:py-24 px-6 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16 md:mb-20">
            <Badge variant="secondary" className="mb-4 md:mb-6 bg-accent/10 text-accent border-accent/20 text-sm font-semibold">
              Platform Features
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-6 text-foreground font-headers font-bold">
              Everything You Need in One Place
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover powerful tools and exclusive content designed specifically for the Nigerian diaspora community
            </p>
          </div>
          
          <div className="relative">
            {/* Carousel Container - No White Card */}
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {platformFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.id} className="w-full flex-shrink-0 px-4">
                      <div className={`min-h-[400px] md:min-h-[500px] bg-gradient-to-br ${feature.gradient} relative overflow-hidden rounded-2xl shadow-2xl`}>
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22m36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
                        <div className="p-8 md:p-16 text-center relative z-10">
                          <div className={`w-16 md:w-24 h-16 md:h-24 ${feature.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 md:mb-10 shadow-xl`}>
                            <Icon className={`w-8 md:w-12 h-8 md:h-12 ${feature.color}`} />
                          </div>
                          <h3 className="text-2xl md:text-3xl mb-4 md:mb-6 text-foreground font-headers font-bold">{feature.title}</h3>
                          <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 leading-relaxed max-w-2xl mx-auto">
                            {feature.description}
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                            {feature.features.map((item, idx) => (
                              <div key={idx} className="text-center">
                                <CheckCircle className="w-5 md:w-6 h-5 md:h-6 text-green-500 mx-auto mb-2" />
                                <p className="text-xs md:text-sm text-muted-foreground font-medium">{item}</p>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mb-6 md:mb-8">
                            <Badge variant="secondary" className="bg-white/20 text-foreground border-white/30 text-sm md:text-base font-semibold px-4 py-2">
                              {feature.stats}
                            </Badge>
                          </div>
                          
                          <Button 
                            onClick={onGetStarted}
                            size="lg"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground text-base font-semibold px-6 md:px-8 py-2 md:py-3 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                          >
                            Explore {feature.title}
                            <ArrowRight className="ml-2 w-4 md:w-5 h-4 md:h-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Enhanced Navigation */}
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleSlideChange('prev')}
              className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 rounded-full w-10 md:w-14 h-10 md:h-14 p-0 bg-white/90 hover:bg-white shadow-xl border-white/50"
            >
              <ChevronLeft className="w-5 md:w-6 h-5 md:h-6" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleSlideChange('next')}
              className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 rounded-full w-10 md:w-14 h-10 md:h-14 p-0 bg-white/90 hover:bg-white shadow-xl border-white/50"
            >
              <ChevronRight className="w-5 md:w-6 h-5 md:h-6" />
            </Button>

            {/* Enhanced Dots Indicator */}
            <div className="flex justify-center mt-8 md:mt-12 space-x-2 md:space-x-3">
              {platformFeatures.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 md:w-4 h-3 md:h-4 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-primary scale-125 shadow-lg' 
                      : 'bg-muted hover:bg-muted-foreground/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Community Showcase Section - Simplified for Mobile */}
      <section id="community" className="py-16 md:py-24 px-6 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-6 text-foreground font-headers font-bold">
              Meet Our Global Family
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              From entrepreneurs in New York to doctors in Dubai, our community spans every continent and profession
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-12 md:mb-16">
            <div className="text-center">
              <div className="w-16 md:w-20 h-16 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Globe className="w-8 md:w-10 h-8 md:h-10 text-primary" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 font-headers">Global Reach</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                From Lagos to London, New York to Nairobi, our members are making impact everywhere
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 md:w-20 h-16 md:h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Briefcase className="w-8 md:w-10 h-8 md:h-10 text-accent" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 font-headers">Every Industry</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Tech entrepreneurs, healthcare professionals, artists, and everything in between
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 md:w-20 h-16 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Heart className="w-8 md:w-10 h-8 md:h-10 text-primary" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 font-headers">One Purpose</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                United by heritage, driven by success, connected by community
              </p>
            </div>
          </div>

          <Card className="border-border/40 bg-background/80 backdrop-blur-sm shadow-2xl">
            <CardContent className="p-8 md:p-12 text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 font-headers">Ready to Join Our Success Stories?</h3>
              <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto">
                Every week, we celebrate new connections, business partnerships, and life-changing opportunities 
                created within our community. Your story could be next.
              </p>
              <Button 
                onClick={onGetStarted}
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground text-base font-semibold px-6 md:px-8 py-3 md:py-4 shadow-xl"
              >
                Start Your Success Story
                <ArrowRight className="ml-2 w-4 md:w-5 h-4 md:h-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQs Section - Simplified for Mobile */}
      <section id="faqs" className="py-16 md:py-24 px-6 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16 md:mb-20">
            <Badge variant="secondary" className="mb-4 md:mb-6 bg-primary/10 text-primary border-primary/20 text-sm font-semibold">
              Got Questions?
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-6 text-foreground font-headers font-bold">
              Everything You Need to Know
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              Find answers to the most common questions about joining and using Diaspora 9ja
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4 md:space-y-6">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border border-border/40 rounded-xl px-4 md:px-8 bg-background/50 hover:bg-background/80 transition-colors">
                  <AccordionTrigger className="text-left hover:no-underline py-6 md:py-8 text-base md:text-lg">
                    <span className="font-headers font-bold pr-4">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-6 md:pb-8 text-sm md:text-base leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-12 md:mt-16 text-center">
              <p className="text-base text-muted-foreground mb-4 md:mb-6">Still have questions?</p>
              <Button 
                variant="outline"
                className="border-primary/20 text-primary hover:bg-primary/5 text-base"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Contact Our Team
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-24 px-6 bg-gradient-to-br from-secondary/30 to-accent/10">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-6 text-foreground font-headers font-bold">
              Trusted by Nigerians Worldwide
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              Real stories from real members who have transformed their lives through our community
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
            <Card className="border-border/40 bg-background/90 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardContent className="p-8 md:p-10">
                <div className="flex items-center mb-4 md:mb-6">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="w-5 md:w-6 h-5 md:h-6 text-accent fill-accent" />
                  ))}
                </div>
                <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 leading-relaxed">
                  "Diaspora 9ja has been instrumental in helping me navigate my career in Canada. 
                  The mentorship program connected me with someone who had walked the same path. 
                  Within 6 months, I landed my dream job and started my own consulting practice."
                </p>
                <div className="flex items-center">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b190?w=64&h=64&fit=crop&crop=face"
                    alt="Adaora K."
                    className="w-12 md:w-16 h-12 md:h-16 rounded-full mr-4 md:mr-6"
                  />
                  <div>
                    <h4 className="text-base md:text-lg text-foreground font-headers font-bold">Adaora K.</h4>
                    <p className="text-sm md:text-base text-muted-foreground">Software Engineer & Consultant, Toronto</p>
                    <p className="text-xs md:text-sm text-accent font-medium">Premium Member since 2023</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-background/90 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardContent className="p-8 md:p-10">
                <div className="flex items-center mb-4 md:mb-6">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="w-5 md:w-6 h-5 md:h-6 text-accent fill-accent" />
                  ))}
                </div>
                <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 leading-relaxed">
                  "The investment opportunities shared on this platform are game-changing. 
                  I've connected with like-minded investors and we've successfully funded 
                  three startups in Lagos. The ROI has been exceptional!"
                </p>
                <div className="flex items-center">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face"
                    alt="Chinedu M."
                    className="w-12 md:w-16 h-12 md:h-16 rounded-full mr-4 md:mr-6"
                  />
                  <div>
                    <h4 className="text-base md:text-lg text-foreground font-headers font-bold">Chinedu M.</h4>
                    <p className="text-sm md:text-base text-muted-foreground">Angel Investor & Business Owner, London</p>
                    <p className="text-xs md:text-sm text-accent font-medium">Premium Member since 2022</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Ready to Connect Section */}
      <section 
        className="py-24 md:py-32 px-6 relative overflow-hidden"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1400&h=800&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Enhanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-accent/90"></div>
        
        <div className="container mx-auto max-w-7xl text-center relative z-10">
          <Badge variant="secondary" className="mb-6 md:mb-8 bg-white/20 text-white border-white/30 text-sm font-semibold px-4 py-2">
            🚀 Join the Movement
          </Badge>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl mb-6 md:mb-8 text-white font-headers font-bold leading-tight">
            Ready to Connect with Your Global Community?
          </h2>
          
          <p className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 text-white/95 max-w-4xl mx-auto leading-relaxed">
            Join thousands of ambitious Nigerians who have found their digital homeland with us. 
            Whether you're looking to expand your business, find investment opportunities, 
            connect with mentors, or simply stay connected to your roots while thriving globally—
            your journey starts here.
          </p>
          
          <div className="mb-8 md:mb-12">
            <Button 
              size="lg" 
              onClick={onGetStarted}
              className="bg-white text-primary hover:bg-white/90 px-8 md:px-12 py-4 md:py-6 text-lg md:text-xl font-semibold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
            >
              Join the Community
              <ArrowRight className="ml-2 md:ml-3 w-5 md:w-6 h-5 md:h-6" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-white/90">
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle className="w-5 md:w-6 h-5 md:h-6 text-green-300" />
              <span className="text-sm md:text-base font-medium">Free to join</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle className="w-5 md:w-6 h-5 md:h-6 text-green-300" />
              <span className="text-sm md:text-base font-medium">Instant access</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle className="w-5 md:w-6 h-5 md:h-6 text-green-300" />
              <span className="text-sm md:text-base font-medium">Global network</span>
            </div>
          </div>
        </div>
      </section>

      {/* Ultra Compact Contact Section */}
      <section id="contact" className="py-12 md:py-16 px-6 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 md:mb-12">
            <Badge variant="secondary" className="mb-3 md:mb-4 bg-primary/10 text-primary border-primary/20 text-sm font-semibold">
              Get in Touch
            </Badge>
            <h2 className="text-2xl md:text-3xl lg:text-4xl mb-3 md:mb-4 text-foreground font-headers font-bold">
              We'd Love to Hear From You
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you have questions, feedback, or want to explore partnership opportunities
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Compact Contact Methods */}
            <div className="space-y-4">
              <h3 className="text-lg md:text-xl mb-4 text-foreground font-headers font-bold">Contact Information</h3>
              <div className="space-y-3">
                {contactMethods.map((method, index) => {
                  const Icon = method.icon;
                  return (
                    <Card key={index} className="border-border/40 hover:border-primary/30 transition-all duration-300 group">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-foreground font-headers">{method.title}</h4>
                            <p className="text-sm text-primary font-medium">{method.value}</p>
                            <p className="text-xs text-muted-foreground">{method.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Ultra Compact Business Hours */}
              <Card className="border-border/40 bg-gradient-to-br from-primary/5 to-accent/5">
                <CardContent className="p-4">
                  <h4 className="text-sm font-semibold text-foreground font-headers mb-3 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Business Hours
                  </h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mon - Fri</span>
                      <span className="font-medium">9 AM - 6 PM GMT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Saturday</span>
                      <span className="font-medium">10 AM - 4 PM GMT</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Ultra Compact Contact Form */}
            <div>
              <Card className="border-border/40 shadow-lg bg-gradient-to-br from-background to-secondary/20">
                <CardContent className="p-6">
                  <h3 className="text-lg md:text-xl mb-4 text-foreground font-headers font-bold">Send Us a Message</h3>
                  
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="name" className="text-sm font-semibold">Name *</Label>
                        <Input
                          id="name"
                          placeholder="Your name"
                          value={contactForm.name}
                          onChange={handleContactInputChange('name')}
                          className="h-10 text-sm"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="email" className="text-sm font-semibold">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={contactForm.email}
                          onChange={handleContactInputChange('email')}
                          className="h-10 text-sm"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="phone" className="text-sm font-semibold">Phone</Label>
                        <Input
                          id="phone"
                          placeholder="+44 20 1234 5678"
                          value={contactForm.phone}
                          onChange={handleContactInputChange('phone')}
                          className="h-10 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="company" className="text-sm font-semibold">Company</Label>
                        <Input
                          id="company"
                          placeholder="Your company"
                          value={contactForm.company}
                          onChange={handleContactInputChange('company')}
                          className="h-10 text-sm"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="message" className="text-sm font-semibold">Message *</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us more about your inquiry..."
                        rows={3}
                        value={contactForm.message}
                        onChange={handleContactInputChange('message')}
                        className="text-sm"
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold py-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer with Brand Colors */}
      <footer className="py-12 md:py-16 px-6 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4 md:mb-6">
                <div className="w-10 md:w-12 h-10 md:h-12 flex items-center justify-center">
                  <img 
                    src={logoImage} 
                    alt="Diaspora 9ja Logo" 
                    className="w-10 md:w-12 h-10 md:h-12 object-contain brightness-0 invert"
                  />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white font-headers">Diaspora 9ja</h3>
              </div>
              <p className="text-gray-200 leading-relaxed mb-4 md:mb-6 text-base md:text-lg">
                Connecting the global Nigerian community through trusted information, 
                meaningful relationships, and shared opportunities.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 md:w-10 h-8 md:h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <Globe className="w-4 md:w-5 h-4 md:h-5 text-white" />
                </div>
                <div className="w-8 md:w-10 h-8 md:h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <Users className="w-4 md:w-5 h-4 md:h-5 text-white" />
                </div>
                <div className="w-8 md:w-10 h-8 md:h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <Heart className="w-4 md:w-5 h-4 md:h-5 text-white" />
                </div>
              </div>
            </div>
            <div>
              <h4 className="mb-4 md:mb-6 text-white font-headers font-bold text-base">Quick Links</h4>
              <ul className="space-y-2 md:space-y-3">
                <li><a href="#about" className="text-gray-200 hover:text-white transition-colors text-sm md:text-base">About Us</a></li>
                <li><a href="#platform" className="text-gray-200 hover:text-white transition-colors text-sm md:text-base">Platform</a></li>
                <li><a href="#community" className="text-gray-200 hover:text-white transition-colors text-sm md:text-base">Community</a></li>
                <li><a href="#testimonials" className="text-gray-200 hover:text-white transition-colors text-sm md:text-base">Testimonials</a></li>
                <li><a href="#faqs" className="text-gray-200 hover:text-white transition-colors text-sm md:text-base">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 md:mb-6 text-white font-headers font-bold text-base">Legal & Support</h4>
              <ul className="space-y-2 md:space-y-3">
                <li><a href="#privacy" className="text-gray-200 hover:text-white transition-colors text-sm md:text-base">Privacy Policy</a></li>
                <li><a href="#terms" className="text-gray-200 hover:text-white transition-colors text-sm md:text-base">Terms of Service</a></li>
                <li><a href="#contact" className="text-gray-200 hover:text-white transition-colors text-sm md:text-base">Contact Us</a></li>
                <li><a href="#help" className="text-gray-200 hover:text-white transition-colors text-sm md:text-base">Help Center</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-6 md:pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-200 mb-4 md:mb-0 text-sm md:text-base">
              &copy; 2024 Diaspora 9ja. All rights reserved. Built with ❤️ for the global Nigerian community.
            </p>
            <div className="flex items-center space-x-4 text-xs md:text-sm text-gray-200">
              <span className="flex items-center">
                <Shield className="w-3 md:w-4 h-3 md:h-4 mr-1" />
                Secure
              </span>
              <span className="flex items-center">
                <Globe className="w-3 md:w-4 h-3 md:h-4 mr-1" />
                Global
              </span>
              <span className="flex items-center">
                <Heart className="w-3 md:w-4 h-3 md:h-4 mr-1" />
                Trusted
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}