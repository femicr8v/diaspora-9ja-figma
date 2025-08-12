"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { platformFeatures } from "@/lib/constants";

interface PlatformSectionProps {
  onGetStarted: () => void;
}

export function PlatformSection({ onGetStarted }: PlatformSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-scroll carousel for platform features
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % platformFeatures.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleSlideChange = (direction: "prev" | "next") => {
    if (direction === "next") {
      setCurrentSlide((prev) => (prev + 1) % platformFeatures.length);
    } else {
      setCurrentSlide(
        (prev) => (prev - 1 + platformFeatures.length) % platformFeatures.length
      );
    }
  };

  return (
    <section id="platform" className="py-16 md:py-24 px-6 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 md:mb-20">
          <Badge
            variant="secondary"
            className="mb-4 md:mb-6 bg-accent/10 text-accent border-accent/20 text-sm font-semibold"
          >
            Platform Features
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-6 text-foreground font-headers font-bold">
            Everything You Need in One Place
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover powerful tools and exclusive content designed specifically
            for the Nigerian diaspora community
          </p>
        </div>

        <div className="relative">
          {/* Carousel Container */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {platformFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.id} className="w-full flex-shrink-0 px-4">
                    <div
                      className={`min-h-[400px] md:min-h-[500px] bg-gradient-to-br ${feature.gradient} relative overflow-hidden rounded-2xl shadow-2xl`}
                    >
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22m36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
                      <div className="p-8 md:p-16 text-center relative z-10">
                        <div
                          className={`w-16 md:w-24 h-16 md:h-24 ${feature.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 md:mb-10 shadow-xl`}
                        >
                          <Icon
                            className={`w-8 md:w-12 h-8 md:h-12 ${feature.color}`}
                          />
                        </div>
                        <h3 className="text-2xl md:text-3xl mb-4 md:mb-6 text-foreground font-headers font-bold">
                          {feature.title}
                        </h3>
                        <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 leading-relaxed max-w-2xl mx-auto">
                          {feature.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                          {feature.features.map((item, idx) => (
                            <div key={idx} className="text-center">
                              <CheckCircle className="w-5 md:w-6 h-5 md:h-6 text-green-500 mx-auto mb-2" />
                              <p className="text-xs md:text-sm text-muted-foreground font-medium">
                                {item}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="mb-6 md:mb-8">
                          <Badge
                            variant="secondary"
                            className="bg-white/20 text-foreground border-white/30 text-sm md:text-base font-semibold px-4 py-2"
                          >
                            {feature.stats}
                          </Badge>
                        </div>

                        <Button
                          onClick={onGetStarted}
                          size="lg"
                          className="bg-primary hover:bg-primary/90 text-primary-foreground text-base font-semibold px-6 md:px-8 py-2 md:py-3 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                        >
                          Explore {feature.title}
                          <ArrowRight className="ml-2 w-4 md:w-5 h-4 md:h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Enhanced Navigation */}
          <Button
            variant="outline"
            size="lg"
            onClick={() => handleSlideChange("prev")}
            className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 rounded-full w-10 md:w-14 h-10 md:h-14 p-0 bg-white/90 hover:bg-white shadow-xl border-white/50"
          >
            <ChevronLeft className="w-5 md:w-6 h-5 md:h-6" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => handleSlideChange("next")}
            className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 rounded-full w-10 md:w-14 h-10 md:h-14 p-0 bg-white/90 hover:bg-white shadow-xl border-white/50"
          >
            <ChevronRight className="w-5 md:w-6 h-5 md:h-6" />
          </Button>

          {/* Enhanced Dots Indicator */}
          <div className="flex justify-center mt-8 md:mt-12 space-x-2 md:space-x-3">
            {platformFeatures.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 md:w-4 h-3 md:h-4 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-primary scale-125 shadow-lg"
                    : "bg-muted hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
