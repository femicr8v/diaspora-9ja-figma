"use client";

import {
  contactHours,
  contactMethods,
  contactFormControls,
} from "@/lib/constants";

import { useState } from "react";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Send, Clock } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import type { ContactFormData } from "@/lib/type";

export function ContactSection() {
  const [contactForm, setContactForm] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
    location: "",
    phone: "",
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", contactForm);
    alert("Thank you for your message! We'll get back to you within 24 hours.");
    setContactForm({
      name: "",
      email: "",
      message: "",
      location: "",
      phone: "",
    });
  };

  const handleContactInputChange =
    (field: keyof ContactFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setContactForm({ ...contactForm, [field]: e.target.value });
    };

  return (
    <section
      id="contact"
      className="py-16 md:py-24 px-6 bg-gradient-to-br from-background via-secondary/30 to-accent/5"
    >
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <Badge
            variant="secondary"
            className="mb-4 md:mb-6 bg-primary/10 text-primary border-primary/20 text-sm font-semibold"
          >
            Get in Touch
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-6 text-foreground font-headers font-bold">
            We'd Love to Hear From You
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Whether you have questions, feedback, or want to explore partnership
            opportunities
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* Contact Information Side */}
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold text-foreground font-headers mb-4">
                Contact Information
              </h3>
              <p className="text-muted-foreground mb-8">
                Get in touch with our team for support, partnerships, or general
                inquiries
              </p>
            </div>

            <div className="space-y-4">
              {contactMethods.map((method, index) => {
                const Icon = method.icon;

                return (
                  <Card
                    key={index}
                    className="border-border/40 hover:border-primary/30 transition-all duration-300 group bg-background/80 backdrop-blur-sm"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="size-8 md:size-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-base font-semibold text-foreground font-headers">
                            {method.title}
                          </h4>
                          <a
                            href={method.action}
                            className="text-base text-primary font-medium"
                          >
                            {method.value}
                          </a>
                          <p className="text-sm text-muted-foreground">
                            {method.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Business Hours */}
            <Card className="border-border/40 bg-gradient-to-br from-background to-accent/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <h4 className="text-base font-semibold text-foreground font-headers mb-4 flex items-center">
                  <Clock className="size-6 mr-3 text-primary" />
                  Business Hours
                </h4>

                <div className="space-y-1 text-base">
                  {contactHours.map((hour, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-muted-foreground">{hour.day}</span>
                      <span className="font-medium opacity-80">
                        {hour.time}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form - Styled exactly like Join Community Form */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <Card className="border-border/40 shadow-2xl bg-background overflow-hidden">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-foreground font-headers mb-2">
                    Send Us a Message
                  </h2>
                  <p className="text-muted-foreground">
                    Fill in your details to get in touch with our team
                  </p>
                </div>

                <form
                  onSubmit={handleContactSubmit}
                  className="flex flex-col gap-4"
                >
                  {/* First row: Name and Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contactFormControls
                      .filter((control) =>
                        ["name", "email"].includes(control.name)
                      )
                      .map((control) => (
                        <div key={control.name} className="space-y-2">
                          <Label
                            htmlFor={control.name}
                            className="text-sm font-semibold"
                          >
                            {control.label}{" "}
                            {control.required && (
                              <span className="text-destructive">*</span>
                            )}
                          </Label>
                          <Input
                            id={control.name}
                            type={control.type}
                            placeholder={control.placeholder}
                            value={contactForm[control.name]}
                            onChange={handleContactInputChange(control.name)}
                            className="h-12 bg-muted/50 border border-border focus:border-primary focus:bg-background"
                            required={control.required}
                          />
                        </div>
                      ))}
                  </div>

                  {/* Second row: Phone and Company */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contactFormControls
                      .filter((control) =>
                        ["phone", "location"].includes(control.name)
                      )
                      .map((control) => (
                        <div key={control.name} className="space-y-2">
                          <Label
                            htmlFor={control.name}
                            className="text-sm font-semibold"
                          >
                            {control.label}{" "}
                            {control.required && (
                              <span className="text-destructive">*</span>
                            )}
                          </Label>
                          <Input
                            id={control.name}
                            type={control.type}
                            placeholder={control.placeholder}
                            value={contactForm[control.name]}
                            onChange={handleContactInputChange(control.name)}
                            className="h-12 bg-muted/50 border border-border focus:border-primary focus:bg-background"
                            required={control.required}
                          />
                        </div>
                      ))}
                  </div>

                  {/* Message field */}
                  {contactFormControls
                    .filter((control) => control.name === "message")
                    .map((control) => (
                      <div key={control.name} className="space-y-2">
                        <Label
                          htmlFor={control.name}
                          className="text-sm font-semibold"
                        >
                          {control.label}{" "}
                          {control.required && (
                            <span className="text-destructive">*</span>
                          )}
                        </Label>
                        <Textarea
                          id={control.name}
                          placeholder={control.placeholder}
                          rows={control.rows || 4}
                          value={contactForm[control.name]}
                          onChange={handleContactInputChange(control.name)}
                          className="bg-muted/50 border border-border focus:border-primary focus:bg-background resize-none"
                          required={control.required}
                        />
                      </div>
                    ))}

                  <Button
                    type="submit"
                    className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </Button>
                </form>

                <div className="pt-4 space-y-3">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      We'll get back to you within 24 hours during business
                      days.
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      By contacting us, you agree to our{" "}
                      <a
                        href="#"
                        className="text-primary hover:underline font-medium"
                      >
                        Privacy Policy
                      </a>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
