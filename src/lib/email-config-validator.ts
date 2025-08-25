import { Resend } from "resend";
import { adminEmail, emailConfig } from "./constants";

// Configuration validation result interface
export interface ConfigValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// Email address validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Email configuration validator class
export class EmailConfigValidator {
  private static instance: EmailConfigValidator;
  private validationCache: ConfigValidationResult | null = null;
  private lastValidationTime: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  public static getInstance(): EmailConfigValidator {
    if (!EmailConfigValidator.instance) {
      EmailConfigValidator.instance = new EmailConfigValidator();
    }
    return EmailConfigValidator.instance;
  }

  /**
   * Validates email address format
   */
  private validateEmailAddress(email: string, fieldName: string): string[] {
    const errors: string[] = [];

    if (!email) {
      errors.push(`${fieldName} is not configured`);
      return errors;
    }

    if (!EMAIL_REGEX.test(email)) {
      errors.push(`${fieldName} has invalid format: ${email}`);
    }

    return errors;
  }

  /**
   * Validates Resend API key format and basic structure
   */
  private validateResendApiKey(apiKey: string): string[] {
    const errors: string[] = [];

    if (!apiKey) {
      errors.push("RESEND_API_KEY environment variable is not set");
      return errors;
    }

    // Resend API keys should start with 're_'
    if (!apiKey.startsWith("re_")) {
      errors.push(
        "RESEND_API_KEY appears to have invalid format (should start with 're_')"
      );
    }

    // Basic length check (Resend keys are typically longer than 20 characters)
    if (apiKey.length < 20) {
      errors.push("RESEND_API_KEY appears to be too short");
    }

    return errors;
  }

  /**
   * Tests Resend API key by attempting to create a client and validate
   */
  private async testResendApiKey(apiKey: string): Promise<string[]> {
    const errors: string[] = [];

    try {
      const resend = new Resend(apiKey);

      // Try to get domains to test API key validity
      // This is a lightweight operation that will fail if the API key is invalid
      await resend.domains.list();
    } catch (error: any) {
      const errorMessage = error.message?.toLowerCase() || "";

      if (
        errorMessage.includes("unauthorized") ||
        errorMessage.includes("invalid api key")
      ) {
        errors.push("RESEND_API_KEY is invalid or unauthorized");
      } else if (
        errorMessage.includes("network") ||
        errorMessage.includes("timeout")
      ) {
        errors.push("Unable to validate RESEND_API_KEY due to network issues");
      } else {
        errors.push(`RESEND_API_KEY validation failed: ${error.message}`);
      }
    }

    return errors;
  }

  /**
   * Validates all required environment variables
   */
  private validateEnvironmentVariables(): {
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required environment variables
    const requiredEnvVars = [
      "RESEND_API_KEY",
      "NEXT_PUBLIC_SUPABASE_URL",
      "SUPABASE_SERVICE_ROLE_KEY",
    ];

    // Optional but recommended environment variables
    const recommendedEnvVars = [
      "STRIPE_SECRET_KEY",
      "STRIPE_WEBHOOK_SECRET",
      "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    ];

    // Check required variables
    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        errors.push(`Required environment variable ${envVar} is not set`);
      }
    }

    // Check recommended variables
    for (const envVar of recommendedEnvVars) {
      if (!process.env[envVar]) {
        warnings.push(`Recommended environment variable ${envVar} is not set`);
      }
    }

