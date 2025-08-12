"use client";

import { Globe, Briefcase, Heart, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

interface CommunityShowcaseSectionProps {
  onGetStarted: () => void;
}

export function CommunityShowcaseSection({
  onGetStarted,
}: CommunityShowcaseSectionProps) {
  return (
    <section
      id="community"
      className="py-16 md:py-24 px-6 bg-gradient-to-br from-primary/5 to-accent/5"
    >
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-6 text-foreground font-headers font-bold">
            Meet Our Global Family
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            From entrepreneurs in New York to doctors in Dubai, our community
            spans every continent and profession
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-12 md:mb-16">
          <div className="text-center">
            <div className="w-16 md:w-20 h-16 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
              <Globe className="w-8 md:w-10 h-8 md:h-10 text-primary" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 font-headers">
              Global Reach
            </h3>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              From Lagos to London, New York to Nairobi, our members are making
              impact everywhere
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 md:w-20 h-16 md:h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
              <Briefcase className="w-8 md:w-10 h-8 md:h-10 text-accent" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 font-headers">
              Every Industry
            </h3>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Tech entrepreneurs, healthcare professionals, artists, and
              everything in between
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 md:w-20 h-16 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
              <Heart className="w-8 md:w-10 h-8 md:h-10 text-primary" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 font-headers">
              One Purpose
            </h3>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              United by heritage, driven by success, connected by community
            </p>
          </div>
        </div>

        <Card className="border-border/40 bg-background/80 backdrop-blur-sm shadow-2xl">
          <CardContent className="p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 font-headers">
              Ready to Join Our Success Stories?
            </h3>
            <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto">
              Every week, we celebrate new connections, business partnerships,
              and life-changing opportunities created within our community. Your
              story could be next.
            </p>
            <Button
              onClick={onGetStarted}
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground text-base font-semibold px-6 md:px-8 py-3 md:py-4 shadow-xl"
            >
              Start Your Success Story
              <ArrowRight className="ml-2 w-4 md:w-5 h-4 md:h-5" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
