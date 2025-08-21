"use client";

import {
  CheckCircle,
  ArrowRight,
  Home,
  User,
  Gift,
  Sparkles,
  Users,
  TrendingUp,
  AlertCircle,
  Loader2,
} from "lucide-react";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { logoImage, logoText } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";

interface PaymentData {
  id: string;
  email: string;
  name: string;
  tier_name: string;
  amount_total: number;
  currency: string;
  created_at: string;
}

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
          const timer = setTimeout(() => setShowConfetti(false), 3000);
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
      icon: Gift,
      title: "Welcome Bonus",
      description: "60% off first month + exclusive resources",
    },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-green-50 via-background to-accent/10 relative overflow-hidden">
      {/* Confetti Animation Placeholder */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-10">
          <div className="absolute inset-0">
            {/* Animated confetti elements */}
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-accent rounded-full animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 3}s`,
                }}
              />
            ))}
            {[...Array(30)].map((_, i) => (
              <div
                key={`confetti-${i}`}
                className="absolute w-1 h-4 bg-primary rounded-full animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1.5 + Math.random() * 2}s`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      <header className="border-b-2 border-border/40 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto max-w-7xl px-6 py-4 flex items-center justify-center">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 flex items-center justify-center">
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
      <main className="container mx-auto max-w-6xl px-6 py-16 text-center relative z-20">
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
            Your payment was successful, {paymentData?.name || "valued member"}!
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
                key={index}
                className="border-border/40 bg-background/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-headers font-bold text-lg text-foreground mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* What's Next */}
        <Card className="border-border/40 bg-gradient-to-r from-primary/5 to-accent/5 backdrop-blur-sm shadow-2xl mb-12">
          <CardContent className="p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground font-headers mb-6">
              What's Next?
            </h2>

            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div className="space-y-4">
                <h3 className="font-headers font-bold text-lg text-foreground flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-accent" />
                  Immediate Access
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Premium investment opportunities
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Exclusive community forums
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Monthly networking events
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-headers font-bold text-lg text-foreground flex items-center">
                  <Gift className="w-5 h-5 mr-2 text-accent" />
                  Welcome Package
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Diaspora Investment Guide (PDF)
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Directory of 5,000+ businesses
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Exclusive webinar invitations
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <Button
            size="lg"
            onClick={() => router.push("/dashboard")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 min-w-[200px]"
          >
            <User className="w-5 h-5 mr-2" />
            Go to Dashboard
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push("/")}
            className="border-2 border-border hover:border-primary/30 text-muted-foreground hover:text-primary px-8 py-4 text-lg font-semibold min-w-[200px]"
          >
            <Home className="w-5 h-5 mr-2" />
            Return Home
          </Button>
        </div>

        {/* Support Information */}
        <div className="mt-16 p-8 bg-background/60 backdrop-blur-sm rounded-2xl border border-border/40">
          <h3 className="font-headers font-bold text-lg text-foreground mb-4">
            Need Help Getting Started?
          </h3>
          <p className="text-muted-foreground mb-6">
            Our community team is here to help you make the most of your
            membership. Don't hesitate to reach out if you have any questions.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center text-sm">
            <a
              href="mailto:support@diaspora9ja.com"
              className="text-primary hover:underline font-medium"
            >
              support@diaspora9ja.com
            </a>
            <span className="hidden md:block text-muted-foreground">•</span>
            <a
              href="tel:+442079460958"
              className="text-primary hover:underline font-medium"
            >
              +44 20 7946 0958
            </a>
            <span className="hidden md:block text-muted-foreground">•</span>
            <span className="text-muted-foreground">
              Live chat available 24/7
            </span>
          </div>
        </div>
      </main>
    </section>
  );
}
