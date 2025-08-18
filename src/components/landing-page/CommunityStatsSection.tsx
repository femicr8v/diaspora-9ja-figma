"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { useState, useEffect, useCallback } from "react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { communityStats, communityProfiles } from "@/lib/constants";

export function CommunityStatsSection() {
  const [membersSlide, setMembersSlide] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [isAutoScrollPaused, setIsAutoScrollPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Calculate items per view based on screen size
  const updateItemsPerView = useCallback(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    }
  }, []);

  useEffect(() => {
    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, [updateItemsPerView]);

  // Calculate slides per page (how many cards to advance at once)
  const slidesPerPage = itemsPerView;

  // Calculate total number of pages
  const totalPages = Math.ceil(communityProfiles.length / slidesPerPage);
  const maxSlides = Math.max(0, totalPages - 1);

  // Auto-scroll carousel for members
  useEffect(() => {
    if (isAutoScrollPaused || maxSlides === 0) return;

    const timer = setInterval(() => {
      setMembersSlide((prev) => {
        const nextSlide = prev + 1;
        return nextSlide > maxSlides ? 0 : nextSlide;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [maxSlides, isAutoScrollPaused]);

  const handleMembersSlideChange = (direction: "prev" | "next") => {
    setIsAutoScrollPaused(true);

    if (direction === "next") {
      setMembersSlide((prev) => Math.min(prev + 1, maxSlides));
    } else {
      setMembersSlide((prev) => Math.max(prev - 1, 0));
    }

    // Resume auto-scroll after 3 seconds
    setTimeout(() => setIsAutoScrollPaused(false), 3000);
  };

  const handleDotClick = (index: number) => {
    setIsAutoScrollPaused(true);
    setMembersSlide(Math.min(index, maxSlides));

    // Resume auto-scroll after 3 seconds
    setTimeout(() => setIsAutoScrollPaused(false), 3000);
  };

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft" && membersSlide > 0) {
      handleMembersSlideChange("prev");
    } else if (event.key === "ArrowRight" && membersSlide < maxSlides) {
      handleMembersSlideChange("next");
    }
  };

  // Handle touch events for swipe navigation
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

    if (isLeftSwipe && membersSlide < maxSlides) {
      handleMembersSlideChange("next");
    }
    if (isRightSwipe && membersSlide > 0) {
      handleMembersSlideChange("prev");
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

        <div
          className="relative"
          onKeyDown={handleKeyDown}
          onMouseEnter={() => setIsAutoScrollPaused(true)}
          onMouseLeave={() => setIsAutoScrollPaused(false)}
          tabIndex={0}
          role="region"
          aria-label="Community members carousel"
        >
          {/* Carousel Container */}
          <div
            className="overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${membersSlide * 100}%)`,
              }}
            >
              {Array.from({ length: totalPages }, (_, pageIndex) => (
                <div key={pageIndex} className="w-full flex-shrink-0 flex">
                  {communityProfiles
                    .slice(
                      pageIndex * slidesPerPage,
                      (pageIndex + 1) * slidesPerPage
                    )
                    .map((profile, index) => (
                      <div
                        key={`${pageIndex}-${index}`}
                        className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3"
                      >
                        <Card className="border-border/40 bg-background/90 hover:shadow-lg transition-all duration-300 group">
                          <CardContent className="p-6 text-center">
                            <div className="border border-accent/40 w-16 md:w-20 h-16 md:h-20 mx-auto mb-4 rounded-full overflow-hidden group-hover:scale-105 transition-transform duration-300">
                              <ImageWithFallback
                                src={profile.image}
                                alt={profile.name}
                                className="size-full object-cover"
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
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 md:mt-8 space-x-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`size-2 md:size-3 rounded-full transition-all duration-300 ${
                    index === membersSlide
                      ? "bg-primary scale-110 shadow-lg"
                      : "bg-muted hover:bg-muted-foreground/50"
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          )}
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
          <Link
            href="/join-the-community"
            className={cn(
              buttonVariants({ variant: "outline", size: "default" }),
              "border-primary/20 text-primary hover:text-primary hover:bg-primary/5 text-base group"
            )}
          >
            Join Our Community
            <ArrowRight className="ml-2 size-4 -rotate-45 group-hover:rotate-0 group-active:rotate-0 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}
