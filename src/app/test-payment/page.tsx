"use client";

import { useState } from "react";
import { PaymentForm } from "@/components/payment-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function TestPaymentPage() {
  const [leadId, setLeadId] = useState<string>("");
  const [email, setEmail] = useState<string>("test@example.com");
  const [name, setName] = useState<string>("Test User");
  const [amount, setAmount] = useState<number>(10.0);
  const [showPayment, setShowPayment] = useState(false);

  const createLead = async () => {
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone: "+1234567890",
          location: "Test Location",
        }),
      });

      const data = await response.json();

      if (data.success) {
        setLeadId(data.leadId);
        setShowPayment(true);
        toast.success("Lead created! Ready for payment.");
      } else {
        toast.error("Failed to create lead");
      }
    } catch (error) {
      toast.error("Error creating lead");
    }
  };

  const handlePaymentSuccess = () => {
    toast.success("Payment completed successfully!");
    setShowPayment(false);
    setLeadId("");
  };

  const handlePaymentError = (error: string) => {
    toast.error(`Payment failed: ${error}`);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Stripe Payment Test</h1>
        <p className="text-muted-foreground mt-2">
          Test the payment integration with Stripe test cards
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Lead Creation */}
        <Card>
          <CardHeader>
            <CardTitle>1. Create Test Lead</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.50"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
              />
            </div>
            <Button onClick={createLead} className="w-full">
              Create Lead
            </Button>
            {leadId && (
              <p className="text-sm text-green-600">
                Lead created with ID: {leadId}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle>2. Test Payment</CardTitle>
          </CardHeader>
          <CardContent>
            {showPayment ? (
              <PaymentForm
                amount={amount}
                leadId={leadId}
                email={email}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Create a lead first to enable payment testing
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Test Cards Info */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Test Card Numbers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span className="font-mono">4242424242424242</span>
              <span className="text-green-600">✅ Success</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono">4000000000000002</span>
              <span className="text-red-600">❌ Card declined</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono">4000000000009995</span>
              <span className="text-yellow-600">⚠️ Insufficient funds</span>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Use any future expiry date and any 3-digit CVC
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
