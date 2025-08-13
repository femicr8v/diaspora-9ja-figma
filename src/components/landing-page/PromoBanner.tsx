"use client";

import { X, Zap } from "lucide-react";

interface PromoBannerProps {
  showPromo: boolean;
  onClose: () => void;
}

export function PromoBanner({ showPromo, onClose }: PromoBannerProps) {
  if (!showPromo) return null;

  return (
    <div className="relative bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white py-3 px-6">
      <div className="container mx-auto max-w-7xl relative">
        <p className="flex items-center justify-center flex-col md:flex-row gap-1 md:gap-8 text-xs md:text-base">
          <span className="flex items-center justify-center gap-1 font-semibold">
            <Zap className="size-4 md:size-5 text-yellow-300" />
            Limited Time Offer: Get 20% Off Your First Month!
          </span>
          <span className="bg-white/20 px-1.5 md:px-3 py-0.5 md:py-1 rounded-full font-mono">
            Use code: GROW20
          </span>
        </p>

        <button
          onClick={onClose}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
        >
          <X className="size-5" />
        </button>
      </div>
    </div>
  );
}
