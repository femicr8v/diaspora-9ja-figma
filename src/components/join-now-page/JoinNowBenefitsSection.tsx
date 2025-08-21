"use client";

import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { CheckCircle, Shield } from "lucide-react";
import { joinNowPageBenefits } from "@/lib/constants";

export function JoinNowBenefitsSection() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
          Discover the exclusive benefits that come with being part of our
          global network
        </p>

        <div className="space-y-6">
          {joinNowPageBenefits.map((item) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.title + "bs"}
                className="border-border/40 bg-background/80 backdrop-blur-sm hover:border-primary/40 hover:shadow-xl transition-all duration-300 group overflow-hidden"
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300 flex-shrink-0">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-foreground font-headers">
                          {item.title}
                        </h3>
                        <Badge
                          variant="secondary"
                          className="bg-accent/10 text-accent border-accent/30 text-xs font-medium"
                        >
                          {item.highlight}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Enhanced Trust Section */}
      <Card className="border-border/40 bg-gradient-to-r from-primary/5 via-background to-accent/5 backdrop-blur-sm shadow-lg">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-foreground font-headers mb-3">
              Trusted & Secure Platform
            </h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of successful Nigerians who trust our platform for
              their professional and personal growth
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span>SSL Encrypted</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span>No Spam Policy</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
