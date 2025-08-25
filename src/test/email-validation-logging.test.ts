import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

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

describe("Email Validation Logging", () => {
  let consoleSpy: any;
  let consoleWarnSpy: any;
  let consoleErrorSpy: any;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Reset modules to get fresh mocks
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should log validation attempt for new email", async () => {
    // Mock Supabase to return no existing records
    const { createClient } = await import("@supabase/supabase-js");
    const mockSupabase = createClient();

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

    // Import after mocking
    const { validateEmail } = await import("../lib/email-validation");

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
  });

  it("should log duplicate client detection", async () => {
    // Mock Supabase to return existing client
    const { createClient } = await import("@supabase/supabase-js");
    const mockSupabase = createClient();

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

    const { validateEmail } = await import("../lib/email-validation");

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

  it("should log performance metrics for slow operations", async () => {
    // Mock Supabase with delay to simulate slow operation
    const { createClient } = await import("@supabase/supabase-js");
    const mockSupabase = createClient();

    const mockSingle = vi
      .fn()
      .mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () => resolve({ data: null, error: { code: "PGRST116" } }),
              150
            )
          )
      );

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

    const { validateEmail } = await import("../lib/email-validation");

    await validateEmail("slow@example.com");

    // Should log performance metrics for operations > 100ms
    expect(consoleSpy).toHaveBeenCalledWith(
      "[PERFORMANCE_METRICS]",
      expect.stringContaining('"operation":"CLIENT_CHECK"')
    );
  });

  it("should log database errors", async () => {
    // Mock Supabase to throw error
    const { createClient } = await import("@supabase/supabase-js");
    const mockSupabase = createClient();

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

    const { validateEmail } = await import("../lib/email-validation");

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
});
