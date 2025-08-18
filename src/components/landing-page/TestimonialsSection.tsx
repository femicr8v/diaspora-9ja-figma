"use client";

import { Star } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { testimonialsSection } from "@/lib/constants";

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-16 md:py-24 px-6">
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
          {testimonialsSection.map((testimonial) => (
            <Card
              key={testimonial.name + "w"}
              className="border-border/40 bg-background/90 shadow-xl hover:shadow-2xl transition-shadow duration-300"
            >
              <CardContent className="p-8 md:p-10 size-full flex flex-col justify-between">
                <div>
                  <span className="flex items-center mb-4 md:mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-5 md:w-6 h-5 md:h-6 text-accent fill-accent"
                      />
                    ))}
                  </span>
                  <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 leading-relaxed">
                    {testimonial.story}
                  </p>
                </div>

                <div className="flex items-center">
                  <ImageWithFallback
                    src={testimonial.img}
                    alt={testimonial.name}
                    className="w-12 md:w-16 h-12 md:h-16 rounded-full mr-4 md:mr-6"
                  />
                  <div>
                    <h4 className="text-base md:text-lg text-foreground font-headers font-bold">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {testimonial.title}
                    </p>
                    <p className="text-xs md:text-sm text-accent font-medium">
                      Premium Member since {testimonial.dateJoined}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
