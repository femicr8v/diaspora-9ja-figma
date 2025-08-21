"use client";

import {
  Loader2,
  LucideIcon,
  UserRoundCheck,
  Shield,
  CheckCircle,
  Star,
} from "lucide-react";

import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { joinFormFields } from "@/lib/constants";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface JoinFormData {
  name: string;
  email: string;
  phone: string;
  location: string;
}

export interface SecurityIcons {
  icon: LucideIcon;
  text: string;
}

const securityIcons: SecurityIcons[] = [
  { icon: Shield, text: "SSL Secure" },
  { icon: CheckCircle, text: "No Spam" },
  { icon: Star, text: "Trusted" },
];

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
              {joinFormFields.slice(0, 2).map((field) => (
                <div key={field.id + "ne"} className="space-y-2">
                  <Label htmlFor={field.id} className="text-sm font-semibold">
                    {field.label}{" "}
                    {field.required && (
                      <span className="text-destructive">*</span>
                    )}
                  </Label>
                  <Input
                    id={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.id as keyof JoinFormData]}
                    onChange={handleInputChange(field.id as keyof JoinFormData)}
                    className="h-12 bg-muted/50 border border-border focus:border-primary focus:bg-background"
                    required={field.required}
                  />
                </div>
              ))}
            </div>

            {/* Second row: Phone and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {joinFormFields.slice(2, 4).map((field) => (
                <div key={field.id + "pl"} className="space-y-2">
                  <Label htmlFor={field.id} className="text-sm font-semibold">
                    {field.label}{" "}
                    {field.required && (
                      <span className="text-destructive">*</span>
                    )}
                  </Label>
                  <Input
                    id={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.id as keyof JoinFormData]}
                    onChange={handleInputChange(field.id as keyof JoinFormData)}
                    className="h-12 bg-muted/50 border border-border focus:border-primary focus:bg-background"
                    required={field.required}
                  />
                </div>
              ))}
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
                {securityIcons.map((feature, index) => (
                  <div
                    key={index + "si"}
                    className="flex items-center text-green-700"
                  >
                    <feature.icon className="w-4 h-4 mr-2" />
                    <span className="font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
