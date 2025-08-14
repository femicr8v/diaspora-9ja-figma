import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  X,
  CreditCard,
  Lock,
  CheckCircle,
  Loader2,
  Shield,
} from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
}

export default function PaymentModal({
  isOpen,
  onClose,
  onSuccess,
  userInfo,
}: PaymentModalProps) {
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    billingAddress: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Partial<typeof paymentData>>({});

  if (!isOpen) return null;

  const handleInputChange =
    (field: keyof typeof paymentData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;

      // Format card number
      if (field === "cardNumber") {
        value = value
          .replace(/\s/g, "")
          .replace(/(.{4})/g, "$1 ")
          .trim();
        if (value.length > 19) value = value.slice(0, 19);
      }

      // Format expiry date
      if (field === "expiryDate") {
        value = value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2");
        if (value.length > 5) value = value.slice(0, 5);
      }

      // Format CVV
      if (field === "cvv") {
        value = value.replace(/\D/g, "");
        if (value.length > 4) value = value.slice(0, 4);
      }

      setPaymentData({ ...paymentData, [field]: value });

      if (errors[field]) {
        setErrors({ ...errors, [field]: undefined });
      }
    };

  const validatePayment = (): boolean => {
    const newErrors: Partial<typeof paymentData> = {};

    if (
      !paymentData.cardNumber.replace(/\s/g, "") ||
      paymentData.cardNumber.replace(/\s/g, "").length < 16
    ) {
      newErrors.cardNumber = "Please enter a valid card number";
    }

    if (
      !paymentData.expiryDate ||
      !/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)
    ) {
      newErrors.expiryDate = "Please enter a valid expiry date (MM/YY)";
    }

    if (!paymentData.cvv || paymentData.cvv.length < 3) {
      newErrors.cvv = "Please enter a valid CVV";
    }

    if (!paymentData.cardName.trim()) {
      newErrors.cardName = "Please enter the cardholder name";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePayment()) return;

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <Card className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-background shadow-2xl border-border/40">
        <CardHeader className="border-b border-border/40 sticky top-0 bg-background/95 backdrop-blur-sm z-10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-headers font-bold text-foreground">
                Complete Your Membership
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Join 15,000+ Nigerians worldwide with premium access
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-full w-8 h-8 p-0 hover:bg-secondary"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          {/* Order Summary */}
          <div className="mb-8 p-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl border border-border/40">
            <h3 className="font-headers font-bold text-lg mb-4">
              Order Summary
            </h3>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">
                  Premium Membership
                </span>
                <span className="font-semibold">$25.00/month</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">
                  Early Bird Discount
                </span>
                <span className="font-semibold text-green-600">-$15.00</span>
              </div>
              <div className="border-t border-border/40 pt-3 flex justify-between items-center">
                <span className="font-semibold text-lg">Total Today</span>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary font-headers">
                    $10.00
                  </div>
                  <div className="text-sm text-muted-foreground">
                    then $25.00/month
                  </div>
                </div>
              </div>
            </div>

            <Badge
              variant="secondary"
              className="bg-accent/10 text-accent border-accent/20 font-semibold"
            >
              🎉 Limited Time: 60% Off First Month
            </Badge>
          </div>

          {/* Customer Info */}
          <div className="mb-8 p-6 bg-secondary/30 rounded-2xl">
            <h3 className="font-headers font-bold text-lg mb-3">
              Account Information
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Name:</span>{" "}
                <span className="font-medium">{userInfo.fullName}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span>{" "}
                <span className="font-medium">{userInfo.email}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Phone:</span>{" "}
                <span className="font-medium">{userInfo.phone}</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handlePayment} className="space-y-6">
            <div>
              <h3 className="font-headers font-bold text-lg mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="cardNumber" className="font-semibold">
                    Card Number *
                  </Label>
                  <div className="relative">
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={paymentData.cardNumber}
                      onChange={handleInputChange("cardNumber")}
                      className={`h-12 rounded-xl border-2 pl-12 ${
                        errors.cardNumber
                          ? "border-destructive focus:border-destructive"
                          : "border-border focus:border-primary"
                      }`}
                      maxLength={19}
                      required
                    />
                    <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  </div>
                  {errors.cardNumber && (
                    <p className="text-sm text-destructive">
                      {errors.cardNumber}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiryDate" className="font-semibold">
                    Expiry Date *
                  </Label>
                  <Input
                    id="expiryDate"
                    placeholder="MM/YY"
                    value={paymentData.expiryDate}
                    onChange={handleInputChange("expiryDate")}
                    className={`h-12 rounded-xl border-2 ${
                      errors.expiryDate
                        ? "border-destructive focus:border-destructive"
                        : "border-border focus:border-primary"
                    }`}
                    maxLength={5}
                    required
                  />
                  {errors.expiryDate && (
                    <p className="text-sm text-destructive">
                      {errors.expiryDate}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cvv" className="font-semibold">
                    CVV *
                  </Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={paymentData.cvv}
                    onChange={handleInputChange("cvv")}
                    className={`h-12 rounded-xl border-2 ${
                      errors.cvv
                        ? "border-destructive focus:border-destructive"
                        : "border-border focus:border-primary"
                    }`}
                    maxLength={4}
                    required
                  />
                  {errors.cvv && (
                    <p className="text-sm text-destructive">{errors.cvv}</p>
                  )}
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="cardName" className="font-semibold">
                    Cardholder Name *
                  </Label>
                  <Input
                    id="cardName"
                    placeholder="Full name as it appears on card"
                    value={paymentData.cardName}
                    onChange={handleInputChange("cardName")}
                    className={`h-12 rounded-xl border-2 ${
                      errors.cardName
                        ? "border-destructive focus:border-destructive"
                        : "border-border focus:border-primary"
                    }`}
                    required
                  />
                  {errors.cardName && (
                    <p className="text-sm text-destructive">
                      {errors.cardName}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Your payment is secured by industry-standard SSL encryption
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    We never store your card details. Powered by Stripe.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-4 pt-6">
              <Button
                type="submit"
                size="lg"
                disabled={isProcessing}
                className="w-full h-14 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5 mr-2" />
                    Complete Payment - $10.00
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isProcessing}
                className="w-full h-12 rounded-xl border-2 border-border hover:border-primary/30 text-muted-foreground hover:text-primary"
              >
                Cancel
              </Button>
            </div>

            {/* Terms */}
            <p className="text-center text-xs text-muted-foreground pt-4">
              By completing this payment, you agree to our{" "}
              <a href="#" className="text-primary hover:underline">
                Terms of Service
              </a>{" "}
              and confirm that you understand our{" "}
              <a href="#" className="text-primary hover:underline">
                Subscription Policy
              </a>
              . You can cancel anytime.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
