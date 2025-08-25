import { emailConfigValidator } from "./email-config-validator";

/**
 * Server-side startup validation
 * This runs during server startup and validates configuration
 */
export async function validateApplicationStartup(): Promise<void> {
  console.log("🚀 Starting application configuration validation...");

  try {
    // Validate email configuration
    const emailValidation = await emailConfigValidator.validateConfiguration();
    emailConfigValidator.logValidationResults(emailValidation);

    if (!emailValidation.valid) {
      console.error(
        "❌ Application startup validation failed due to email configuration issues"
      );

      // In production, you might want to prevent startup
      if (process.env.NODE_ENV === "production") {
        console.error(
          "🚨 Critical configuration errors detected in production. Please fix before proceeding."
        );
        // Uncomment the next line if you want to prevent startup on configuration errors
        // process.exit(1);
      }
    } else {
      console.log("✅ Application startup validation completed successfully");
    }
  } catch (error) {
    console.error("❌ Application startup validation failed:", error);

    if (process.env.NODE_ENV === "production") {
      console.error("🚨 Critical startup error in production");
      // Uncomment the next line if you want to prevent startup on validation errors
      // process.exit(1);
    }
  }
}

/**
 * Synchronous startup validation for environments where async is not available
 */
export function validateApplicationStartupSync(): void {
  console.log(
    "🚀 Starting synchronous application configuration validation..."
  );

  try {
    // Validate email configuration synchronously
    const emailValidation = emailConfigValidator.validateConfigurationSync();
    emailConfigValidator.logValidationResults(emailValidation);

    if (!emailValidation.valid) {
      console.error(
        "❌ Application startup validation failed due to email configuration issues"
      );

      if (process.env.NODE_ENV === "production") {
        console.error(
          "🚨 Critical configuration errors detected in production. Please fix before proceeding."
        );
      }
    } else {
      console.log("✅ Application startup validation completed successfully");
    }
  } catch (error) {
    console.error("❌ Application startup validation failed:", error);

    if (process.env.NODE_ENV === "production") {
      console.error("🚨 Critical startup error in production");
    }
  }
}
