import { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { 
  Crown,
  Check,
  X,
  ArrowLeft,
  CreditCard,
  Lock,
  Star,
  Users,
  TrendingUp,
  MessageSquare,
  Briefcase,
  BookOpen,
  Globe,
  Zap,
  Shield,
  BarChart3,
  Clock
} from "lucide-react";
import logoImage from 'figma:asset/0be1b3fe61946b6a71598093280579589812311d.png';

interface MembershipPageProps {
  onUpgrade: () => void;
  onBack: () => void;
  isLoggedIn: boolean;
}

export default function MembershipPage({ onUpgrade, onBack, isLoggedIn }: MembershipPageProps) {
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'premium'>('premium');
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStripePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate Stripe payment processing
    try {
      console.log('Processing Stripe payment for Premium membership...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock successful Stripe response
      console.log('Stripe payment successful');
      setIsProcessing(false);
      onUpgrade();
    } catch (error) {
      console.error('Stripe payment failed:', error);
      setIsProcessing(false);
      alert('Payment failed. Please try again.');
    }
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentData({ ...paymentData, [field]: e.target.value });
  };

  const features = {
    free: [
      { feature: 'Access to community posts', included: true },
      { feature: 'Basic news and updates', included: true },
      { feature: 'Public forum participation', included: true },
      { feature: 'Limited business directory', included: true },
      { feature: 'Premium news analysis', included: false },
      { feature: 'Exclusive investment opportunities', included: false },
      { feature: 'Priority business listings', included: false },
      { feature: 'Mentorship matching', included: false },
      { feature: 'Private community groups', included: false },
      { feature: 'Expert webinars & events', included: false },
      { feature: 'Direct messaging', included: false },
      { feature: 'Advanced analytics dashboard', included: false },
    ],
    premium: [
      { feature: 'Access to community posts', included: true },
      { feature: 'Basic news and updates', included: true },
      { feature: 'Public forum participation', included: true },
      { feature: 'Limited business directory', included: true },
      { feature: 'Premium news analysis', included: true },
      { feature: 'Exclusive investment opportunities', included: true },
      { feature: 'Priority business listings', included: true },
      { feature: 'Mentorship matching', included: true },
      { feature: 'Private community groups', included: true },
      { feature: 'Expert webinars & events', included: true },
      { feature: 'Direct messaging', included: true },
      { feature: 'Advanced analytics dashboard', included: true },
    ]
  };

  const premiumBenefits = [
    {
      icon: TrendingUp,
      title: 'Exclusive Investment Access',
      description: 'Get early access to vetted investment opportunities and detailed market analysis.'
    },
    {
      icon: Users,
      title: 'VIP Mentorship Network',
      description: 'Connect with top-tier professionals and industry leaders for personalized guidance.'
    },
    {
      icon: MessageSquare,
      title: 'Private Community Groups',
      description: 'Join exclusive discussion groups organized by industry, location, and interests.'
    },
    {
      icon: Star,
      title: 'Premium Content & Analysis',
      description: 'Access in-depth articles, market reports, and expert insights unavailable to free users.'
    },
    {
      icon: Briefcase,
      title: 'Priority Business Exposure',
      description: 'Get your business featured prominently in our directory with enhanced visibility.'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics Dashboard',
      description: 'Track your network growth, engagement metrics, and investment portfolio performance.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/5">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 flex items-center justify-center">
              <img 
                src={logoImage} 
                alt="Diaspora 9ja Logo" 
                className="w-12 h-12 object-contain"
              />
            </div>
            <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
              Premium Membership
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl mb-4 text-foreground font-headers">
            Unlock Premium Access
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of successful diaspora professionals with exclusive access to premium content, networking, and opportunities.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Pricing Plans */}
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-foreground text-center font-headers">Choose Your Plan</h2>
            
            {/* Free Plan */}
            <Card className="border-border/40 relative overflow-hidden">
              <CardHeader className="text-center pb-4">
                <CardTitle className="flex items-center justify-center space-x-2 font-headers">
                  <Globe className="w-5 h-5 text-muted-foreground" />
                  <span>Free Membership</span>
                </CardTitle>
                <div className="text-3xl font-semibold text-foreground font-headers">$0</div>
                <p className="text-muted-foreground">Basic community access</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {features.free.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      {item.included ? (
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className={`text-sm ${item.included ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {item.feature}
                      </span>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  disabled
                >
                  Current Plan
                </Button>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="border-accent/40 relative overflow-hidden shadow-xl bg-gradient-to-br from-background to-accent/5">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-accent via-accent to-primary text-white px-4 py-1 text-sm font-medium">
                🎉 Early Bird Special
              </div>
              <CardHeader className="text-center pb-4 pt-8">
                <CardTitle className="flex items-center justify-center space-x-2 font-headers">
                  <Crown className="w-5 h-5 text-accent" />
                  <span>Premium Membership</span>
                </CardTitle>
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-4xl font-semibold text-accent font-headers">$10</span>
                    <div className="text-left">
                      <div className="text-sm text-muted-foreground line-through">$25</div>
                      <div className="text-xs text-accent font-medium">Early Bird</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">per month • Full access</p>
                  <div className="flex items-center justify-center space-x-1 text-xs text-accent">
                    <Clock className="w-3 h-3" />
                    <span>Limited time offer</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {features.premium.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-foreground">
                        {item.feature}
                      </span>
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={() => setSelectedPlan('premium')}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Premium
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Price increases to $25/month after early bird period
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Stripe Payment Form */}
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-foreground text-center font-headers">Secure Payment with Stripe</h2>
            
            <Card className="border-border/40 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 font-headers">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <span>Payment Details</span>
                </CardTitle>
                <p className="text-muted-foreground">
                  Secure payment processing with Stripe's 256-bit SSL encryption
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleStripePayment} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      placeholder="Full name as it appears on card"
                      value={paymentData.name}
                      onChange={handleInputChange('name')}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={paymentData.cardNumber}
                      onChange={handleInputChange('cardNumber')}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={paymentData.expiryDate}
                        onChange={handleInputChange('expiryDate')}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={paymentData.cvv}
                        onChange={handleInputChange('cvv')}
                        required
                      />
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gradient-to-r from-accent/5 to-primary/5 rounded-lg p-4 space-y-2 border border-accent/20">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Premium Membership (Early Bird)</span>
                      <div className="text-right">
                        <span className="text-sm text-muted-foreground line-through">$25.00</span>
                        <div className="font-semibold text-accent">$10.00</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Processing Fee</span>
                      <span className="font-semibold text-foreground">$0.00</span>
                    </div>
                    <div className="border-t border-border/40 pt-2 flex justify-between items-center">
                      <span className="font-semibold text-foreground">Total (Monthly)</span>
                      <span className="text-2xl font-semibold text-accent font-headers">$10.00</span>
                    </div>
                    <div className="text-center text-xs text-muted-foreground">
                      💰 You save $15/month with early bird pricing!
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing with Stripe...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Pay $10.00 with Stripe
                      </>
                    )}
                  </Button>
                </form>

                {/* Security Notice */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Shield className="w-4 h-4" />
                    <span>Your payment information is encrypted and secure with Stripe</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Zap className="w-4 h-4" />
                    <span>Cancel anytime • No hidden fees • 30-day money-back guarantee</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Premium Benefits Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4 text-foreground font-headers">
              Why Go Premium?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Unlock exclusive features designed to accelerate your success in the diaspora community
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {premiumBenefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="border-border/40 hover:shadow-lg transition-shadow duration-300 group">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                      <Icon className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="text-lg mb-3 text-foreground font-headers">{benefit.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Pricing Notice */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="border-accent/20 bg-gradient-to-r from-accent/5 to-primary/5">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Clock className="w-6 h-6 text-accent" />
                <h3 className="text-xl font-semibold text-foreground font-headers">Limited Time Early Bird Pricing</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Get Premium membership for just $10/month. Price increases to $25/month after the early bird period ends.
                Lock in your early bird rate now!
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Crown className="w-4 h-4 text-accent" />
                  <span className="font-medium">Early Bird: $10/month</span>
                </div>
                <div className="w-px h-4 bg-border"></div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Regular: $25/month</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}