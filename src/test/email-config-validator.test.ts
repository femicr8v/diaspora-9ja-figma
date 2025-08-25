import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  EmailConfigValidator,
  validateEmailConfigurationSync,
} from "../lib/email-config-validator";

describe("EmailConfigValidator", () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    // Save original environment
    originalEnv = { ...process.env };

    // Set up test environment with valid configuration
    process.env.RESEND_API_KEY = "re_test_key_1234567890123456789";
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test_service_role_key";

    // Clear validator cache
    const validator = EmailConfigValidator.getInstance();
    validator.clearCache();
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe("validateConfigurationSync", () => {
    it("should pass validation with valid configuration", () => {
      const result = validateEmailConfigurationSync();

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should fail validation when RESEND_API_KEY is missing", () => {
      delete process.env.RESEND_API_KEY;

      const result = validateEmailConfigurationSync();

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        "Required environment variable RESEND_API_KEY is not set"
      );
    });

    it("should fail validation with invalid API key format", () => {
      process.env.RESEND_API_KEY = "invalid_format_key";

      const result = validateEmailConfigurationSync();

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        "RESEND_API_KEY appears to have invalid format (should start with 're_')"
      );
    });

    it("should fail validation with short API key", () => {
      process.env.RESEND_API_KEY = "re_short";

      const result = validateEmailConfigurationSync();

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("RESEND_API_KEY appears to be too short");
    });

    it("should fail validation when required environment variables are missing", () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;

      const result = validateEmailConfigurationSync();

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        "Required environment variable NEXT_PUBLIC_SUPABASE_URL is not set"
      );
      expect(result.errors).toContain(
        "Required environment variable SUPABASE_SERVICE_ROLE_KEY is not set"
      );
    });

    it("should show warnings for missing recommended environment variables", () => {
      const result = validateEmailConfigurationSync();

      expect(result.warnings).toContain(
        "Recommended environment variable STRIPE_SECRET_KEY is not set"
      );
      expect(result.warnings).toContain(
        "Recommended environment variable STRIPE_WEBHOOK_SECRET is not set"
      );
      expect(result.warnings).toContain(
        "Recommended environment variable NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set"
      );
    });
  });

  describe("singleton pattern", () => {
    it("should return the same instance", () => {
      const instance1 = EmailConfigValidator.getInstance();
      const instance2 = EmailConfigValidator.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe("cache management", () => {
    it("should clear cache correctly", () => {
      const validator = EmailConfigValidator.getInstance();

      // Validate to populate cache
      validator.validateConfigurationSync();

      // Clear cache
      validator.clearCache();

      // This should work without issues
      const result = validator.validateConfigurationSync();
      expect(result).toBeDefined();
    });
  });

  describe("logging", () => {
    it("should log validation results", () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const validator = EmailConfigValidator.getInstance();

      // Test successful validation logging
      const validResult = { valid: true, errors: [], warnings: [] };
      validator.logValidationResults(validResult);
      expect(consoleSpy).toHaveBeenCalledWith(
        "✅ Email configuration validation passed"
      );

      // Test failed validation logging
      const invalidResult = {
        valid: false,
        errors: ["Test error"],
        warnings: [],
      };
      validator.logValidationResults(invalidResult);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "❌ Email configuration validation failed:"
      );

      consoleSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });
});
