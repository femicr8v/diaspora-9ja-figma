"use client";

import { Star } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="py-16 md:py-24 px-6 bg-gradient-to-br from-secondary/30 to-accent/10"
    >
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-6 text-foreground font-headers font-bold">
            Trusted by Nigerians Worldwide
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Real stories from real members who have transformed their lives
            through our community
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
          <Card className="border-border/40 bg-background/90 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <CardContent className="p-8 md:p-10">
              <div className="flex items-center mb-4 md:mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-5 md:w-6 h-5 md:h-6 text-accent fill-accent"
                  />
                ))}
              </div>
              <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 leading-relaxed">
                "Diaspora 9ja has been instrumental in helping me navigate my
                career in Canada. The mentorship program connected me with
                someone who had walked the same path. Within 6 months, I landed
                my dream job and started my own consulting practice."
              </p>
              <div className="flex items-center">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b190?w=64&h=64&fit=crop&crop=face"
                  alt="Adaora K."
                  className="w-12 md:w-16 h-12 md:h-16 rounded-full mr-4 md:mr-6"
                />
                <div>
                  <h4 className="text-base md:text-lg text-foreground font-headers font-bold">
                    Adaora K.
                  </h4>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Software Engineer & Consultant, Toronto
                  </p>
                  <p className="text-xs md:text-sm text-accent font-medium">
                    Premium Member since 2023
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-background/90 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <CardContent className="p-8 md:p-10">
              <div className="flex items-center mb-4 md:mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-5 md:w-6 h-5 md:h-6 text-accent fill-accent"
                  />
                ))}
              </div>
              <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 leading-relaxed">
                "The investment opportunities shared on this platform are
                game-changing. I've connected with like-minded investors and
                we've successfully funded three startups in Lagos. The ROI has
                been exceptional!"
              </p>
              <div className="flex items-center">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face"
                  alt="Chinedu M."
                  className="w-12 md:w-16 h-12 md:h-16 rounded-full mr-4 md:mr-6"
                />
                <div>
                  <h4 className="text-base md:text-lg text-foreground font-headers font-bold">
                    Chinedu M.
                  </h4>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Angel Investor & Business Owner, London
                  </p>
                  <p className="text-xs md:text-sm text-accent font-medium">
                    Premium Member since 2022
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
