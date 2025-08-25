import { validateApplicationStartupSync } from "@/lib/startup-validator";
import ConfigValidator from "@/components/ConfigValidator";
import { Space_Grotesk, Roboto } from "next/font/google";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

// Run server-side configuration validation on startup
validateApplicationStartupSync();

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Diaspo9ja",
  description: "Connecting Nigerians Globally",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${roboto.className} antialiased`}
      >
        <ConfigValidator />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
