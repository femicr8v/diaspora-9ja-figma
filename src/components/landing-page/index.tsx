"use client";

import { useState } from "react";
import { Footer } from "./Footer";
import { FAQSection } from "./FAQSection";
import { PromoBanner } from "./PromoBanner";
import { HeroSection } from "./HeroSection";
import { AboutSection } from "./AboutSection";
import { HomepageHeader } from "./HomepageHeader";
import { ContactSection } from "./ContactSection";
import { PlatformSection } from "./PlatformSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { CallToActionSection } from "./CallToActionSection";
import { CommunityStatsSection } from "./CommunityStatsSection";
import { CommunityShowcaseSection } from "./CommunityShowcaseSection";

export function LandingPage() {
  const [showPromo, setShowPromo] = useState(true);

  const handleGetStarted = () => {
    console.log("Get started clicked");
    // Handle get started logic - redirect to sign-up, open modal, etc.
  };
  return (
    <div className="min-h-screen">
      <PromoBanner showPromo={showPromo} onClose={() => setShowPromo(false)} />
      <HomepageHeader onGetStarted={handleGetStarted} />
      <HeroSection onGetStarted={handleGetStarted} />
      <AboutSection />
      <CommunityStatsSection onGetStarted={handleGetStarted} />
      <PlatformSection onGetStarted={handleGetStarted} />
      <CommunityShowcaseSection onGetStarted={handleGetStarted} />
      <TestimonialsSection />
      <FAQSection />
      <CallToActionSection onGetStarted={handleGetStarted} />
      <ContactSection />
      <Footer />
    </div>
  );
}
