"use client";

import { Badge } from "../ui/badge";
import { trustIndicators } from "@/lib/constants";

export function JoinNowHeroSection() {
  const repeatingPlusGreenPattern =
    "bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23e8f5e8%22%20fill-opacity%3D%220.3%22%3E%3Cpath%20d%3D%22m36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]";

  return (
    <section className="py-16 md:py-24 px-6 text-center bg-gradient-to-r from-primary/5 via-background to-accent/5 relative overflow-hidden">
      <div
        className={`absolute inset-0 ${repeatingPlusGreenPattern} opacity-50`}
      />

      <div className="container mx-auto max-w-7xl text-center relative z-10">
        <Badge
          variant="secondary"
          className="mb-6 md:mb-8 bg-accent/10 text-accent border-accent/20 text-sm font-semibold px-4 py-2"
        >
          🌍 Join 15,000+ Nigerians Worldwide
        </Badge>

        <h1 className="max-w-4xl text-3xl md:text-5xl lg:text-6xl xl:text-7xl mx-auto mb-6 md:mb-8 font-bold gradient-text font-headers leading-tight">
          Join The Global Nigerian Community
        </h1>

        <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed">
          Connect with the most trusted platform for Nigerians worldwide. Access
          exclusive opportunities, build meaningful relationships, and stay
          connected with your heritage while thriving globally.
        </p>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {trustIndicators.map((indicator, index) => {
            const Icon = indicator.icon;

            return (
              <div
                key={index + "hs"}
                className={`text-center ${
                  index % 2 === 0 ? "text-primary" : "text-accent"
                }`}
              >
                <div
                  className={`size-12 md:size-16 ${
                    index % 2 === 0 ? "bg-primary/10" : "bg-accent/10"
                  } rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3`}
                >
                  <Icon className="size-6 md:size-8" />
                </div>
                <div className="text-lg md:text-3xl font-bold mb-1 font-headers">
                  {indicator.number}
                </div>
                <p className="text-xs md:text-sm text-muted-foreground font-medium">
                  {indicator.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
