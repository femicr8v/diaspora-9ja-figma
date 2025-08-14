"use client";

import { Users, TrendingUp, Shield } from "lucide-react";

export function JoinNowBottomCTA() {
  return (
    <section className="py-16 px-6 bg-gradient-to-r from-primary/10 via-background to-accent/10">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold text-foreground font-headers mb-4">
          Ready to Transform Your Global Network?
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Join thousands of successful Nigerians who have already discovered
          opportunities, built meaningful connections, and accelerated their
          careers through our platform.
        </p>
        <div className="flex items-center justify-center space-x-8 text-muted-foreground">
          <div className="flex items-center">
            <Users className="w-5 h-5 mr-2 text-primary" />
            <span className="font-medium">Global Community</span>
          </div>
          <div className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-accent" />
            <span className="font-medium">Growth Opportunities</span>
          </div>
          <div className="flex items-center">
            <Shield className="w-5 h-5 mr-2 text-green-600" />
            <span className="font-medium">Trusted Platform</span>
          </div>
        </div>
      </div>
    </section>
  );
}
