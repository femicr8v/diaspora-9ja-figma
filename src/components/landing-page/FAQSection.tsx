"use client";

import { ArrowRight } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../ui/accordion";
import { faqs } from "@/lib/constants";

export function FAQSection() {
  return (
    <section id="faqs" className="py-16 md:py-24 px-6 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 md:mb-20">
          <Badge
            variant="secondary"
            className="mb-4 md:mb-6 bg-primary/10 text-primary border-primary/20 text-sm font-semibold"
          >
            Got Questions?
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-6 text-foreground font-headers font-bold">
            Everything You Need to Know
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Find answers to the most common questions about joining and using
            Diaspora 9ja
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion
            type="single"
            collapsible
            className="space-y-4 md:space-y-6"
          >
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border/40 rounded-xl px-4 md:px-8 bg-background/50 hover:bg-background/80 transition-colors"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6 md:py-8 text-base md:text-lg">
                  <span className="font-headers font-bold pr-4">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 md:pb-8 text-sm md:text-base leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 md:mt-16 text-center">
            <p className="text-base text-muted-foreground mb-4 md:mb-6">
              Still have questions?
            </p>
            <Button
              variant="outline"
              className="border-primary/20 text-primary hover:bg-primary/5 text-base"
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Contact Our Team
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
