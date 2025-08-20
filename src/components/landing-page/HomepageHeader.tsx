"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { logoImage, logoText, navigationLinks } from "@/lib/constants";

export function HomepageHeader() {
  return (
    <header className="border-b-2 border-border/40 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
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

        {/* Navigation */}
        <nav className="flex items-center space-x-8">
          {navigationLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hidden lg:flex text-base text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              {link.label}
            </a>
          ))}

          <Link
            href="/join-the-community"
            className={cn(
              buttonVariants({ variant: "default", size: "default" }),
              `bg-primary hover:bg-primary/90 text-primary-foreground text-base font-semibold animate-pulse-glow flex`
            )}
          >
            Join Now
          </Link>
        </nav>
      </div>
    </header>
  );
}
