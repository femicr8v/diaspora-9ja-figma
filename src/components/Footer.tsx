"use client";

import Image from "next/image";
import { Globe, Users, Heart, Shield } from "lucide-react";
import { footerLinks, logoImage, logoText } from "@/lib/constants";

const topIcons = [Globe, Users, Heart];

const bottomIcons = [
  { label: "Secure", icon: Shield },
  { label: "Global", icon: Globe },
  { label: "Trusted", icon: Heart },
];

export function Footer() {
  return (
    <footer className="py-12 md:py-16 px-6 bg-primary text-white">
      <main className="container mx-auto max-w-7xl">
        <div className="grid md:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4 md:mb-6">
              <div className="w-10 md:w-12 h-10 md:h-12 flex items-center justify-center">
                <Image
                  src={logoImage}
                  width={40}
                  height={40}
                  alt="Diaspora 9ja Logo"
                  className="size-10 md:size-12 object-contain brightness-0 invert"
                />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white font-headers">
                {logoText}
              </h3>
            </div>
            <p className="text-gray-200 leading-relaxed mb-4 md:mb-6 text-base md:text-lg">
              Connecting the global Nigerian community through trusted
              information, meaningful relationships, and shared opportunities.
            </p>
            <div className="flex space-x-4">
              {topIcons.map((icon) => {
                const Icon = icon;

                return (
                  <span
                    key={icon + "ti"}
                    className="w-8 md:w-10 h-8 md:h-10 bg-white/10 rounded-lg flex items-center justify-center"
                  >
                    <Icon className="w-4 md:w-5 h-4 md:h-5 text-white" />
                  </span>
                );
              })}
            </div>
          </div>

          {footerLinks.map((item) => (
            <div key={item.title + "fl"}>
              <h4 className="mb-4 md:mb-6 text-white font-headers font-bold text-base">
                {item.title}
              </h4>

              <ul className="space-y-2 md:space-y-3">
                {item.links.map((link) => (
                  <li key={link.href + "l"}>
                    <a
                      href={link.href}
                      className="text-gray-200 hover:text-white transition-colors text-sm md:text-base"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-6 md:pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between md:items-center">
          <p className="text-gray-200 mb-4 md:mb-0 text-sm md:text-base">
            &copy; 2025 Diaspora 9ja. All rights reserved. Built with ❤️ for the
            global Nigerian community.
          </p>

          <div className="flex items-center space-x-4 text-xs md:text-sm text-gray-200">
            {bottomIcons.map((item) => {
              const Icon = item.icon;

              return (
                <span key={item.label + "bi"} className="flex items-center">
                  <Icon className="w-3 md:w-4 h-3 md:h-4 mr-1" />
                  {item.label}
                </span>
              );
            })}
          </div>
        </div>
      </main>
    </footer>
  );
}
