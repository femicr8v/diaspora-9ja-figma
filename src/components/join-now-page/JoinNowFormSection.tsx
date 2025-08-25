"use client";

import {
  Loader2,
  LucideIcon,
  UserRoundCheck,
  Shield,
  CheckCircle,
  Star,
} from "lucide-react";

import { toast } from "sonner";
import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { joinFormFields } from "@/lib/constants";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { CheckoutResponse, ERROR_TYPES } from "@/lib/error-types";

interface JoinFormData {
  name: string;
  email: string;
  phone: string;
  location: string;
}

export interface SecurityIcons {
  icon: LucideIcon;
  text: string;
}

const securityIcons: SecurityIcons[] = [
  { icon: Shield, text: "SSL Secure" },
  { icon: CheckCircle, text: "No Spam" },
  { icon: Star, text: "Trusted" },
];

export function JoinNowFormSection() {
  const [formData, setFormData] = useState<JoinFormData>({
    name: "",
    email: "",
    phone: "",
    location: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorField, setErrorField] = useState<string | null>(null);
  const [lastErrorType, setLastErrorType] = useState<string | null>(null);

  const handleInputChange =
    (field: keyof JoinFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value });

      // Clear error state when user modifies any field after an error
      // This ensures form remains accessible and allows re-validation (Requirement 4.3)
      if (hasError) {
        setHasError(false);
        setErrorField(null);
        setLastErrorType(null);
      }
    };

  const handleJoinCommunity = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent form resubmission if there's an active error state (Requirement 4.2)
    if (hasError && lastErrorType === ERROR_TYPES.DUPLICATE_CLIENT) {
      toast.error("Please resolve the email issue before submitting again", {
        description:
          "Use a different email address or sign in to your existing account.",
      });
      return;
    }

    // Clear previous error state
    setHasError(false);
    setErrorField(null);
    setLastErrorType(null);

    // Validate required fields
    if (!formData.name || !formData.email) {
      toast.error("Name and Email is required", {
        description: "Please fill in your name and email address.",
      });
      return;
    }

    setIsLoading(true);

    try {
      // First, save the lead information
      const leadResponse = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!leadResponse.ok) {
        throw new Error("Failed to save lead information");
      }

      // Then proceed to checkout with pre-filled information
      const checkoutResponse = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
          location: formData.location,
          userId: "guest",
        }),
      });

      const checkoutData: CheckoutResponse = await checkoutResponse.json();

      if (checkoutData.url) {
        // Success - redirect to checkout
        window.location.href = checkoutData.url;
      } else if (checkoutData.error && checkoutData.errorType) {
        // Handle different error types with specific messaging and behavior
        handleCheckoutError(checkoutData);
        setIsLoading(false);
      } else {
        // Fallback for unexpected error format
        toast.error(checkoutData.error ?? "Something went wrong");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Join community error:", error);
      toast.error("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const handleCheckoutError = (errorResponse: CheckoutResponse) => {
    const { error, errorType, details } = errorResponse;

    // Set error state to prevent form resubmission and highlight problematic field
    setHasError(true);
    setLastErrorType(errorType || null);

    // Set error field for highlighting (email field for duplicate client errors)
    if (errorType === ERROR_TYPES.DUPLICATE_CLIENT) {
      setErrorField("email");
    } else if (details?.field) {
      setErrorField(details.field);
    }

    switch (errorType) {
      case ERROR_TYPES.DUPLICATE_CLIENT:
        // Specific toast notification for duplicate client errors (Requirement 4.1)
        toast.error("Email Already Registered", {
          description:
            error ||
            "This email is already registered. Please sign in to your account or use a different email.",
          duration: 8000, // Longer duration for important message
          action: {
            label: "Sign In",
            onClick: () => {
              // Could redirect to sign-in page or open sign-in modal
              window.location.href = "/sign-in";
            },
          },
        });
        break;

      case ERROR_TYPES.VALIDATION_ERROR:
        // Validation error with field-specific feedback
        toast.error("Validation Error", {
          description: error || "Please check your input and try again.",
          duration: 4000,
        });
        break;

      case ERROR_TYPES.SERVER_ERROR:
        // Server error with retry suggestion
        toast.error("Server Error", {
          description:
            error || "Unable to process your request. Please try again.",
          duration: 5000,
          action: {
            label: "Retry",
            onClick: () => {
              // Clear error state and allow retry
              setHasError(false);
              setErrorField(null);
              setLastErrorType(null);
            },
          },
        });
        break;

      default:
        // Fallback for unknown error types
        toast.error("Error", {
          description: error || "Something went wrong. Please try again.",
          duration: 4000,
        });
        break;
    }
  };

  return (
    <div className="lg:sticky lg:top-8 lg:self-start">
      <Card className="border-border/40 shadow-2xl bg-background overflow-hidden">
        {/* Enhanced Community Image */}
        <div className="relative">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=320&fit=crop"
            alt="Global Nigerian Community"
            className="w-full h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        {/* Enhanced Join Form */}
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground font-headers mb-2">
              Start Your Journey
            </h2>
            <p className="text-muted-foreground">
              Fill in your details to join our exclusive community
            </p>
          </div>

          <form onSubmit={handleJoinCommunity} className="flex flex-col gap-4">
            {/* First row: Name and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {joinFormFields.slice(0, 2).map((field) => {
                const hasFieldError = hasError && errorField === field.id;
                return (
                  <div key={field.id + "ne"} className="space-y-2">
                    <Label htmlFor={field.id} className="text-sm font-semibold">
                      {field.label}{" "}
                      {field.required && (
                        <span className="text-destructive">*</span>
                      )}
                    </Label>
                    <Input
                      id={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formData[field.id as keyof JoinFormData]}
                      onChange={handleInputChange(
                        field.id as keyof JoinFormData
                      )}
                      className={`h-12 bg-muted/50 border focus:bg-background ${
                        hasFieldError
                          ? "border-destructive focus:border-destructive"
                          : "border-border focus:border-primary"
                      }`}
                      required={field.required}
                      aria-invalid={hasFieldError}
                      aria-describedby={
                        hasFieldError ? `${field.id}-error` : undefined
                      }
                    />
                    {hasFieldError && (
                      <p
                        id={`${field.id}-error`}
                        className="text-sm text-destructive"
                        role="alert"
                      >
                        Please check this field and try again.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Second row: Phone and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {joinFormFields.slice(2, 4).map((field) => {
                const hasFieldError = hasError && errorField === field.id;
                return (
                  <div key={field.id + "pl"} className="space-y-2">
                    <Label htmlFor={field.id} className="text-sm font-semibold">
                      {field.label}{" "}
                      {field.required && (
                        <span className="text-destructive">*</span>
                      )}
                    </Label>
                    <Input
                      id={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formData[field.id as keyof JoinFormData]}
                      onChange={handleInputChange(
                        field.id as keyof JoinFormData
                      )}
                      className={`h-12 bg-muted/50 border focus:bg-background ${
                        hasFieldError
                          ? "border-destructive focus:border-destructive"
                          : "border-border focus:border-primary"
                      }`}
                      required={field.required}
                      aria-invalid={hasFieldError}
                      aria-describedby={
                        hasFieldError ? `${field.id}-error` : undefined
                      }
                    />
                    {hasFieldError && (
                      <p
                        id={`${field.id}-error`}
                        className="text-sm text-destructive"
                        role="alert"
                      >
                        Please check this field and try again.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <Button
              type="submit"
              disabled={
                isLoading ||
                (hasError && lastErrorType === ERROR_TYPES.DUPLICATE_CLIENT)
              }
              className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              aria-describedby={hasError ? "form-error-message" : undefined}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Redirecting to Checkout...
                </>
              ) : hasError && lastErrorType === ERROR_TYPES.DUPLICATE_CLIENT ? (
                <>
                  <UserRoundCheck strokeWidth={2} className="w-5 h-5 mr-2" />
                  Please Use Different Email
                </>
              ) : (
                <>
                  <UserRoundCheck strokeWidth={2} className="w-5 h-5 mr-2" />
                  Join The Community
                </>
              )}
            </Button>

            {/* Error state message for screen readers */}
            {hasError && (
              <div
                id="form-error-message"
                className="sr-only"
                role="status"
                aria-live="polite"
              >
                {lastErrorType === ERROR_TYPES.DUPLICATE_CLIENT
                  ? "This email is already registered. Please use a different email address or sign in to your existing account."
                  : "There was an error with your submission. Please check the highlighted fields and try again."}
              </div>
            )}

            {/* Visual error message for duplicate client */}
            {hasError && lastErrorType === ERROR_TYPES.DUPLICATE_CLIENT && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-center">
                <p className="text-sm text-destructive font-medium">
                  This email is already registered
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Please use a different email address or{" "}
                  <button
                    type="button"
                    onClick={() => (window.location.href = "/sign-in")}
                    className="text-primary hover:underline font-medium"
                  >
                    sign in to your existing account
                  </button>
                </p>
              </div>
            )}
          </form>

          <div className="pt-4 space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Your information will be securely processed and pre-filled in
                checkout.
              </p>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                By joining, you agree to our{" "}
                <a
                  href="#"
                  className="text-primary hover:underline font-medium"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-primary hover:underline font-medium"
                >
                  Privacy Policy
                </a>
              </p>
            </div>

            {/* Security Features */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-6 text-sm">
                {securityIcons.map((feature, index) => (
                  <div
                    key={index + "si"}
                    className="flex items-center text-green-700"
                  >
                    <feature.icon className="w-4 h-4 mr-2" />
                    <span className="font-medium max-md:text-xs">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
