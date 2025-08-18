"use client";

import { Badge } from "../ui/badge";
import { JoinNowHeader } from "./JoinNowHeader";
import { JoinNowBottomCTA } from "./JoinNowBottomCTA";
import { JoinNowHeroSection } from "./JoinNowHeroSection";
import { JoinNowFormSection } from "./JoinNowFormSection";
import { JoinNowBenefitsSection } from "./JoinNowBenefitsSection";
import { Footer } from "../landing-page/Footer";

export function JoinNowPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/5">
      <JoinNowHeader />
      <JoinNowHeroSection />

      {/* Main Content Section */}
      <section className="py-16 md:py-24 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center">
            <Badge
              variant="secondary"
              className="mb-4 md:mb-10 bg-primary/10 text-primary border-primary/20 text-sm font-semibold"
            >
              Why Join Our Community?
            </Badge>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
            {/* Left Side - Benefits */}
            <JoinNowBenefitsSection />

            {/* Right Side - Form */}
            <JoinNowFormSection />
          </div>
        </div>
      </section>

      {/* <JoinNowBottomCTA /> */}
      <Footer />
    </div>
  );
}
