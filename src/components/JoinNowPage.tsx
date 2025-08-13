import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import {
  CheckCircle,
  Users,
  TrendingUp,
  Calendar,
  Globe,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import logoImage from "figma:asset/0be1b3fe61946b6a71598093280579589812311d.png";

interface JoinNowPageProps {
  onBack: () => void;
  onShowPayment: (formData: FormData) => void;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
}

export default function JoinNowPage({
  onBack,
  onShowPayment,
}: JoinNowPageProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const benefits = [
    {
      icon: Users,
      title: "Access to Trusted Information",
      description:
        "Get verified news, insights, and updates specifically curated for the Nigerian diaspora community",
    },
    {
      icon: Globe,
      title: "Networking Opportunities",
      description:
        "Connect with fellow Nigerians worldwide, build meaningful professional and personal relationships",
    },
    {
      icon: TrendingUp,
      title: "Exclusive Investment Opportunities",
      description:
        "Access vetted investment deals and business opportunities with full due diligence reports",
    },
    {
      icon: Calendar,
      title: "Exclusive Events and Resources",
      description:
        "Join private events, masterclasses, and access premium content not available to the public",
    },
  ];

  const handleInputChange =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors({ ...errors, [field]: undefined });
      }
    };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\+]?[\d\s\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate form processing
    setTimeout(() => {
      setIsSubmitting(false);
      onShowPayment(formData);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
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

          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center space-x-2 text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Button>
        </div>
      </header>

      {/* Standalone Header Section */}
      <section className="py-12 md:py-16 px-6 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12 md:mb-16">
            <Badge
              variant="secondary"
              className="mb-4 md:mb-6 bg-accent/10 text-accent border-accent/20 text-sm font-semibold"
            >
              🌍 Join 15,000+ Nigerians Worldwide
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-6 text-foreground font-headers font-bold">
              Join the Diaspora 9ja Community
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Connect with the most trusted platform for Nigerians worldwide.
              Access exclusive opportunities, build meaningful relationships,
              and stay connected with your heritage while thriving globally.
            </p>
          </div>

          {/* Main Content Grid - Same as Contact Section */}
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Left Side - Benefits */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl mb-6 text-foreground font-headers font-bold">
                  Why Join Our Community?
                </h2>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => {
                    const Icon = benefit.icon;
                    return (
                      <Card
                        key={index}
                        className="border-border/40 hover:border-primary/30 transition-all duration-300 group"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                              <Icon className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground font-headers mb-1">
                                {benefit.title}
                              </h3>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {benefit.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Trust Indicators - Compact */}
              <Card className="border-border/40 bg-gradient-to-br from-primary/5 to-accent/5">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground font-headers mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                    Trusted Community
                  </h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary mb-1 font-headers">
                        50+
                      </div>
                      <p className="text-xs text-muted-foreground">Countries</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary mb-1 font-headers">
                        15,000+
                      </div>
                      <p className="text-xs text-muted-foreground">Members</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary mb-1 font-headers">
                        98%
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Satisfaction
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-accent/10 rounded-lg">
                    <p className="text-sm text-accent font-medium text-center">
                      ✨ Join today and get exclusive early access
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Side - Combined Image and Form */}
            <div>
              <Card className="border-border/40 shadow-2xl bg-gradient-to-br from-background to-secondary/20 overflow-hidden">
                {/* Community Image - Top rounded corners only */}
                <div className="relative">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&h=300&fit=crop"
                    alt="Global Nigerian Community"
                    className="w-full h-64 object-cover"
                  />
                </div>

                {/* Join Form - Directly below image */}
                <CardContent className="p-6">
                  <h2 className="text-xl mb-4 text-foreground font-headers font-bold">
                    Start Your Journey
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <Label
                        htmlFor="fullName"
                        className="text-sm font-semibold"
                      >
                        Full Name *
                      </Label>
                      <Input
                        id="fullName"
                        placeholder="Your full name"
                        value={formData.fullName}
                        onChange={handleInputChange("fullName")}
                        className={`h-10 text-sm rounded-xl border-2 transition-all duration-200 ${
                          errors.fullName
                            ? "border-destructive focus:border-destructive"
                            : "border-border focus:border-primary"
                        }`}
                        required
                      />
                      {errors.fullName && (
                        <p className="text-xs text-destructive mt-1">
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="email" className="text-sm font-semibold">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleInputChange("email")}
                        className={`h-10 text-sm rounded-xl border-2 transition-all duration-200 ${
                          errors.email
                            ? "border-destructive focus:border-destructive"
                            : "border-border focus:border-primary"
                        }`}
                        required
                      />
                      {errors.email && (
                        <p className="text-xs text-destructive mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="phone" className="text-sm font-semibold">
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+44 20 1234 5678"
                        value={formData.phone}
                        onChange={handleInputChange("phone")}
                        className={`h-10 text-sm rounded-xl border-2 transition-all duration-200 ${
                          errors.phone
                            ? "border-destructive focus:border-destructive"
                            : "border-border focus:border-primary"
                        }`}
                        required
                      />
                      {errors.phone && (
                        <p className="text-xs text-destructive mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold py-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Join Now"
                      )}
                    </Button>

                    <div className="text-center pt-2">
                      <p className="text-xs text-muted-foreground">
                        By joining, you agree to our{" "}
                        <a
                          href="#"
                          className="text-primary hover:underline font-medium"
                        >
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                          href="#"
                          className="text-primary hover:underline font-medium"
                        >
                          Privacy Policy
                        </a>
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Security Badge - Outside the main card */}
              <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground mt-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>Secure & Encrypted</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>No Spam Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
