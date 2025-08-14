"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  ArrowLeft,
  Loader2,
  Shield,
  Star,
  Zap,
  CheckCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { countries } from "@/lib/constants";

interface FormData {
  fullName: string;
  email: string;
  countryCode: string;
  phone: string;
}

export function JoinNowFormSection() {
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
                  <span className="w-1 h-1 bg-destructive rounded-full mr-2" />
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
                          <span className="text-lg">{country.flag}</span>
                          <div className="flex flex-col">
                            <span className="font-medium">{country.code}</span>
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
  );
}
