"use client";

import { useState } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { FAQSection } from "./FAQSection";
import { PromoBanner } from "./PromoBanner";
import { HeroSection } from "./HeroSection";
import { AboutSection } from "./AboutSection";
import { PlatformSection } from "./PlatformSection";
import { ContactSection } from "./ContactSection";
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
      <Header onGetStarted={handleGetStarted} />
      <HeroSection onGetStarted={handleGetStarted} />
      <AboutSection />
      <CommunityStatsSection onGetStarted={handleGetStarted} />
      <PlatformSection onGetStarted={handleGetStarted} />
      <CommunityShowcaseSection onGetStarted={handleGetStarted} />
      <FAQSection />
      <TestimonialsSection />
      <CallToActionSection onGetStarted={handleGetStarted} />
      <ContactSection />
      <Footer />
    </div>
  );
}
