import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { 
  BookOpen,
  Calendar,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Search,
  Filter,
  User,
  TrendingUp,
  Globe,
  Users
} from "lucide-react";
import { ImageWithFallback } from './figma/ImageWithFallback';

export default function BlogPage() {
  const featuredPosts = [
    {
      id: 1,
      title: "From Lagos to Silicon Valley: My Journey as a Nigerian Tech Entrepreneur",
      excerpt: "Five years ago, I left my comfortable job in Lagos to pursue my dreams in Silicon Valley. Here's everything I learned about building a startup as a Nigerian immigrant in America.",
      author: "Adaora Okonkwo",
      authorRole: "CEO, TechBridge Solutions",
      authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b352?w=100&h=100&fit=crop&crop=face",
      category: "Entrepreneurship",
      readTime: "8 min read",
      publishedAt: "2 days ago",
      views: 4200,
      likes: 127,
      comments: 23,
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop",
      featured: true
    },
    {
      id: 2,
      title: "Navigating Cultural Identity: Raising Nigerian Children in the Diaspora",
      excerpt: "How do we maintain our cultural heritage while allowing our children to thrive in their new home countries? A personal reflection on parenting in the diaspora.",
      author: "Dr. Emeka Nwosu",
      authorRole: "Pediatrician & Father of 3",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      category: "Culture & Family",
      readTime: "6 min read",
      publishedAt: "4 days ago",
      views: 3100,
      likes: 89,
      comments: 31,
      image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=400&fit=crop",
      featured: true
    }
  ];

  const recentPosts = [
    {
      id: 3,
      title: "The Rise of Nigerian Fintech: How Diaspora Expertise is Driving Innovation",
      excerpt: "Nigerian fintech companies are transforming Africa's financial landscape, powered by diaspora professionals bringing global expertise home.",
      author: "Kemi Adeleke",
      authorRole: "Fintech Consultant",
      category: "Technology",
      readTime: "5 min read",
      publishedAt: "1 week ago",
      views: 2800,
      likes: 76,
      comments: 19
    },
    {
      id: 4,
      title: "Building Bridges: How to Start a Successful Import-Export Business",
      excerpt: "A comprehensive guide to leveraging diaspora connections for import-export opportunities between Nigeria and your host country.",
      author: "Olu Taiwo",
      authorRole: "International Trade Expert",
      category: "Business",
      readTime: "7 min read",
      publishedAt: "1 week ago",
      views: 2400,
      likes: 92,
      comments: 15
    },
    {
      id: 5,
      title: "Mental Health in the Diaspora: Breaking the Silence",
      excerpt: "Addressing the unique mental health challenges faced by Nigerian immigrants and the importance of community support systems.",
      author: "Dr. Funmi Oladele",
      authorRole: "Clinical Psychologist",
      category: "Health & Wellness",
      readTime: "4 min read",
      publishedAt: "2 weeks ago",
      views: 1900,
      likes: 67,
      comments: 28
    },
    {
      id: 6,
      title: "Investment Opportunities Back Home: A Diaspora Guide to Nigerian Markets",
      excerpt: "Practical insights on how diaspora Nigerians can invest in Nigeria's growing economy while managing risks and maximizing returns.",
      author: "Tunde Bakare",
      authorRole: "Investment Advisor",
      category: "Investment",
      readTime: "6 min read",
      publishedAt: "2 weeks ago",
      views: 3200,
      likes: 134,
      comments: 42
    }
  ];

  const categories = [
    "All", "Entrepreneurship", "Technology", "Culture & Family", 
    "Business", "Investment", "Health & Wellness", "Education", "Immigration"
  ];

  const trendingTopics = [
    "Startup Funding", "Cultural Heritage", "Remote Work", 
    "Nigerian Economy", "Diaspora Investment", "Tech Innovation"
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-accent" />
            </div>
            <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
              Community Stories
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl mb-4 text-foreground">
            Blog & Insights
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Stories, insights, and experiences from our global Nigerian community. Share knowledge, inspire others, and build connections through storytelling.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Search and Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  className="pl-10 h-11"
                />
              </div>
              <Button variant="outline" className="flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </Button>
              <Button className="bg-primary hover:bg-primary/90">
                Write Article
              </Button>
            </div>

            {/* Category Filters */}
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

            {/* Featured Posts */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground">Featured Stories</h2>
              {featuredPosts.map((post) => (
                <Card key={post.id} className="border-border/40 hover:shadow-lg transition-shadow duration-300 border-accent/20 overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <ImageWithFallback
                        src={post.image}
                        alt={post.title}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                    <div className="md:w-2/3 p-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          {post.category}
                        </Badge>
                        <Badge variant="secondary" className="bg-accent/10 text-accent">
                          Featured
                        </Badge>
                      </div>
                      
                      <h3 className="text-xl md:text-2xl mb-3 text-foreground leading-tight hover:text-primary transition-colors cursor-pointer">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {post.excerpt}
                      </p>

                      {/* Author Info */}
                      <div className="flex items-center space-x-3 mb-4">
                        <ImageWithFallback
                          src={post.authorAvatar}
                          alt={post.author}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-foreground text-sm">{post.author}</p>
                          <p className="text-xs text-muted-foreground">{post.authorRole}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{post.readTime}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{post.publishedAt}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{post.views.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span>{post.likes}</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{post.comments}</span>
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Recent Posts */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground">Recent Articles</h2>
              <div className="grid gap-6">
                {recentPosts.map((post) => (
                  <Card key={post.id} className="border-border/40 hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          {post.category}
                        </Badge>
                      </div>
                      
                      <h3 className="text-xl mb-3 text-foreground hover:text-primary transition-colors cursor-pointer">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {post.excerpt}
                      </p>

                      {/* Author Info */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground text-sm">{post.author}</p>
                            <p className="text-xs text-muted-foreground">{post.authorRole}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{post.readTime}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{post.publishedAt}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{post.views.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span>{post.likes}</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{post.comments}</span>
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Write for Us */}
            <Card className="border-border/40 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <h3 className="mb-2 text-foreground">Share Your Story</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Have insights to share with the community? Write for our blog and inspire others.
                </p>
                <Button className="w-full bg-primary hover:bg-primary/90 mb-2">
                  Write Article
                </Button>
                <Button variant="outline" className="w-full">
                  Guidelines
                </Button>
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card className="border-border/40">
              <CardContent className="p-6">
                <h3 className="flex items-center space-x-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  <span>Trending Topics</span>
                </h3>
                <div className="space-y-2">
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
                </div>
              </CardContent>
            </Card>

            {/* Newsletter */}
            <Card className="border-border/40">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-accent" />
                </div>
                <h3 className="mb-2 text-foreground">Weekly Digest</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get the week's best stories delivered to your inbox
                </p>
                <Input 
                  placeholder="Your email address" 
                  className="mb-3"
                />
                <Button className="w-full bg-accent hover:bg-accent/90">
                  Subscribe
                </Button>
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card className="border-border/40">
              <CardContent className="p-6">
                <h3 className="mb-4">Community Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Articles Published</span>
                    <span className="font-semibold text-primary">342</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Contributing Authors</span>
                    <span className="font-semibold text-primary">87</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Monthly Readers</span>
                    <span className="font-semibold text-primary">24.5k</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Comments This Month</span>
                    <span className="font-semibold text-primary">1.2k</span>
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