    return { errors, warnings };
  }

  /**
   * Validates email configuration in constants
   */
  private validateEmailConstants(): { errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate admin email
    errors.push(...this.validateEmailAddress(adminEmail, "Admin email"));

    // Validate email config
    if (!emailConfig) {
      errors.push("Email configuration object is not defined");
      return { errors, warnings };
    }

    errors.push(
      ...this.validateEmailAddress(emailConfig.fromEmail, "From email")
    );

    if (!emailConfig.fromName) {
      errors.push("From name is not configured in email config");
    } else if (emailConfig.fromName.length < 2) {
      warnings.push(
        "From name is very short, consider using a more descriptive name"
      );
    }

    // Check if using Resend's default domain
    if (emailConfig.fromEmail === "onboarding@resend.dev") {
      warnings.push(
        "Using Resend's default domain. Consider setting up a custom domain for production"
      );
    }

    return { errors, warnings };
  }

  /**
   * Performs comprehensive configuration validation
   */
  public async validateConfiguration(
    forceRefresh: boolean = false
  ): Promise<ConfigValidationResult> {
    const now = Date.now();

    // Return cached result if still valid and not forcing refresh
    if (
      !forceRefresh &&
      this.validationCache &&
      now - this.lastValidationTime < this.CACHE_DURATION
    ) {
      return this.validationCache;
    }

    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Validate environment variables
      const envValidation = this.validateEnvironmentVariables();
      errors.push(...envValidation.errors);
      warnings.push(...envValidation.warnings);

      // Validate email constants
      const constantsValidation = this.validateEmailConstants();
      errors.push(...constantsValidation.errors);
      warnings.push(...constantsValidation.warnings);

      // Validate Resend API key format
      const apiKey = process.env.RESEND_API_KEY;
      if (apiKey) {
        errors.push(...this.validateResendApiKey(apiKey));

        // Test API key if format is valid
        if (errors.length === 0) {
          const apiKeyTestErrors = await this.testResendApiKey(apiKey);
          errors.push(...apiKeyTestErrors);
        }
      }
    } catch (error: any) {
      errors.push(`Configuration validation failed: ${error.message}`);
    }

    const result: ConfigValidationResult = {
      valid: errors.length === 0,
      errors,
      warnings,
    };

    // Cache the result
    this.validationCache = result;
    this.lastValidationTime = now;

    return result;
  }

  /**
   * Validates configuration synchronously (without API key testing)
   */
  public validateConfigurationSync(): ConfigValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Validate environment variables
      const envValidation = this.validateEnvironmentVariables();
      errors.push(...envValidation.errors);
      warnings.push(...envValidation.warnings);

      // Validate email constants
      const constantsValidation = this.validateEmailConstants();
      errors.push(...constantsValidation.errors);
      warnings.push(...constantsValidation.warnings);

      // Validate Resend API key format (without testing)
      const apiKey = process.env.RESEND_API_KEY;
      if (apiKey) {
        errors.push(...this.validateResendApiKey(apiKey));
      }
    } catch (error: any) {
      errors.push(`Configuration validation failed: ${error.message}`);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Clears validation cache
   */
  public clearCache(): void {
    this.validationCache = null;
    this.lastValidationTime = 0;
  }

  /**
   * Logs validation results
   */
  public logValidationResults(result: ConfigValidationResult): void {
    if (result.valid) {
      console.log("✅ Email configuration validation passed");
      if (result.warnings.length > 0) {
        console.warn("⚠️  Configuration warnings:");
        result.warnings.forEach((warning) => console.warn(`  - ${warning}`));
      }
    } else {
      console.error("❌ Email configuration validation failed:");
      result.errors.forEach((error) => console.error(`  - ${error}`));

      if (result.warnings.length > 0) {
        console.warn("⚠️  Additional warnings:");
        result.warnings.forEach((warning) => console.warn(`  - ${warning}`));
      }
    }
  }
}

// Export singleton instance
export const emailConfigValidator = EmailConfigValidator.getInstance();

// Convenience function for quick validation
export async function validateEmailConfiguration(
  forceRefresh: boolean = false
): Promise<ConfigValidationResult> {
  return emailConfigValidator.validateConfiguration(forceRefresh);
}

// Convenience function for synchronous validation
export function validateEmailConfigurationSync(): ConfigValidationResult {
  return emailConfigValidator.validateConfigurationSync();
}
