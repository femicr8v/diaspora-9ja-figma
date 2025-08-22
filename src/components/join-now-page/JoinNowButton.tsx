"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2, UserRoundCheck } from "lucide-react";

export function JoinNowButton({
  user,
}: {
  user?: { id: string; email: string };
}) {
  const [email, setEmail] = useState(user?.email ?? "");
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email, // optional if you want Stripe to ask for it
          userId: user?.id ?? "guest",
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error ?? "Something went wrong");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {!user && (
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email (optional - Stripe will ask if not provided)"
          className="h-12 bg-muted/50 border border-border focus:border-primary focus:bg-background"
        />
      )}
      <Button
        onClick={handleCheckout}
        disabled={isLoading}
        className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Redirecting to Checkout...
          </>
        ) : (
          <>
            <UserRoundCheck strokeWidth={2} className="w-5 h-5 mr-2" />
            Join Our Community
          </>
        )}
      </Button>
    </div>
  );
}
