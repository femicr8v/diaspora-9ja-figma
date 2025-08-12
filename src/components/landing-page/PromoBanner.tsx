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
      <div className="container mx-auto max-w-7xl flex items-center justify-center text-center relative">
        <div className="flex items-center space-x-4">
          <Zap className="w-5 h-5 text-yellow-300" />
          <span className="text-sm md:text-base font-semibold">
            Limited Time Offer: Get 20% Off Your First Month!
          </span>

          <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-mono">
            Use code: GROW20
          </span>
        </div>

        <button
          onClick={onClose}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
