"use client";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { platformFeatures } from "@/lib/constants";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "../ui/card";

interface PlatformSectionProps {
  onGetStarted: () => void;
}

export function PlatformSection({ onGetStarted }: PlatformSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoScrollPaused, setIsAutoScrollPaused] = useState(false);

  // Auto-scroll carousel for platform features
  useEffect(() => {
    if (isAutoScrollPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % platformFeatures.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoScrollPaused]);

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
    setIsAutoScrollPaused(true);
    // Resume auto-scroll after 10 seconds of user interaction
    setTimeout(() => setIsAutoScrollPaused(false), 10000);
  };

  // Touch state for swipe functionality
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        const prevSlide =
          (currentSlide - 1 + platformFeatures.length) %
          platformFeatures.length;
        handleSlideChange(prevSlide);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        const nextSlide = (currentSlide + 1) % platformFeatures.length;
        handleSlideChange(nextSlide);
      }
    },
    [currentSlide]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Touch handlers for swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      const nextSlide = (currentSlide + 1) % platformFeatures.length;
      handleSlideChange(nextSlide);
    } else if (isRightSwipe) {
      const prevSlide =
        (currentSlide - 1 + platformFeatures.length) % platformFeatures.length;
      handleSlideChange(prevSlide);
    }
  };

  const repeatingPlusWhitePattern =
    "bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.15%22%3E%3Cpath%20d%3D%22m36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]";

  return (
    <section id="platform" className="py-16 md:py-24 px-6 bg-background">
      <main className="container mx-auto max-w-7xl">
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
            Unlock a comprehensive suite of tools, resources, and exclusive
            content crafted to empower the Nigerian diaspora. Build meaningful
            connections, access opportunities, and thrive in your global
            journey.
          </p>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setIsAutoScrollPaused(true)}
          onMouseLeave={() => setIsAutoScrollPaused(false)}
        >
          {/* Carousel Container shadow-2xl */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {platformFeatures.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div key={feature.id} className="w-full flex-shrink-0 px-4">
                    <Card
                      className={`h-full min-h-[500px] md:min-h-[600px] bg-gradient-to-br ${feature.gradient} relative overflow-hidden border-0`}
                    >
                      <div
                        className={`absolute inset-0 ${repeatingPlusWhitePattern} opacity-60`}
                      />

                      <CardHeader className="text-center relative z-10 pb-4">
                        <div
                          className={`w-16 md:w-24 h-16 md:h-24 ${feature.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-xl`}
                        >
                          <Icon
                            className={`w-8 md:w-12 h-8 md:h-12 ${feature.color}`}
                          />
                        </div>
                        <h3 className="text-2xl md:text-3xl text-foreground font-headers font-bold">
                          {feature.title}
                        </h3>
                      </CardHeader>

                      <CardContent className="text-center relative z-10 px-6 md:px-8">
                        <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 leading-relaxed max-w-2xl mx-auto">
                          {feature.description}
                        </p>

                        <div className="flex flex-col items-center justify-center md:flex-row gap-4 md:gap-6 mb-6 md:mb-8">
                          {feature.features.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex md:flex-col gap-2 justify-center items-center text-center"
                            >
                              <CheckCircle className="size-5 md:size-6 text-green-500" />
                              <p className="text-xs md:text-sm text-muted-foreground font-medium">
                                {item}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="mb-4 md:mb-6">
                          <Badge
                            variant="secondary"
                            className="bg-white/30 text-foreground border-white/40 text-sm md:text-base font-semibold px-4 py-2"
                          >
                            {feature.stats}
                          </Badge>
                        </div>
                      </CardContent>

                      <CardFooter className="justify-center relative z-10 pt-0">
                        <Button
                          onClick={onGetStarted}
                          size="lg"
                          className="bg-primary hover:bg-primary/90 active:bg-primary/90 text-primary-foreground px-8 md:px-10 py-3 md:py-5 text-base md:text-lg font-semibold shadow-xl hover:shadow-2xl active:shadow-2xl transform hover:scale-105 active:scale-105 transition-all duration-300 group"
                        >
                          Explore Now
                          <ArrowRight className="ml-2 md:ml-3 size-5 md:size-6 -rotate-45 group-hover:rotate-0 group-active:rotate-0 transition-transform duration-300" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Enhanced Dots Indicator */}
          <div className="flex justify-center mt-8 md:mt-12 space-x-2 md:space-x-3">
            {platformFeatures.map((_, index) => (
              <button
                key={index}
                onClick={() => handleSlideChange(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`size-2 md:size-3 rounded-full transition-all duration-300 hover:scale-110 active:scale-110 ${
                  index === currentSlide
                    ? "bg-primary scale-110 shadow-lg"
                    : "bg-muted hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>
        </div>
      </main>
    </section>
  );
}
