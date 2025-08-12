"use client";

import { Globe, Users, Heart, Shield } from "lucide-react";
import { logoImage } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="py-12 md:py-16 px-6 bg-gradient-to-br from-primary to-primary/80 text-white">
      <div className="container mx-auto max-w-7xl">
        <div className="grid md:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4 md:mb-6">
              <div className="w-10 md:w-12 h-10 md:h-12 flex items-center justify-center">
                <img
                  src={logoImage}
                  alt="Diaspora 9ja Logo"
                  className="w-10 md:w-12 h-10 md:h-12 object-contain brightness-0 invert"
                />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white font-headers">
                Diaspora 9ja
              </h3>
            </div>
            <p className="text-gray-200 leading-relaxed mb-4 md:mb-6 text-base md:text-lg">
              Connecting the global Nigerian community through trusted
              information, meaningful relationships, and shared opportunities.
            </p>
            <div className="flex space-x-4">
              <div className="w-8 md:w-10 h-8 md:h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <Globe className="w-4 md:w-5 h-4 md:h-5 text-white" />
              </div>
              <div className="w-8 md:w-10 h-8 md:h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <Users className="w-4 md:w-5 h-4 md:h-5 text-white" />
              </div>
              <div className="w-8 md:w-10 h-8 md:h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <Heart className="w-4 md:w-5 h-4 md:h-5 text-white" />
              </div>
            </div>
          </div>
          <div>
            <h4 className="mb-4 md:mb-6 text-white font-headers font-bold text-base">
              Quick Links
            </h4>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <a
                  href="#about"
                  className="text-gray-200 hover:text-white transition-colors text-sm md:text-base"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#platform"
                  className="text-gray-200 hover:text-white transition-colors text-sm md:text-base"
                >
                  Platform
                </a>
              </li>
              <li>
                <a
                  href="#community"
                  className="text-gray-200 hover:text-white transition-colors text-sm md:text-base"
                >
                  Community
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  className="text-gray-200 hover:text-white transition-colors text-sm md:text-base"
                >
                  Testimonials
                </a>
              </li>
              <li>
                <a
                  href="#faqs"
                  className="text-gray-200 hover:text-white transition-colors text-sm md:text-base"
                >
                  FAQs
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 md:mb-6 text-white font-headers font-bold text-base">
              Legal & Support
            </h4>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <a
                  href="#privacy"
                  className="text-gray-200 hover:text-white transition-colors text-sm md:text-base"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#terms"
                  className="text-gray-200 hover:text-white transition-colors text-sm md:text-base"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-gray-200 hover:text-white transition-colors text-sm md:text-base"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#help"
                  className="text-gray-200 hover:text-white transition-colors text-sm md:text-base"
                >
                  Help Center
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-6 md:pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-200 mb-4 md:mb-0 text-sm md:text-base">
            &copy; 2024 Diaspora 9ja. All rights reserved. Built with ❤️ for the
            global Nigerian community.
          </p>
          <div className="flex items-center space-x-4 text-xs md:text-sm text-gray-200">
            <span className="flex items-center">
              <Shield className="w-3 md:w-4 h-3 md:h-4 mr-1" />
              Secure
            </span>
            <span className="flex items-center">
              <Globe className="w-3 md:w-4 h-3 md:h-4 mr-1" />
              Global
            </span>
            <span className="flex items-center">
              <Heart className="w-3 md:w-4 h-3 md:h-4 mr-1" />
              Trusted
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
