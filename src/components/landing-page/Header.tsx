"use client";

import { logoImage } from "@/lib/constants";
import { Button } from "../ui/button";

interface HeaderProps {
  onGetStarted: () => void;
}

export function Header({ onGetStarted }: HeaderProps) {
  return (
    <header className="border-b-2 border-border/40 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 flex items-center justify-center">
            <img
              src={logoImage}
              alt="Diaspora 9ja Logo"
              className="w-10 h-10 object-contain"
            />
          </div>
          <h1 className="text-xl font-bold text-primary font-headers">
            Diaspo9ja
          </h1>
        </div>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          <a
            href="#about"
            className="text-base text-muted-foreground hover:text-primary transition-colors font-medium"
          >
            About
          </a>
          <a
            href="#platform"
            className="text-base text-muted-foreground hover:text-primary transition-colors font-medium"
          >
            Platform
          </a>
          <a
            href="#community"
            className="text-base text-muted-foreground hover:text-primary transition-colors font-medium"
          >
            Community
          </a>
          <a
            href="#testimonials"
            className="text-base text-muted-foreground hover:text-primary transition-colors font-medium"
          >
            Testimonials
          </a>
          <a
            href="#faqs"
            className="text-base text-muted-foreground hover:text-primary transition-colors font-medium"
          >
            FAQs
          </a>
          <a
            href="#contact"
            className="text-base text-muted-foreground hover:text-primary transition-colors font-medium"
          >
            Contact
          </a>
          <Button
            onClick={onGetStarted}
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-base font-semibold animate-pulse-glow"
          >
            Join Now
          </Button>
        </nav>

        {/* Mobile menu button */}
        <Button
          variant="outline"
          className="lg:hidden text-base"
          onClick={onGetStarted}
        >
          Join Now
        </Button>
      </div>
    </header>
  );
}
