import { describe, it, expect, vi } from "vitest";
import {
  normalizeEmail,
  isValidEmailFormat,
  compareEmails,
} from "../email-validation";

// Mock Supabase module
vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        ilike: vi.fn(() => ({
          eq: vi.fn(() => ({
            limit: vi.fn(() => ({
              single: vi.fn(),
            })),
          })),
          limit: vi.fn(() => ({
            single: vi.fn(),
          })),
        })),
      })),
    })),
  })),
}));

describe("Email Validation Service", () => {
  describe("normalizeEmail", () => {
    it("should convert email to lowercase", () => {
      expect(normalizeEmail("TEST@EXAMPLE.COM")).toBe("test@example.com");
    });

    it("should trim whitespace", () => {
      expect(normalizeEmail("  test@example.com  ")).toBe("test@example.com");
    });

    it("should handle mixed case and whitespace", () => {
      expect(normalizeEmail("  TeSt@ExAmPlE.CoM  ")).toBe("test@example.com");
    });

    it("should handle empty string", () => {
      expect(normalizeEmail("")).toBe("");
    });
  });

  describe("isValidEmailFormat", () => {
    it("should return true for valid email formats", () => {
      const validEmails = [
        "test@example.com",
        "user.name@domain.co.uk",
        "user+tag@example.org",
        "user123@test-domain.com",
        "a@b.co",
      ];

      validEmails.forEach((email) => {
        expect(isValidEmailFormat(email)).toBe(true);
      });
    });

    it("should return false for invalid email formats", () => {
      const invalidEmails = [
        "invalid-email",
        "@example.com",
        "test@",
        "test.example.com",
        "test@.com",
        "test@com",
        "",
        "test @example.com",
        "test@example .com",
      ];

      invalidEmails.forEach((email) => {
        expect(isValidEmailFormat(email)).toBe(false);
      });
    });
  });

  describe("compareEmails", () => {
    it("should return true for identical emails", () => {
      expect(compareEmails("test@example.com", "test@example.com")).toBe(true);
    });

    it("should return true for emails with different cases", () => {
      expect(compareEmails("TEST@EXAMPLE.COM", "test@example.com")).toBe(true);
      expect(compareEmails("Test@Example.Com", "test@example.com")).toBe(true);
    });

    it("should return true for emails with whitespace", () => {
      expect(compareEmails("  test@example.com  ", "test@example.com")).toBe(
        true
      );
    });

    it("should return false for different emails", () => {
      expect(compareEmails("test1@example.com", "test2@example.com")).toBe(
        false
      );
      expect(compareEmails("test@example1.com", "test@example2.com")).toBe(
        false
      );
    });
  });
});
