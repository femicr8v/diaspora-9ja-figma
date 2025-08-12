"use client";

import { Target, Eye, Heart, CheckCircle, Users } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";

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
            than a platform—we've created a digital homeland.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 md:gap-12 mb-16 md:mb-20">
          <Card className="border-border/40 hover:border-primary/30 transition-all duration-500 group hover:shadow-2xl bg-gradient-to-br from-background to-primary/5">
            <CardContent className="p-8 md:p-10 text-center">
              <div className="w-16 md:w-20 h-16 md:h-20 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-8 md:w-10 h-8 md:h-10 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl mb-4 md:mb-6 text-foreground font-headers font-bold">
                Our Mission
              </h3>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-4 md:mb-6">
                To unite Nigerians worldwide through a vibrant, inclusive
                digital hub that fosters networking, learning, and collaboration
                across borders and industries.
              </p>
              <ul className="text-left space-y-2 text-sm md:text-base text-muted-foreground">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-primary mr-2" /> Global
                  networking
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-primary mr-2" />{" "}
                  Knowledge sharing
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-primary mr-2" /> Cultural
                  preservation
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/40 hover:border-accent/30 transition-all duration-500 group hover:shadow-2xl bg-gradient-to-br from-background to-accent/5">
            <CardContent className="p-8 md:p-10 text-center">
              <div className="w-16 md:w-20 h-16 md:h-20 bg-gradient-to-br from-accent to-accent/70 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 group-hover:scale-110 transition-transform duration-300">
                <Eye className="w-8 md:w-10 h-8 md:h-10 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl mb-4 md:mb-6 text-foreground font-headers font-bold">
                Our Vision
              </h3>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-4 md:mb-6">
                A thriving global community where every Nigerian, regardless of
                location, feels connected, supported, and empowered to achieve
                extraordinary success.
              </p>
              <ul className="text-left space-y-2 text-sm md:text-base text-muted-foreground">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-accent mr-2" />{" "}
                  Borderless connections
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-accent mr-2" /> Mutual
                  support
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-accent mr-2" />{" "}
                  Collective success
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/40 hover:border-primary/30 transition-all duration-500 group hover:shadow-2xl bg-gradient-to-br from-background to-primary/5">
            <CardContent className="p-8 md:p-10 text-center">
              <div className="w-16 md:w-20 h-16 md:h-20 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-8 md:w-10 h-8 md:h-10 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl mb-4 md:mb-6 text-foreground font-headers font-bold">
                Our Impact
              </h3>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-4 md:mb-6">
                Since 2023, we've facilitated thousands of connections, enabled
                millions in investments, and created opportunities that span
                continents.
              </p>
              <ul className="text-left space-y-2 text-sm md:text-base text-muted-foreground">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-primary mr-2" /> $50M+ in
                  deals
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-primary mr-2" /> 5,000+
                  businesses
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-primary mr-2" /> 50+
                  countries
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Founder Story - Hidden on mobile */}
        <div className="hidden md:block bg-gradient-to-r from-secondary/30 to-accent/10 rounded-3xl p-8 md:p-12 text-center">
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
              <p className="text-sm text-muted-foreground">Diaspora 9ja</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
