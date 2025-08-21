"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { communityShowcase } from "@/lib/constants";

export function CommunityShowcaseSection() {
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
          {communityShowcase.map((item, index) => {
            const Icon = item.icon;

            return (
              <div key={index + "wa"} className="text-center">
                <div
                  className={`size-16 md:size-20 ${
                    index % 2 === 0
                      ? "bg-primary/10 text-primary"
                      : "bg-accent/10 text-accent"
                  } rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6`}
                >
                  <Icon className="w-8 md:w-10 h-8 md:h-10" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 font-headers">
                  {item.title}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        <Card className="border-border/40 bg-background/80 backdrop-blur-sm shadow-2xl">
          <CardContent className="p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
              Ready to Join Our Success Stories?
            </h3>
            <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto">
              Every week, we celebrate new connections, business partnerships,
              and life-changing opportunities created within our community. Your
              story could be next.
            </p>
            <Link
              href="/join-the-community"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "bg-accent hover:bg-accent/90 active:bg-accent/90 text-accent-foreground text-base font-semibold px-6 md:px-8 py-3 md:py-4 shadow-xl mb-6"
              )}
            >
              Start Your Success Story
              <ArrowRight className="ml-2 size-4 -rotate-45 group-hover:rotate-0 group-active:rotate-0 transition-transform duration-300" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
