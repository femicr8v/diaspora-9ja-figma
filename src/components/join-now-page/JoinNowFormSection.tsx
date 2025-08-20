"use client";

import {
  Shield,
  Star,
  CheckCircle,
  UserRoundCheck,
  Loader2,
} from "lucide-react";

import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface JoinFormData {
  name: string;
  email: string;
  phone: string;
  location: string;
}

export function JoinNowFormSection() {
  const [formData, setFormData] = useState<JoinFormData>({
    name: "",
    email: "",
    phone: "",
    location: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange =
    (field: keyof JoinFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
    };

  const handleJoinCommunity = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.email) {
      alert("Please fill in your name and email address.");
      return;
    }

    setIsLoading(true);

    try {
      // First, save the lead information
      const leadResponse = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!leadResponse.ok) {
        throw new Error("Failed to save lead information");
      }

      // Then proceed to checkout with pre-filled information
      const checkoutResponse = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
          location: formData.location,
          userId: "guest",
        }),
      });

      const checkoutData = await checkoutResponse.json();
      if (checkoutData.url) {
        window.location.href = checkoutData.url;
      } else {
        alert(checkoutData.error ?? "Something went wrong");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Join community error:", error);
      alert("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="lg:sticky lg:top-8 lg:self-start">
      <Card className="border-border/40 shadow-2xl bg-background overflow-hidden">
        {/* Enhanced Community Image */}
        <div className="relative">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=320&fit=crop"
            alt="Global Nigerian Community"
            className="w-full h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
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

          <form onSubmit={handleJoinCommunity} className="flex flex-col gap-4">
            {/* First row: Name and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange("name")}
                  className="h-12 bg-muted/50 border border-border focus:border-primary focus:bg-background"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange("email")}
                  className="h-12 bg-muted/50 border border-border focus:border-primary focus:bg-background"
                  required
                />
              </div>
            </div>

            {/* Second row: Phone and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleInputChange("phone")}
                  className="h-12 bg-muted/50 border border-border focus:border-primary focus:bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-semibold">
                  Location
                </Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="City, Country"
                  value={formData.location}
                  onChange={handleInputChange("location")}
                  className="h-12 bg-muted/50 border border-border focus:border-primary focus:bg-background"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Redirecting to Checkout...
                </>
              ) : (
                <>
                  <UserRoundCheck strokeWidth={2} className="w-5 h-5 mr-2" />
                  Join Our Community
                </>
              )}
            </Button>
          </form>

          <div className="pt-4 space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Your information will be securely processed and pre-filled in
                checkout.
              </p>
            </div>

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
        </CardContent>
      </Card>
    </div>
  );
}
