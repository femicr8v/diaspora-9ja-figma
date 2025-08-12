"use client";

import { ArrowRight, CheckCircle } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { aboutStats } from "@/lib/constants";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="py-16 md:py-24 px-6 text-center bg-gradient-to-br from-background via-secondary/20 to-accent/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23e8f5e8%22%20fill-opacity%3D%220.3%22%3E%3Cpath%20d%3D%22m36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <Badge
          variant="secondary"
          className="mb-6 md:mb-8 bg-accent/10 text-accent border-accent/20 text-sm font-semibold px-4 py-2"
        >
          🌍 Connecting 15,000+ Nigerians Worldwide
        </Badge>

        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-6 md:mb-8 font-bold gradient-text font-headers leading-tight">
          Your Global Nigerian Community Hub
        </h1>

        <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed">
          Join the most trusted platform connecting Nigerians worldwide. Access
          exclusive opportunities, build meaningful relationships, and stay
          connected with your heritage while thriving globally.
        </p>

        <div className="flex flex-col items-center gap-4 mb-8 md:mb-12">
          <Button
            size="lg"
            onClick={onGetStarted}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 md:px-10 py-3 md:py-4 text-base md:text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Start Your Journey
            <ArrowRight className="ml-2 md:ml-3 w-5 md:w-6 h-5 md:h-6" />
          </Button>
          <div className="flex items-center space-x-2 text-sm md:text-base text-muted-foreground">
            <CheckCircle className="w-4 md:w-5 h-4 md:h-5 text-green-500" />
            <span className="font-medium">
              Free to join • No credit card required
            </span>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto">
          {aboutStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-12 md:w-16 h-12 md:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                  <Icon className="w-6 md:w-8 h-6 md:h-8 text-primary" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1 font-headers">
                  {stat.number}
                </div>
                <p className="text-xs md:text-sm text-muted-foreground font-medium">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
