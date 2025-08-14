"use client";

import { ArrowRight, CheckCircle } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CallToActionSectionProps {
  onGetStarted: () => void;
}

export function CallToActionSection({
  onGetStarted,
}: CallToActionSectionProps) {
  return (
    <section
      className="py-24 md:py-32 px-6 relative overflow-hidden"
      style={{
        backgroundImage:
          'url("https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1400&h=800&fit=crop")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Enhanced Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-accent/90"></div>

      <div className="container mx-auto max-w-7xl text-center relative z-10">
        <Badge
          variant="secondary"
          className="mb-6 md:mb-8 bg-white/20 text-white border-white/30 text-sm font-semibold px-4 py-2"
        >
          🚀 Join the Movement
        </Badge>

        <h2 className="text-3xl md:text-4xl lg:text-5xl mb-6 md:mb-8 text-white font-headers font-bold leading-tight">
          Ready to Connect with Your Global Community?
        </h2>

        <p className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 text-white/95 max-w-4xl mx-auto leading-relaxed">
          Join thousands of ambitious Nigerians who have found their digital
          homeland with us. Whether you're looking to expand your business, find
          investment opportunities, connect with mentors, or simply stay
          connected to your roots while thriving globally— your journey starts
          here.
        </p>

        <div className="mb-8 md:mb-12">
          <Link
            href="/join-the-community"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              `bg-white text-primary hover:bg-white/90 px-8 md:px-12 py-4 md:py-6 text-lg md:text-xl font-semibold shadow-2xl hover:shadow-3xl transform hover:scale-105 group transition-all duration-300`
            )}
          >
            Join the Community
            <ArrowRight className="ml-2 md:ml-3 size-5 md:size-6 -rotate-45 group-hover:rotate-0 group-active:rotate-0 transition-transform duration-300" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-white/90">
          <div className="flex items-center justify-center space-x-3">
            <CheckCircle className="w-5 md:w-6 h-5 md:h-6 text-green-300" />
            <span className="text-sm md:text-base font-medium">
              Free to join
            </span>
          </div>
          <div className="flex items-center justify-center space-x-3">
            <CheckCircle className="w-5 md:w-6 h-5 md:h-6 text-green-300" />
            <span className="text-sm md:text-base font-medium">
              Instant access
            </span>
          </div>
          <div className="flex items-center justify-center space-x-3">
            <CheckCircle className="w-5 md:w-6 h-5 md:h-6 text-green-300" />
            <span className="text-sm md:text-base font-medium">
              Global network
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
