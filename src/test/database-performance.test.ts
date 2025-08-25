import { describe, it, expect } from "vitest";
import {
  normalizeEmail,
  compareEmails,
  isValidEmailFormat,
} from "../lib/email-validation";

// Test email validation logic that will work with case-insensitive indexes
describe("Email Validation Logic Tests", () => {
  describe("Email Normalization", () => {
    it("should normalize emails to lowercase", () => {
      expect(normalizeEmail("TEST@EXAMPLE.COM")).toBe("test@example.com");
      expect(normalizeEmail("Test@Example.Com")).toBe("test@example.com");
      expect(normalizeEmail("test@example.com")).toBe("test@example.com");
    });

    it("should trim whitespace from emails", () => {
      expect(normalizeEmail("  test@example.com  ")).toBe("test@example.com");
      expect(normalizeEmail("\ttest@example.com\n")).toBe("test@example.com");
    });

    it("should handle empty and invalid inputs", () => {
      expect(normalizeEmail("")).toBe("");
      expect(normalizeEmail("   ")).toBe("");
    });
  });

  describe("Email Format Validation", () => {
    it("should validate correct email formats", () => {
      expect(isValidEmailFormat("test@example.com")).toBe(true);
      expect(isValidEmailFormat("user.name@domain.co.uk")).toBe(true);
      expect(isValidEmailFormat("test+tag@example.org")).toBe(true);
    });

    it("should reject invalid email formats", () => {
      expect(isValidEmailFormat("invalid-email")).toBe(false);
      expect(isValidEmailFormat("@example.com")).toBe(false);
      expect(isValidEmailFormat("test@")).toBe(false);
      expect(isValidEmailFormat("test@.com")).toBe(false);
      expect(isValidEmailFormat("")).toBe(false);
    });
  });

  describe("Email Comparison", () => {
    it("should compare emails case-insensitively", () => {
      expect(compareEmails("test@example.com", "TEST@EXAMPLE.COM")).toBe(true);
      expect(compareEmails("Test@Example.Com", "test@example.com")).toBe(true);
      expect(compareEmails("user@domain.com", "user@domain.com")).toBe(true);
    });

    it("should handle whitespace in email comparison", () => {
      expect(compareEmails("  test@example.com  ", "test@example.com")).toBe(
        true
      );
      expect(compareEmails("test@example.com", "  TEST@EXAMPLE.COM  ")).toBe(
        true
      );
    });

    it("should return false for different emails", () => {
      expect(compareEmails("test1@example.com", "test2@example.com")).toBe(
        false
      );
      expect(compareEmails("test@example.com", "test@different.com")).toBe(
        false
      );
    });
  });

  describe("Query Optimization Logic", () => {
    it("should prepare emails for index-optimized queries", () => {
      // Test that our normalization prepares emails for efficient database queries
      const testCases = [
        { input: "USER@EXAMPLE.COM", expected: "user@example.com" },
        { input: "User.Name@Domain.Co.UK", expected: "user.name@domain.co.uk" },
        { input: "  Test+Tag@Example.Org  ", expected: "test+tag@example.org" },
      ];

      testCases.forEach(({ input, expected }) => {
        const normalized = normalizeEmail(input);
        expect(normalized).toBe(expected);
        // Verify the normalized email is ready for case-insensitive index lookup
        expect(normalized).toBe(normalized.toLowerCase());
        expect(normalized.trim()).toBe(normalized);
      });
    });

    it("should ensure consistent email processing for database queries", () => {
      const emails = [
        "test@example.com",
        "TEST@EXAMPLE.COM",
        "Test@Example.Com",
        "  test@EXAMPLE.com  ",
      ];

      // All variations should normalize to the same value for consistent database queries
      const normalized = emails.map(normalizeEmail);
      const unique = [...new Set(normalized)];

      expect(unique).toHaveLength(1);
      expect(unique[0]).toBe("test@example.com");
    });
  });
});
