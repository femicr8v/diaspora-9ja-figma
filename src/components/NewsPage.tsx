import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { 
  Calendar,
  Eye,
  Share2,
  Search,
  Filter,
  Clock,
  TrendingUp,
  Globe,
  Users,
  Crown,
  Lock,
  Star
} from "lucide-react";
import { ImageWithFallback } from './figma/ImageWithFallback';

interface NewsPageProps {
  isPremium?: boolean;
  onUpgrade?: () => void;
}

export default function NewsPage({ isPremium = false, onUpgrade }: NewsPageProps) {
  const featuredNews = [
    {
      id: 1,
      title: "Nigeria's Tech Diaspora Drives $2.3B Investment into African Startups",
      excerpt: "Nigerian professionals in Silicon Valley and London are leading unprecedented investment flows into African tech companies, creating a new wave of innovation across the continent.",
      category: "Technology",
      readTime: "5 min read",
      views: "2.3k",
      publishedAt: "2 hours ago",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop",
      featured: true,
      premium: false
    },
    {
      id: 2,
      title: "New UK Immigration Policy Creates Opportunities for Nigerian Professionals",
      excerpt: "Recent changes to the UK's skilled worker visa program have opened new pathways for Nigerian professionals in healthcare, engineering, and tech sectors.",
      category: "Immigration",
      readTime: "4 min read",
      views: "1.8k",
      publishedAt: "4 hours ago",
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=400&fit=crop",
      featured: false,
      premium: false
    }
  ];

  const premiumNews = [
    {
      id: 3,
      title: "Exclusive: Nigerian Diaspora Investment Patterns Analysis 2024",
      excerpt: "Deep-dive analysis into where and how diaspora Nigerians are investing their wealth, with sector-specific insights and future projections.",
      category: "Premium Analysis",
      readTime: "12 min read",
      views: "847",
      publishedAt: "6 hours ago",
      premium: true
    },
    {
      id: 4,
      title: "Behind the Scenes: Top 10 Nigerian Startups Raising Series A",
      excerpt: "Exclusive insider information on promising Nigerian startups currently in Series A fundraising, including pitch decks and investor meetings.",
      category: "Premium Business",
      readTime: "8 min read",
      views: "623",
      publishedAt: "8 hours ago",
      premium: true
    }
  ];

  const recentNews = [
    {
      id: 5,
      title: "Diaspora Remittances Reach Record High of $22 Billion in 2024",
      excerpt: "Latest CBN data shows Nigerian diaspora sent record amounts home, with digital channels accounting for 65% of transfers.",
      category: "Finance",
      readTime: "3 min read",
      views: "3.1k",
      publishedAt: "6 hours ago"
    },
    {
      id: 6,
      title: "Canada Announces New Express Entry Program for Nigerian Healthcare Workers",
      excerpt: "The program aims to fast-track immigration for qualified nurses, doctors, and medical technicians from Nigeria.",
      category: "Immigration",
      readTime: "4 min read",
      views: "2.7k",
      publishedAt: "8 hours ago"
    },
    {
      id: 7,
      title: "Nigerian Entrepreneurs Lead African Representation at Global Innovation Summit",
      excerpt: "Over 50 Nigerian startup founders attended the summit, showcasing innovations in fintech, healthtech, and agritech.",
      category: "Business",
      readTime: "6 min read",
      views: "1.9k",
      publishedAt: "12 hours ago"
    }
  ];

  const categories = ["All", "Technology", "Business", "Investment", "Immigration", "Finance", "Culture", "Education"];
  const trendingTopics = ["Diaspora Investment", "Tech Innovation", "Immigration Updates", "Remittances", "Business Opportunities"];

  const PremiumUpgradeCard = () => (
    <Card className="border-accent/40 bg-gradient-to-br from-accent/5 to-accent/10">
      <CardContent className="p-6 text-center">
        <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Crown className="w-8 h-8 text-accent" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Unlock Premium Content
        </h3>
        <p className="text-muted-foreground mb-4 text-sm">
          Get access to exclusive analysis, insider reports, and premium insights for just $10/month.
        </p>
        <Button 
          onClick={onUpgrade}
          className="bg-accent hover:bg-accent/90 text-accent-foreground w-full mb-2"
        >
          <Crown className="w-4 h-4 mr-2" />
          Upgrade to Premium
        </Button>
        <p className="text-xs text-muted-foreground">
          Cancel anytime • 7-day free trial
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
              Latest Updates
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl mb-4 text-foreground">
            Latest News
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Stay informed with the latest news and updates relevant to the Nigerian diaspora community worldwide.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search news..."
                  className="pl-10 h-11"
                />
              </div>
              <Button variant="outline" className="flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </Button>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={category === "All" ? "secondary" : "outline"}
                  size="sm"
                  className={category === "All" ? "bg-primary/10 text-primary" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Featured News */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground">Featured Stories</h2>
              {featuredNews.map((article) => (
                <Card key={article.id} className={`border-border/40 hover:shadow-lg transition-shadow duration-300 overflow-hidden ${article.featured ? 'border-primary/20' : ''}`}>
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <ImageWithFallback
                        src={article.image}
                        alt={article.title}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                    <div className="md:w-2/3 p-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          {article.category}
                        </Badge>
                        {article.featured && (
                          <Badge variant="secondary" className="bg-accent/10 text-accent">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-xl md:text-2xl mb-3 text-foreground leading-tight hover:text-primary transition-colors cursor-pointer">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{article.readTime}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{article.views}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{article.publishedAt}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Premium Content Section */}
            {!isPremium && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-foreground flex items-center space-x-2">
                    <Crown className="w-6 h-6 text-accent" />
                    <span>Premium Analysis</span>
                  </h2>
                  <Button 
                    onClick={onUpgrade}
                    variant="outline" 
                    size="sm"
                    className="border-accent/20 text-accent hover:bg-accent/5"
                  >
                    <Crown className="w-4 h-4 mr-1" />
                    Unlock
                  </Button>
                </div>
                
                {premiumNews.map((article) => (
                  <Card key={article.id} className="border-accent/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-accent/5 pointer-events-none" />
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className="bg-accent/10 text-accent border-accent/20">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    </div>
                    <CardContent className="p-6 relative">
                      <div className="flex items-center space-x-2 mb-3">
                        <Badge variant="secondary" className="bg-accent/20 text-accent">
                          {article.category}
                        </Badge>
                      </div>
                      <h3 className="text-xl mb-3 text-foreground">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{article.readTime}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{article.views}</span>
                          </div>
                        </div>
                        <Button 
                          onClick={onUpgrade}
                          size="sm" 
                          className="bg-accent hover:bg-accent/90 text-accent-foreground"
                        >
                          <Lock className="w-4 h-4 mr-1" />
                          Unlock
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Premium Content for Premium Users */}
            {isPremium && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground flex items-center space-x-2">
                  <Crown className="w-6 h-6 text-accent" />
                  <span>Premium Analysis</span>
                </h2>
                {premiumNews.map((article) => (
                  <Card key={article.id} className="border-accent/20 hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <Badge variant="secondary" className="bg-accent/10 text-accent">
                          {article.category}
                        </Badge>
                        <Badge className="bg-accent/10 text-accent border-accent/20">
                          <Crown className="w-3 h-3 mr-1" />
                          Premium
                        </Badge>
                      </div>
                      <h3 className="text-xl mb-3 text-foreground hover:text-primary transition-colors cursor-pointer">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{article.readTime}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{article.views}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{article.publishedAt}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Recent News */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground">Recent Updates</h2>
              <div className="grid gap-6">
                {recentNews.map((article) => (
                  <Card key={article.id} className="border-border/40 hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          {article.category}
                        </Badge>
                      </div>
                      <h3 className="text-xl mb-3 text-foreground hover:text-primary transition-colors cursor-pointer">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{article.readTime}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{article.views}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{article.publishedAt}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Premium Upgrade Card for Free Users */}
            {!isPremium && <PremiumUpgradeCard />}

            {/* Trending Topics */}
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  <span>Trending Topics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {trendingTopics.map((topic, index) => (
                  <Button
                    key={topic}
                    variant="ghost"
                    className="w-full justify-start text-left h-auto p-2 hover:bg-primary/5"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                        {index + 1}
                      </span>
                      <span className="text-sm">{topic}</span>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card className="border-border/40 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="mb-2 text-foreground">Stay Updated</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get the latest news delivered to your inbox weekly
                </p>
                <Input 
                  placeholder="Your email address" 
                  className="mb-3"
                />
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Subscribe
                </Button>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Community Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Articles this week</span>
                  <span className="font-semibold text-primary">28</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total readers</span>
                  <span className="font-semibold text-primary">15.2k</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Premium subscribers</span>
                  <span className="font-semibold text-accent">2.1k</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Contributors</span>
                  <span className="font-semibold text-primary">47</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}