"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "../ui/button";
import { logoImage, logoText } from "@/lib/constants";

export function JoinNowHeader() {
  return (
    <header className="border-b-2 border-border/40 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="max-md:pl-10">
          <div className="w-10 h-10 flex items-center justify-center gap-1.5 md:gap-3">
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

        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost", size: "default" }),
            `flex text-muted-foreground hover:bg-accent hover:text-white active:bg-accent active:text-white text-base font-medium`
          )}
        >
          <ArrowLeft className="size-4" />
          <span>Go Back</span>
        </Link>
      </div>
    </header>
  );
}
