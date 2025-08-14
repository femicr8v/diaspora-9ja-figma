"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "../ui/button";
import { logoImage, logoText } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function JoinNowHeader() {
  return (
    <header className="border-b-2 border-border/40 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/" className="w-10 h-10 flex items-center justify-center">
            <Image
              src={logoImage}
              width={40}
              height={40}
              alt="Diaspora 9ja Logo"
              className="size-10 object-contain"
            />
          </Link>
          <h1 className="text-xl font-bold text-primary font-headers">
            {logoText}
          </h1>
        </div>

        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost", size: "default" }),
            `hover:bg-accent text-muted-foreground hover:text-white text-base font-medium flex`
          )}
        >
          <ArrowLeft className="size-4" />
          <span>Go Back</span>
        </Link>
      </div>
    </header>
  );
}
