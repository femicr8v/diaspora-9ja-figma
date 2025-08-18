"use client";

import { Card, CardContent } from "../ui/card";
import { JoinNowButton } from "./JoinNowButton";
import { Shield, Star, CheckCircle } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export function JoinNowFormSection() {
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

          <JoinNowButton />

          <div className="pt-4 space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Stripe will collect your name, email, phone, and billing address
                securely.
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
