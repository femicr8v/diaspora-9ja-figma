"use client";

import {
  CheckCircle,
  Home,
  Sparkles,
  Users,
  TrendingUp,
  AlertCircle,
  Loader2,
  CornerDownRight,
} from "lucide-react";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { logoImage, logoText } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { ConfettiFireworks } from "@/components/ui/confetti-fireworks";

interface PaymentData {
  id: string;
  email: string;
  name: string;
  tier_name: string;
  amount_total: number;
  currency: string;
  created_at: string;
}

const welcomeBenefits = [
  {
    icon: TrendingUp,
    title: "Premium Investment Access",
    description: "Exclusive deals worth $50M+ available now",
  },
  {
    icon: Users,
    title: "Global Network",
    description: "Connect with 15,000+ Nigerians worldwide",
  },
  {
    icon: Sparkles,
    title: "Expert Mentorship",
    description: "1-on-1 guidance from successful diaspora entrepreneurs",
  },
];

export default function ThankYouPage() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get("session_id");
      const email = searchParams.get("email");

      if (!sessionId && !email) {
        setError(
          "Missing payment information. Please check your payment confirmation email."
        );
        setIsVerifying(false);
        return;
      }

      try {
        const params = new URLSearchParams();
        if (sessionId) params.append("session_id", sessionId);
        if (email) params.append("email", email);

        const response = await fetch(`/api/verify-payment?${params}`);
        const data = await response.json();

        if (data.verified) {
          setPaymentVerified(true);
          setPaymentData(data.payment);
          // Trigger confetti animation
          setShowConfetti(true);
          const timer = setTimeout(() => setShowConfetti(false), 5000);
          return () => clearTimeout(timer);
        } else {
          setError(
            "Payment not found or not completed. Please contact support if you believe this is an error."
          );
        }
      } catch (err) {
        console.error("Payment verification failed:", err);
        setError(
          "Failed to verify payment. Please try again or contact support."
        );
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  // Show loading state while verifying
  if (isVerifying) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-green-50 via-background to-accent/10 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Verifying your payment...
          </h2>
          <p className="text-muted-foreground">
            Please wait while we confirm your transaction.
          </p>
        </div>
      </section>
    );
  }

  // Show error state if payment not verified
  if (!paymentVerified || error) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-red-50 via-background to-accent/10 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Access Denied
          </h1>
          <p className="text-muted-foreground mb-6">
            {error || "You need to complete your payment to access this page."}
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => router.push("/join-the-community")}
              className="w-full"
            >
              Complete Payment
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="w-full"
            >
              <Home className="w-4 h-4 mr-2" />
              Return Home
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const repeatingPlusGreenPattern =
    "bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23e8f5e8%22%20fill-opacity%3D%220.3%22%3E%3Cpath%20d%3D%22m36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]";

  return (
    <section className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/5 overflow-hidden">
      {/* Confetti Fireworks Component */}
      <ConfettiFireworks trigger={showConfetti} duration={5000} />

      <main className="relative overflow-hidden">
        <div
          className={`absolute inset-0 ${repeatingPlusGreenPattern} opacity-50`}
        />

        <header className="border-b-2 border-border/40 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto max-w-7xl px-6 py-4 flex items-center justify-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 flex items-center justify-center gap-1.5 md:gap-3">
                <Image
                  src={logoImage}
                  width={40}
                  height={40}
                  alt="Diaspora 9ja Logo"
                  className="size-10 object-contain"
                />
                <h1 className="text-xl font-bold text-primary font-headers">
                  {logoText}
                </h1>
              </div>
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto max-w-6xl px-6 py-16 text-center relative z-20">
          {/* Success Icon */}
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <div className="mb-12">
            <Badge
              variant="secondary"
              className="mb-4 md:mb-10 bg-primary/10 text-primary border-primary/20 text-sm font-semibold"
            >
              🎉 Welcome to the Community!
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold gradient-text leading-tight mb-6">
              Your payment was successful,{" "}
              {paymentData?.name || "valued member"}!
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8 max-w-3xl mx-auto">
              Welcome to {logoText}, the most trusted platform connecting
              Nigerians worldwide. You're now part of an exclusive community of
              15,000+ ambitious professionals and entrepreneurs.
            </p>
          </div>

          {/* Welcome Benefits */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {welcomeBenefits.map((benefit, index) => {
              const Icon = benefit.icon;

              return (
                <Card
                  key={index + "wb"}
                  className="border-border/45 bg-background/80 text-center hover:border-primary/20 hover:shadow-xl active:shadow-xl transition-all duration-300 group text-primary"
                >
                  <CardContent className="p-8 text-center">
                    <div className="size-12 md:size-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-6 group-hover:bg-primary/10 group-hover:scale-110 group-active:scale-110 transition-all duration-300">
                      <Icon className="size-6 md:size-8" />
                    </div>
                    <h3 className="font-bold text-lg text-foreground mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Action Button */}
          <div className="mt-10 md:mt-20 flex justify-center items-center">
            <Link
              href="https://discord.com/"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "h-12 active:bg-primary/90 md:has-[>svg]:px-8 py-3 md:py-5 text-base md:text-xl font-semibold shadow-xl hover:shadow-2xl active:shadow-2xl transform hover:scale-105 active:scale-105 animate-bounce transition-all duration-300 group"
              )}
            >
              Join Discord Community
              <CornerDownRight className="ml-2 md:ml-3 size-5 md:size-6 -rotate-45 group-hover:rotate-0 group-active:rotate-0 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </main>

      {/* Support Information */}
      <footer className="py-12 md:py-16 px-6 bg-primary text-white">
        <div className="container mx-auto text-center max-w-6xl">
          <h3 className="font-bold text-lg md:text-xl mb-4">
            Need Help Getting Started?
          </h3>
          <p className="mb-6 md:px-24">
            Our community team is here to help you make the most of your
            membership. We're available 24/7 for onboarding, investment
            opportunities, and connecting with fellow members.
          </p>

          <div className="mt-6 md:mt-10 ">
            <Link
              href="mailto:support@diaspora9ja.com"
              className={cn(
                buttonVariants({ variant: "outline", size: "default" }),
                "px-6 py-2 border-white bg-transparent text-white text-sm hover:text-primary hover:bg-white hover:font-medium active:text-primary active:bg-white active:font-medium font-normal rounded-full duration-300"
              )}
            >
              support@diaspora9ja.com
            </Link>
          </div>
        </div>
      </footer>
    </section>
  );
}
