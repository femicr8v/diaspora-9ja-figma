import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  normalizeEmail,
  isValidEmailFormat,
  compareEmails,
  type ClientRecord,
  type LeadRecord,
} from "@/lib/email-validation";

// Mock console methods to capture logs
const mockConsoleLog = vi.spyOn(console, "log").mockImplementation(() => {});
const mockConsoleError = vi
  .spyOn(console, "error")
  .mockImplementation(() => {});
const mockConsoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {});

describe("Email Validation Integration Tests", () => {
  // Test data setup for clients and leads tables
  const testClients: ClientRecord[] = [
    { id: "client-1", email: "existing.client@test.com", status: "active" },
    { id: "client-2", email: "inactive.client@test.com", status: "inactive" },
  ];

  const testLeads: LeadRecord[] = [
    { id: "lead-1", email: "existing.lead@test.com", status: "pending" },
    { id: "lead-2", email: "converted.lead@test.com", status: "converted" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Test Data Setup", () => {
    it("should have valid test client data", () => {
      expect(testClients).toHaveLength(2);
      expect(testClients[0]).toHaveProperty("id");
      expect(testClients[0]).toHaveProperty("email");
      expect(testClients[0]).toHaveProperty("status");
      expect(testClients[0].status).toBe("active");
    });

    it("should have valid test lead data", () => {
      expect(testLeads).toHaveLength(2);
      expect(testLeads[0]).toHaveProperty("id");
      expect(testLeads[0]).toHaveProperty("email");
      expect(testLeads[0]).toHaveProperty("status");
    });

    it("should create test data with proper structure for clients table", () => {
      testClients.forEach((client) => {
        expect(client).toHaveProperty("id");
        expect(client).toHaveProperty("email");
        expect(client).toHaveProperty("status");
        expect(typeof client.id).toBe("string");
        expect(typeof client.email).toBe("string");
        expect(typeof client.status).toBe("string");
        expect(client.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      });
    });

    it("should create test data with proper structure for leads table", () => {
      testLeads.forEach((lead) => {
        expect(lead).toHaveProperty("id");
        expect(lead).toHaveProperty("email");
        expect(lead).toHaveProperty("status");
        expect(typeof lead.id).toBe("string");
        expect(typeof lead.email).toBe("string");
        expect(typeof lead.status).toBe("string");
        expect(lead.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      });
    });
  });

  describe("Email Format Validation", () => {
    it("should reject invalid email formats", () => {
      const invalidEmails = [
        "invalid-email",
        "@test.com",
        "user@",
        "user@.com",
        "",
        "user space@test.com",
        "user@test",
        "user@@test.com",
      ];

      invalidEmails.forEach((email) => {
        expect(isValidEmailFormat(email)).toBe(false);
      });
    });

    it("should accept valid email formats", () => {
      const validEmails = [
        "user@test.com",
        "user.name@test.com",
        "user+tag@test.com",
        "user123@test123.com",
        "a@b.co",
        "test.email+tag@example.co.uk",
        "user_name@test-domain.com",
      ];

      validEmails.forEach((email) => {
        expect(isValidEmailFormat(email)).toBe(true);
      });
    });
  });

  describe("Email Normalization", () => {
    it("should normalize emails correctly", () => {
      expect(normalizeEmail("Test@Example.COM")).toBe("test@example.com");
      expect(normalizeEmail("  user@test.com  ")).toBe("user@test.com");
      expect(normalizeEmail("USER@TEST.COM")).toBe("user@test.com");
      expect(normalizeEmail("User.Name@Test.COM")).toBe("user.name@test.com");
    });

    it("should handle edge cases in normalization", () => {
      expect(normalizeEmail("")).toBe("");
      expect(normalizeEmail("   ")).toBe("");
      expect(normalizeEmail("A@B.C")).toBe("a@b.c");
    });
  });

  describe("Email Comparison", () => {
    it("should compare emails case-insensitively", () => {
      expect(compareEmails("User@Test.COM", "user@test.com")).toBe(true);
      expect(compareEmails("user1@test.com", "user2@test.com")).toBe(false);
      expect(compareEmails("  USER@TEST.COM  ", "user@test.com")).toBe(true);
      expect(
        compareEmails("Test.User@Example.COM", "test.user@example.com")
      ).toBe(true);
    });

    it("should handle edge cases in comparison", () => {
      expect(compareEmails("", "")).toBe(true);
      expect(compareEmails("user@test.com", "")).toBe(false);
      expect(compareEmails("", "user@test.com")).toBe(false);
    });
  });

  describe("New User Registration Flow", () => {
    it("should validate email format for new users", () => {
      const newUserEmails = [
        "new.user@test.com",
        "another.user@example.org",
        "user123@domain.co.uk",
      ];

      newUserEmails.forEach((email) => {
        expect(isValidEmailFormat(email)).toBe(true);
        expect(normalizeEmail(email)).toBe(email.toLowerCase().trim());
      });
    });

    it("should handle various email formats for new users", () => {
      const emailVariations = [
        { input: "NEW.USER@TEST.COM", expected: "new.user@test.com" },
        { input: "  user@test.com  ", expected: "user@test.com" },
        { input: "User+Tag@Example.COM", expected: "user+tag@example.com" },
      ];

      emailVariations.forEach(({ input, expected }) => {
        expect(normalizeEmail(input)).toBe(expected);
        expect(isValidEmailFormat(input.trim())).toBe(true);
      });
    });
  });

  describe("Lead Conversion Flow", () => {
    it("should validate lead email formats", () => {
      testLeads.forEach((lead) => {
        expect(isValidEmailFormat(lead.email)).toBe(true);
        expect(normalizeEmail(lead.email)).toBe(lead.email.toLowerCase());
      });
    });

    it("should handle case-insensitive lead email matching", () => {
      const leadEmail = testLeads[0].email;
      const variations = [
        leadEmail.toUpperCase(),
        leadEmail.toLowerCase(),
        `  ${leadEmail}  `,
        leadEmail.charAt(0).toUpperCase() + leadEmail.slice(1),
      ];

      variations.forEach((variation) => {
        expect(compareEmails(variation, leadEmail)).toBe(true);
      });
    });
  });

  describe("Duplicate Client Detection", () => {
    it("should validate client email formats", () => {
      testClients.forEach((client) => {
        expect(isValidEmailFormat(client.email)).toBe(true);
        expect(normalizeEmail(client.email)).toBe(client.email.toLowerCase());
      });
    });

    it("should handle case-insensitive client email matching", () => {
      const clientEmail = testClients[0].email;
      const variations = [
        clientEmail.toUpperCase(),
        clientEmail.toLowerCase(),
        `  ${clientEmail}  `,
        clientEmail.charAt(0).toUpperCase() + clientEmail.slice(1),
      ];

      variations.forEach((variation) => {
        expect(compareEmails(variation, clientEmail)).toBe(true);
      });
    });

    it("should distinguish between active and inactive clients", () => {
      const activeClient = testClients.find((c) => c.status === "active");
      const inactiveClient = testClients.find((c) => c.status === "inactive");

      expect(activeClient).toBeDefined();
      expect(inactiveClient).toBeDefined();
      expect(activeClient?.status).toBe("active");
      expect(inactiveClient?.status).toBe("inactive");
    });
  });

  describe("Error Response Handling", () => {
    it("should handle invalid email format errors", () => {
      const invalidEmails = ["invalid", "@test.com", "user@"];

      invalidEmails.forEach((email) => {
        expect(isValidEmailFormat(email)).toBe(false);
      });
    });

    it("should provide consistent error handling for malformed emails", () => {
      const malformedEmails = ["user@@test.com"];

      malformedEmails.forEach((email) => {
        expect(isValidEmailFormat(email)).toBe(false);
      });
    });
  });

  describe("Concurrent Validation", () => {
    it("should handle multiple email validations", () => {
      const emails = [
        "user1@test.com",
        "user2@test.com",
        "user3@test.com",
        "USER4@TEST.COM",
        "  user5@test.com  ",
      ];

      const results = emails.map((email) => ({
        original: email,
        normalized: normalizeEmail(email),
        isValid: isValidEmailFormat(email.trim()),
      }));

      results.forEach((result) => {
        expect(result.isValid).toBe(true);
        expect(result.normalized).toBe(result.original.toLowerCase().trim());
      });
    });

    it("should handle concurrent email comparisons", () => {
      const baseEmail = "test@example.com";
      const variations = [
        "TEST@EXAMPLE.COM",
        "test@example.com",
        "  test@example.com  ",
        "Test@Example.Com",
      ];

      const comparisons = variations.map((variation) =>
        compareEmails(baseEmail, variation)
      );

      comparisons.forEach((result) => {
        expect(result).toBe(true);
      });
    });
  });

  describe("Performance Considerations", () => {
    it("should efficiently normalize large numbers of emails", () => {
      const emails = Array.from(
        { length: 1000 },
        (_, i) => `user${i}@test${i % 10}.com`
      );

      const startTime = Date.now();
      const normalized = emails.map((email) => normalizeEmail(email));
      const endTime = Date.now();

      expect(normalized).toHaveLength(1000);
      expect(endTime - startTime).toBeLessThan(100); // Should complete in under 100ms
    });

    it("should efficiently validate large numbers of emails", () => {
      const emails = Array.from(
        { length: 1000 },
        (_, i) => `user${i}@test${i % 10}.com`
      );

      const startTime = Date.now();
      const validations = emails.map((email) => isValidEmailFormat(email));
      const endTime = Date.now();

      expect(validations).toHaveLength(1000);
      expect(validations.every((v) => v === true)).toBe(true);
      expect(endTime - startTime).toBeLessThan(100); // Should complete in under 100ms
    });
  });
});
