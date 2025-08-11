import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  Crown,
  TrendingUp,
  Users,
  MessageSquare,
  Star,
  Calendar,
  DollarSign,
  Eye,
  Briefcase,
  BookOpen,
  Bell,
  BarChart3,
  Globe,
  ArrowUpRight,
  Download,
  Play,
  Award,
  Target
} from "lucide-react";
import logoImage from 'figma:asset/0be1b3fe61946b6a71598093280579589812311d.png';

interface MembershipDashboardProps {
  userName: string;
  onNavigate: (page: 'news' | 'investment' | 'business' | 'blog') => void;
}

export default function MembershipDashboard({ userName, onNavigate }: MembershipDashboardProps) {
  const memberStats = {
    networkConnections: 847,
    investmentViews: 12,
    businessLeads: 5,
    articlesRead: 23,
    memberSince: "January 2024"
  };

  const exclusiveContent = [
    {
      id: 1,
      type: 'Investment Analysis',
      title: 'Q1 2024 Nigerian Real Estate Market Deep Dive',
      description: 'Comprehensive analysis of Lagos and Abuja property markets with diaspora investment strategies.',
      icon: TrendingUp,
      readTime: '15 min',
      premium: true,
      category: 'Investment'
    },
    {
      id: 2,
      type: 'Expert Webinar',
      title: 'Scaling Your Business Across African Markets',
      description: 'Live session with successful Nigerian entrepreneurs who expanded across West Africa.',
      icon: Play,
      duration: '45 min',
      premium: true,
      category: 'Business'
    },
    {
      id: 3,
      type: 'Market Report',
      title: 'Fintech Investment Opportunities in Nigeria 2024',
      description: 'Exclusive insights into emerging fintech startups seeking diaspora investment.',
      icon: BarChart3,
      readTime: '12 min',
      premium: true,
      category: 'Investment'
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Premium Members Networking Event',
      date: '2024-02-15',
      time: '7:00 PM GMT',
      type: 'Virtual',
      attendees: 45,
      description: 'Exclusive networking session for premium members in tech and finance.'
    },
    {
      id: 2,
      title: 'Investment Masterclass: Real Estate',
      date: '2024-02-20',
      time: '6:00 PM GMT',
      type: 'Webinar',
      attendees: 120,
      description: 'Expert-led session on real estate investment strategies for diaspora Nigerians.'
    },
    {
      id: 3,
      title: 'Mentorship Speed Dating',
      date: '2024-02-25',
      time: '8:00 PM GMT',
      type: 'Virtual',
      attendees: 60,
      description: '15-minute sessions with industry leaders across various sectors.'
    }
  ];

  const premiumInsights = [
    {
      title: 'Network Growth',
      value: '23%',
      change: '+5%',
      description: 'vs last month',
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Investment Views',
      value: '12',
      change: '+8',
      description: 'new opportunities',
      icon: Eye,
      color: 'text-blue-600'
    },
    {
      title: 'Business Leads',
      value: '5',
      change: '+2',
      description: 'this week',
      icon: Briefcase,
      color: 'text-purple-600'
    },
    {
      title: 'Engagement Score',
      value: '92%',
      change: '+12%',
      description: 'community rank',
      icon: Star,
      color: 'text-accent'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 flex items-center justify-center">
                <img 
                  src={logoImage} 
                  alt="Diaspora 9ja Logo" 
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl text-foreground">
                  Welcome back, {userName}!
                </h1>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge className="bg-accent/10 text-accent border-accent/20">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium Member
                  </Badge>
                  <span className="text-muted-foreground text-sm">
                    Member since {memberStats.memberSince}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-lg text-muted-foreground">
            Your premium dashboard with exclusive insights, networking opportunities, and personalized recommendations.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {premiumInsights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <Card key={index} className="border-border/40">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-5 h-5 ${insight.color}`} />
                    <span className={`text-xs font-medium ${insight.color}`}>
                      {insight.change}
                    </span>
                  </div>
                  <div className="text-2xl font-semibold text-foreground">
                    {insight.value}
                  </div>
                  <p className="text-sm text-muted-foreground">{insight.title}</p>
                  <p className="text-xs text-muted-foreground">{insight.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Exclusive Content */}
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-accent" />
                  <span>Premium Exclusive Content</span>
                </CardTitle>
                <p className="text-muted-foreground">
                  Access content available only to premium members
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {exclusiveContent.map((content) => {
                  const Icon = content.icon;
                  return (
                    <div key={content.id} className="flex items-start space-x-4 p-4 border border-border/40 rounded-lg hover:bg-secondary/30 transition-colors">
                      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-accent" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge variant="secondary" className="text-xs">
                            {content.type}
                          </Badge>
                          <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 text-xs">
                            Premium
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-foreground mb-1">
                          {content.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {content.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {content.readTime || content.duration}
                          </span>
                          <Button variant="ghost" size="sm">
                            <ArrowUpRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Quick Access */}
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-primary" />
                  <span>Platform Quick Access</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    onClick={() => onNavigate('investment')}
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <TrendingUp className="w-6 h-6 text-accent" />
                    <span>Investments</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onNavigate('business')}
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <Briefcase className="w-6 h-6 text-primary" />
                    <span>Business</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onNavigate('news')}
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <Bell className="w-6 h-6 text-blue-600" />
                    <span>Latest News</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onNavigate('blog')}
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <BookOpen className="w-6 h-6 text-purple-600" />
                    <span>Blog</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Network Progress */}
            <Card className="border-border/40 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-foreground">Network Goal</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current: {memberStats.networkConnections}</span>
                    <span className="text-primary font-semibold">Goal: 1,000</span>
                  </div>
                  <Progress value={84} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    84% complete - 153 connections to go!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-accent" />
                  <span>Premium Events</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="border border-border/40 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {event.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {event.attendees} attending
                      </span>
                    </div>
                    <h4 className="font-semibold text-sm text-foreground mb-1">
                      {event.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      {event.description}
                    </p>
                    <div className="text-xs text-muted-foreground">
                      {event.date} • {event.time}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Member Achievements */}
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-accent" />
                  <span>Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3 p-2 bg-accent/10 rounded-lg">
                  <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Super Networker</p>
                    <p className="text-xs text-muted-foreground">500+ connections</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 bg-primary/10 rounded-lg">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <Eye className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Investment Explorer</p>
                    <p className="text-xs text-muted-foreground">10+ opportunities viewed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}