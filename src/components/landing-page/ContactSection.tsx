"use client";

import { useState } from "react";
import { Send, Clock } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Card, CardContent } from "../ui/card";
import { contactMethods } from "@/lib/constants";

export function ContactSection() {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
    company: "",
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
      company: "",
      phone: "",
    });
  };

  const handleContactInputChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setContactForm({ ...contactForm, [field]: e.target.value });
    };

  return (
    <section id="contact" className="py-12 md:py-16 px-6 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8 md:mb-12">
          <Badge
            variant="secondary"
            className="mb-3 md:mb-4 bg-primary/10 text-primary border-primary/20 text-sm font-semibold"
          >
            Get in Touch
          </Badge>
          <h2 className="text-2xl md:text-3xl lg:text-4xl mb-3 md:mb-4 text-foreground font-headers font-bold">
            We'd Love to Hear From You
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you have questions, feedback, or want to explore partnership
            opportunities
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Compact Contact Methods */}
          <div className="space-y-4">
            <h3 className="text-lg md:text-xl mb-4 text-foreground font-headers font-bold">
              Contact Information
            </h3>
            <div className="space-y-3">
              {contactMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <Card
                    key={index}
                    className="border-border/40 hover:border-primary/30 transition-all duration-300 group"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-foreground font-headers">
                            {method.title}
                          </h4>
                          <p className="text-sm text-primary font-medium">
                            {method.value}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {method.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Ultra Compact Business Hours */}
            <Card className="border-border/40 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="p-4">
                <h4 className="text-sm font-semibold text-foreground font-headers mb-3 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Business Hours
                </h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mon - Fri</span>
                    <span className="font-medium">9 AM - 6 PM GMT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saturday</span>
                    <span className="font-medium">10 AM - 4 PM GMT</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ultra Compact Contact Form */}
          <div>
            <Card className="border-border/40 shadow-lg bg-gradient-to-br from-background to-secondary/20">
              <CardContent className="p-6">
                <h3 className="text-lg md:text-xl mb-4 text-foreground font-headers font-bold">
                  Send Us a Message
                </h3>

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="name" className="text-sm font-semibold">
                        Name *
                      </Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={contactForm.name}
                        onChange={handleContactInputChange("name")}
                        className="h-10 text-sm"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="email" className="text-sm font-semibold">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={contactForm.email}
                        onChange={handleContactInputChange("email")}
                        className="h-10 text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="phone" className="text-sm font-semibold">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        placeholder="+44 20 1234 5678"
                        value={contactForm.phone}
                        onChange={handleContactInputChange("phone")}
                        className="h-10 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label
                        htmlFor="company"
                        className="text-sm font-semibold"
                      >
                        Company
                      </Label>
                      <Input
                        id="company"
                        placeholder="Your company"
                        value={contactForm.company}
                        onChange={handleContactInputChange("company")}
                        className="h-10 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="message" className="text-sm font-semibold">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us more about your inquiry..."
                      rows={3}
                      value={contactForm.message}
                      onChange={handleContactInputChange("message")}
                      className="text-sm"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold py-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
