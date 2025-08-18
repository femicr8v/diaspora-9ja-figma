"use client";

import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { CheckCircle, Users } from "lucide-react";
import { aboutCards, logoText } from "../../lib/constants";

export function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-24 px-6 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 md:mb-20">
          <Badge
            variant="secondary"
            className="mb-4 md:mb-6 bg-primary/10 text-primary border-primary/20 text-sm font-semibold"
          >
            Our Story
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-6 text-foreground font-headers font-bold">
            Bridging Continents, Connecting Hearts
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Born from a vision to unite the Nigerian diaspora, we've built more
            than a platform, we've created a digital homeland. Our journey is
            not just about connecting people, it's about fostering a vibrant,
            inclusive space where every voice matters.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 md:gap-12 mb-0 md:mb-20">
          {aboutCards.map((card) => {
            const Icon = card.icon;
            const isAccent = card.color === "text-accent";

            // Create proper class strings for Tailwind CSS
            const borderHoverClass = isAccent
              ? "hover:border-accent/30 active:border-accent/30"
              : "hover:border-primary/30 active:border-primary/30";

            const backgroundClass = isAccent
              ? "bg-gradient-to-br from-background to-accent/5"
              : "bg-gradient-to-br from-background to-primary/5";

            return (
              <Card
                key={card.id}
                className={`border-border/40 ${borderHoverClass} ${backgroundClass} transition-all duration-300 group hover:shadow-2xl active:shadow-2xl`}
              >
                <CardContent className="p-8 md:p-10 text-center">
                  <div
                    className={`size-16 md:size-20 bg-gradient-to-br ${
                      isAccent
                        ? "from-accent/10 to-accent/10"
                        : "from-primary/10 to-primary/10"
                    } rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 group-hover:scale-110 group-active:scale-110 transition-transform duration-300`}
                  >
                    <Icon
                      className={`size-8 md:size-10 ${
                        isAccent ? "text-accent" : "text-primary"
                      }`}
                    />
                  </div>

                  <h3 className="text-xl md:text-2xl mb-4 md:mb-6 text-foreground font-headers font-bold">
                    {card.title}
                  </h3>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-4 md:mb-6">
                    {card.description}
                  </p>
                  <ul className="text-left flex flex-col items-center justify-center space-y-2 text-sm md:text-base text-muted-foreground">
                    {card.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle
                          className={`size-4 ${
                            isAccent ? "text-accent" : "text-primary"
                          } mr-2`}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Founder Story - Hidden on mobile */}
        <div className="hidden md:block bg-gradient-to-br from-primary/5 to-accent/10 rounded-3xl p-8 md:p-12 text-center border border-border/30">
          <h3 className="text-2xl md:text-3xl mb-4 md:mb-6 text-foreground font-headers font-bold">
            From Vision to Reality
          </h3>
          <p className="text-base md:text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            "Growing up between Lagos and London, I experienced firsthand the
            challenges of staying connected to home while building a life
            abroad. Diaspora 9ja was born from the belief that distance
            shouldn't diminish our bonds or limit our potential. Today, we're
            proud to be the bridge that connects our global family."
          </p>
          <div className="mt-6 md:mt-8 flex items-center justify-center space-x-4">
            <div className="w-12 md:w-16 h-12 md:h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Users className="w-6 md:w-8 h-6 md:h-8 text-primary" />
            </div>
            <div className="text-left">
              <p className="text-base font-semibold text-foreground">
                Founding Team
              </p>
              <p className="text-sm text-muted-foreground">{logoText}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
