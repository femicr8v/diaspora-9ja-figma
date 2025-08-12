"use client";

import { useState } from "react";
import LandingPage from "./LandingPage";

export default function LandingPageWrapper() {
  const [currentPage, setCurrentPage] = useState<
    "landing" | "news" | "investment" | "business" | "blog"
  >("landing");

  const handleGetStarted = () => {
    // Handle get started logic
    console.log("Get started clicked");
    // You could redirect to a sign-up page, open a modal, etc.
  };

  const handleNavigate = (
    page: "news" | "investment" | "business" | "blog"
  ) => {
    setCurrentPage(page);
    console.log("Navigate to:", page);
    // Handle navigation logic
  };

  const handleSignIn = () => {
    console.log("Sign in clicked");
    // Handle sign in logic
  };

  return (
    <LandingPage
      onGetStarted={handleGetStarted}
      onNavigate={handleNavigate}
      onSignIn={handleSignIn}
    />
  );
}
