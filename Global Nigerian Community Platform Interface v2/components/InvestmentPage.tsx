import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import { 
  TrendingUp,
  DollarSign,
  BarChart3,
  MapPin,
  Calendar,
  Users,
  Search,
  Filter,
  Star,
  ArrowUpRight,
  Building,
  Zap,
  Truck,
  Smartphone
} from "lucide-react";
import { ImageWithFallback } from './figma/ImageWithFallback';

export default function InvestmentPage() {
  const featuredInvestments = [
    {
      id: 1,
      title: "Lagos Smart City Infrastructure Project",
      description: "Revolutionary urban development project transforming Lagos into a smart city with renewable energy, efficient transportation, and digital infrastructure.",
      sector: "Infrastructure",
      targetAmount: "$50M",
      raisedAmount: "$32M",
      progress: 64,
      minInvestment: "$10,000",
      expectedReturns: "12-15% annually",
      duration: "5-7 years",
      location: "Lagos, Nigeria",
      investors: 234,
      featured: true,
      riskLevel: "Medium",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop"
    },
    {
      id: 2,
      title: "Nigerian Fintech Scale-up Fund",
      description: "Investment fund focusing on Series A and B Nigerian fintech companies with proven traction and expansion plans across West Africa.",
      sector: "Technology",
      targetAmount: "$25M",
      raisedAmount: "$18M",
      progress: 72,
      minInvestment: "$25,000",
      expectedReturns: "25-35% over 3-5 years",
      duration: "3-5 years",
      location: "Multi-city",
      investors: 89,
      featured: true,
      riskLevel: "High",
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=400&fit=crop"
    }
  ];

  const investmentOpportunities = [
    {
      id: 3,
      title: "Renewable Energy Farm - Kano State",
      description: "Solar and wind energy project providing clean power to northern Nigeria communities while generating steady returns for investors.",
      sector: "Energy",
      targetAmount: "$15M",
      raisedAmount: "$8M",
      progress: 53,
      minInvestment: "$5,000",
      expectedReturns: "8-12% annually",
      duration: "7-10 years",
      location: "Kano, Nigeria",
      investors: 156,
      riskLevel: "Low"
    },
    {
      id: 4,
      title: "Agricultural Processing Hub",
      description: "Modern food processing facility to add value to raw agricultural products and reduce post-harvest losses in the Middle Belt region.",
      sector: "Agriculture",
      targetAmount: "$8M",
      raisedAmount: "$3M",
      progress: 38,
      minInvestment: "$2,500",
      expectedReturns: "10-14% annually",
      duration: "4-6 years",
      location: "Jos, Nigeria",
      investors: 78,
      riskLevel: "Medium"
    },
    {
      id: 5,
      title: "E-commerce Logistics Network",
      description: "Last-mile delivery network connecting major Nigerian cities with efficient, technology-driven logistics solutions.",
      sector: "Logistics",
      targetAmount: "$12M",
      raisedAmount: "$5M",
      progress: 42,
      minInvestment: "$7,500",
      expectedReturns: "15-20% over 3-4 years",
      duration: "3-4 years",
      location: "Multi-city",
      investors: 92,
      riskLevel: "Medium"
    },
    {
      id: 6,
      title: "Healthcare Technology Platform",
      description: "Telemedicine and digital health records platform improving healthcare access in underserved Nigerian communities.",
      sector: "Healthcare",
      targetAmount: "$6M",
      raisedAmount: "$2M",
      progress: 33,
      minInvestment: "$3,000",
      expectedReturns: "20-30% over 4-5 years",
      duration: "4-5 years",
      location: "Abuja, Nigeria",
      investors: 67,
      riskLevel: "Medium"
    }
  ];

  const investmentTypes = ["All", "Technology", "Infrastructure", "Energy", "Agriculture", "Healthcare", "Logistics", "Real Estate"];
  const riskLevels = ["All Risk Levels", "Low Risk", "Medium Risk", "High Risk"];

  const getSectorIcon = (sector: string) => {
    switch (sector.toLowerCase()) {
      case 'technology':
        return Smartphone;
      case 'infrastructure':
        return Building;
      case 'energy':
        return Zap;
      case 'logistics':
        return Truck;
      default:
        return BarChart3;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
              Investment Hub
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl mb-4 text-foreground">
            Investment Opportunities
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Discover vetted investment opportunities in Nigeria and across Africa. Build wealth while contributing to economic growth.
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
                  placeholder="Search investments..."
                  className="pl-10 h-11"
                />
              </div>
              <Button variant="outline" className="flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </Button>
            </div>

            {/* Filter Tabs */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {investmentTypes.map((type) => (
                  <Button
                    key={type}
                    variant={type === "All" ? "secondary" : "outline"}
                    size="sm"
                    className={type === "All" ? "bg-primary/10 text-primary" : ""}
                  >
                    {type}
                  </Button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {riskLevels.map((risk) => (
                  <Button
                    key={risk}
                    variant={risk === "All Risk Levels" ? "secondary" : "outline"}
                    size="sm"
                    className={risk === "All Risk Levels" ? "bg-accent/10 text-accent" : ""}
                  >
                    {risk}
                  </Button>
                ))}
              </div>
            </div>

            {/* Featured Investments */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground flex items-center space-x-2">
                <Star className="w-6 h-6 text-accent" />
                <span>Featured Opportunities</span>
              </h2>
              {featuredInvestments.map((investment) => {
                const SectorIcon = getSectorIcon(investment.sector);
                return (
                  <Card key={investment.id} className="border-border/40 hover:shadow-lg transition-shadow duration-300 border-accent/20 overflow-hidden">
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <ImageWithFallback
                          src={investment.image}
                          alt={investment.title}
                          className="w-full h-48 md:h-full object-cover"
                        />
                      </div>
                      <div className="md:w-2/3 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="bg-primary/10 text-primary flex items-center space-x-1">
                              <SectorIcon className="w-3 h-3" />
                              <span>{investment.sector}</span>
                            </Badge>
                            <Badge variant="outline" className={getRiskColor(investment.riskLevel)}>
                              {investment.riskLevel} Risk
                            </Badge>
                            <Badge variant="secondary" className="bg-accent/10 text-accent">
                              Featured
                            </Badge>
                          </div>
                          <Button variant="ghost" size="sm">
                            <ArrowUpRight className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <h3 className="text-xl md:text-2xl mb-3 text-foreground leading-tight hover:text-primary transition-colors cursor-pointer">
                          {investment.title}
                        </h3>
                        <p className="text-muted-foreground mb-4 leading-relaxed">
                          {investment.description}
                        </p>
                        
                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">
                              Raised: <span className="font-semibold text-accent">{investment.raisedAmount}</span> of {investment.targetAmount}
                            </span>
                            <span className="text-accent font-semibold">{investment.progress}%</span>
                          </div>
                          <Progress value={investment.progress} className="h-2" />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Min. Investment</p>
                            <p className="font-semibold text-foreground">{investment.minInvestment}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Expected Returns</p>
                            <p className="font-semibold text-accent">{investment.expectedReturns}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Duration</p>
                            <p className="font-semibold text-foreground">{investment.duration}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Investors</p>
                            <p className="font-semibold text-foreground">{investment.investors}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* All Opportunities */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground">All Opportunities</h2>
              <div className="grid gap-6">
                {investmentOpportunities.map((investment) => {
                  const SectorIcon = getSectorIcon(investment.sector);
                  return (
                    <Card key={investment.id} className="border-border/40 hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="bg-primary/10 text-primary flex items-center space-x-1">
                              <SectorIcon className="w-3 h-3" />
                              <span>{investment.sector}</span>
                            </Badge>
                            <Badge variant="outline" className={getRiskColor(investment.riskLevel)}>
                              {investment.riskLevel} Risk
                            </Badge>
                          </div>
                          <Button variant="ghost" size="sm">
                            <ArrowUpRight className="w-4 h-4" />
                          </Button>
                        </div>

                        <h3 className="text-xl mb-3 text-foreground hover:text-primary transition-colors cursor-pointer">
                          {investment.title}
                        </h3>
                        <p className="text-muted-foreground mb-4 leading-relaxed">
                          {investment.description}
                        </p>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">
                              Raised: <span className="font-semibold text-accent">{investment.raisedAmount}</span> of {investment.targetAmount}
                            </span>
                            <span className="text-accent font-semibold">{investment.progress}%</span>
                          </div>
                          <Progress value={investment.progress} className="h-2" />
                        </div>

                        <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-4 h-4" />
                            <span>Min: {investment.minInvestment}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <BarChart3 className="w-4 h-4" />
                            <span>{investment.expectedReturns}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{investment.duration}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{investment.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{investment.investors} investors</span>
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
            {/* Investment Guide */}
            <Card className="border-border/40 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="mb-2 text-foreground">New to Investing?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Download our comprehensive guide to diaspora investing
                </p>
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Download Guide
                </Button>
              </CardContent>
            </Card>

            {/* Top Performers */}
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  <span>Top Performers</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {['Agritech Fund IV', 'Lagos Real Estate', 'Fintech Ventures'].map((fund, index) => (
                  <div key={fund} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{fund}</p>
                      <p className="text-xs text-muted-foreground">12 months</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      +{25 - index * 3}%
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Investment Stats */}
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Platform Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Invested</span>
                  <span className="font-semibold text-primary">$127M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Active Projects</span>
                  <span className="font-semibold text-primary">42</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Avg. Returns</span>
                  <span className="font-semibold text-accent">14.7%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Investors</span>
                  <span className="font-semibold text-primary">2.1k</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}