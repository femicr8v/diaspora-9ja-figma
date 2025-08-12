import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { 
  Briefcase,
  MapPin,
  Calendar,
  Users,
  Search,
  Filter,
  Star,
  ArrowUpRight,
  Building,
  Smartphone,
  Heart,
  GraduationCap,
  Home,
  Utensils,
  ShoppingBag,
  Globe,
  Phone,
  Mail
} from "lucide-react";
import { ImageWithFallback } from './figma/ImageWithFallback';

export default function BusinessPage() {
  const featuredBusinesses = [
    {
      id: 1,
      businessName: "NaijaConnect Tech Solutions",
      description: "Full-service IT consulting and software development company specializing in digital transformation for Nigerian businesses expanding globally.",
      category: "Technology",
      location: "Toronto, Canada",
      owner: "Kemi Adebayo",
      experience: "8 years",
      services: ["Web Development", "Mobile Apps", "Cloud Migration", "IT Consulting"],
      rating: 4.9,
      reviews: 127,
      price: "Starting from $2,500",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop",
      verified: true,
      featured: true
    },
    {
      id: 2,
      businessName: "Diaspora Legal Services",
      description: "Immigration and business law firm helping Nigerian professionals navigate legal processes in the US, UK, and Canada.",
      category: "Legal Services",
      location: "London, UK",
      owner: "Barrister Emeka Okafor",
      experience: "12 years",
      services: ["Immigration Law", "Business Formation", "Contract Review", "Family Law"],
      rating: 4.8,
      reviews: 89,
      price: "Consultation from $150",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=400&fit=crop",
      verified: true,
      featured: true
    }
  ];

  const businessListings = [
    {
      id: 3,
      businessName: "Afrobeats Event Planning",
      description: "Professional event planning services for weddings, corporate events, and cultural celebrations in the diaspora community.",
      category: "Events & Entertainment",
      location: "New York, USA",
      owner: "Funmi Johnson",
      experience: "5 years",
      services: ["Wedding Planning", "Corporate Events", "Cultural Celebrations"],
      rating: 4.7,
      reviews: 64,
      price: "Packages from $1,200",
      verified: true
    },
    {
      id: 4,
      businessName: "Nigerian Cuisine Catering",
      description: "Authentic Nigerian food catering for events, parties, and corporate functions. Specializing in traditional and modern fusion dishes.",
      category: "Food & Catering",
      location: "Sydney, Australia",
      owner: "Chef Adunni Oladipo",
      experience: "6 years",
      services: ["Event Catering", "Meal Prep", "Cooking Classes", "Recipe Development"],
      rating: 4.9,
      reviews: 112,
      price: "From $15 per person",
      verified: true
    },
    {
      id: 5,
      businessName: "Diaspora Real Estate Group",
      description: "Real estate investment and property management services specializing in Nigerian diaspora property investments.",
      category: "Real Estate",
      location: "Dubai, UAE",
      owner: "Tunde Adesina",
      experience: "10 years",
      services: ["Property Investment", "Property Management", "Relocation Services"],
      rating: 4.6,
      reviews: 78,
      price: "Commission-based",
      verified: true
    },
    {
      id: 6,
      businessName: "African Beauty & Wellness Spa",
      description: "Premium wellness spa offering traditional African beauty treatments and modern wellness services for the diaspora community.",
      category: "Health & Beauty",
      location: "Atlanta, USA",
      owner: "Ngozi Williams",
      experience: "7 years",
      services: ["Spa Treatments", "Beauty Services", "Wellness Coaching"],
      rating: 4.8,
      reviews: 95,
      price: "Services from $80",
      verified: true
    }
  ];

  const categories = [
    { name: "All", icon: Globe },
    { name: "Technology", icon: Smartphone },
    { name: "Legal Services", icon: Building },
    { name: "Health & Beauty", icon: Heart },
    { name: "Education", icon: GraduationCap },
    { name: "Real Estate", icon: Home },
    { name: "Food & Catering", icon: Utensils },
    { name: "Events & Entertainment", icon: ShoppingBag }
  ];

  const getCategoryIcon = (category: string) => {
    const categoryMap: Record<string, any> = {
      'Technology': Smartphone,
      'Legal Services': Building,
      'Health & Beauty': Heart,
      'Education': GraduationCap,
      'Real Estate': Home,
      'Food & Catering': Utensils,
      'Events & Entertainment': ShoppingBag,
    };
    return categoryMap[category] || Briefcase;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary" />
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              Business Directory
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl mb-4 text-foreground">
            Business Advertisements
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Discover and connect with Nigerian-owned businesses worldwide. Support our community entrepreneurs and find trusted services.
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
                  placeholder="Search businesses, services..."
                  className="pl-10 h-11"
                />
              </div>
              <Button variant="outline" className="flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </Button>
              <Button className="bg-primary hover:bg-primary/90">
                Post Your Business
              </Button>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.name}
                    variant={category.name === "All" ? "secondary" : "outline"}
                    size="sm"
                    className={`flex items-center space-x-2 ${category.name === "All" ? "bg-primary/10 text-primary" : ""}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{category.name}</span>
                  </Button>
                );
              })}
            </div>

            {/* Featured Businesses */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground flex items-center space-x-2">
                <Star className="w-6 h-6 text-accent" />
                <span>Featured Businesses</span>
              </h2>
              {featuredBusinesses.map((business) => {
                const CategoryIcon = getCategoryIcon(business.category);
                return (
                  <Card key={business.id} className="border-border/40 hover:shadow-lg transition-shadow duration-300 border-accent/20 overflow-hidden">
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <ImageWithFallback
                          src={business.image}
                          alt={business.businessName}
                          className="w-full h-48 md:h-full object-cover"
                        />
                      </div>
                      <div className="md:w-2/3 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="bg-primary/10 text-primary flex items-center space-x-1">
                              <CategoryIcon className="w-3 h-3" />
                              <span>{business.category}</span>
                            </Badge>
                            {business.verified && (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                ✓ Verified
                              </Badge>
                            )}
                            <Badge variant="secondary" className="bg-accent/10 text-accent">
                              Featured
                            </Badge>
                          </div>
                          <Button variant="ghost" size="sm">
                            <ArrowUpRight className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <h3 className="text-xl md:text-2xl mb-2 text-foreground leading-tight hover:text-primary transition-colors cursor-pointer">
                          {business.businessName}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          by {business.owner} • {business.experience} experience
                        </p>
                        <p className="text-muted-foreground mb-4 leading-relaxed">
                          {business.description}
                        </p>

                        {/* Services */}
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {business.services.slice(0, 3).map((service) => (
                              <Badge key={service} variant="outline" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                            {business.services.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{business.services.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{business.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-accent fill-accent" />
                            <span className="font-semibold text-foreground">{business.rating}</span>
                            <span className="text-muted-foreground">({business.reviews})</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-muted-foreground">Price:</span>
                            <span className="font-semibold text-accent">{business.price}</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Phone className="w-3 h-3 mr-1" />
                              Contact
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* All Business Listings */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground">All Business Listings</h2>
              <div className="grid gap-6">
                {businessListings.map((business) => {
                  const CategoryIcon = getCategoryIcon(business.category);
                  return (
                    <Card key={business.id} className="border-border/40 hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="bg-primary/10 text-primary flex items-center space-x-1">
                              <CategoryIcon className="w-3 h-3" />
                              <span>{business.category}</span>
                            </Badge>
                            {business.verified && (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                ✓ Verified
                              </Badge>
                            )}
                          </div>
                          <Button variant="ghost" size="sm">
                            <ArrowUpRight className="w-4 h-4" />
                          </Button>
                        </div>

                        <h3 className="text-xl mb-2 text-foreground hover:text-primary transition-colors cursor-pointer">
                          {business.businessName}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          by {business.owner} • {business.experience} experience
                        </p>
                        <p className="text-muted-foreground mb-4 leading-relaxed">
                          {business.description}
                        </p>

                        {/* Services */}
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {business.services.map((service) => (
                              <Badge key={service} variant="outline" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-6 text-sm text-muted-foreground items-center">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{business.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-accent fill-accent" />
                            <span className="font-semibold text-foreground">{business.rating}</span>
                            <span>({business.reviews} reviews)</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span>Price: <span className="font-semibold text-accent">{business.price}</span></span>
                          </div>
                          <div className="flex space-x-2 ml-auto">
                            <Button size="sm" variant="outline">
                              <Phone className="w-3 h-3 mr-1" />
                              Contact
                            </Button>
                            <Button size="sm" variant="outline">
                              <Mail className="w-3 h-3 mr-1" />
                              Email
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Post Your Business */}
            <Card className="border-border/40 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <h3 className="mb-2 text-foreground">Own a Business?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  List your business and reach thousands of diaspora Nigerians
                </p>
                <Button className="w-full bg-primary hover:bg-primary/90 mb-2">
                  List Your Business
                </Button>
                <Button variant="outline" className="w-full">
                  View Pricing
                </Button>
              </CardContent>
            </Card>

            {/* Top Rated Businesses */}
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-accent" />
                  <span>Top Rated</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {['Tech Solutions Plus', 'Legal Eagle Law', 'Premium Catering Co.'].map((business, index) => (
                  <div key={business} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{business}</p>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-accent fill-accent" />
                        <span className="text-xs text-muted-foreground">{(4.9 - index * 0.1).toFixed(1)}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {['Tech', 'Legal', 'Food'][index]}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Platform Stats */}
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Directory Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Listed Businesses</span>
                  <span className="font-semibold text-primary">847</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Verified Businesses</span>
                  <span className="font-semibold text-primary">723</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Countries</span>
                  <span className="font-semibold text-primary">28</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Avg. Rating</span>
                  <span className="font-semibold text-accent">4.7★</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}