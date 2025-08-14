"use client";

import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { ArrowLeft, Loader2, Shield, Star, CheckCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { countries } from "@/lib/countries";

interface FormData {
  fullName: string;
  email: string;
  countryCode: string;
  phone: string;
}

export function JoinNowFormSection() {
  const form = useForm<FormData>({
    defaultValues: {
      fullName: "",
      email: "",
      countryCode: "+44-GB",
      phone: "",
    },
    mode: "onChange",
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    control,
    reset,
  } = form;

  const onSubmit = async (data: FormData) => {
    try {
      // Simulate form processing
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const countryCode = data.countryCode.split("-")[0];
      console.log("Form submitted:", {
        ...data,
        countryCode,
        phone: `${countryCode} ${data.phone}`,
      });

      // Reset form after successful submission
      reset();

      // onShowPayment({
      //   fullName: data.fullName,
      //   email: data.email,
      //   phone: `${data.countryCode} ${data.phone}`
      // });
    } catch (error) {
      console.error("Form submission error:", error);
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

          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={control}
                name="fullName"
                rules={{
                  required: "Full name is required",
                  minLength: {
                    value: 2,
                    message: "Full name must be at least 2 characters",
                  },
                }}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Full Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your full name"
                        className={`h-12 bg-muted/50 border transition-all duration-200 ${
                          fieldState.error
                            ? "border-destructive focus:border-destructive bg-destructive/5"
                            : "border-border focus:border-primary focus:bg-background"
                        }`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="flex items-center">
                      {fieldState.error && (
                        <span className="w-1 h-1 bg-destructive rounded-full mr-2" />
                      )}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="email"
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                  },
                }}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">
                      Email Address *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        className={`h-12 bg-muted/50 border transition-all duration-200 ${
                          fieldState.error
                            ? "border-destructive focus:border-destructive bg-destructive/5"
                            : "border-border focus:border-primary focus:bg-background"
                        }`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="flex items-center">
                      {fieldState.error && (
                        <span className="w-1 h-1 bg-destructive rounded-full mr-2" />
                      )}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel className="font-semibold">Phone Number *</FormLabel>
                <div className="flex gap-3">
                  <FormField
                    control={control}
                    name="countryCode"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger
                              className={`w-32 h-12 bg-muted/50 border transition-all duration-200 ${
                                fieldState.error
                                  ? "border-destructive focus:border-destructive bg-destructive/5"
                                  : "border-border focus:border-primary focus:bg-background"
                              }`}
                            >
                              <SelectValue>
                                <div className="flex items-center space-x-2">
                                  <span className="text-lg">
                                    {countries.find(
                                      (c) =>
                                        `${c.code}-${c.country}` === field.value
                                    )?.flag || "🌍"}
                                  </span>
                                  <span className="text-sm font-medium">
                                    {countries.find(
                                      (c) =>
                                        `${c.code}-${c.country}` === field.value
                                    )?.code || field.value}
                                  </span>
                                </div>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {countries.map((country, index) => (
                                <SelectItem
                                  key={`${country.country}-${index}`}
                                  value={`${country.code}-${country.country}`}
                                >
                                  <div className="flex items-center space-x-3 py-1">
                                    <span className="text-lg">
                                      {country.flag}
                                    </span>
                                    <div className="flex flex-col">
                                      <span className="font-medium">
                                        {country.code}
                                      </span>
                                      <span className="text-xs text-muted-foreground">
                                        {country.name}
                                      </span>
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="phone"
                    rules={{
                      required: "Phone number is required",
                      pattern: {
                        value: /^[\d\s\-\(\)\+]{7,}$/,
                        message:
                          "Please enter a valid phone number (minimum 7 digits)",
                      },
                      minLength: {
                        value: 7,
                        message: "Phone number must be at least 7 characters",
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="20 1234 5678"
                            className={`h-12 bg-muted/50 border transition-all duration-200 ${
                              fieldState.error
                                ? "border-destructive focus:border-destructive bg-destructive/5"
                                : "border-border focus:border-primary focus:bg-background"
                            }`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="flex items-center">
                          {fieldState.error && (
                            <span className="w-1 h-1 bg-destructive rounded-full mr-2" />
                          )}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Join Our Community
                    <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
                  </>
                )}
              </Button>
              <div className="pt-4 space-y-4">
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
                    <div className="flex items-center text-green-700">
                      <Shield className="w-4 h-4 mr-2" />
                      <span className="font-medium">SSL Secure</span>
                    </div>
                    <div className="flex items-center text-green-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span className="font-medium">No Spam</span>
                    </div>
                    <div className="flex items-center text-green-700">
                      <Star className="w-4 h-4 mr-2" />
                      <span className="font-medium">Trusted</span>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
