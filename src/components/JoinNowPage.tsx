"use client";

import { useState } from "react";
import { Button, buttonVariants } from "./ui/button";
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
  Shield,
  Star,
  Zap,
  ChevronDown,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  joinNowPageBenefits,
  logoImage,
  logoText,
  trustIndicators,
  countries,
} from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface JoinNowPageProps {
  onBack: () => void;
  onShowPayment: (formData: FormData) => void;
}

interface FormData {
  fullName: string;
  email: string;
  countryCode: string;
  phone: string;
}

export function JoinNowPage() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    countryCode: "+44",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleInputChange =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors({ ...errors, [field]: undefined });
      }
    };

  const handleCountryCodeChange = (value: string) => {
    setFormData({ ...formData, countryCode: value });
    // Clear phone error when country code changes
    if (errors.phone) {
      setErrors({ ...errors, phone: undefined });
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
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\d\s\-\(\)]{7,}$/.test(formData.phone.replace(/^\+/, ""))) {
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
      // onShowPayment({
      //   fullName: formData.fullName,
      //   email: formData.email,
      //   phone: `${formData.countryCode} ${formData.phone}`
      // });
    }, 1000);
  };

  const repeatingPlusGreenPattern =
    "bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23e8f5e8%22%20fill-opacity%3D%220.3%22%3E%3Cpath%20d%3D%22m36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/5">
      {/* Header */}
      <header className="border-b-2 border-border/40 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="w-10 h-10 flex items-center justify-center"
            >
              <Image
                src={logoImage}
                width={40}
                height={40}
                alt="Diaspora 9ja Logo"
                className="size-10 object-contain"
              />
            </Link>
            <h1 className="text-xl font-bold text-primary font-headers">
              {logoText}
            </h1>
          </div>

          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "ghost", size: "default" }),
              `hover:bg-accent text-muted-foreground hover:text-white text-base font-medium flex`
            )}
          >
            <ArrowLeft className="size-4" />
            <span>Go Back</span>
          </Link>
        </div>
      </header>

      {/* Hero Header Section */}
      <section className="py-16 md:py-24 px-6 text-center bg-gradient-to-r from-primary/5 via-background to-accent/5 relative overflow-hidden">
        <div
          className={`absolute inset-0 ${repeatingPlusGreenPattern} opacity-50`}
        />

        <div className="container mx-auto max-w-7xl text-center relative z-10">
          <Badge
            variant="secondary"
            className="mb-6 md:mb-8 bg-accent/10 text-accent border-accent/20 text-sm font-semibold px-4 py-2"
          >
            🌍 Join 15,000+ Nigerians Worldwide
          </Badge>

          <h1 className="max-w-4xl text-3xl md:text-5xl lg:text-6xl xl:text-7xl mx-auto mb-6 md:mb-8 font-bold gradient-text font-headers leading-tight">
            Join The Global Nigerian Community
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed">
            Connect with the most trusted platform for Nigerians worldwide.
            Access exclusive opportunities, build meaningful relationships, and
            stay connected with your heritage while thriving globally.
          </p>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {trustIndicators.map((indicator, index) => {
              const Icon = indicator.icon;
              return (
                <div
                  key={index}
                  className={`text-center ${
                    index % 2 === 0 ? "text-primary" : "text-accent"
                  }`}
                >
                  <div
                    className={`size-12 md:size-16 ${
                      index % 2 === 0 ? "bg-primary/10" : "bg-accent/10"
                    } rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3`}
                  >
                    <Icon className="size-6 md:size-8" />
                  </div>
                  <div className="text-lg md:text-3xl font-bold mb-1 font-headers">
                    {indicator.number}
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground font-medium">
                    {indicator.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
            {/* Left Side - Enhanced Benefits */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground font-headers mb-2">
                  Why Join Our Community?
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Discover the exclusive benefits that come with being part of
                  our global network
                </p>

                <div className="space-y-6">
                  {joinNowPageBenefits.map((item) => {
                    const Icon = item.icon;

                    return (
                      <Card
                        key={item.title + "w"}
                        className="border-border/40 bg-background/80 backdrop-blur-sm hover:border-primary/40 hover:shadow-xl transition-all duration-300 group overflow-hidden"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300 flex-shrink-0">
                              <Icon className="w-7 h-7 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-bold text-foreground font-headers">
                                  {item.title}
                                </h3>
                                <Badge
                                  variant="secondary"
                                  className="bg-accent/10 text-accent border-accent/30 text-xs font-medium"
                                >
                                  {item.highlight}
                                </Badge>
                              </div>
                              <p className="text-muted-foreground leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Enhanced Trust Section */}
              <Card className="border-border/40 bg-gradient-to-r from-primary/5 via-background to-accent/5 backdrop-blur-sm shadow-lg">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground font-headers mb-3">
                      Trusted & Secure Platform
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Join thousands of successful Nigerians who trust our
                      platform for their professional and personal growth
                    </p>
                    <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span>SSL Encrypted</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span>GDPR Compliant</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span>No Spam Policy</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Side - Enhanced Image and Form */}
            <div className="lg:sticky lg:top-8 lg:self-start">
              <Card className="border-border/40 shadow-2xl bg-background overflow-hidden">
                {/* Enhanced Community Image */}
                <div className="relative">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=320&fit=crop"
                    alt="Global Nigerian Community"
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center justify-between text-white">
                      <div>
                        <h3 className="text-xl font-bold font-headers mb-1">
                          Ready to Connect?
                        </h3>
                        <p className="text-sm opacity-90">
                          Start your journey with us today
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Join Form */}
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-foreground font-headers mb-2">
                      Start Your Journey
                    </h2>
                    <p className="text-muted-foreground">
                      Fill in your details to join our exclusive community
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="font-semibold">
                        Full Name *
                      </Label>
                      <Input
                        id="fullName"
                        placeholder="Your full name"
                        value={formData.fullName}
                        onChange={handleInputChange("fullName")}
                        className={`h-12 bg-muted/50 border transition-all duration-200 ${
                          errors.fullName
                            ? "border-destructive focus:border-destructive bg-destructive/5"
                            : "border-border focus:border-primary focus:bg-background"
                        }`}
                        required
                      />
                      {errors.fullName && (
                        <p className="text-sm text-destructive flex items-center mt-1">
                          <span className="w-1 h-1 bg-destructive rounded-full mr-2"></span>
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-semibold">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleInputChange("email")}
                        className={`h-12 bg-muted/50 border transition-all duration-200 ${
                          errors.email
                            ? "border-destructive focus:border-destructive bg-destructive/5"
                            : "border-border focus:border-primary focus:bg-background"
                        }`}
                        required
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive flex items-center mt-1">
                          <span className="w-1 h-1 bg-destructive rounded-full mr-2"></span>
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="font-semibold">
                        Phone Number *
                      </Label>
                      <div className="flex gap-3">
                        <Select
                          value={formData.countryCode}
                          onValueChange={handleCountryCodeChange}
                        >
                          <SelectTrigger
                            className={`w-32 h-12 bg-muted/50 border transition-all duration-200 ${
                              errors.phone
                                ? "border-destructive focus:border-destructive bg-destructive/5"
                                : "border-border focus:border-primary focus:bg-background"
                            }`}
                          >
                            <SelectValue>
                              <div className="flex items-center space-x-2">
                                <span className="text-lg">
                                  {countries.find(
                                    (c) => c.code === formData.countryCode
                                  )?.flag || "🌍"}
                                </span>
                                <span className="text-sm font-medium">
                                  {formData.countryCode}
                                </span>
                              </div>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem
                                key={`${country.code}-${country.country}`}
                                value={country.code}
                              >
                                <div className="flex items-center space-x-3 py-1">
                                  <span className="text-lg">
                                    {country.flag}
                                  </span>
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {country.code}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {country.name}
                                    </span>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Input
                          id="phone"
                          type="tel"
                          placeholder="20 1234 5678"
                          value={formData.phone}
                          onChange={handleInputChange("phone")}
                          className={`flex-1 h-12 bg-muted/50 border transition-all duration-200 ${
                            errors.phone
                              ? "border-destructive focus:border-destructive bg-destructive/5"
                              : "border-border focus:border-primary focus:bg-background"
                          }`}
                          required
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-sm text-destructive flex items-center mt-1">
                          <span className="w-1 h-1 bg-destructive rounded-full mr-2"></span>
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Join Our Community
                          <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
                        </>
                      )}
                    </Button>

                    <div className="pt-4 space-y-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">
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

                      {/* Security Features */}
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center justify-center space-x-6 text-sm">
                          <div className="flex items-center text-green-700">
                            <Shield className="w-4 h-4 mr-2" />
                            <span className="font-medium">SSL Secure</span>
                          </div>
                          <div className="flex items-center text-green-700">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            <span className="font-medium">No Spam</span>
                          </div>
                          <div className="flex items-center text-green-700">
                            <Star className="w-4 h-4 mr-2" />
                            <span className="font-medium">Trusted</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-primary/10 via-background to-accent/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-foreground font-headers mb-4">
            Ready to Transform Your Global Network?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of successful Nigerians who have already discovered
            opportunities, built meaningful connections, and accelerated their
            careers through our platform.
          </p>
          <div className="flex items-center justify-center space-x-8 text-muted-foreground">
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-primary" />
              <span className="font-medium">Global Community</span>
            </div>
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-accent" />
              <span className="font-medium">Growth Opportunities</span>
            </div>
            <div className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-green-600" />
              <span className="font-medium">Trusted Platform</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
