"use client";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { communityStats, communityProfiles } from "@/lib/constants";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

interface CommunityStatsSectionProps {
  onGetStarted: () => void;
}

export function CommunityStatsSection({
  onGetStarted,
}: CommunityStatsSectionProps) {
  const [membersSlide, setMembersSlide] = useState(0);

  // Auto-scroll carousel for members
  useEffect(() => {
    const timer = setInterval(() => {
      setMembersSlide((prev) => (prev + 1) % communityProfiles.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleMembersSlideChange = (direction: "prev" | "next") => {
    if (direction === "next") {
      setMembersSlide((prev) => (prev + 1) % communityProfiles.length);
    } else {
      setMembersSlide(
        (prev) =>
          (prev - 1 + communityProfiles.length) % communityProfiles.length
      );
    }
  };

  return (
    <section className="py-16 md:py-24 px-6 bg-gradient-to-br from-secondary/30 to-accent/10">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-6 text-foreground font-headers font-bold">
            Our Thriving Community
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Real numbers from real people making real connections across the
            globe and beyond. Every story shared, every milestone celebrated,
            and every friendship forged adds to our collective strength.
          </p>
        </div>

        {/* <div className="grid grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-16"> */}
        <div className="grid grid-cols-4 gap-2 md:gap-8 mb-12 md:mb-16">
          {communityStats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <Card
                key={index}
                className="border-border/40 bg-background/80 text-center hover:border-primary/20 hover:shadow-xl active:shadow-xl transition-all duration-300 group text-primary"
              >
                <CardContent className="p-2 md:p-8 max-md:[&:last-child]:pb-2">
                  <div className="size-12 md:size-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-6 group-hover:bg-primary/10 group-hover:scale-110 group-active:scale-110 transition-all duration-300">
                    <Icon className="size-6 md:size-8" />
                  </div>
                  <div className="text-lg md:text-4xl font-bold mb-1 font-headers">
                    {stat.value}
                  </div>
                  <p className="text-xs md:text-base text-muted-foreground mb-2">
                    {stat.label}
                  </p>
                  <div className="text-xs md:text-base text-center text-green-600 font-medium">
                    ↗ {stat.trend}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Members Carousel */}
        <div className="text-center mb-8 md:mb-12">
          <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 md:mb-4 font-headers">
            Meet Our Global Members
          </h3>
          <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8">
            From every corner of the world, every industry, united by heritage
          </p>
        </div>

        <div className="relative">
          {/* Carousel Container */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${
                  membersSlide *
                  (window.innerWidth < 768
                    ? 100
                    : window.innerWidth < 1024
                    ? 50
                    : 33.333)
                }%)`,
              }}
            >
              {communityProfiles.map((profile, index) => (
                <div
                  key={index}
                  className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3"
                >
                  <Card className="border-border/40 bg-background/90 hover:shadow-lg transition-all duration-300 group">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 md:w-20 h-16 md:h-20 mx-auto mb-4 rounded-full overflow-hidden group-hover:scale-105 transition-transform duration-300">
                        <ImageWithFallback
                          src={profile.image}
                          alt={profile.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="text-sm md:text-base font-semibold text-foreground mb-1">
                        {profile.name}
                      </h4>
                      <p className="text-xs md:text-sm text-muted-foreground mb-1">
                        {profile.role}
                      </p>
                      <p className="text-xs md:text-sm text-accent font-medium mb-2">
                        {profile.location}
                      </p>
                      <Badge
                        variant="secondary"
                        className="text-xs bg-primary/10 text-primary border-primary/20"
                      >
                        {profile.industry}
                      </Badge>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleMembersSlideChange("prev")}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 rounded-full w-8 h-8 md:w-10 md:h-10 p-0 bg-white/90 hover:bg-white shadow-lg border-white/50"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleMembersSlideChange("next")}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full w-8 h-8 md:w-10 md:h-10 p-0 bg-white/90 hover:bg-white shadow-lg border-white/50"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-6 md:mt-8 space-x-2">
            {communityProfiles.map((_, index) => (
              <button
                key={index}
                onClick={() => setMembersSlide(index)}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                  index === membersSlide
                    ? "bg-primary scale-125 shadow-lg"
                    : "bg-muted hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="text-center mt-8 md:mt-12">
          <p className="text-base md:text-lg text-muted-foreground mb-4 md:mb-6">
            <span className="font-semibold text-primary">2,000+ members</span>{" "}
            from
            <span className="font-semibold text-accent">
              {" "}
              50+ countries
            </span>{" "}
            building the future together
          </p>
          <Button
            onClick={onGetStarted}
            variant="outline"
            className="border-primary/20 text-primary hover:bg-primary/5 text-base"
          >
            Join Our Community
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
