"use client";

import { useEffect } from "react";
import { emailConfigValidator } from "@/lib/email-config-validator";

/**
 * Client-side configuration validator component
 * This component runs configuration validation on the client side
 * and logs results to the browser console
 */
export default function ConfigValidator() {
  useEffect(() => {
    // Run synchronous validation on client side
    const result = emailConfigValidator.validateConfigurationSync();
    emailConfigValidator.logValidationResults(result);

    // If there are critical errors, show a warning in development
    if (!result.valid && process.env.NODE_ENV === "development") {
      console.warn(
        "🚨 Email configuration issues detected. Check the logs above for details."
      );
    }
  }, []);

  // This component doesn't render anything
  return null;
}
