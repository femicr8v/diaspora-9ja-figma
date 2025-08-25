import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  validateEmail,
  checkClientEmail,
  checkLeadEmail,
} from "@/lib/email-validation";

// Mock Supabase client
vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
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

describe("Email Validation Logging Integration", () => {
  let consoleSpy: any;
  let consoleWarnSpy: any;
  let consoleErrorSpy: any;
  let mockSupabase: any;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Reset module to get fresh Supabase mock
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("validateEmail with logging", () => {
    it("should log validation attempt for new email", async () => {
      // Mock Supabase to return no existing records
      const { createClient } = await import("@supabase/supabase-js");
      mockSupabase = createClient("http://localhost:54321", "test-key");

      const mockSingle = vi
        .fn()
        .mockResolvedValueOnce({ data: null, error: { code: "PGRST116" } }) // No client
        .mockResolvedValueOnce({ data: null, error: { code: "PGRST116" } }); // No lead

      mockSupabase.from.mockReturnValue({
        select: () => ({
          eq: () => ({
            eq: () => ({
              limit: () => ({
                single: mockSingle,
              }),
            }),
            limit: () => ({
              single: mockSingle,
            }),
          }),
        }),
      });

      const email = "new@example.com";
      const metadata = { userAgent: "test-agent", ip: "127.0.0.1" };

      const result = await validateEmail(email, metadata);

      expect(result.isValid).toBe(true);
      expect(result.existsAsClient).toBe(false);
      expect(result.existsAsLead).toBe(false);

      // Should log validation attempt
      expect(consoleSpy).toHaveBeenCalledWith(
        "[EMAIL_VALIDATION]",
        expect.stringContaining('"eventType":"VALIDATION_ATTEMPT"')
      );

      // Should log performance metrics for client and lead checks
      expect(consoleSpy).toHaveBeenCalledWith(
        "[PERFORMANCE_METRICS]",
        expect.stringContaining('"operation":"CLIENT_CHECK"')
      );
    });

    it("should log duplicate client detection", async () => {
      // Mock Supabase to return existing client
      const { createClient } = await import("@supabase/supabase-js");
      mockSupabase = createClient("http://localhost:54321", "test-key");

      const clientData = {
        id: "client-123",
        email: "existing@example.com",
        status: "active",
      };
      const mockSingle = vi
        .fn()
        .mockResolvedValueOnce({ data: clientData, error: null }) // Existing client
        .mockResolvedValueOnce({ data: null, error: { code: "PGRST116" } }); // No lead

      mockSupabase.from.mockReturnValue({
        select: () => ({
          eq: () => ({
            eq: () => ({
              limit: () => ({
                single: mockSingle,
              }),
            }),
            limit: () => ({
              single: mockSingle,
            }),
          }),
        }),
      });

      const email = "existing@example.com";
      const result = await validateEmail(email);

      expect(result.existsAsClient).toBe(true);
      expect(result.clientId).toBe("client-123");

      // Should log validation attempt
      expect(consoleSpy).toHaveBeenCalledWith(
        "[EMAIL_VALIDATION]",
        expect.stringContaining('"eventType":"VALIDATION_ATTEMPT"')
      );

      // Should log duplicate client detection
      expect(consoleSpy).toHaveBeenCalledWith(
        "[DUPLICATE_CLIENT_DETECTED]",
        expect.stringContaining('"eventType":"DUPLICATE_CLIENT"')
      );

      // Should log security warning
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          "[SECURITY] Duplicate client registration attempt"
        )
      );
    });

    it("should log lead conversion", async () => {
      // Mock Supabase to return existing lead
      const { createClient } = await import("@supabase/supabase-js");
      mockSupabase = createClient("http://localhost:54321", "test-key");

      const leadData = {
        id: "lead-456",
        email: "lead@example.com",
        status: "pending",
      };
      const mockSingle = vi
        .fn()
        .mockResolvedValueOnce({ data: null, error: { code: "PGRST116" } }) // No client
        .mockResolvedValueOnce({ data: leadData, error: null }); // Existing lead

      mockSupabase.from.mockReturnValue({
        select: () => ({
          eq: () => ({
            eq: () => ({
              limit: () => ({
                single: mockSingle,
              }),
            }),
            limit: () => ({
              single: mockSingle,
            }),
          }),
        }),
      });

      const email = "lead@example.com";
      const result = await validateEmail(email);

      expect(result.existsAsLead).toBe(true);
      expect(result.leadId).toBe("lead-456");

      // Should log validation attempt
      expect(consoleSpy).toHaveBeenCalledWith(
        "[EMAIL_VALIDATION]",
        expect.stringContaining('"eventType":"VALIDATION_ATTEMPT"')
      );

      // Should log lead conversion
      expect(consoleSpy).toHaveBeenCalledWith(
        "[LEAD_CONVERSION]",
        expect.stringContaining('"eventType":"LEAD_CONVERSION"')
      );
    });

    it("should log database errors", async () => {
      // Mock Supabase to throw error
      const { createClient } = await import("@supabase/supabase-js");
      mockSupabase = createClient("http://localhost:54321", "test-key");

      const dbError = new Error("Connection failed");
      (dbError as any).code = "ECONNRESET";

      const mockSingle = vi.fn().mockRejectedValue(dbError);

      mockSupabase.from.mockReturnValue({
        select: () => ({
          eq: () => ({
            eq: () => ({
              limit: () => ({
                single: mockSingle,
              }),
            }),
          }),
        }),
      });

      const email = "error@example.com";

      await expect(validateEmail(email)).rejects.toThrow("Connection failed");

      // Should log database error
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "[DATABASE_ERROR]",
        expect.stringContaining('"operation":"CLIENT_CHECK"')
      );

      // Should log validation error
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "[EMAIL_VALIDATION_ERROR]",
        expect.stringContaining('"eventType":"DATABASE_ERROR"')
      );
    });

    it("should log invalid email format", async () => {
      const invalidEmail = "not-an-email";
      const result = await validateEmail(invalidEmail);

      expect(result.isValid).toBe(false);

      // Should log validation attempt with invalid result
      expect(consoleSpy).toHaveBeenCalledWith(
        "[EMAIL_VALIDATION]",
        expect.stringContaining('"isValid":false')
      );
    });
  });

  describe("checkClientEmail with logging", () => {
    it("should log performance metrics for successful client check", async () => {
      const { createClient } = await import("@supabase/supabase-js");
      mockSupabase = createClient("http://localhost:54321", "test-key");

      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { code: "PGRST116" },
      });

      mockSupabase.from.mockReturnValue({
        select: () => ({
          eq: () => ({
            eq: () => ({
              limit: () => ({
                single: mockSingle,
              }),
            }),
          }),
        }),
      });

      const result = await checkClientEmail("test@example.com");

      expect(result).toBeNull();

      // Should log performance metrics
      expect(consoleSpy).toHaveBeenCalledWith(
        "[PERFORMANCE_METRICS]",
        expect.stringContaining('"operation":"CLIENT_CHECK"')
      );
    });

    it("should log database error for client check failure", async () => {
      const { createClient } = await import("@supabase/supabase-js");
      mockSupabase = createClient("http://localhost:54321", "test-key");

      const dbError = new Error("Database timeout");
      const mockSingle = vi.fn().mockRejectedValue(dbError);

      mockSupabase.from.mockReturnValue({
        select: () => ({
          eq: () => ({
            eq: () => ({
              limit: () => ({
                single: mockSingle,
              }),
            }),
          }),
        }),
      });

      await expect(checkClientEmail("test@example.com")).rejects.toThrow(
        "Database timeout"
      );

      // Should log database error
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "[DATABASE_ERROR]",
        expect.stringContaining('"operation":"CLIENT_CHECK"')
      );
    });
  });

  describe("checkLeadEmail with logging", () => {
    it("should log performance metrics for successful lead check", async () => {
      const { createClient } = await import("@supabase/supabase-js");
      mockSupabase = createClient("http://localhost:54321", "test-key");

      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { code: "PGRST116" },
      });

      mockSupabase.from.mockReturnValue({
        select: () => ({
          eq: () => ({
            limit: () => ({
              single: mockSingle,
            }),
          }),
        }),
      });

      const result = await checkLeadEmail("test@example.com");

      expect(result).toBeNull();

      // Should log performance metrics
      expect(consoleSpy).toHaveBeenCalledWith(
        "[PERFORMANCE_METRICS]",
        expect.stringContaining('"operation":"LEAD_CHECK"')
      );
    });

    it("should log database error for lead check failure", async () => {
      const { createClient } = await import("@supabase/supabase-js");
      mockSupabase = createClient("http://localhost:54321", "test-key");

      const dbError = new Error("Network error");
      const mockSingle = vi.fn().mockRejectedValue(dbError);

      mockSupabase.from.mockReturnValue({
        select: () => ({
          eq: () => ({
            limit: () => ({
              single: mockSingle,
            }),
          }),
        }),
      });

      await expect(checkLeadEmail("test@example.com")).rejects.toThrow(
        "Network error"
      );

      // Should log database error
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "[DATABASE_ERROR]",
        expect.stringContaining('"operation":"LEAD_CHECK"')
      );
    });
  });
});
